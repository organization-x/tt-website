import type { Links } from "@prisma/client";

type LinkName = Exclude<keyof Links, "userId">;

const createLinks: Record<LinkName, (name: string) => string> = {
	GitHub: (name) => `https://github.com/${name}/`,
	LinkedIn: (name) => `https://www.linkedin.com/in/${name}/`,
	Devto: (name) => `https://dev.to/${name}/`,
	Twitter: (name) => `https://twitter.com/${name}/`,
	Facebook: (name) => `https://www.facebook.com/${name}/`,
	Website: (name) => name
};

export function linkUrl(link: LinkName, name: string) {
	return createLinks[link]?.(name) ?? name;
}
