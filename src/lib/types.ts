// Provides types for static components, the reason prisma schemas arent used is because (for example)
// re-rendering a component every time a project author changes their profile picture is not ideal,
// so statically providing info directly inside of the component is better

export type Developer = {
	name: string;
	position: string;
	url: string;
};
