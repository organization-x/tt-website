import { Doc } from "yjs";
import { parse } from "cookie";
import { WebSocketServer } from "ws";
import { decoding, encoding } from "lib0";
import { writeUpdate, writeSyncStep1, readSyncMessage } from "y-protocols/sync";
import {
	applyAwarenessUpdate,
	Awareness,
	encodeAwarenessUpdate,
	removeAwarenessStates
} from "y-protocols/awareness";

import { prisma } from "./lib/prisma";

import type { Plugin, WebSocket } from "vite";

type SharedDoc = {
	id: string;
	awareness: Awareness;
	sockets: Map<WebSocket, Set<number>>;
};

// Enum used for encoding different type of protocol messages
const enum Message {
	Sync = 0,
	Awareness = 1
}

// TODO: Do testing with other actual clients and make sure everything works

// Store all docs in a global variable
const sharedDocs = new Map<string, SharedDoc>();

// Close sockets and remove the respective awareness states associated with them, also if
// they are the last socket left, destroy the doc
const close = (sharedDoc: SharedDoc, socket: WebSocket) => {
	const controlledIds = sharedDoc.sockets.get(socket)!;

	sharedDoc.sockets.delete(socket);

	removeAwarenessStates(sharedDoc.awareness, Array.from(controlledIds), null);

	socket.close();

	if (!sharedDoc.sockets.size) sharedDocs.delete(sharedDoc.id);
};

// Send data to a socket, if an error occurs or the socket hasn't connected it will be closed
const send = (sharedDoc: SharedDoc, socket: WebSocket, message: Uint8Array) => {
	if (
		socket.readyState !== socket.CONNECTING &&
		socket.readyState !== socket.OPEN
	)
		return close(sharedDoc, socket);

	socket.send(message, (error) => error && close(sharedDoc, socket));
};

// Used as the callback function for all instances of docs, this sends a sync state out
// to all clients when the doc is modified
const docUpdate = (sharedDoc: SharedDoc, update: Uint8Array) => {
	const encoder = encoding.createEncoder();

	encoding.writeVarUint(encoder, Message.Sync);

	writeUpdate(encoder, update);

	const message = encoding.toUint8Array(encoder);

	sharedDoc.sockets.forEach((_, socket) => send(sharedDoc, socket, message));
};

// Used as the callback function for all instances of awareness, this sends an awareness state out
// when it is modified
const awarenessUpdate = (
	sharedDoc: SharedDoc,
	{
		added,
		updated,
		removed
	}: { added: number[]; updated: number[]; removed: number[] },
	socket: WebSocket
) => {
	// Collect all changed clients this socket is responsible for
	const changedClients = added.concat(updated, removed);

	// Add or remove clients from the sockets control
	if (socket) {
		const controlledIds = sharedDoc.sockets.get(socket);

		if (controlledIds) {
			added.forEach((clientID) => {
				controlledIds.add(clientID);
			});

			removed.forEach((clientID) => {
				controlledIds.delete(clientID);
			});
		}
	}

	const encoder = encoding.createEncoder();

	encoding.writeVarUint(encoder, Message.Awareness);
	encoding.writeVarUint8Array(
		encoder,
		encodeAwarenessUpdate(sharedDoc.awareness, changedClients)
	);

	const buff = encoding.toUint8Array(encoder);
	sharedDoc.sockets.forEach((_, socket) => send(sharedDoc, socket, buff));
};

// WebSocket server for TipTap collaboration. It uses port 8080 in a dev environment to
// not interfere with HMR, in production it uses port 3000 and the provided server
export const wss = (mode: string): Plugin => ({
	name: "wss",

	configureServer(server) {
		const ws = new WebSocketServer({
			...(mode === "production"
				? { server: server.httpServer! }
				: { port: 8080 }),
			verifyClient: async (info, res) => {
				// Check to see if the session is valid and if the user associated with it
				// is an author of the project

				// Grab the project id from the url
				const projectId = info.req.url?.split("/")[1];

				// If the url doesn't include a project ID, ignore
				if (!projectId) return res(false, 404, "Not Found");

				// Grab the session cookie and verify the session
				const session = parse(info.req.headers.cookie || "").session;

				if (!session) return res(false, 401, "Unauthorized");

				const user = await prisma.user.findMany({
					where: { sessions: { some: { token: session } } }
				});

				if (!user.length) return res(false, 401, "Unauthorized");

				const project = await prisma.project.findUnique({
					where: { id: projectId },
					include: { authors: true }
				});

				if (!project) return res(false, 404, "Not Found");

				// Check to see if the user is an author of the project
				project.authors.some(
					(author) => author.userId === user[0].id
				) || user[0].role === "Admin"
					? res(true)
					: res(false, 401, "Unauthorized");
			}
		});

		// On a websocket connection iniatlize all syncing/awareness requirements
		ws.on("connection", (socket: WebSocket, req) => {
			socket.binaryType = "arraybuffer";

			const projectId = req.url!.split("/")[1];

			let sharedDoc = sharedDocs.get(projectId)!;

			if (!sharedDoc) {
				const doc: SharedDoc = {
					id: projectId,
					awareness: new Awareness(new Doc()),
					sockets: new Map()
				};

				doc.awareness.setLocalState(null);

				// When the doc is updated, call the global callback
				doc.awareness.doc.on("update", (update: Uint8Array) =>
					docUpdate(doc, update)
				);

				// When the awareness is updated, call the global callback
				doc.awareness.on(
					"update",
					(
						changes: {
							added: number[];
							updated: number[];
							removed: number[];
						},
						socket: WebSocket
					) => awarenessUpdate(sharedDoc, changes, socket)
				);

				// Add the doc to the global map
				sharedDocs.set(projectId, doc);
				sharedDoc = doc;
			}

			// Add this socket to the doc
			sharedDoc.sockets.set(socket, new Set());

			// When the socket receives a message, depending on the type of message, carry out sync/awareness
			// updates accordingly
			socket.on("message", (msg: ArrayBuffer) => {
				const encoder = encoding.createEncoder();
				const decoder = decoding.createDecoder(new Uint8Array(msg));

				const type = decoding.readVarUint(decoder);

				switch (type) {
					case Message.Sync:
						encoding.writeVarUint(encoder, Message.Sync);

						readSyncMessage(
							decoder,
							encoder,
							sharedDoc.awareness.doc,
							null
						);

						// If the sync message doesn't include any data, ignore
						if (encoding.length(encoder) <= 1) return;

						send(sharedDoc, socket, encoding.toUint8Array(encoder));

						break;
					case Message.Awareness:
						// Apply the awareness update which will subsequently call the global awareness update callback
						applyAwarenessUpdate(
							sharedDoc.awareness,
							decoding.readVarUint8Array(decoder),
							socket
						);
				}
			});

			// Use a ping pong system to keep the socket alive
			let pong = true;
			const interval = setInterval(() => {
				if (!pong) {
					if (sharedDoc.sockets.has(socket)) close(sharedDoc, socket);

					clearInterval(interval);
				} else if (sharedDoc.sockets.has(socket)) {
					pong = false;

					socket.ping(undefined, undefined, (error) => {
						if (!error) return;

						close(sharedDoc, socket);
						clearInterval(interval);
					});
				}
			}, 30000);

			socket.on("pong", () => (pong = true));

			socket.on("close", () => {
				close(sharedDoc, socket);
				clearInterval(interval);
			});

			// Send the first sync step which takes the awareness on the server side and
			// ports it over to clients
			let encoder = encoding.createEncoder();

			encoding.writeVarUint(encoder, Message.Sync);
			writeSyncStep1(encoder, sharedDoc.awareness.doc);

			send(sharedDoc, socket, encoding.toUint8Array(encoder));

			// Get all awareness states/steps
			const awarenessStates = sharedDoc.awareness.getStates();

			// If there's no steps yet, don't send them to the client
			if (awarenessStates.size < 1) return;

			encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, Message.Awareness);

			encoding.writeVarUint8Array(
				encoder,
				encodeAwarenessUpdate(
					sharedDoc.awareness,
					Array.from(awarenessStates.keys())
				)
			);

			send(sharedDoc, socket, encoding.toUint8Array(encoder));
		});
	}
});
