/**
 * build (V7.6)
 */

KarmaFieldsAlpha.build = async function(args, parent, element, clean) {
	if (!element || clean) {
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
		await args.update(args);
	}
	if (args.children || args.child) {
		const children = args.children || [args.child];
		let i = 0;
		let element = args.element.firstElementChild;
		while (i < children.length) {
			let child = children[i];
			let current = element;
			child.render = (clean) => {
				return KarmaFieldsAlpha.build(child, args.element, current, clean);
			}
			i++;
			element = element && element.nextElementSibling;
		}
		while (element) {
			args.element.removeChild(element);
			element = element.nextElementSibling;
		}
		await Promise.all(children.map(child => child.render()));
	}
	if (args.complete) {
		args.complete(args);
	}
};
