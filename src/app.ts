//our root app component
import {Component} from 'angular2/core';
import {PureFunctionContainer} from './pure-function-container.component';

@Component({
	selector: 'my-app',
	template: `
		<pure-function-container *ngFor="#i of [1,2,3,4]" [name]="'Function #' + i"></pure-function-container>
	`,
	directives: [
		PureFunctionContainer,
	],
})
export class App { }
