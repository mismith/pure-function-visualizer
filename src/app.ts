//our root app component
import {Component} from 'angular2/core';

@Component({
	selector: 'function-container',
	providers: [],
	template: `
		<div class="function-container flex-column flex-inline">
			<header class="flex-row">
				<button (click)="addInput('Input #' + (inputs.length + 1))">+</button>
				<input [(ngModel)]="name" placeholder="Name" class="flex" />
				<button (click)="addOutput('Output #' + (outputs.length + 1))">+</button>
			</header>
			<div class="flex-row">
				<ul class="flex-column">
					<li *ngFor="#input of inputs; #i = index" class="flex-row">
						<input type="radio" tabindex="-1" />
						<input [(ngModel)]="input.name" placeholder="Name" class="flex" />
						<button (click)="removeInput(i)">&ndash;</button>
					</li>
				</ul>
				<ul class="flex-column">
					<li *ngFor="#output of outputs; #i = index" class="flex-row">
						<button (click)="removeOutput(i)">&ndash;</button>
						<input [(ngModel)]="output.name" placeholder="Name" class="flex" />
						<input type="radio" tabindex="-1" />
					</li>
				</ul>
			</div>
		</div>
	`,
	directives: []
})
export class App {
	public inputs = [];
	public outputs = [];
	
	constructor() {
		this.name = 'Function #1';
	}
	
	addInput(name = '') {
		this.inputs.push({name});
	}
	addOutput(name = '') {
		this.outputs.push({name});
	}
	
	removeInput(index) {
		this.inputs.splice(index, 1);
	}
	removeOutput(index) {
		this.outputs.splice(index, 1);
	}
}
