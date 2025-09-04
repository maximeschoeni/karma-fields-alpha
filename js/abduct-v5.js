
/**
 * abduct (V2)
 */
async function abduct(element, implants) {

	let child = element.firstElementChild;

	for (let implant of implants) {

		if (!child || implant.transformX && (implant.tag || "div") !== child.tagName.toLowerCase()) {
			if (child) {
				const newchild = document.createElement(implant.tag || "div");
				child.replaceWith(newchild);
				child = newchild;
			} else {
				child = document.createElement(implant.tag || "div");
				element.appendChild(child);
			}
			if (implant.class) {
				child.className = implant.class;
			}
			if (implant.init) {
				await implant.init(child, implant);
			}
		}

		if (implant.update) {
			await implant.update(child, implant);
		}
		if (implant.children || implant.child) {
			await abduct(child, implant.children || [implant.child]);
		}
		child = child.nextElementSibling;
	}

	while (child) {
		let next = child.nextElementSibling;
		element.removeChild(child);
		child = next;
	}

}
