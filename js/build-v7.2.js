/**
 * build (V7.2)
 */
KarmaFields.build = function(args, parent, current, reflow) {
	let element;
	if (args) {
		if (current && !args.clear && !reflow) {
			element = current
		} else {
			let element = document.createElement(args.tag || "div");
			for (var key in args) {
				element["k"+key] = args[key];
			}
			if (args.kclass) {
				element.className = args.kclass;
			}
			element.krender = function(reflow) {
				let childArgs = this.kchildren || args.kchild && [args.kchild] || [];
				for (let i = 0; i < Math.max(childArgs.length, this.children.length); i++) {
					KarmaFields.build(childArgs[i], this, this.children[i], reflow);
				}
			};
			element.element = element; // -> compat
			element.render = element.krender // -> compat
			if (current) {
				parent.replaceChild(element, current);
			} else {
				parent.appendChild(element);
			}
			if (element.kinit) {
				element.kinit(element);
			}
		}
		if (element.kupdate) {
			element.kupdate(element);
		}
		if (element.krender) {
			element.krender();
		}
	} else if (current) {
		parent.removeChild(current);
	}
	return element;
};
