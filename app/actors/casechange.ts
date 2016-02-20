export class CaseChange {
	constructor() {
		this.name = 'caseChange';
		this.inputs = [
			{
				name: 'string',
				type: 'string',
			},
		];
		this.outputs = [
			{
				name: 'lowercase',
				type: 'string',
			},
			{
				name: 'uppercase',
				type: 'string',
			},
		];
	}
	handler(str: string = '') {
		str = str + ''; // coerce type
		return [
			str.toLowerCase(),
			str.toUpperCase(),
		];
	}
}
