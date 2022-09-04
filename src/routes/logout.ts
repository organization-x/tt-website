import type { RequestHandler } from "@sveltejs/kit";
import { serialize } from "cookie";

// On logout remove any cookies by settings the locals to null and setting the user cookie to expire immediatley,
// then redirect to home page
export const GET: RequestHandler = async (req) => {
	req.locals.user = null;
	return {
		status: 302,
		headers: {
			location: "/",
			"set-cookie": serialize("user", "", { expires: new Date(0) })
		}
	};
};
