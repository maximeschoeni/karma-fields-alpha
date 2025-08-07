
/**
 * abduct (V2)
 */
async function abduct(element, implants) {

	let child = element.firstElementChild;

	for (let implant of implants) {
		if (!child) {
			child = document.createElement(implant.tag || "div");
			if (implant.class) {
				child.className = implant.class;
			}
			element.appendChild(child);
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
