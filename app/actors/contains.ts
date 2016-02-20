export class Contains {
	constructor() {
		this.name = 'contains';
		this.inputs = [
			{
				name: 'haystack',
				type: 'array',
			},
			{
				name: 'needle',
			},
		];
		this.outputs = [
			{
				name: 'contains',
				type: 'boolean',
			},
			{
				name: 'index',
				type: 'number',
			},
		];
	}
	handler(haystack: array = [], needle) {
		haystack = Array.from(haystack); // coerce type
		var i = haystack.indexOf(needle);
		return [
			i >= 0,
			i,
		];
	}
}
