export class Image {
	name = 'image';
	inputs = [
		{
			name: 'src',
			type: 'string',
		},
	];
	outputs = [];
	handler(src: string = '') {
		if ( ! this.img) {
			var figure = document.createElement('figure');
			this.img = document.createElement('img');
			figure.appendChild(this.img);
			this.el.nativeElement.firstElementChild.appendChild(figure);
		}
		this.img.src = src;
	}
}
