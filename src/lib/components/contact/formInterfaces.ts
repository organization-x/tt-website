export interface ChangeValues {
	change: {
		title: string;
		isValid: boolean;
		input: string | string[];
	};
}
export interface ChangeSelectValues {
	change: {
		isSelected: boolean;
		option: string;
	};
}

export interface Boxes {
	type: string;
	name: string;
	isValid: boolean;
	required: boolean;
	placeholder: string;
	options?: string[];
	value: string | string[];
}