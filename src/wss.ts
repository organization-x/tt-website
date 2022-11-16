import { Doc } from "yjs";
import { parse } from "cookie";
import { encoding } from "lib0";
import { WebSocketServer } from "ws";
import { writeUpdate, writeSyncStep1 } from "y-protocols/sync";
import {
	Awareness,
	encodeAwarenessUpdate,
	removeAwarenessStates
} from "y-protocols/awareness";

import { prisma } from "./lib/prisma";

import type { Plugin, WebSocket } from "vite";

const enum State {
	Connecting = 0,
	Open = 1
}

const enum Message {
	Sync = 0,
	Awareness = 1
}

const docs = new Map<string, SharedDoc>();

const close = (doc: SharedDoc, socket: WebSocket) => {
	// If the doc contains the socket then remove it and disengage the awareness associated with it
	const ids = doc.sockets.get(socket);
	if (ids) {
		doc.sockets.delete(socket);
		removeAwarenessStates(doc.awareness, Array.from(ids), null);
	}

	socket.close();
};

const send = (doc: SharedDoc, socket: WebSocket, message: Uint8Array) => {
	// If the socket isn't connecting or open, close it on the server side
	if (
		socket.readyState !== State.Connecting &&
		socket.readyState !== State.Open
	)
		return close(doc, socket);

	socket.send(message, (err) => err && close(doc, socket));
};

class SharedDoc extends Doc {
	name: string;
	sockets: Map<WebSocket, Set<number>>;
	awareness: Awareness;

	constructor(name: string) {
		super();

		this.name = name;

		this.sockets = new Map();

		this.awareness = new Awareness(this);

		this.awareness.setLocalState(null);

		this.awareness.on(
			"update",
			(
				added: Array<number>,
				updated: Array<number>,
				removed: Array<number>,
				socket: WebSocket | null
			) => {
				const changedClients = added.concat(updated, removed);

				// Update the current controlled client ID's
				if (socket) {
					const connControlledIDs = this.sockets.get(socket);

					if (!connControlledIDs) return;

					added.forEach((id) => connControlledIDs.add(id));
					removed.forEach((id) => connControlledIDs.delete(id));
				}

				// On creation, broadcast the awareness state
				const encoder = encoding.createEncoder();

				encoding.writeVarUint(encoder, Message.Awareness);

				encoding.writeVarUint8Array(
					encoder,
					encodeAwarenessUpdate(this.awareness, changedClients)
				);

				const message = encoding.toUint8Array(encoder);

				this.sockets.forEach((_, socket) =>
					send(this, socket, message)
				);
			}
		);

		this.on("update", (update: Uint8Array, origin, doc: SharedDoc) => {
			const encoder = encoding.createEncoder();

			encoding.writeVarUint(encoder, Message.Sync);

			writeUpdate(encoder, update);

			const message = encoding.toUint8Array(encoder);

			doc.sockets.forEach((_, socket) => send(doc, socket, message));
		});
	}
}

// WebSocket server for TipTap collaboration.
// Currently it's using port 8080 since HMR interferes with it
export const wss: Plugin = {
	name: "wsServer",

	configureServer(server) {
		const wss = new WebSocketServer({
			port: 8080,
			verifyClient: async (info, res) => {
				// Check to see if the session is valid and if the user associated with it
				// is an author of the project

				// Grab the project id from the url
				const projectId = info.req.url?.split("/")[3];

				// If the url is not a collaboration url, ignore
				if (
					!info.req.url?.startsWith("/dashboard/projects/") ||
					!projectId
				)
					return res(false, 404, "Not Found");

				// Grab the session cookie and verify the session
				const session = parse(info.req.headers.cookie || "").session;

				if (!session) return res(false, 401, "Unauthorized");

				const sesh = await prisma.session.findUnique({
					where: { token: session }
				});

				if (!sesh) return res(false, 401, "Unauthorized");

				const project = await prisma.project.findUnique({
					where: { id: projectId },
					include: { authors: true }
				});

				if (!project) return res(false, 404, "Not Found");

				// Check to see if the user is an author of the project
				project.authors.some((author) => author.userId === sesh.userId)
					? res(true)
					: res(false, 401, "Unauthorized");
			}
		});

		wss.on("connection", (socket, req) => {
			socket.binaryType = "arraybuffer";

			const projectId = req.url!.split("/")[3];

			// If the shared doc hasn't been initialized, create it
			if (!docs.has(projectId))
				docs.set(projectId, new SharedDoc(projectId));

			const doc = docs.get(projectId)!;

			// Add the socket to the doc's socket map with a corresponding set to keep track of client ID's
			doc.sockets.set(socket, new Set());

			// Keep the websocket alive with ping/pong
			let pong = true;

			const pingInterval = setInterval(() => {
				if (!pong) {
					if (doc.sockets.has(socket)) close(doc, socket);

					clearInterval(pingInterval);
				} else if (doc.sockets.has(socket)) {
					pong = false;

					try {
						socket.ping();
					} catch {
						close(doc, socket);
						clearInterval(pingInterval);
					}
				}
			}, 30000);

			socket.on("pong", () => {
				pong = true;
			});

			socket.on("close", () => {
				close(doc, socket);
				clearInterval(pingInterval);
			});

			// Send initial sync step to the client
			const encoder = encoding.createEncoder();

			encoding.writeVarUint(encoder, Message.Sync);
			writeSyncStep1(encoder, doc);
			send(doc, socket, encoding.toUint8Array(encoder));

			const awarenessStates = doc.awareness.getStates();

			if (awarenessStates.size > 0) {
				const encoder = encoding.createEncoder();

				encoding.writeVarUint(encoder, Message.Awareness);

				encoding.writeVarUint8Array(
					encoder,
					encodeAwarenessUpdate(
						doc.awareness,
						Array.from(awarenessStates.keys())
					)
				);

				send(doc, socket, encoding.toUint8Array(encoder));
			}
		});
	}
};

// TODO: Do testing with other actual clients and make sure everything works
