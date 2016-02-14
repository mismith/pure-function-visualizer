import {Component, Input, ElementRef} from 'angular2/core';
import {Moveable} from './moveable';
import {WhiplinkerNode, WhiplinkerService} from './whiplinker';

@Component({
	selector: 'pure-function-container',
	template: `
		<div class="pure-function-container flex-column flex-inline" moveable (move)="refresh()">
			<header class="flex-row">
				<!--<button (click)="addInput({name: 'Input #' + (inputs.length + 1)})">+</button>-->
				<output [innerHTML]="name" class="flex"></output>
				<!--<button (click)="addOutput({name: 'Output #' + (outputs.length + 1)})">+</button>-->
			</header>
			<div class="flex-row">
				<ul class="flex-column inputs">
					<li *ngFor="#input of inputs; #i = index;">
						<whiplinkerNode type="target"></whiplinkerNode>
						<div>
							<input type="{{ input.type || 'text' }}" [(ngModel)]="input.value" min="{{ input.min }}" max="{{ input.max }}" (keyup)="onInput(input, $event);" (blur)="onInput(input, $event);" (change)="onInput(input, $event);" class="value" />
						</div>
						<output [innerHTML]="input.name" class="name"></output>
						<!--<div>
							<button (click)="removeInput(i)">&ndash;</button>
						</div>-->
					</li>
				</ul>
				<ul class="flex-column outputs">
					<li *ngFor="#output of outputs; #i = index;">
						<!--<div>
							<button (click)="removeOutput(i)">&ndash;</button>
						</div>-->
						<output [innerHTML]="output.name" class="name right"></output>
						<div>
							<input type="{{ output.type || 'text' }}" [(ngModel)]="output.value" class="value" readonly />
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
		this.handler.apply(this, this.inputs.map(input => input.value)).forEach((value, i) => {
			this.outputs[i].value = value;
		});
		
		this.whiplinker.repaint();
	}
	
	// inputs
	onInput(input, e) {
		if (typeof input.onchange === 'function') {
			input.onchange(e, this);
		}
		this.refresh();
	}
	addInput(input = {name: '', onchange: function(){}}) {
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
	
	// outputs
	addOutput(output = {name: ''}) {
		this.outputs.push(output);
		
		this.refresh();
	}
	removeOutput(index: number) {
		this.outputs.splice(index, 1);
		
		this.refresh();
	}
}
