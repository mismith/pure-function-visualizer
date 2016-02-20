export class CaseChange {
	name = 'caseChange';
	inputs = [
		{
			name: 'string',
			type: 'string',
		},
	];
	outputs = [
		{
			name: 'lowercase',
			type: 'string',
		},
		{
			name: 'uppercase',
			type: 'string',
		},
	];
	handler(str: string = '') {
		str = str + ''; // coerce type
		return [
			str.toLowerCase(),
			str.toUpperCase(),
		];
	}
}
