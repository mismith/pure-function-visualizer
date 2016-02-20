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
						<whiplinker-node type="target" (hit)="linkValue($event.detail.data, input)" (delete)="unlinkValue($event.detail.data, input)"></whiplinker-node>
						<div class="value">
							<input type="{{ input.type }}" [(ngModel)]="input.value" min="{{ input.min }}" max="{{ input.max }}" [title]="'<' + input.type + '> ' + input.value" />
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
						<whiplinker-node type="source" (from)="whiplinker.data(output)"></whiplinker-node>
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
	
	@Input() template;
	private name: string;
	private inputs: string = [];
	private outputs: string = [];
	private handler;
	
	@Input() options: object = {};
	
	@Output() remove = new EventEmitter();
	
	constructor(private el: ElementRef) { }
	ngOnInit() {
		// set initial position
		if (this.options.position) {
			this.el.nativeElement.firstElementChild.style.left = this.options.position.left + 'px';
			this.el.nativeElement.firstElementChild.style.top  = this.options.position.top + 'px';
		}
		
		// can't target own input
		this.targetFilter = e => {
			return ! (this.el.nativeElement.contains(e.sourceElement) && this.el.nativeElement.contains(e.targetElement));
		};
		this.whiplinker.addTargetFilter(this.targetFilter);
		
		// fill from template
		var template = new this.template();
		['name','handler'].forEach(k => if(this[k] === undefined) this[k] = template[k]);
		Array.from(template.inputs || []).map(input   => this.addInput(Object.assign({}, input)));
		Array.from(template.outputs || []).map(output => this.addOutput(Object.assign({}, output)));
		
		this.refresh();
	}
	ngOnDestroy() {
		// clean up whiplinker filters
		this.whiplinker.removeTargetFilter(this.targetFilter);
		
		// clean up linkedValues
		for (var i = this.inputs.length - 1; i >= 0; i--) this.removeInput(i);
		for (i = this.outputs.length - 1; i >= 0; i--) this.removeOutput(i);
	}
	
	// inputs
	addInput(input = {name: ''}) {
		this.inputs.push(input);
		
		// watch value
		Object.observe(input, changes => this.inputChange(input, changes));
	}
	removeInput(index: number) {
		this.unlinkValues(this.inputs[index]);
		this.inputs.splice(index, 1);
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
		
		// watch value
		Object.observe(output, changes => this.outputChange(output, changes));
	}
	removeOutput(index: number) {
		this.unlinkValues(this.outputs[index]);
		this.outputs.splice(index, 1);
	}
	
	// changes
	refresh() {
		// process all inputs into output values
		(this.handler.apply(this, this.inputs.map(input => input.value)) || []).forEach((value, i) => {
			if (this.outputs[i]) {
				if (this.outputs[i].value !== value) {
					this.outputs[i].value = value;
				}
			}
		});
		
		// make sure whiplinks are up-to-date
		this.whiplinker.repaint();
	}
	inputChange(input, changes) {
		if (typeof input.onchange === 'function') {
			input.onchange.call(input, this);
		}
		
		// changes here can affect our ouputs, so refresh
		this.refresh();
	}
	outputChange(output, changes) {
		if (typeof output.onchange === 'function') {
			output.onchange.call(output, this);
		}
		
		// changes here should propagate to linked inputs, if any
		this.propagateValues(output);
	}
	
	// links
	linkValue(output, input) {
		// forward link it
		output.links = output.links || [];
		output.links.push(input);
		
		// back link it (for easy/two-way removal)
		input.links = input.links || [];
		input.links.push(output);
		
		// propagate the value immediately
		this.propagateValue(output, input);
	}
	unlinkValue(near, far) {
		if(near.links) near.links.splice(near.links.indexOf(far), 1);
		if(far.links)  far.links.splice(far.links.indexOf(near), 1);
	}
	unlinkValues(near, far) {
		if (near.links) {
			near.links.forEach(far => this.unlinkValue(near, far));
		}
	}
	propagateValue(output, input) {
		input.value = output.value;
	}
	propagateValues(output) {
		if (output.links) {
			output.links.forEach(input => this.propagateValue(output, input));
		}
	}
}
