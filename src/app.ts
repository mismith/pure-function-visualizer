//our root app component
import {Component} from 'angular2/core';
import {PureFunctionContainer} from './pure-function-container.component';

@Component({
	selector: 'my-app',
	template: `
		<pure-function-container *ngFor="#fn of functions" [fn]="fn"></pure-function-container>
	`,
	directives: [
		PureFunctionContainer,
	],
})
export class App {
	constructor() {
		this.functions = [
			{
				name: 'minMax',
				inputs: [
					{
						name: 'qty',
						type: 'number',
						min: 2,
						value: 2,
						onchange: (e, pureFunctionContainer) => {
							pureFunctionContainer.changeNumberOfInputs(parseInt(e.target.value) + 1, i => {
								return {
									name: 'num' + i,
									type: 'number',
								};
							});
						},
					},
					{
						name: 'num1',
						type: 'number',
					},
					{
						name: 'num2',
						type: 'number',
					},
				],
				outputs: [
					{
						name: 'min',
						type: 'number',
					},
					{
						name: 'max',
						type: 'number',
					},
				],
				handler: (qty, ...values) => [
					Math.min.apply(this, values),
					Math.max.apply(this, values),
				];
			},
			{
				name: 'caseChange',
				inputs: [
					{
						name: 'string',
					},
				],
				outputs: [
					{
						name: 'lowercase',
					},
					{
						name: 'uppercase',
					},
				],
				handler: (str = '') => [
					str.toLowerCase(),
					str.toUpperCase(),
				];
			},
		];
	}
}
