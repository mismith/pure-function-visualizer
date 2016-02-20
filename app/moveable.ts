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
	private x: number = 0;
	private y: number = 0;
	@Input() moveable: HTMLElement = document.body;
	@Output() move: EventEmitter = new EventEmitter();

	constructor(private el: ElementRef, private renderer: Renderer) {
		// use HTML5-native drag/drop
		this.renderer.setElementProperty(this.el, 'draggable', true);
	}
	ngOnInit() {
		this.renderer.on(this.moveable, 'dragover', e => e.preventDefault());
		this.setPosition();
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
		this.setPosition(e.x, e.y);
	}
	private onDrag(e) {
		if (e.x && e.y) this.setPosition(e.x, e.y);
	}
	setPosition(x, y) {
		let marginX = 10,
			marginY = 10;
		
		let self = this.el.nativeElement.getBoundingClientRect(),
			limits = this.moveable.getBoundingClientRect();
			
		if (x === undefined) x = self.left;
		if (y === undefined) y = self.top;
		
		let left = Math.min(Math.max(marginX, limits.left, Math.min(limits.left + limits.width, x - this.x)), limits.right - self.width - marginX),
			top  = Math.min(Math.max(marginY, limits.top,  Math.min(limits.top  + limits.height, y - this.y)), limits.bottom - self.height - marginY);
			
		this.move.next({left, top});
		this.renderer.setElementStyle(this.el, 'left', (left || 0) + 'px');
		this.renderer.setElementStyle(this.el, 'top',  (top || 0)  + 'px');
	}
}
