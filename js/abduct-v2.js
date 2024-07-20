
/**
 * abduct (V2)
 */
async function abduct(element, implants) {

	async function spawn(implant, element, child) {
		// if (!child) {
		// 	child = document.createElement(implant.tag || "div");
		// 	if (implant.class) {
		// 		child.className = implant.class;
		// 	}
		// 	element.appendChild(child);
		// 	if (implant.init) {
		// 		await implant.init(child, implant, () => spawn(implant, element, child));
		// 	}
		// } else if ((implant.tag || "div") !== child.localName) {
		// 	const newchild = document.createElement(implant.tag || "div");
		// 	if (implant.class) {
		// 		newchild.className = implant.class;
		// 	}
		// 	child.replaceWith(newchild);
		// 	if (implant.init) {
		// 		await implant.init(newchild, implant, () => spawn(implant, element, child));
		// 	}
		// }
		if (!child || (implant.tag || "div") !== child.localName) {
			const newChild = document.createElement(implant.tag || "div");
			if (implant.class) {
				newChild.className = implant.class;
			}
			if (child) {
				child.replaceWith(newchild);
			} else {
				element.appendChild(newchild);
			}
			child = newchild;
			if (implant.init) {
				await implant.init(child, implant, () => spawn(implant, element, child));
			}
		}
		if (implant.update) {
			await implant.update(child, implant, () => spawn(implant, element, child));
		}
		if (implant.children || implant.child) {
			await abduct(child, implant.children || [implant.child]);
		}
		if (implant.complete) {
			await implant.complete(child, implant, () => spawn(implant, element, child));
		}
	};

	// let i = 0;
	let child = element.firstElementChild;
	// while (i < implants.length) {
	// 	await spawn(implants[i], element, child);
	// 	i++;
	// 	child = child && child.nextElementSibling;
	// }
	// if (Array.isArray(implants)) {
	// 	implants = implants.values();
	// }
	// let implant = implants.next();
	// while (!implant.done) {
	// 	await spawn(implant.value, element, child);
	// 	implant = implants.next();
	// 	child = child && child.nextElementSibling;
	// }
	for (let implant of implants) {
		await spawn(implant, element, child);
		child = child && child.nextElementSibling;
	}

	while (child) {
		let next = child && child.nextElementSibling;
		element.removeChild(child);
		child = next;
	}

}
