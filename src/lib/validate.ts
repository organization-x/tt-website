import { FieldType } from "$lib/enums";

export const validate = (value: string, type: FieldType | null) => {
	// Based on the type of field, validate it with its respective regex.
	// Since this only gets called if the field is filled, if it doesn't
	// have a type that means it's valid by default

	switch (type) {
		case FieldType.Email:
			return /^(?:[a-z0-9!#$%&'*+.=?^_`{|}~-]+|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+")@[a-zA-Z0-9-]{1,256}\.[a-zA-Z0-9-]{2,6}$/gi.test(
				value
			);
		case FieldType.Phone:
			return /^[0-9]*$/g.test(value);
		case FieldType.Website:
			return /^(http(s)?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/g.test(
				value
			);
		default:
			return true;
	}
};
