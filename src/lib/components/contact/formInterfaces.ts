export interface ChangeSelectValues {
	change: {
		isSelected: boolean;
		option: string;
	};
}

export enum BoxType {
	Field,
	Select,
	TextArea
}

interface StringBox {
	type: BoxType.Field | BoxType.TextArea;
	name: string;
	isValid: boolean;
	required: boolean;
	placeholder: string;
	value: string;
}

interface SelectBox {
	type: BoxType.Select;
	name: string;
	isValid: boolean;
	required: boolean;
	placeholder: string;
	options: string[];
	value: string[];
}

export type Box = StringBox | SelectBox;
