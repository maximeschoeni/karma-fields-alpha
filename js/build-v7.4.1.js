/**
 * V7.4.1
 */
KarmaFields.build = function(args, parent, current) {
	let element;
	if (args) {
		if (!current || args.reinit || args.clear) {
			element = document.createElement(args.tag || "div");
			element.render = function() {
				let children = this.kids || this.kid && [this.kid] || [];
				let i = 0;
				let child = this.firstElementChild;
				while (i < children.length || child) {
					let next = child && child.nextElementSibling;
					KarmaFields.build(children[i], this, child);
					i++;
					child = next;
				}
			};
			for (var key in args) {
				element[key] = args[key];
			}
			if (current) {
				parent.replaceChild(element, current);
			} else {
				parent.appendChild(element);
			}
			if (element.init) {
				element.init(element);
			}
		} else {
			element = current;
		}
		if (element.update) {
			element.update(element);
		}
		if (element.render) {
			element.render();
		}
	} else if (parent && current) {
		parent.removeChild(current);
	}
	return element;
};
