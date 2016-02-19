//our root app component
import {Component} from 'angular2/core';
import {PFComponent} from './pf-component';
import {WhiplinkerService} from './whiplinker';

@Component({
	selector: '[pf-visualizer]',
	template: `
		<main class="flex" (drop)="onDragDrop($event)">
			<pf-component *ngFor="#actor of actors" [templateData]="getActorTemplate(actor.template)" [options]="actor.options" (remove)="removeActor(actor)"></pf-component>
		</main>
		<aside class="bg-primary">
			<ul class="flex-column">
				<li *ngFor="#actorTemplate of actorTemplates" class="flex-row">
					<button [innerHTML]="actorTemplate.name" draggable="true" (dragstart)="onDragStart($event, actorTemplate.name)"></button>
				</li>
			</ul>
		</aside>
	`,
	bindings: [
		WhiplinkerService,
	],
	directives: [
		PFComponent,
	],
})
export class PFVisualizer {
	private whiplinker = new WhiplinkerService().instance();
	private actors: array = [];
	
	constructor() {
		// only allow one link per target
		this.whiplinker.addTargetFilter(e => ! e.targetElement.checked);
		
		// function pool
		this.actorTemplates = [
			{
				name: 'minMax',
				inputs: [
					{
						name: 'qty',
						type: 'number',
						min: 2,
						value: 2,
						onchange: function(input) {
							this.changeNumberOfInputs(parseInt(input.value) + 1, i => {
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
				handler: function(qty: number, ...values) {
					return [
						Math.min.apply(this, values),
						Math.max.apply(this, values),
					];
				},
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
						type: 'string',
					},
					{
						name: 'uppercase',
						type: 'string',
					},
				],
				handler: function(str: string = '') {
					str = str + '';
					return [
						str.toLowerCase(),
						str.toUpperCase(),
					];
				},
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
						type: 'any',
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
				handler: function(arr: array = [], needle) {
					var i = arr.indexOf(needle);
					return [
						i >= 0,
						i,
					];
				},
			},
			{
				name: 'img',
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
		
		//this.addActor('img');
		this.addActor('minMax', {
			position: {
				left: 500,
				top: 200,
			},
		});
		this.addActor('caseChange', {
			position: {
				left: 900,
				top: 300,
			},
		});
	}
	
	// actors
	getActorTemplate(template) {
		return this.actorTemplates.find(actorTemplate => actorTemplate.name === template);
	}
	addActor(template, options = {}) {
		this.actors.push({
			template: template,
			options:  options,
		});
	}
	removeActor(indexOrActor) {
		if (typeof indexOrActor !== 'number') indexOrActor = this.actors.indexOf(indexOrActor);
		this.actors.splice(indexOrActor, 1);
	}
	
	// drag/drop
	onDragStart(e, template) {
		e.dataTransfer.setData('text/plain', template);
	}
	onDragDrop(e) {
		var template = e.dataTransfer.getData('text/plain');
		if (template) {
			this.addActor(template, {
				position: {
					left: e.x - 10,
					top:  e.y - 10,
				},
			});
		}
	}
}
