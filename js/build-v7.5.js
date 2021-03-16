/**
 * build (V7.5)
 */
KarmaFields.ChildrenWM = new WeakMap();
KarmaFields.InitWM = new WeakMap();
KarmaFields.UpdateWM = new WeakMap();
KarmaFields.RenderWM = new WeakMap();

KarmaFields.argsWM = new WeakMap();

KarmaFields.build = function(args, parent, current, reflow) {
	let element;
	if (args) {
		if (current && !args.clear && !reflow) {
			element = current;
		} else {
			element = document.createElement(args.tag || "div");
			KarmaFields.argsWM.set(element, args);

			args.render = function(reflow) {
				let children = this.children || this.child && [this.child] || [];
				for (let i = 0; i < Math.max(children.length, element.children.length); i++) {
					KarmaFields.build(children[i], element, element.children[i], reflow);
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
