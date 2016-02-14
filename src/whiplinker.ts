import {Component, ElementRef, Input, Attribute} from 'angular2/core';

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
	
	constructor(@Attribute('type') private type, private el: ElementRef) { }
	ngOnInit() {
		// checked when linked
		this.whiplinker
			.on('hit', e => e.sourceElement.checked = e.targetElement.checked = true)
			.on('delete', e => e.sourceElement.checked = e.targetElement.checked = false);
		
		// setup hooks
		if (this.type !== 'target') {
			// it's a source
			this.whiplinker.hookSourceElement(this.el.nativeElement.firstChild);
		}
		if (this.type !== 'source') {
			// it's a target
			this.whiplinker.hookTargetElement(this.el.nativeElement.firstChild);
		}
	}
}
