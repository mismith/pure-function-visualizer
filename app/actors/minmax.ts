export class MinMax {
	name = 'minMax';
	inputs = [
		{
			name: 'qty',
			type: 'number',
			min: 2,
			value: 2,
			onchange: function(PFComponent) {
				PFComponent.changeNumberOfInputs(parseInt(this.value) + 1, i => {
					return {
						name: 'num' + i,
						type: 'number',
						value: 0,
					};
				});
			},
		},
		{
			name: 'num1',
			type: 'number',
			value: 0,
		},
		{
			name: 'num2',
			type: 'number',
			value: 0,
		},
	];
	outputs = [
		{
			name: 'min',
			type: 'number',
		},
		{
			name: 'max',
			type: 'number',
		},
	];
	handler(qty: number, ...values) {
		return [
			Math.min.apply(this, values),
			Math.max.apply(this, values),
		];
	}
}
