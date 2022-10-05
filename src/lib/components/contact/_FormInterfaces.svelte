<script lang="ts" context="module">
	export interface changeValues {
		change: {
			page: string;
			title: string;
			isValid: boolean;
			input: string | string[];
		};
	}
	export interface changeSelectValues {
		change: {
			isSelected: boolean;
			option: string;
		};
	}

	export interface boxesType {
		page: number;
		name: string;
		isValid: boolean;
		value: string | string[];
	}
</script>
