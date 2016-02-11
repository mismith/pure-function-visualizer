import {Component, ElementRef, Input, Attribute} from 'angular2/core';

export class WhiplinkerService {
	private _instance: WhiplinkService;
	
	constructor() {
		if ( ! WhiplinkerService._instance) {
			WhiplinkerService._instance = new WhipLinker();
			
			WhiplinkerService._instance.setOptions({
				allowTarget: function (e) {
					// only allow one link per target
					return ! e.targetElement.checked;
				},
			});
			WhiplinkerService._instance
				.on('hit', e => e.sourceElement.checked = e.targetElement.checked = true)
				.on('delete', e => e.sourceElement.checked = e.targetElement.checked = false);
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
		if (this.type !== 'target') {
			this.whiplinker.hookSourceElement(this.el.nativeElement.firstChild);
		}
		if (this.type !== 'source') {
			this.whiplinker.hookTargetElement(this.el.nativeElement.firstChild);
		}
	}
}
