/**
 * jQuery Whip/Link Plugin v1.0.0
 * Copyleft 2012 - Murray Smith mismith.info
 */
(function($){
	$.fn.whiplink = function(to, options){
		// options
		var defaultOptions = {
		
			// general behaviour
			from:         this.selector, // what elements can whips be dragged from?
			to:           this.selector, // what elements can whips be dragged to?
			handles:      false,         // should there be handle elements at each end of the whip?
			persist:      true,          // should whips stay visible after a successful hit?
			snap:         true,          // should whips snap to <from> and <to> nodes?
			                             //    (format: '[left|center|right[ top|middle|center|bottom]]'; defaults to 'center center')
			// quantity restrictions
			maxFromSolo:  1,             // how many whips can each individual <from> node source?
			maxFromTotal: 0,             // how many whips can all of the <from> nodes in this collection source? (0 = unlimited)
			maxToSolo:    1,             // how many whips can each individual <to> node accept?
			maxToTotal:   0,             // how many whips can all of the <to> nodes in thie collection accept? (0 = unlimited)
			
			// whip styling
			prefix:       'wl-',         // what should all css classes begin with?
			customClass:  false,         // is there a class to add to all whips? (for custom styling)
		};
		
		// private properties
		var $source,
			source = {top:0, left:0},
			$current,
			links = [];
		
		// public properties
		this.active = false;
		
		// helper methods
		this.offset = function(el){
			if(el === true) return source;
			
			var $el    = $(el),
				offset = $el.offset();
			
			return {
				left: offset.left + (/left/.test(options.snap) ? 0 : (/right/.test(options.snap)  ? $el.outerWidth()  : $el.outerWidth()/2)),
				top:  offset.top +  (/top/.test(options.snap)  ? 0 : (/bottom/.test(options.snap) ? $el.outerHeight() : $el.outerHeight()/2)),
			};
		};
		this.source = function(el, x, y){
			if(el !== undefined){
				// set source element
				$source = $(el);
			}
			source = {left: x, top: y};
			// get source element
			return $source;
		};
		this.current = function(el){
			if(el !== undefined){
				// set current whip element
				$current = !el ? false : $(el);
			}else if(!$current){
				// create new whip if none exists
				$current = $(
					'<div class="' + options.prefix + 'whip' + (options.customClass ? ' ' + options.customClass : '') + '">' +
						(options.handles ? 
						'<div class="' + options.prefix + 'handle ' + options.prefix + 'handle-from"></div>' +
						'<div class="' + options.prefix + 'handle ' + options.prefix + 'handle-to"></div>' : '') +
					'</div>'
				).appendTo(document.body); 
			}
			// get current whip
			return $current;
		};
		this.links = function(sel, type, returns){
			var found = [];
				sel   = sel  || this;
				type  = type || 'from'; // can be: 'whip', 'from', 'to'
			
			$(sel).each(function(){
				var el = this;
				$.each(links, function(){
					if(this[type]==el) found.push(returns && this[returns] ? this[returns] : this);
				});
			});
			return found;
		};
		
		// public methods (chainable)
		this.throw = function(from, x, y){
			this.source(from, x, y);
			this.current().addClass(options.prefix+'active').removeClass(options.prefix+'missed').width(0).css(this.offset(options.snap ? from : true)).show();
			this.active = true;
			
			return this;
		};
		this.to = function(x,y){
			if(arguments.length && this.active){
				var center;
				if(!$.isNumeric(x)){
					center = this.offset(x);
					x = center.left;
					y = center.top;
				}
				center = this.offset(this.source());
				x -= center.left;
				y -= center.top;
				
				var length = Math.sqrt(x*x+y*y),
					angle  = Math.atan(y/x) * // get theta
							 180/Math.PI +    // to degrees
							 (x<0?180:0);     // quadrants II & III
							 
				this.current().css({
					width:     length,
					transform: 'rotate('+angle+'deg)',
				});
			}
			
			return this;
		};
		this.hit = function(el){
			if( // are whip quantities maxed out?
				(!options.maxFromTotal || this.links(options.from).length  < options.maxFromTotal) &&
				(!options.maxFromSolo  || this.links(this.source()).length < options.maxFromSolo) &&
				(!options.maxToTotal || this.links(options.to,'to').length < options.maxToTotal) &&
				(!options.maxToSolo  || this.links(el,'to').length         < options.maxToSolo) &&
				// does this links already exist?
				$.inArray(el, this.links(this.source(),'from','to')) < 0 &&
				$.inArray(el, this.links(this.source(),'to','from')) < 0 &&
				// is the <from> node the same as the <to> node?
				this.source()[0] !== el
			){
				// snapping?
				if(options.snap && el) this.to(el);
				
				// add the link
				var link = {
					whip: this.current()[0],
					from: this.source()[0],
					to:   $(el)[0],
				};
				links.push(link);
				
				// clean up
				this.current().removeClass(options.prefix + 'hover').removeClass(options.prefix + 'active');
				if(!options.persist) this.current().remove();
				this.current(false);
				
				// hook user event
				this.trigger('hit.whiplink', [link.to, links, link.from, link.whip]);
			}else{
				// maximum reached
				alert('maximum whips reached');
				return this.miss();
			}
			
			return this.done();
		};
		this.miss = function(){
			this.current().width(0).removeClass(options.prefix + 'active').addClass(options.prefix+'missed');
			
			// hook user event
			this.trigger('miss.whiplink', [links, this.source()[0], this.current()[0]]);
			
			return this.done();
		};
		this.done = function(){
			// stop whipping
			this.active = false;
			
			return this;
		};
		
		// parse options & dispatch methods
		if(arguments.length == 2){
			options    = $.isPlainObject(options)? options : {};
			options.to = to;
		}else if(arguments.length == 1){
			if(this[to]){
				// it's a method
				return this[to].apply(this, Array.prototype.slice.call(arguments, 1));
			}else{
				if(typeof(to)=='string'){
					// it's a 'to' selector
					options    = {to: to};
				}else if($.isPlainObject(to)){
					options = to;
				}else{
					options = {};
				}
			}
		}else{
			options = {};
		}
		options = $.extend(defaultOptions, options);
		
		// init
		var whip = this;
		
		this.bind('hit.whiplink', function(e, to, links, from, whip){
			if(links.length == 4) console.log('hit');
		});
		this.bind('miss.whiplink', function(e, links, from, whip){
			console.log('miss');
		});
		
		$(document)
			.on('mousedown.whiplink', options.from, function(e){
				whip.throw(this, e.clientX, e.clientY);
				
				e.stopPropagation();
				e.preventDefault();
			})
			.on('mouseup.whiplink', options.to, function(e){
				if(whip.active){
					whip.hit(this);
					
					$(this).removeClass(options.prefix + 'hover');
					
					e.stopPropagation();
					e.preventDefault();
				}
			})
			.on('mouseenter.whiplink', options.to, function(e){
				if(whip.active){
					$(this).addClass(options.prefix + 'hover');
					whip.current().addClass(options.prefix + 'hover');
				}
			})
			.on('mouseleave.whiplink', options.to, function(e){
				if(whip.active){
					$(this).removeClass(options.prefix + 'hover');
					whip.current().removeClass(options.prefix + 'hover');
				}
			})
			.on('mousemove.whiplink', function(e){
				if(whip.active){
					whip.to(e.clientX, e.clientY);
				}
			})
			.on('mouseup.whiplink', function(){
				if(whip.active){
					whip.miss();
				}
			})
/*
			.on('click', '.whip', function(){
				$(this).toggleClass('selected');
			})
*/
			;
		return this;
	};
})(jQuery);