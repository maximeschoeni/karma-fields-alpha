/**
 * build (V7.1)
 */
KarmaFields.build = function(args, parent, element, clean) {
	if (args) {
		if (args.kids || args.kid || args.className) {
			console.error(args, "bad args");
		}
		args.render = function(clean) {
			let children = this.children || this.child && [this.child] || [];
			let i = 0;
			let child = this.element.firstElementChild;
			while (i < children.length || child) {
				let next = child && child.nextElementSibling;
				KarmaFields.build(children[i], this.element, child, clean);
				i++;
				child = next;
			}
		};

		if (!element || clean || args.clear || args.reflow && args.reflow(element)) {
			args.element = document.createElement(args.tag || "div");
			if (args.class) {
				args.element.className = args.class;
			}
			if (element) {
				parent.replaceChild(args.element, element);
			} else {
				parent.appendChild(args.element);
			}
			if (args.init) {
				args.init(args);
			}
		} else {
			args.element = element;
		}

		if (args.update) {
			args.update(args);
		}
		if (args.render) {
			args.render();
		}
	} else if (element) {
		parent.removeChild(element);
	}
	return args;
};
