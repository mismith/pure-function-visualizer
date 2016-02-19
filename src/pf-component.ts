import {Component, Input, Output, ElementRef, EventEmitter} from 'angular2/core';
import {Moveable} from './moveable';
import {WhiplinkerNode, WhiplinkerService} from './whiplinker';

@Component({
	selector: 'pf-component',
	template: `
		<div class="pf-component flex-column flex-inline" [moveable]="el.nativeElement.parentNode" (move)="refresh()">
			<header>
				<output [innerHTML]="name" class="flex"></output>
				<button (click)="remove.next()" title="Remove"></button>
			</header>
			<div class="flex-row">
				<ul class="flex-column inputs">
					<li *ngFor="#input of inputs; #i = index;">
						<whiplinkerNode type="target"></whiplinkerNode>
						<div class="value">
							<input type="{{ input.type }}" [(ngModel)]="input.value" min="{{ input.min }}" max="{{ input.max }}" (keyup)="onInput(input, $event)" (blur)="onInput(input, $event)" (change)="onInput(input, $event)" [title]="'<' + input.type + '> ' + input.value" />
						</div>
						<output [innerHTML]="input.name" class="name"></output>
					</li>
				</ul>
				<ul class="flex-column outputs">
					<li *ngFor="#output of outputs; #i = index;">
						<output [innerHTML]="output.name" class="name right"></output>
						<div class="value">
							<input type="{{ output.type }}" [(ngModel)]="output.value" class="value" [title]="'<' + output.type + '> ' + output.value" readonly />
						</div>
						<whiplinkerNode type="source" (from)="whiplinker.data({actor: PFComponent, output: output})"></whiplinkerNode>
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
export class PFComponent {
	@Input() whiplinker = new WhiplinkerService().instance();
	
	@Input() name: string = '';
	@Input() inputs: string = [];
	@Input() outputs: string = [];
	@Input() handler = function(){};
	
	@Input() position: object = {top: 0, left: 0};
	
	@Input() options: object = {};
	
	@Output() remove = new EventEmitter();
	
	constructor(private el: ElementRef) { }
	ngOnInit() {
		// parse options
		Object.assign(this, this.options);
		this.inputs  = Array.from(this.inputs).map(input   => Object.assign({}, input));
		this.outputs = Array.from(this.outputs).map(output => Object.assign({}, output));
		
		// set initial position
		this.el.nativeElement.firstElementChild.style.left = this.position.left + 'px';
		this.el.nativeElement.firstElementChild.style.top  = this.position.top + 'px';
		
		// can't target own input
		this.targetFilter = e => {
			return ! (this.el.nativeElement.contains(e.sourceElement) && this.el.nativeElement.contains(e.targetElement));
		};
		this.whiplinker.addTargetFilter(this.targetFilter);
		
		this.refresh();
		
		return this.PFComponent = this;
	}
	ngOnDestroy() {
		// clean up filters
		this.whiplinker.removeTargetFilter(this.targetFilter);
	}
	refresh() {
		// process all inputs into output values
		(this.handler.apply(this, this.inputs.map(input => input.value)) || []).forEach((value, i) => {
			if (this.outputs[i].value !== value) {
				this.outputs[i].value = value;
				this.onOutput(this.outputs[i]);
			}
		});
		
		// make sure whiplinks are up-to-date
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
			input.onchange.call(this, e);
		}
		this.refresh();
	}
	
	// outputs
	onOutput(output, e) {
		if (typeof output.onchange === 'function') {
			output.onchange.call(this, e);
		}
		// don't refresh since this will be called because of a refresh
	}
	addOutput(output = {name: ''}) {
		this.outputs.push(output);
		
		this.refresh();
	}
	removeOutput(index: number) {
		this.outputs.splice(index, 1);
		
		this.refresh();
	}
}
