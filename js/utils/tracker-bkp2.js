


// Usage:

// new PointerTrap(element);
//
// element.ontrack = trap => {
// 	console.log(trap.diffX, trap.diffY);
// }
//
// element.onlose = trap => {
// 	console.log(trap.swipeRight, trap.swipeFail);
// }



KarmaFieldsAlpha.Tracker = class {

	// static register(tracker) {

	// 	this.trackers.
	// }

	static zones = new Map();
	static elements;
	static element;

	static register(element, field, offset, groupLength) {

		this.zones.set(element, { field, offset, groupLength });

	}

	static trackMouse(element, event) {

		this.isMouse = true;
		this.element = element;
		this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

		const onmousemove = event => {
			this.x = event.clientX;
			this.y = event.clientY;
			this.event = event;
			this.update();
		}

		const onscroll = event => {
			if (event.target.contains(this.element)) {
				this.update();
			}
		}

		const onmouseup = event => {
			this.event = event;
			// this.lastTarget = event.target;
			this.isMouse = false;
			this.complete();
			document.removeEventListener("mousemove", onmousemove);
			document.removeEventListener("mouseup", onmouseup);
			(this.scrollContainer || document).removeEventListener("scroll", onscroll);
		}

		this.x = event.clientX;
		this.y = event.clientY;
		this.event = event;
		this.firstTarget = event.target;
		this.init();

		document.addEventListener("mousemove", onmousemove);
		document.addEventListener("mouseup", onmouseup);
		(this.scrollContainer || document).addEventListener("scroll", onscroll);

	}

	static trackTouch(element, event) {

		this.isTouch = true;
		this.element = element;
		this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

		const ontouchmove = event => {
			this.x = event.touches[0].clientX;
			this.y = event.touches[0].clientY;
			this.event = event;
			this.update();
		}

		const ontouchend = event => {
			this.isTouch = false;
			this.event = event;
			this.complete();
			document.removeEventListener("touchmove", ontouchmove);
			document.removeEventListener("touchend", ontouchend);
		}

		this.x = event.touches[0].clientX;
		this.y = event.touches[0].clientY;
		this.event = event;
		this.init();
		document.addEventListener("touchmove", ontouchmove);
		document.addEventListener("touchend", ontouchend);

	}


	static init() {

		this.lastX = this.x;
		this.lastY = this.y;

		const index = this.findIndex();
		const field = this.getField();
		const selection = field.getSelection();

		if (index > -1 && selection && index >= selection.index && index < selection.index + selection.length) {

			this.dragging = true;
			this.draggingIndex = index;
			this.dragOrigin = this.getBox(selection.index, selection.length);
			// this.dragOrigin2 = this.getBox(selection.index, selection.length);

			this.dragOffset = { x: this.x - this.dragOrigin.x, y: this.y - this.dragOrigin.y };
			this.elements = this.getElements(selection.index, selection.length);

			for (let element of this.elements) {

				element.classList.add("dragging");

			}

			this.event.stopPropagation();

		} else {

			this.selecting = true;

			if (index > -1) {

				this.tie = { index, length: 1 };

				if (selection.length && this.event.shiftKey) {

					this.tie.index = Math.min(selection.index, index);
					this.tie.length = Math.max(index + 1, selection.index + selection.length) - this.tie.index;

				}

				field.setSelection(this.tie);

				this.event.stopPropagation();

			} else {

				field.unselect();

			}

			field.render();

		}


	}

	static update() {

		this.diffX = this.x - this.lastX;
		this.diffY = this.y - this.lastY;
		this.lastX = this.x;
		this.lastY = this.y;

		if (this.dragging) {

			// console.log(this.dragOrigin2);

			this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
			this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

			const field = this.getField();

			if (field.drag) {

				field.drag(this);

			} else {

				this.reorder() || this.dragout();

			}

			for (let element of this.elements) {

				element.style.transform = `translate(${this.tx}px, ${this.ty}px)`;

			}

		} else if (this.selecting) {

			const index = this.findIndex();
			const field = this.getField();
			const selection = field.getSelection();

			if (index > -1) {

				if (this.tie) {

					const min = Math.min(index, this.tie.index);
					const max = Math.max(this.tie.index + this.tie.length, index + 1);
					const newSelection = { index: min, length: max - min };

					if (!selection || newSelection.index !== selection.index || newSelection.length !== selection.length) {
						field.setSelection(newSelection);
						field.render();
					}

				} else {

					field.setSelection({ index, length: 1 });
					field.render();

				}

			}

		}

	}

	static complete() {

		if (this.dragging) {

			for (let element of this.elements) {

				element.style.transform = `translate(0, 0)`;
				element.classList.remove("dragging");

			}

			this.dragging = false;

		}

		if (this.selecting) {

			const field = this.getField();
			const selection = field.getSelection();

			if (selection.length === 1) {
				const child = field.getChild(selection.index);
				child.setFocus(true);
			} else {
				field.setFocus(true);
			}

			this.selecting = false;
			field.render();

		}

	}

	static reorder() {

		return this.swapAbove() || this.swapBelow();

	}


	// static reorder() {

	// 	const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);

	// 	const boxBefore = this.getElementBoxBefore();
	// 	const swapAbove = boxBefore && (this.diffY < 0 && dragBox.y < boxBefore.y + boxBefore.height / 2 || dragBox.y < boxBefore.y && dragBox.y + dragBox.height < boxBefore.y + boxBefore.height);

	// 	const boxAfter = this.getElementBoxAfter();
	// 	const swapBelow = boxAfter && (this.diffY > 0 && dragBox.y + dragBox.height > boxAfter.y + boxAfter.height / 2 || dragBox.y > boxAfter.y && dragBox.y + dragBox.height > boxAfter.y + boxAfter.height);

	// 	if (this.isBoxBefore(dragBox, this.elements[0].previousElementSibling)) {

	// 	}


	// 	// const firstElement = this.elements[0];
	// 	// const elementBefore = firstElement.previousElementSibling;
	// 	// const firstElementBox = firstElement.getBoundingClientRect();
	// 	// const elementBeforeBox = elementBefore && elementBefore.getBoundingClientRect();
	// 	// const elementBeforeY = elementBeforeBox.y + elementBeforeBox.height / 2

	// 	// const swapAbove = elementBefore && this.diffY < 0 && this.dragOrigin.y + this.ty < elementBeforeBox.y + elementBeforeBox.height / 2;


	// 	// const lastElement = this.elements[this.elements.length - 1];
	// 	// const elementAfter = lastElement.nextElementSibling;
	// 	// const lastElementBox = firstElement.getBoundingClientRect();
	// 	// const elementAfterBox = elementAfter && elementAfter.getBoundingClientRect();

	// 	// const swapBelow = elementAfter && this.diffY > 0 && lastElementBox.y + lastElementBox.height + this.ty > elementAfterBox.y + elementAfterBox.height / 2;


	// 	if (swapAbove) {

	// 		this.insertBefore(this.elements, elementBefore);

	// 	}

	// 	if (swapBelow) {

	// 		this.insertBefore(this.elements, elementAfter.nextElementSibling);

	// 	}

	// 	if (swapAbove || swapBelow) {

	// 		for (let element of this.elements) {

	// 			element.style.transform = "translate(0, 0)";

	// 		}

	// 		const field = this.getField();
	// 		const selection = field.getSelection();
	// 		let newSelection = { ...selection };

	// 		if (swapAbove) {
	// 			newSelection.index--;
	// 		}

	// 		if (swapBelow) {
	// 			newSelection.index++;
	// 		}

	// 		// this.dragOrigin = this.getBox(newSelection.index, newSelection.length);


	// 		this.dragOrigin = this.getElementsBox(this.elements);

	// 		this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
	// 		this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

	// 		field.save("reorder");
	// 		field.swapAt(selection.index, newSelection.index, selection.length);

	// 		field.setSelection(newSelection);
	// 		field.render();

	// 		return true;

	// 	}

	// }

	// static getElementBoxBefore() {

	// 	const firstElement = this.elements[0];
	// 	const elementBefore = firstElement.previousElementSibling;

	// 	if (elementBefore) {

	// 		return elementBefore.getBoundingClientRect();

	// 	}

	// }

	// static getElementBoxAfter() {

	// 	const lastElement = this.elements[this.elements.length - 1];
	// 	const elementAfter = lastElement.nextElementSibling;

	// 	if (elementAfter) {

	// 		return elementAfter.getBoundingClientRect();

	// 	}

	// }


	static swapAbove() {

		const elementBefore = this.elements[0].previousElementSibling;

		if (elementBefore) {

			const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);
			const box = elementBefore.getBoundingClientRect();

			// if (this.diffY < 0 && dragBox.y < box.y + box.height / 2 || dragBox.y < box.y && dragBox.y + dragBox.height < box.y + box.height) {
			// if (dragBox.y < box.y + box.height / 2) {
			if (this.diffY < 0 && dragBox.y < box.y + box.height / 2) {

				console.log("swapAbove");

				this.insertBefore(elementBefore);

				const field = this.getField();

				const { index, length } = field.getSelection();

				field.save("reorder");
				field.swapAt(index, index - 1, length);
				field.setSelection({ index: index - 1, length });
				field.render();

				return true;

			}

		}

	}

	static swapBelow() {

		const elementAfter = this.elements[this.elements.length - 1].nextElementSibling;

		if (elementAfter) {

			const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);
			const box = elementAfter.getBoundingClientRect();

			// if (this.diffY > 0 && dragBox.y + dragBox.height > box.y + box.height / 2 || dragBox.y > box.y && dragBox.y + dragBox.height > box.y + box.height) {
			if (this.diffY > 0 && dragBox.y + dragBox.height > box.y + box.height / 2) {

			// if (dragBox.y + dragBox.height > box.y + box.height / 2 || this.diffY > 0 && dragBox.y + dragBox.height >= box.y + box.height / 2) {

				console.log("swapBelow");

				this.insertBefore(elementAfter.nextElementSibling);

				const field = this.getField();

				const { index, length } = field.getSelection();

				field.save("reorder");
				field.swapAt(index, index + 1, length);
				field.setSelection({ index: index + 1, length });
				field.render();

				return true;

			}

		}

	}

	// static swapToChild() {

	// 	const field = this.getField();
	// 	const { index, length } = field.getSelection();
	// 	const containerBox = this.element.getBoundingClientRect();

	// 	const dragBox = this.getDragBox();

	// 	for (let [element, zone] of this.zones) {

	// 		const isPrev = zone.field.parent === field && zone.field.getIndex() === index - 1;
	// 		const isNext = zone.field.parent === field && zone.field.getIndex() === index + length;

	// 		if (isPrev || isNext) {



	// 			const box = element.getBoundingClientRect();

	// 			if (isPrev && dragBox.y < box.y + box.height && this.diffY < 0 || isNext && dragBox.y + dragBox.height > box.y && this.diffY > 0) {

	// 				console.log("swapToChild", field.getSelection());

	// 			// }

	// 			// if (this.isDraggingIn(box)) {



	// 				field.save("reorder");

	// 				const values = field.getValuesAt(index, length);
	// 				zone.field.insertAt(values, 0);
	// 				field.removeAt(index, length); // -> only erase after inserting!

	// 				field.unselect();
	// 				// console.log("swapToChild", { index: 0, length });
	// 				zone.field.setSelection({ index: 0, length });

	// 				this.element = element;
	// 				this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

	// 				this.insertAt(0);

	// 				for (let element of this.elements) {

	// 					element.style.transform = "translate(0, 0)";

	// 				}

	// 				this.dragOrigin = this.getElementsBox(this.elements);

	// 				this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
	// 				this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

	// 				field.render();

	// 				return true;

	// 			}

	// 		}

	// 	}

	// }

	static swapToChildBefore() {

		const field = this.getField();
		const { index, length } = field.getSelection();

		const dragBox = this.getDragBox();

		for (let [element, zone] of this.zones) {

			if (zone.field.parent === field && zone.field.getIndex() === index - 1) {

				const box = element.getBoundingClientRect();

				if (dragBox.y < box.y + box.height && this.diffY < 0) {

					console.log("swapToChildBefore");

					field.save("reorder");

					const values = field.getValuesAt(index, length);
					field.removeAt(index, length);
					field.unselect();

					const sibling = field.getChild(index - 1);
					sibling.insertAt(values, 0);
					sibling.setSelection({ index: 0, length });

					this.switchContainer(element)
					this.insertAt(0);

					field.render();

					return true;

				}

			}

		}

	}

	static swapToChildAfter() {

		const field = this.getField();
		const { index, length } = field.getSelection();

		const dragBox = this.getDragBox();

		for (let [element, zone] of this.zones) {

			// const isPrev = zone.field.parent === field && zone.field.getIndex() === index - 1;
			// const isNext = zone.field.parent === field && zone.field.getIndex() === index + length;

			if (zone.field.parent === field && zone.field.getIndex() === index + length) {

				const box = element.getBoundingClientRect();

				if (dragBox.y + dragBox.height > box.y && this.diffY > 0) {

					console.log("swapToChildAfter");

					field.save("reorder");

					const values = field.getValuesAt(index, length);
					field.removeAt(index, length);
					field.unselect();

					const sibling = field.getChild(index); // as it is removed, index is now the one of the next sibling
					sibling.insertAt(values, 0);
					sibling.setSelection({ index: 0, length });

					this.switchContainer(element)
					this.insertAt(0);

					field.render();

					return true;

				}

			}

		}

	}



	// static swapToParent() {

	// 	const field = this.getField();
	// 	const selection = field.getSelection();
	// 	const containerBox = this.element.getBoundingClientRect();

	// 	const dragBox = this.getDragBox();

	// 	const draggingAbove = dragBox.y < containerBox.y && this.diffY < 0;
	// 	const draggingBelow = dragBox.y + dragBox.height > containerBox.y + containerBox.height && this.diffY > 0

	// 	if (draggingAbove || draggingBelow) {

	// 		for (let [element, zone] of this.zones) {

	// 			if (zone.field === field.parent) {

	// 				let index = draggingAbove ? field.resource.index : field.resource.index + 1;

	// 				field.save("reorder");

	// 				const values = field.getValuesAt(selection.index, selection.length);
	// 				field.removeAt(selection.index, selection.length); // first remove
	// 				zone.field.insertAt(values, index); // then insert

	// 				field.unselect();

	// 				// console.log("swapToParent", { ...selection, index: index });
	// 				zone.field.setSelection({ ...selection, index: index });
	// 				zone.field.setFocus();

	// 				this.switchContainer(element);
	// 				this.insertAt(index);

	// 				field.render();

	// 				return true;

	// 			}

	// 		}

	// 	}

	// }

	static swapToParentBefore() {

		let field = this.getField();
		const selection = field.getSelection();
		const containerBox = this.element.getBoundingClientRect();

		const dragBox = this.getDragBox();

		// const draggingAbove = ;
		// const draggingBelow = dragBox.y + dragBox.height > containerBox.y + containerBox.height && this.diffY > 0

		if (dragBox.y < containerBox.y && this.diffY < 0) {

			for (let [element, zone] of this.zones) {

				if (zone.field === field.parent) {

					console.log("swapToParentBefore");

					let index = field.getIndex();

					field.save("reorder");

					const values = field.getValuesAt(selection.index, selection.length);
					field.removeAt(selection.index, selection.length);
					field.unselect();

					zone.field.insertAt(values, index);
					zone.field.setSelection({ index: index, length: selection.length });
					zone.field.setFocus();

					field = zone.field.getChild(index + 1);
					field.unselect();

					this.switchContainer(element);
					this.insertAt(index);

					field.render();

					return true;

				}

			}

		}

	}

	static swapToParentAfter() {

		let field = this.getField();
		const selection = field.getSelection();
		const containerBox = this.element.getBoundingClientRect();

		const dragBox = this.getDragBox();

		if (dragBox.y + dragBox.height > containerBox.y + containerBox.height && this.diffY > 0) {

			for (let [element, zone] of this.zones) {

				if (zone.field === field.parent) {

					console.log("swapToParentAfter");

					let index = field.getIndex();

					field.save("reorder");

					const values = field.getValuesAt(selection.index, selection.length);
					field.removeAt(selection.index, selection.length);
					field.unselect();

					zone.field.insertAt(values, index + 1);
					zone.field.setSelection({ index: index + 1, length: selection.length });
					zone.field.setFocus();

					this.switchContainer(element);
					this.insertAt(index + 1);

					field.render();

					return true;

				}

			}

		}

	}

	// static swapToParentBefore() {

	// 	const field = this.getField();
	// 	// const { index, length } = field.getSelection();
	// 	const selection = field.getSelection();
	// 	const containerBox = this.element.getBoundingClientRect();

	// 	const dragBox = this.getDragBox();

	// 	if (dragBox.y < containerBox.y && this.diffY < 0) {

	// 		for (let [element, zone] of this.zones) {

	// 			if (zone.field === field.parent) {

	// 				console.log("swapToParent");

	// 				let index = field.resource.index;

	// 				field.save("reorder");

	// 				const values = field.getValuesAt(selection.index, selection.length);

	// 				field.removeAt(selection.index, selection.length); // first remove
	// 				zone.field.insertAt(values, index); // then insert

	// 				field.unselect();
	// 				zone.field.setSelection({ ...selection, index });
	// 				zone.field.setFocus();

	// 				this.element = element;
	// 				this.insertAt(this.elements, index);

	// 				this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

	// 				for (let element of this.elements) {

	// 					element.style.transform = "translate(0, 0)";

	// 				}

	// 				this.dragOrigin = this.getElementsBox(this.elements);

	// 				this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
	// 				this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

	// 				field.render();

	// 				return true;

	// 			}

	// 		}

	// 	}

	// }





	// static dragEnd() {

	// 	for (let element of this.elements) {

	// 		element.style.transform = `translate(0, 0)`;
	// 		element.classList.remove("dragging");

	// 	}

	// 	this.dragging = false;

	// }

	static getField() {

		const zone = this.zones.get(this.element);

		return zone.field;

	}

	static findIndex() {

		const { offset, groupLength, field } = this.zones.get(this.element);

		if (field.findIndex) {

			return field.findIndex(this);

		} else {

			let index = 0;
			let child = this.element.firstElementChild;

			while (child) {

				const box = child.getBoundingClientRect();

				if (this.isInsideBox(box, this.x, this.y)) {
					return index;
				}

				index++;
				child = child.nextElementSibling;
			}

			return -1;

		}

		// let index = 0;
		// let child = this.element.firstElementChild;

		// while (index < offset && child) {
		// 	index++;
		// 	child = child.nextElementSibling;
		// }

		// while (child) {
		// 	const box = child.getBoundingClientRect();
		// 	if (this.x >= box.x && this.x < box.x + box.width && this.y >= box.y && this.y < box.y + box.height) {
		// 		return Math.floor((index - offset) / groupLength);
		// 	}
		// 	index++;
		// 	child = child.nextElementSibling;
		// }

		// return -1;

	}


	static isInsideBox(box, x, y) {

		return x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height;

	}

	static getElements(index, length = 1) {

		const { offset, groupLength } = this.zones.get(this.element);

		const children = [...this.element.children];

		return children.slice(offset + index * groupLength, offset + (index + length) * groupLength);

	}

	static getBox(index, length = 1) {

		const elements = this.getElements(index, length);

		return this.getElementsBox(elements);

	}

	static getElementsBox(elements) {

		if (elements.length) {

			const box1 = elements[0].getBoundingClientRect();

			if (elements.length > 1) {

				const box2 = elements[elements.length - 1].getBoundingClientRect();

				return { x: box1.x, y: box1.y, width: box2.x + box2.width - box1.x, height: box2.y + box2.height - box1.y };

			} else {

				return box1;

			}

		}

	}

	static insertBefore(targetElement) {

		if (targetElement) {

			for (let element of this.elements) {

				this.element.insertBefore(element, targetElement);

			}

		} else {

			for (let element of this.elements) {

				this.element.appendChild(element);

			}

		}

		for (let element of this.elements) {

			element.style.transform = "translate(0, 0)";

		}

		this.dragOrigin = this.getElementsBox(this.elements);

		this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
		this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

	}

	static insertAt(index) {

		const [element] = this.getElements(index, 1);

		this.insertBefore(element);

	}

	static switchContainer(element) {

		this.element = element;
		this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

	}

	// static insertBefore(elements, targetElement) {

	// 	if (targetElement) {

	// 		for (let element of elements) {

	// 			this.element.insertBefore(element, targetElement);

	// 		}

	// 	} else {

	// 		for (let element of elements) {

	// 			this.element.appendChild(element);

	// 		}

	// 	}

	// 	for (let element of elements) {

	// 		element.style.transform = "translate(0, 0)";

	// 	}

	// 	this.dragOrigin = this.getElementsBox(elements);

	// 	this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
	// 	this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

	// }

	// static dragout() {

	// 	const containerBox = this.element.getBoundingClientRect();

	// 	let exit = false;

	// 	if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

	// 		if (this.diffX > 0) {

	// 			if (this.dragOrigin.x + this.dragOrigin.width + this.tx > containerBox.x + containerBox.width) {

	// 				exit = true;

	// 			}

	// 		} else {

	// 			if (this.dragOrigin.x + this.tx < containerBox.x) {

	// 				exit = true;

	// 			}

	// 		}

	// 	} else {

	// 		if (this.diffY > 0) {

	// 			if (this.dragOrigin.y + this.dragOrigin.height + this.ty > containerBox.y + containerBox.height) {

	// 				exit = true;

	// 			}

	// 		} else {

	// 			if (this.dragOrigin.y + this.ty < containerBox.y) {

	// 				exit = true;

	// 			}

	// 		}

	// 	}

	// 	if (exit) {

	// 		const field = this.getField();
	// 		const selection = field.getSelection();

	// 		for (let [element, zone] of this.zones) {

	// 			const box = element.getBoundingClientRect();
	// 			const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);

	// 			if (this.boxIntersect(dragBox, box)) {

	// 				for (let element of this.elements) {

	// 					element.style.transform = "translate(0, 0)";

	// 				}

	// 				field.save("reorder");

	// 				const values = field.getValuesAt(selection.index, selection.length);
	// 				field.removeAt(selection.index, selection.length);
	// 				field.unselect();
	// 				const newSelection = { index: 0, length: selection.length };
	// 				zone.field.insertAt(values, 0);
	// 				zone.field.setSelection(newSelection);
	// 				zone.field.setFocus(true);

	// 				this.element = element;
	// 				this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");
	// 				this.dragOrigin = this.getBox(newSelection.index, newSelection.length);

	// 				this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
	// 				this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

	// 				field.render();

	// 				return true;

	// 			}

	// 		}

	// 	}

	// }

	static boxTranslate(box, tx, ty) {

		return {
			x: box.x + tx,
			y: box.y + ty,
			width: box.width,
			height: box.height
		};

	}

	static boxIntersect(box1, box2) {

		return (box1.x + box1.width > box2.x && box1.x < box2.x + box2.width && box1.y + box1.height > box2.y && box1.y < box2.y + box2.height);

	}

	static isDraggingOut(box) {

		if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

			if (this.diffX > 0) {

				if (this.dragOrigin.x + this.dragOrigin.width + this.tx > box.x + box.width) {

					return true;

				}

			} else {

				if (this.dragOrigin.x + this.tx < box.x) {

					return true;

				}

			}

		} else {

			if (this.diffY > 0) {

				if (this.dragOrigin.y + this.dragOrigin.height + this.ty > box.y + box.height) {

					return true;

				}

			} else if (this.diffY < 0) {

				if (this.dragOrigin.y + this.ty < box.y) {

					return true;

				}

			}

		}

		return false;

	}

	static isDraggingIn(box) {

		const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);

		if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

			if (this.diffX > 0) {

				if (dragBox.x + dragBox.width > box.x && dragBox.x < box.x + box.width && dragBox.y < box.y + box.height && dragBox.y + dragBox.height > box.y) {

					return true;

				}

			} else {

				if (dragBox.x < box.x + box.width && dragBox.y + dragBox.width > box.x && dragBox.y < box.y + box.height && dragBox.y + dragBox.height > box.y) {

					return true;

				}

			}

		} else {

			if (this.diffY > 0) {

				if (dragBox.y + dragBox.height > box.y && dragBox.y < box.y + box.height && dragBox.x < box.x + box.width && dragBox.x + dragBox.width > box.x) {

					return true;

				}

			} else if (this.diffY < 0) {

				if (dragBox.y < box.y + box.height && dragBox.y + dragBox.height > box.y && dragBox.x < box.x + box.width && dragBox.x + dragBox.width > box.x) {

					return true;

				}

			}

		}

		return false;

	}

	static getDragBox() {

		return {
			x: this.dragOrigin.x + this.tx,
			y: this.dragOrigin.y + this.ty,
			width: this.dragOrigin.width,
			height: this.dragOrigin.height
		};

	}


}
