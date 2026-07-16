


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

	static trackMouse(element, event, field) {

		this.field = field;
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
		const focus = field.hasFocus();

		const draggable = field.resource.sortable || field.resource.draggable;

		// field.unselectChildren();

		if (draggable && focus && index > -1 && selection && index >= selection.index && index < selection.index + selection.length) {

			this.dragging = true;
			this.draggingIndex = index;
			this.dragOrigin = this.getBox(selection.index, selection.length);


			this.dragOffset = { x: this.x - this.dragOrigin.x, y: this.y - this.dragOrigin.y };
			this.elements = this.getElements(selection.index, selection.length);

			for (let element of this.elements) {

				element.classList.add("dragging");

			}

			this.event.stopPropagation();

		} else {

			// field.unselectDeep();
			field.unselectBlocks();

			this.selecting = true;

			if (index > -1) {

				this.tie = { index, length: 1 };

				if (selection.length && this.event.shiftKey) {

					this.tie.index = Math.min(selection.index, index);
					this.tie.length = Math.max(index + 1, selection.index + selection.length) - this.tie.index;

				}

				field.setSelection(this.tie);
				field.setFocus();

			} else {

				// field.unselect();


			}



		}

		this.event.stopPropagation();

		field.render("local");

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
						field.render("local");
					}

				} else {

					field.setSelection({ index, length: 1 });
					field.render("local");

				}

			}

		}

	}

	static complete() {

		if (this.dragging) {

			for (let element of this.elements) {

				element.style.transform = `none`;
				element.classList.remove("dragging");

			}

			this.dragging = false;

		}

		if (this.selecting) {

			const field = this.getField();
			// const selection = field.getSelection();

			// if (selection.length === 1) {
			// 	const child = field.getChild(selection.index);
			// 	child.setFocus(true);
			// } else {
			// 	field.setFocus(true);
			// }

			field.setFocus(true);


			this.selecting = false;

			field.render("layer");

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
		const field = this.getField();
		const { index, length } = field.getSelection();
		const fieldBefore = field.getChild(index - 1);



		if (elementBefore && fieldBefore) {

			// const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);
			const box = elementBefore.getBoundingClientRect();


			// const orientation = field.getOrientation();
			// const direction = this.getDirection();

			// const overlapse = orientation === "row" && (direction === "left" && dragBox.x < box.x + box.width / 2 || dragBox.x < box.x && dragBox.x + dragBox.width < box.x + box.width) || orientation === "column" && (direction === "top" && dragBox.y < box.y + box.height / 2 || dragBox.y < box.y && dragBox.y + dragBox.height < box.y + box.height);

			// if (overlapse) {
			if (!fieldBefore.isGroup() && this.isDraggingBefore(box) || this.isBefore(box)) {

				this.insertBefore(elementBefore);

				// const { index, length } = field.getSelection();

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

		const field = this.getField();
		const { index, length } = field.getSelection();
		const fieldAfter = field.getChild(index + length);

		if (elementAfter && fieldAfter) {

			// const dragBox = this.boxTranslate(this.dragOrigin, this.tx, this.ty);
			const box = elementAfter.getBoundingClientRect();
			// const field = this.getField();
			// const orientation = field.getOrientation();
			// const direction = this.getDirection();

			// const overlapse = orientation === "row" && (direction === "right" && dragBox.x + dragBox.width > box.x + box.width / 2 || dragBox.x > box.x && dragBox.x + dragBox.width > box.x + box.width) || orientation === "column" && (direction === "down" && dragBox.y + dragBox.height > box.y + box.height / 2 || dragBox.y > box.y && dragBox.y + dragBox.height > box.y + box.height);

			// if (this.diffY > 0 && dragBox.y + dragBox.height > box.y + box.height / 2 || dragBox.y > box.y && dragBox.y + dragBox.height > box.y + box.height) {
			// if (orientation === "row" && this.diffX > 0 && dragBox.x + dragBox.width > box.x + box.width / 2 || orientation === "column" && this.diffY > 0 && dragBox.y + dragBox.height > box.y + box.height / 2) {
			// if (dragBox.y + dragBox.height > box.y + box.height / 2 || this.diffY > 0 && dragBox.y + dragBox.height >= box.y + box.height / 2) {
			// if (overlapse) {



			if (!fieldAfter.isGroup() && this.isDraggingAfter(box) || this.isAfter(box)) {

				this.insertBefore(elementAfter.nextElementSibling);

				// const { index, length } = field.getSelection();

				field.save("reorder");
				field.swapAt(index, index + 1, length);
				field.setSelection({ index: index + 1, length });
				field.render();

				return true;

			}

		}

	}

	static swapToChildBefore() {

		const field = this.getField();
		const { index, length } = field.getSelection();
		const fieldBefore = field.getChild(index - 1);

		const element = field.getChildContainer(this.element, index - 1);

		if (element && fieldBefore && this.allowedIn(fieldBefore)) {

			// const dragBox = this.getDragBox();
			const box = element.getBoundingClientRect();
			// const orientation = field.getOrientation();
			// const direction = this.getDirection();

			// if (orientation === "row" && dragBox.x < box.x + box.width && direction === "left" || orientation === "column" && dragBox.y < box.y + box.height && direction === "up") {
			if (fieldBefore.isGroup() && this.isDraggingIntoPrevious(box)) {


				field.save("reorder");

				const values = field.getValuesAt(index, length);
				field.removeAt(index, length);
				field.unselect();

				const child = field.getChild(index - 1);
				const childValues = child.getChildren() || [];
				child.insertAt(values, childValues.length); // -> insert at end
				child.setSelection({ index: childValues.length, length });
				child.setFocus(true);

				this.field = child;

				this.switchContainer(element)
				this.insertAt(childValues.length);

				field.render();

				return true;

			}

		}

	}


	static swapToChildAfter() {

		const field = this.getField();
		const { index, length } = field.getSelection();
		const fieldAfter = field.getChild(index + length);

		const element = field.getChildContainer(this.element, index + length);

		if (element && fieldAfter && this.allowedIn(fieldAfter)) {

			// const dragBox = this.getDragBox();
			const box = element.getBoundingClientRect();
			// const orientation = field.getOrientation();
			// const direction = this.getDirection();

			if (fieldAfter.isGroup() && this.isDraggingIntoNext(box)) {

				// if (orientation === "row" && dragBox.x + dragBox.height > box.x && direction === "right" || orientation === "column" && dragBox.y + dragBox.height > box.y && direction === "down") {

				field.save("reorder");

				let child = field.getChild(index + length);
				child.unselect();

				const values = field.getValuesAt(index, length);
				field.removeAt(index, length);
				field.unselect();

				child = field.getChild(index); // as it is removed, index is now the one of the next sibling
				child.insertAt(values, 0);
				child.setSelection({ index: 0, length });
				child.setFocus(true);

				this.field = child;

				this.switchContainer(element)
				this.insertAt(0);

				field.render();

				return true;

			}

		}

	}


	static swapToParentBefore() {

		let field = this.getField();
		const selection = field.getSelection();
		const containerBox = this.element.getBoundingClientRect();

		const element = field.getParentContainer(this.element);


		if (element) {

			if (this.isDraggingOutBefore(containerBox)) {

				let index = field.getIndex();

				field.save("reorder");

				const values = field.getValuesAt(selection.index, selection.length);
				field.removeAt(selection.index, selection.length);
				field.unselect();

				field.parent.insertAt(values, index);
				field.parent.setSelection({ index: index, length: selection.length });
				field.parent.setFocus();

				this.field = field.parent;

				this.switchContainer(element);
				this.insertAt(index);

				field.render();

				return true;

			}

		}

	}

	static swapToParentAfter() {

		let field = this.getField();
		const selection = field.getSelection();
		const containerBox = this.element.getBoundingClientRect();
		// const direction = this.getDirection();

		const element = field.getParentContainer(this.element);

		if (element) {

			// const dragBox = this.getDragBox();
			// const orientation = field.parent.getOrientation();

			// if (orientation === "row" && dragBox.x + dragBox.width > containerBox.x + containerBox.width && direction === "right" || orientation === "column" && dragBox.y + dragBox.height > containerBox.y + containerBox.height && direction === "down") {

			if (this.isDraggingOutAfter(containerBox)) {

				let index = field.getIndex();

				field.save("reorder");

				const values = field.getValuesAt(selection.index, selection.length);
				field.removeAt(selection.index, selection.length);
				field.unselect();

				field.parent.insertAt(values, index + 1);
				field.parent.setSelection({ index: index + 1, length: selection.length });
				field.parent.setFocus();

				this.field = field.parent;

				this.switchContainer(element);
				this.insertAt(index + 1);

				field.render();

				return true;

			}

		}

	}

	static getOrientation() {

		const field = this.getField();
		return field.getOrientation();

	}

	static getDirection() {

		if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

			if (this.diffX > 0) {

				return "right";

			} else if (this.diffX < 0) {

				return "left";

			}

		} else {

			if (this.diffY > 0) {

				return "down";

			} else if (this.diffY < 0) {

				return "up";

			}

		}

		return "";
	}

	// static compareDragBox(box) {

	// 	const field = this.getField();
	// 	const dragBox = this.getDragBox();
	// 	const direction = field.getDirection();

	// 	if (direction === "row") {

	// 		if (this.diffX < 0) {

	// 			return dragBox.x < box.x + box.width / 2;

	// 		} else {

	// 			return dragBox.x < box.x + box.width && ;
	// 		}

	// 	}

	// 	if (direction === "row" && this.diffX < 0 && dragBox.x < box.x + box.width / 2 || direction === "column" && this.diffY < 0 && dragBox.y < box.y + box.height / 2) {


	// 	if (direction === "row" && this.diffX < 0 && dragBox.x < box.x + box.width / 2 || direction === "column" && this.diffY < 0 && dragBox.y < box.y + box.height / 2) {


	// }

	// static evalBox(box) {

	// 	const dragBox = this.getDragBox();
	// 	const field = this.getField();
	// 	const orientation = field.getOrientation();

	// 	const output = {};

	// 	if (orientation === "row") {

	// 		output.isBefore = dragBox.x < box.x && dragBox.x + dragBox.width < box.x + box.width;
	// 		output.isAfter = dragBox.x > box.x && dragBox.x + dragBox.width > box.x + box.width;

	// 	} else {

	// 		output.isBefore = dragBox.y < box.y && dragBox.y + dragBox.height < box.y + box.height;
	// 		output.isAfter = dragBox.y > box.y && dragBox.y + dragBox.height > box.y + box.height;

	// 	}

	// 	if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

	// 		if (this.diffX < 0) {

	// 			output.isDraggingAfter = orientation === "row" && dragBox.x < box.x + box.width / 2;
	// 			output.isDraggingOut = field.parent.getOrientation() === "row" && dragBox.x < box.x;
	// 			output.isDraggingTo = orientation === "row" && dragBox.x < box.x + box.width;

	// 		} else if (this.diffX > 0) {

	// 			output.isDraggingAfter = orientation === "row" && dragBox.x + dragBox.width > box.x + box.width / 2;
	// 			output.isDraggingOut = field.parent.getOrientation() === "row" && dragBox.x + dragBox.width > box.x + box.width;
	// 			output.isDraggingInto = orientation === "row" && dragBox.x + dragBox.width > box.x;

	// 		}

	// 	} else {

	// 		if (this.diffY < 0) {

	// 			output.isDraggingAfter = orientation === "column" && dragBox.y < box.y + box.height / 2;
	// 			output.isDraggingOut = field.parent.getOrientation() === "column" && dragBox.y < box.y;
	// 			output.isDraggingTo = orientation === "column" && dragBox.y < box.y + box.height;

	// 		} else if (this.diffX > 0) {

	// 			output.isDraggingAfter = orientation === "column" && dragBox.y + dragBox.height > box.y + box.height / 2;
	// 			output.isDraggingOut = field.parent.getOrientation() === "column" && dragBox.y + dragBox.height > box.y + box.height;
	// 			output.isDraggingInto = orientation === "column" && dragBox.y + dragBox.height > box.y;

	// 		}

	// 	}

	// 	return output;

	// }

	static isBefore(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();

		if (field.getOrientation() === "row") {

			return dragBox.x < box.x && dragBox.x + dragBox.width < box.x + box.width;

		} else {

			return dragBox.y < box.y && dragBox.y + dragBox.height < box.y + box.height;

		}

	}

	static isAfter(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();

		if (field.getOrientation() === "row") {

			return dragBox.x > box.x && dragBox.x + dragBox.width > box.x + box.width;

		} else {

			return dragBox.y > box.y && dragBox.y + dragBox.height > box.y + box.height;

		}

	}

	static isDraggingBefore(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();
		const orientation = field.getOrientation();
		const isHorizontal = Math.abs(this.diffX) > Math.abs(this.diffY);

		if (isHorizontal && orientation === "row" && this.diffX < 0) {

			return dragBox.x < box.x + box.width / 2;

		} else if (!isHorizontal && orientation === "column" && this.diffY < 0) {

			return dragBox.y < box.y + box.height / 2;

		}

		return false;

	}

	static isDraggingAfter(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();
		const orientation = field.getOrientation();

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && orientation === "row" && this.diffX > 0) {

			return dragBox.x + dragBox.width > box.x + box.width / 2;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && orientation === "column" && this.diffY > 0) {

			return dragBox.y + dragBox.height > box.y + box.height / 2;

		}

		return false;

	}



	// static isDraggingOut(box) {

	// 	const dragBox = this.getDragBox();
	// 	const field = this.getField();
	// 	const orientation = field.parent.getOrientation();

	// 	if (Math.abs(this.diffX) > Math.abs(this.diffY) && orientation === "row") {

	// 		if (this.diffX < 0) {

	// 			return dragBox.x < box.x;

	// 		} else if (this.diffX > 0) {

	// 			return dragBox.x + dragBox.width > box.x + box.width;

	// 		}

	// 	} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && orientation === "column") {

	// 		if (this.diffY < 0) {

	// 			return dragBox.y < box.y;

	// 		} else if (this.diffY > 0) {

	// 			return dragBox.y + dragBox.height > box.y + box.height;

	// 		}

	// 	}

	// 	return false;

	// }

	static isDraggingOutBefore(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();
		const orientation = field.parent.getOrientation();

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && orientation === "row" && this.diffX < 0) {

			return dragBox.x < box.x;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && orientation === "column" && this.diffY < 0) {

			return dragBox.y < box.y;

		}

		return false;

	}

	static isDraggingOutAfter(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();
		const orientation = field.parent.getOrientation();

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && orientation === "row" && this.diffX > 0) {

			return dragBox.x + dragBox.width > box.x + box.width;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && orientation === "column" && this.diffY > 0) {

			return dragBox.y + dragBox.height > box.y + box.height;

		}

		return false;

	}

	static isDraggingIntoPrevious(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();
		const orientation = field.getOrientation();

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && orientation === "row" && this.diffX < 0) {

			return dragBox.x < box.x + box.width;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && orientation === "column" && this.diffY < 0) {

			return dragBox.y < box.y + box.height;

		}

		return false;

	}

	static isDraggingIntoNext(box) {

		const dragBox = this.getDragBox();
		const field = this.getField();
		const orientation = field.getOrientation();

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && orientation === "row" && this.diffX > 0) {

			return dragBox.x + dragBox.width > box.x;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && orientation === "column" && this.diffY > 0) {

			return dragBox.y + dragBox.height > box.y;

		}

		return false;

	}




	static getField() {

		return this.field;

		// const zone = this.zones.get(this.element);

		// return zone.field;

	}

	static *listDragField() {

		const field = this.getField();
		const { index, length } = field.getSelection();

		for (let i = 0; i < length; i++) {

			yield field.getChild(i + index);

		}

	}

	static allowedIn(field) {

		for (let dragField of this.listDragField()) {

			if (!field.canContain(dragField.getBlockType())) {

				return false;

			}

		}

		return true;
	}

	static findIndex() {

		const field = this.getField();

		// const { offset, groupLength, field } = this.zones.get(this.element);

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

		// const { offset, groupLength } = this.zones.get(this.element);
		const { offset, groupLength } = { offset: 0, groupLength: 1 };

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
