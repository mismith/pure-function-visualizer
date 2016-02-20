export class Contains {
	name = 'contains';
	inputs = [
		{
			name: 'haystack',
			type: 'array',
		},
		{
			name: 'needle',
		},
	];
	outputs = [
		{
			name: 'contains',
			type: 'boolean',
		},
		{
			name: 'index',
			type: 'number',
		},
	];
	handler(haystack: array = [], needle) {
		haystack = Array.from(haystack);
		var i = haystack.indexOf(needle);
		return [
			i >= 0,
			i,
		];
	}
}
