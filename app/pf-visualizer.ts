//our root app component
import {Component} from 'angular2/core';
import {PFComponent} from './pf-component';
import {WhiplinkerService} from './whiplinker';

import {MinMax} from './actors/minmax';
import {CaseChange} from './actors/casechange';
import {Contains} from './actors/contains';
import {Image} from './actors/image';

@Component({
	selector: '[pf-visualizer]',
	template: `
		<main class="flex" (drop)="onDragDrop($event)">
			<pf-component *ngFor="#actor of actors" [actorTemplate]="actor.template" [options]="actor.options" (remove)="unplaceActor(actor)"></pf-component>
		</main>
		<aside class="bg-primary">
			<ul class="flex-column">
				<li *ngFor="#actorTemplate of actorTemplates" class="flex-row">
					<button [innerHTML]="actorTemplate.name" draggable="true" (dragstart)="onDragStart($event, actorTemplate)"></button>
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
			MinMax,
			CaseChange,
			Contains,
			Image,
		];
		
		this.placeActor(MinMax, {
			position: {
				left: 50,
				top: 50,
			},
		});
		this.placeActor(CaseChange, {
			position: {
				left: 400,
				top: 100,
			},
		});
	}
	
	// actors
	placeActor(template, options = {}) {
		this.actors.push({
			template: template,
			options:  options,
		});
	}
	unplaceActor(indexOrActor) {
		if (typeof indexOrActor !== 'number') indexOrActor = this.actors.indexOf(indexOrActor);
		this.actors.splice(indexOrActor, 1);
	}
	
	// drag/drop
	onDragStart(e, template) {
		this.draggingActorTemplate = template;
	}
	onDragDrop(e) {
		if (this.draggingActorTemplate) {
			this.placeActor(this.draggingActorTemplate, {
				position: {
					left: e.x - 10,
					top:  e.y - 10,
				},
			});
			this.draggingActorTemplate = null;
		}
	}
}
