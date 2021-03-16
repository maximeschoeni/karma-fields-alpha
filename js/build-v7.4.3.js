/**
 * V7.4.3
 */

KarmaFields.build = async function(args, parent, current) {
	 	let element;
	 	if (args) {
	 		if (current && !args.clear && !args.reflow) {
	 			element = current;
	 		} else {
	 			element = document.createElement(args.tag || "div");
	 			element.render = async function() {
	        let children = this.kids || this.kid && [this.kid] || [];
					let i = 0;
					let child = this.firstElementChild;
					while (i < children.length || child) {
						let next = child && child.nextElementSibling;
						await KarmaFields.build(children[i], this, child);
						i++;
						child = next;
					}
	 			};
	      Object.assign(element, args);
	 			if (current) {
	 				parent.replaceChild(element, current);
	 			} else {
	 				parent.appendChild(element);
	 			}
	 			if (element.init) {
	 				await element.init(element);
	 			}
	 		}
	    if (element.update) {
	    	await element.update(element);
	    }
	    if (element.render) {
	    	await element.render();
	    }
			if (element.complete) {
	    	await element.complete(element);
	    }
	 	} else if (parent && current) {
	 		parent.removeChild(current);
	 	}
	  return element;
	 };
