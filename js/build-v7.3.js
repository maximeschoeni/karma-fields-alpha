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
			element.render = function(reflow) {
				for (let i = 0; i < Math.max(this.kids.length, this.children.length); i++) {
					KarmaFields.build(this.kids[i], this, this.children[i], reflow);
				}
			};
			for (var key in args) {
				if (key === "children") {
					element.kids = args.children;
				} else if (key === "child") {
					element.kids = [args.child];
				} else {
					element[key] = args[key];
				}
			}
			if (current) {
				parent.replaceChild(element, current);
			} else {
				parent.appendChild(element);
			}
			if (element.init) {
				element.init(element);
			}
		}
		if (element.update) {
			element.update(element);
		}
		if (element.render) {
			element.render();
		}
	} else if (current) {
		parent.removeChild(current);
	}
	return element;
};
