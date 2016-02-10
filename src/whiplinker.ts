import {Component, ElementRef, Attribute} from 'angular2/core';

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
	selector: 'whiplinkNode',
	template: `<input type="radio" tabindex="-1" />`,
	bindings: [WhiplinkerService],
})
export class WhiplinkNode {
	constructor(whiplinker: WhiplinkerService, @Attribute('type') type = 'source', el: ElementRef) {
		this.wl = whiplinker.instance();
		this.wl
			.on('hit', function (e) {
				e.sourceElement.checked = e.targetElement.checked = true;
			})
			.on('delete', function (e) {
				e.sourceElement.checked = e.targetElement.checked = false;
			})
			.on('select', function (e) {
				e.whiplinkElement.style.boxShadow = 'inset 0 0 0 3px rgb(59, 153, 252)';
			})
			.on('deselect', function (e) {
				e.whiplinkElement.style.boxShadow = null;
			});
		
		if (type === 'target') {
			this.wl.addTargetElement(el.nativeElement);
		} else {
			this.wl.addSourceElement(el.nativeElement);
		}
	}
}
