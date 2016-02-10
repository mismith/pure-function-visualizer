import {Directive, ElementRef, Renderer, Output, EventEmitter} from 'angular2/core';

@Directive({
	selector: '[moveable]',
	host: {
		'(dragstart)': 'onStart($event)',
		'(drag)': 'onDrag($event)',
	},
})
export class Moveable {
	public x: number = 0;
	public y: number = 0;
	@Output() move: EventEmitter = new EventEmitter();

	constructor(private el: ElementRef, private renderer: Renderer) {
		// use HTML5-native drag/drop
		this.renderer.setElementProperty(this.el, 'draggable', true);
		this.renderer.on(document, 'dragover', e => e.preventDefault());
	}
	private onStart(e) {
		// hide drag/drop UI
		e.dataTransfer.effectAllowed = 'move';
		let img = document.createElement('img')
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparent gif
		e.dataTransfer.setDragImage(img, 0, 0);
		
		// init
		this.x = e.offsetX;
		this.y = e.offsetY;
		this.renderer.setElementStyle(this.el, 'position', 'absolute');
		this.doTranslation(e.x, e.y);
	}
	private onDrag(e) {
		this.doTranslation(e.x, e.y);
	}
	private doTranslation(x = 0, y = 0) {
		this.move.next({x, y});
		this.renderer.setElementStyle(this.el, 'left', (x - this.x) + 'px');
		this.renderer.setElementStyle(this.el, 'top',  (y - this.y) + 'px');
	}
}
