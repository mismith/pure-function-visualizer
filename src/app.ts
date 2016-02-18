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
				handler: (qty: number, ...values) => [
					Math.min.apply(this, values),
					Math.max.apply(this, values),
				];
			},
			{
				name: 'caseChange',
				inputs: [
					{
						name: 'string',
						type: 'string',
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
				handler: (str: string = '') => [
					str.toLowerCase(),
					str.toUpperCase(),
				];
			},
			{
				name: 'contains',
				inputs: [
					{
						name: 'haystack',
						type: 'array',
					},
					{
						name: 'needle',
					},
				],
				outputs: [
					{
						name: 'contains',
						type: 'boolean',
					},
					{
						name: 'index',
						type: 'number',
					},
				],
				handler: (arr: array = [], needle) => {
					if (typeof arr === 'string') arr = arr.split(',');
					var i = arr.indexOf(needle);
					return [
						i >= 0,
						i,
					];
				};
			},
			{
				name: 'image',
				inputs: [
					{
						name: 'src',
						type: 'string',
					},
				],
				handler: function(src: string = '') {
					if ( ! this.img) {
						var figure = document.createElement('figure');
						this.img = document.createElement('img');
						figure.appendChild(this.img);
						this.el.nativeElement.firstElementChild.appendChild(figure);
					}
					this.img.src = src;
				},
			},
		];
	}
}
