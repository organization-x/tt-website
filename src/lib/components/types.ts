// TODO: Temporary, will be omitted upon usage of Prism in favor of a schema

export type Developer = {
	name: string;
	pos: string;
	bio: string;
	src: string;
	alt: string;
	href: string;
};

export type Project = {
	name: string;
	desc: string;
	href: string;
	src: string;
	alt: string;
	color: string; // Hex
	icons: string[];
};
