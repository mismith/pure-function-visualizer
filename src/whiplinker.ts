import {Component, ElementRef, Input, Output, EventEmitter} from 'angular2/core';

export class WhiplinkerService {
	private _instance: WhiplinkService;
	
	constructor() {
		if ( ! WhiplinkerService._instance) {
			WhiplinkerService._instance = new WhipLinker();
		}
	}
	instance() {
		return WhiplinkerService._instance;
	}
}

@Component({
	selector: 'whiplinkerNode',
	template: `<input type="radio" onclick="return false;" tabindex="-1" />`,
	bindings: [WhiplinkerService],
})
export class WhiplinkerNode {
	@Input() whiplinker = new WhiplinkerService().instance();
	@Input() type: string;
	
	@Output() from   = new EventEmitter();
	@Output() hit    = new EventEmitter();
	@Output() delete = new EventEmitter();
	
	constructor(private el: ElementRef) { }
	ngOnInit() {
		var el = this.el.nativeElement;
		el.addEventListener('wl-from', e => {
			// dispatch
			this.from.next(e);
		});
		el.addEventListener('wl-hit', e => {
			// checked when linked
			e.detail.sourceElement.checked = e.detail.targetElement.checked = true;
			
			// dispatch
			this.hit.next(e);
		});
		el.addEventListener('wl-delete', e => {
			// checked only when linked
			e.detail.sourceElement.checked = e.detail.targetElement.checked = false;
			
			// dispatch
			this.delete.next(e);
		});
		
		// setup hooks
		if (this.type !== 'target') {
			// it's a source
			this.whiplinker.hookSourceElement(el.firstChild);
		}
		if (this.type !== 'source') {
			// it's a target
			this.whiplinker.hookTargetElement(el.firstChild);
		}
	}
}
