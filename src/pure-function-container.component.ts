import {Component, Input, ElementRef} from 'angular2/core';
import {Moveable} from './moveable';
import {WhiplinkerNode, WhiplinkerService} from './whiplinker';

@Component({
	selector: 'pure-function-container',
	template: `
		<div class="pure-function-container flex-column flex-inline" moveable (move)="refresh()">
			<header>
				<output [innerHTML]="name" class="flex"></output>
				<button (click)="remove()" title="Remove"></button>
			</header>
			<div class="flex-row">
				<ul class="flex-column inputs">
					<li *ngFor="#input of inputs; #i = index;">
						<whiplinkerNode type="target"></whiplinkerNode>
						<div class="value">
							<input type="{{ input.type }}" [(ngModel)]="input.value" min="{{ input.min }}" max="{{ input.max }}" (keyup)="onInput(input, $event)" (blur)="onInput(input, $event)" (change)="onInput(input, $event)" [title]="input.type + ': ' + input.value" />
						</div>
						<output [innerHTML]="input.name" class="name"></output>
					</li>
				</ul>
				<ul class="flex-column outputs">
					<li *ngFor="#output of outputs; #i = index;">
						<output [innerHTML]="output.name" class="name right"></output>
						<div class="value">
							<input type="{{ output.type }}" [(ngModel)]="output.value" class="value" [title]="output.type + ': ' + output.value" readonly />
						</div>
						<whiplinkerNode type="source"></whiplinkerNode>
					</li>
				</ul>
			</div>
		</div>
	`,
	bindings: [
		WhiplinkerService,
	],
	directives: [
		WhiplinkerNode,
		Moveable,
	],
})
export class PureFunctionContainer {
	@Input() whiplinker = new WhiplinkerService().instance();
	
	@Input() name: string = '';
	@Input() inputs: string = [];
	@Input() outputs: string = [];
	@Input() handler = function(){};
	@Input() fn: object = {};
	
	constructor(private el: ElementRef) { }
	ngOnInit() {
		// parse options
		Object.assign(this, this.fn);
		
		// only allow one link per target
		this.whiplinker.addTargetFilter(e => ! e.targetElement.checked);
		
		// can't target own input
		this.whiplinker.addTargetFilter(e => {
			return ! (this.el.nativeElement.contains(e.sourceElement) && this.el.nativeElement.contains(e.targetElement));
		});
		
		this.refresh();
	}
	refresh() {
		(this.handler.apply(this, this.inputs.map(input => input.value)) || []).forEach((value, i) => {
			if (this.outputs[i].value !== value) {
				this.outputs[i].value = value;
				this.onOutput(this.outputs[i]);
			}
		});
		
		this.whiplinker.repaint();
	}
	
	// inputs
	addInput(input = {name: ''}) {
		this.inputs.push(input);
		
		this.refresh();
	}
	removeInput(index: number) {
		this.inputs.splice(index, 1);
		
		this.refresh();
	}
	changeNumberOfInputs(newNumberOfInputs: number, onAdd = function(i){}) {
		if (newNumberOfInputs < this.inputs.length) {
			// remove from end
			while (newNumberOfInputs < this.inputs.length) {
				this.removeInput(this.inputs.length - 1);
			}
		} else {
			// append new input
			while (this.inputs.length < newNumberOfInputs) {
				this.addInput(onAdd(this.inputs.length));
			}
		}
	}
	onInput(input, e) {
		if (typeof input.onchange === 'function') {
			input.onchange(e, this);
		}
		this.refresh();
	}
	
	// outputs
	onOutput(output, e) {
		if (typeof output.onchange === 'function') {
			output.onchange(e, this);
		}
	}
	addOutput(output = {name: ''}) {
		this.outputs.push(output);
		
		this.refresh();
	}
	removeOutput(index: number) {
		this.outputs.splice(index, 1);
		
		this.refresh();
	}
	
	// self
	remove() {
		this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
		
		this.refresh();
	}
}
