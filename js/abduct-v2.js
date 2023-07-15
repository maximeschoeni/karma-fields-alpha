
/**
 * abduct (V2)
 */
async function abduct(element, implants) {

	async function spawn(implant, element, child) {
		if (!child) {
			child = document.createElement(implant.tag || "div");
			if (implant.class) {
				child.className = implant.class;
			}
			element.appendChild(child);
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

	let i = 0;
	let child = element.firstElementChild;
	while (i < implants.length) {
		await spawn(implants[i], element, child);
		i++;
		child = child && child.nextElementSibling;
	}
	while (child) {
		let next = child && child.nextElementSibling;
		element.removeChild(child);
		child = next;
	}

}
