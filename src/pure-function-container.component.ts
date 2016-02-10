import {Component, Input} from 'angular2/core';
import {Moveable} from './moveable';
import {WhiplinkNode, WhiplinkerService} from './whiplinker';

@Component({
	selector: 'pure-function-container',
	template: `
		<div class="function-container flex-column flex-inline" moveable (move)="whiplinker.instance().repaint()">
			<header class="flex-row">
				<button (click)="addInput('Input #' + (inputs.length + 1))">+</button>
				<input [(ngModel)]="name" placeholder="Function Name" class="flex" />
				<button (click)="addOutput('Output #' + (outputs.length + 1))">+</button>
			</header>
			<div class="flex-row">
				<ul class="flex-column">
					<li *ngFor="#input of inputs; #i = index" class="flex-row">
						<whiplinkNode type="target"></whiplinkNode>
						<input [(ngModel)]="input.name" placeholder="Input Name" class="flex" />
						<button (click)="removeInput(i)">&ndash;</button>
					</li>
				</ul>
				<ul class="flex-column">
					<li *ngFor="#output of outputs; #i = index" class="flex-row">
						<button (click)="removeOutput(i)">&ndash;</button>
						<input [(ngModel)]="output.name" placeholder="Output Name" class="flex" />
						<whiplinkNode type="source"></whiplinkNode>
					</li>
				</ul>
			</div>
		</div>
	`,
	bindings: [
		WhiplinkerService,
	],
	directives: [
		WhiplinkNode,
		Moveable,
	],
})
export class PureFunctionContainer {
	@Input() name: string = 'Function';
	public inputs = [];
	public outputs = [];
	
	constructor(private whiplinker: WhiplinkerService) {
	}
	
	addInput(name = '') {
		this.inputs.push({name});
		this.whiplinker.instance().repaint();
	}
	addOutput(name = '') {
		this.outputs.push({name});
		this.whiplinker.instance().repaint();
	}
	
	removeInput(index) {
		this.inputs.splice(index, 1);
		this.whiplinker.instance().repaint();
	}
	removeOutput(index) {
		this.outputs.splice(index, 1);
		this.whiplinker.instance().repaint();
	}
}
