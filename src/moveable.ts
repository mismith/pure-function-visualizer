import {Directive, ElementRef, Renderer, Input, Output, EventEmitter} from 'angular2/core';

@Directive({
	selector: '[moveable]',
	host: {
		'(dragstart)': 'onStart($event)',
		'(drag)':      'onDrag($event)',
		'(dragend)':   'onDrag($event)',
	},
})
export class Moveable {
	public x: number = 0;
	public y: number = 0;
	@Input() container: HTMLElement = document.body;
	@Output() move: EventEmitter = new EventEmitter();

	constructor(private el: ElementRef, private renderer: Renderer) {
		// use HTML5-native drag/drop
		this.renderer.setElementProperty(this.el, 'draggable', true);
	}
	ngOnInit() {
		this.renderer.on(this.container, 'dragover', e => e.preventDefault());
	}
	private onStart(e) {
		// hide drag/drop UI
		let img = document.createElement('img')
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparent gif
		e.dataTransfer.setDragImage(img, 0, 0);
		e.dataTransfer.effectAllowed = 'move';
		
		// init
		this.x = e.offsetX;
		this.y = e.offsetY;
		this.renderer.setElementStyle(this.el, 'position', 'absolute');
		this.doTranslation(e.x, e.y);
	}
	private onDrag(e) {
		if (e.x && e.y) this.doTranslation(e.x, e.y);
	}
	private doTranslation(x = 0, y = 0) {
		let limits = this.container.getBoundingClientRect(),
			left = Math.max(0, limits.left, Math.min(limits.left + limits.width, x - this.x)),
			top  = Math.max(0, limits.top,  Math.min(limits.top  + limits.height, y - this.y));
		
		this.move.next({left, top});
		this.renderer.setElementStyle(this.el, 'left', (left || 0) + 'px');
		this.renderer.setElementStyle(this.el, 'top',  (top || 0)  + 'px');
	}
}
