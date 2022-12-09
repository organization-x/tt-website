// This file contains functions for handling images during project editing, this is so images on seperate clients
// can be shown in the editor even if not uploaded to Cloudflare images

// Encode a blob into base64
export const baseEncode = (reader: FileReader, blob: Blob): Promise<string> =>
	new Promise((res) => {
		reader.addEventListener("load", () => res(reader.result as string)),
			{ once: true };

		reader.readAsDataURL(blob);
	});

// Hash a blob using SHA-1, then convert it to a hex string. This is used
// for identifying images during project collaboration
export const hashBlob = async (blob: Blob) =>
	Array.from(
		new Uint8Array(
			await crypto.subtle.digest("SHA-1", await blob.arrayBuffer())
		)
	)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
