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

const urls: string[] = [];

export const checkObjectURL = (url: string) => urls.includes(url);

export const createObjectURL = (blob: Blob) => {
	const url = URL.createObjectURL(blob);
	urls.push(url);

	return url;
};
