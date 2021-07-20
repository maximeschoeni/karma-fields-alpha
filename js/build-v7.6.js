/**
 * build (V7.6)
 */

KarmaFieldsAlpha.build = async function(args, parent, element, clean) {
	args.render = (clean) => {
		return new Promise((resolve) => {
			requestIdleCallback( async () => {
				await KarmaFieldsAlpha.build(args, parent, args.element, clean);
				resolve();
			});
		});
	}
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
		let child = args.element.firstElementChild;
		const promises = [];
		while (i < children.length) {
			let next = child && child.nextElementSibling;
			promises.push(KarmaFieldsAlpha.build(children[i], args.element, child, args.clean));
			// await KarmaFieldsAlpha.build(children[i], args.element, child, args.clean);
			i++;
			child = next;
		}
		await Promise.all(promises);
		while (child) {
			let next = child && child.nextElementSibling;
			args.element.removeChild(child);
			child = next;
		}

	}
	// if (args.children || args.child) {
	// 	const children = args.children || [args.child];
	// 	children.forEach((child, index) => {
	// 		child.render = (clean) => {
	// 			// console.log(child, args.element, element, clean, index, args.element.children[index]);
	// 			return KarmaFieldsAlpha.build(child, args.element, args.element.children[index], clean);
	// 		}
	// 	});
	//
	// 	while (args.element.children.length > children.length) {
	//
	// 		args.element.removeChild(args.element.lastElementChild);
	// 	}
	// 	await Promise.all(children.map(child => child.render()));
	// }
	if (args.complete) {
		args.complete(args);
	}
};
