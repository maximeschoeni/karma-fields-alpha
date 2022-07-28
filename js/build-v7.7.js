/**
 * build (V7.6)
 */

// KarmaFieldsAlpha.buildChildren = function(children, element, clean) {
// 	let i = 0;
// 	let child = element.firstElementChild;
// 	const promises = [];
// 	while (i < children.length) {
// 		const promise = this.build(children[i], element, child, clean);
// 		promises.push(promise);
// 		i++;
// 		child = child && child.nextElementSibling;
// 	}
// 	while (child) {
// 		let next = child && child.nextElementSibling;
// 		element.removeChild(child);
// 		child = next;
// 	}
// 	return Promise.all(promises);
// }

KarmaFieldsAlpha.buildChildren = async function(children, element, clean) {
	let i = 0;
	let child = element.firstElementChild;
	const promises = [];
	while (i < children.length) {
		await this.build(children[i], element, child, clean);
		i++;
		child = child && child.nextElementSibling;
	}
	while (child) {
		let next = child && child.nextElementSibling;
		element.removeChild(child);
		child = next;
	}
	// return Promise.all(promises);
}



KarmaFieldsAlpha.build = async function(args, parent, element, clean) {
	args.render = (clean) => this.build(args, parent, args.element, clean);
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
			await args.init(args);
		}
	} else {
		args.element = element;

	}
	if (args.update) {
		await args.update(args);
	}
	if (args.children || args.child) {
		await this.buildChildren(args.children || [args.child], args.element, args.clean);
	}
	if (args.complete) {
		args.complete(args);
	}
};
