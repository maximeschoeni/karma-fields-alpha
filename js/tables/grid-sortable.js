

KarmaFieldsAlpha.field.sortable = class extends KarmaFieldsAlpha.field.selectable {

	doAction(action, ...args) {

		switch (action) {

			case "swap":
				this.swap(...args);
				break;

			default:
				super.doAction(action, ...args)

		}

	}

	// *generateIndex() {

	// 	for (let i = 0; i < this.resource.length; i++) {

	// 		yield i;

	// 	}

	// }

	swapTo(target, index, length) {

		if (index === undefined) {

			const selection = this.getQuerySelection();

			if (selection) {

				index = selection.index;
				length = selection.length;

			} else {

				return;

			}

		}

		const indexes = this.generateIndexes();

		const newIndexes = [...indexes];

		newIndexes.splice(target, 0, ...newIndexes.splice(index, length));

		this.parent.doAction("reorder", newIndexes);

	}

	canContain(field) { // -> hierarchical

		return false;

	}

	canSwapToParent() { // -> hierarchical

		return false;

	}

	canSwapToChild(index) { // -> hierarchical

		return false;

	}

	getOrientation() {

		return "column";

	}

	registerTracker(element, orientation) {

		const tracker = new KarmaFieldsAlpha.field.sortable.MouseTracker(element);

		tracker.orientation = orientation || "column";

		tracker.onInit = () => {
			this.mouseDown(tracker);
		}

		tracker.onUpdate = () => {
			this.mouseMove(tracker);
		}

		tracker.onComplete = () => {
			this.mouseUp(tracker);
		}

	}

	mouseDown(tracker) { // overrided selection mouseDown

		const selection = this.getRawSelection();
		const focus = this.hasFocus();
		const draggable = this.resource.sortable || this.resource.draggable;

		if (draggable && focus && tracker.index > -1 && selection && tracker.index >= selection.index && tracker.index < selection.index + selection.length) {

			tracker.dragging = true;
			tracker.dragIndex = selection.index;
			tracker.dragLength = selection.length;
			tracker.dragElements = tracker.sliceElements(selection.index, selection.length);

			for (let element of tracker.dragElements) {

				element.style.transform = "translate(0, 0)";
				element.classList.add("dragging");

			}

			tracker.dragOrigin = tracker.getBoxAt(selection.index, selection.length);
			tracker.dragOffset = { x: tracker.x - tracker.dragOrigin.x, y: tracker.y - tracker.dragOrigin.y };

			tracker.event.stopPropagation();

		} else {

			super.mouseDown(tracker); // -> start selection

		}

	}

	mouseMove(tracker) { // -> override selection mouseMove

		if (tracker.dragging) {

			tracker.drag();

			// const selection = this.getRawSelection();


			// const nextIndex = selection.index + selection.length;

			// if (prevIndex >= 0 && tracker.isDraggingBefore(prevIndex, this.resource.orientation)) {
			if (tracker.isDraggingBefore()) {

				// const prevIndex = selection.index - 1;
				const prevIndex = tracker.dragIndex - 1;

				tracker.swapTo(prevIndex);
				// this.swapTo(prevIndex);

				this.save("reorder");
				this.swapTo(prevIndex);
				this.setRawSelection({ index: prevIndex, length: tracker.dragLength });

			} else if (tracker.isDraggingAfter()) {

				const nextIndex = tracker.dragIndex + tracker.dragLength;

				tracker.swapTo(nextIndex);
				// this.swapTo(nextIndex);

				this.save("reorder");
				this.swapTo(nextIndex);
				this.setRawSelection({ index: nextIndex, length: tracker.dragLength });

			}

			// const selection = this.getSelection();

			// const prevIndex = selection.index - 1;
			// const nextIndex = selection.index + selection.length;

			// const prevField = this.getChild(prevIndex);
			// const nextField = this.getChild(nextIndex);

			// const orientation = this.getOrientation();

			// if (prevField?.canContain(this) && tracker.isDraggingInto(prevIndex, orientation)) {

			// 	tracker.swapToChild(prevIndex, prevField.resource.length);
			// 	this.swapToChild(prevField, prevField.resource.length);

			// } else if (nextField?.canContain(this) && tracker.isDraggingInto(nextIndex, orientation)) {

			// 	tracker.swapToChild(nextField, 0);
			// 	this.swapToChild(nextField, 0);

			// } else if (prevIndex >= 0 && tracker.isDraggingOver(prevIndex, orientation)) {

			// 	tracker.swapTo(prevIndex);
			// 	this.swapTo(prevIndex);

			// } else if (nextIndex < this.resource.length && tracker.isDraggingOver(nextIndex, orientation)) {

			// 	tracker.swapTo(nextIndex);
			// 	this.swapTo(nextIndex);

			// } else if (this.parent.canContain(this) && tracker.isDraggingOut(1, this.parent.getOrientation())) {

			// 	tracker.swapToParent(1);
			// 	this.swapToParent(1);

			// } else if (this.parent.canContain(this) && tracker.isDraggingOut(-1 , this.parent.getOrientation())) {

			// 	tracker.swapToParent(-1);
			// 	this.swapToParent(-1);

			// }

		} else {

			super.mouseMove(tracker); // -> grow selection

		}

	}

	HIERARCHICALmouseMove(tracker) { // -> override selection updateTrack

		if (tracker.dragging) {

			tracker.drag();

			const selection = this.getSelection();

			const prevIndex = selection.index - 1;
			const nextIndex = selection.index + selection.length;

			const prevField = this.getChild(prevIndex);
			const nextField = this.getChild(nextIndex);

			const orientation = this.getOrientation();

			if (prevField?.canContain(this) && tracker.isDraggingInto(prevIndex, orientation)) {

				tracker.swapToChild(prevIndex, prevField.resource.length);
				this.swapToChild(prevField, prevField.resource.length);

			} else if (nextField?.canContain(this) && tracker.isDraggingInto(nextIndex, orientation)) {

				tracker.swapToChild(nextField, 0);
				this.swapToChild(nextField, 0);

			} else if (prevIndex >= 0 && tracker.isDraggingOver(prevIndex, orientation)) {

				tracker.swapTo(prevIndex);
				this.swapTo(prevIndex);

			} else if (nextIndex < this.resource.length && tracker.isDraggingOver(nextIndex, orientation)) {

				tracker.swapTo(nextIndex);
				this.swapTo(nextIndex);

			} else if (this.parent.canContain(this) && tracker.isDraggingOut(1, this.parent.getOrientation())) {

				tracker.swapToParent(1);
				this.swapToParent(1);

			} else if (this.parent.canContain(this) && tracker.isDraggingOut(-1 , this.parent.getOrientation())) {

				tracker.swapToParent(-1);
				this.swapToParent(-1);

			}

		} else {

			super.HIERARCHICALmouseMove(tracker); // -> grow selection

		}

	}

	mouseUp(tracker) {

		if (tracker.dragging) {

			for (let child of tracker.dragElements) {

				child.style.transform = "none";
				child.classList.remove("dragging");

			}

			tracker.dragging = false;
			// tracker.dragOrigin = null;
			// tracker.dragOffset = null;
			// tracker.dragIndex = null;
			// tracker.dragLength = null;
			// tracker.dragElements = null;

		} else {

			super.mouseUp(tracker); // -> grow selection

		}

	}

	// swapTrack(tracker) {

	// 	const selection = this.getSelection();

	// 	const prevIndex = selection.index - 1;
	// 	const nextIndex = selection.index + selection.length;

	// 	const orientation = this.getOrientation();

	// 	if (prevIndex >= 0 && tracker.isDraggingOver(prevIndex, orientation)) {

	// 		tracker.swapTo(prevIndex);
	// 		this.swapTo(prevIndex);

	// 	} else if (nextIndex < this.resource.length && tracker.isDraggingOver(nextIndex, orientation)) {

	// 		tracker.swapTo(nextIndex);
	// 		this.swapTo(nextIndex);

	// 	}

	// }

	// HIERARCHICALswapTrack(tracker) { // HIERARCHICAL override swapTrack

	// 	const selection = this.getSelection();

	// 	const prevIndex = selection.index - 1;
	// 	const nextIndex = selection.index + selection.length;

	// 	const prevField = this.getChild(prevIndex);
	// 	const nextField = this.getChild(nextIndex);

	// 	const orientation = this.getOrientation();

	// 	if (prevField?.canContain(this) && tracker.isDraggingInto(prevIndex, orientation)) {

	// 		tracker.swapToChild(prevIndex, prevField.resource.length);
	// 		this.swapToChild(prevField, prevField.resource.length);

	// 	} else if (nextField?.canContain(this) && tracker.isDraggingInto(nextIndex, orientation)) {

	// 		tracker.swapToChild(nextField, 0);
	// 		this.swapToChild(nextField, 0);

	// 	} else if (prevIndex >= 0 && tracker.isDraggingOver(prevIndex, orientation)) {

	// 		tracker.swapTo(prevIndex);
	// 		this.swapTo(prevIndex);

	// 	} else if (nextIndex < this.resource.length && tracker.isDraggingOver(nextIndex, orientation)) {

	// 		tracker.swapTo(nextIndex);
	// 		this.swapTo(nextIndex);

	// 	} else if (this.parent.canContain(this) && tracker.isDraggingOut(1, this.parent.getOrientation())) {

	// 		tracker.swapToParent(1);
	// 		this.swapToParent(1);

	// 	} else if (this.parent.canContain(this) && tracker.isDraggingOut(-1 , this.parent.getOrientation())) {

	// 		tracker.swapToParent(-1);
	// 		this.swapToParent(-1);

	// 	}

	// }

	// swapTo(target) {

	// 	const selection = this.getRawSelection();

	// 	this.save("reorder");
	// 	this.swap(target);
	// 	this.setRawSelection({ index: target, length: selection.length });
	// }

}


KarmaFieldsAlpha.field.sortable.MouseTracker = class extends KarmaFieldsAlpha.field.selectable.MouseTracker {

	getDragbox() {

		return {
			x: this.x - this.dragOffset.x,
			y: this.y - this.dragOffset.y,
			width: this.dragOrigin.width,
			height: this.dragOrigin.height
		};
	}

	insertElementsBefore(elements, targetElement, container = this.element) {

		if (targetElement) {

			for (let element of elements) {

				container.insertBefore(element, targetElement);

			}

		} else {

			for (let element of elements) {

				container.appendChild(element);

			}

		}

	}

	getChildren() {

		return [...this.element.children];

	}

	// resetDrag() {

	// 	this.dragElements = this.sliceElements(selection.index, selection.length);

	// 	for (let element of this.dragElements) {

	// 		element.style.transform = "translate(0, 0)";
	// 		element.classList.add("dragging");

	// 	}

	// 	this.dragOrigin = this.getBoxAt(selection.index, selection.length);
	// 	// -> don't reset dragOffset!

	// }

	drag() {

		// this.dragbox = {
		// 	x: this.x - this.dragOffset.x,
		// 	y: this.y - this.dragOffset.y,
		// 	width: this.dragOrigin.width,
		// 	height: this.dragOrigin.height
		// };

		// const tx = this.dragbox.x - this.dragOrigin.x;
		// const ty = this.dragbox.y - this.dragOrigin.y;

		// const tx = this.x - this.dragOrigin.x - this.dragOffset.x;
		// const ty = this.y - this.dragOrigin.y - this.dragOffset.y;

		// const selection = this.field.getSelection();
		// const children = this.getChildren();

		// for (let element of children.slice(selection.index, selection.index + selection.length)) {

		// 	element.style.transform = `translate(${tx}px, ${ty}px)`;

		// }

		const tx = this.x - this.dragOrigin.x - this.dragOffset.x;
		const ty = this.y - this.dragOrigin.y - this.dragOffset.y;

		for (let element of this.dragElements) {

			element.style.transform = `translate(${tx}px, ${ty}px)`;

		}

	}

	swapTo(index) {

		// const selection = this.field.getSelection();
		const targetElement = this.element.children[index];
		// const dragElements = this.sliceElements(selection.index, selection.length);

		for (let element of this.dragElements) {

			element.style.transform = "translate(0, 0)";

		}

		if (index < this.dragIndex) {

			this.insertElementsBefore(this.dragElements, targetElement);

		} else {

			this.insertElementsBefore(this.dragElements, targetElement.nextElementSibling);

		}

		// this.field.save("reorder");
		// this.field.swapAt(selection.index, index, selection.length);
		// this.field.setSelection({ index, length: selection.length });

		this.dragIndex = index;
		this.dragOrigin = this.getElementsBox(...this.dragElements);

		this.drag();

	}

	swapToChild(index) {

		// const selection = this.field.getSelection();
		// const targetField = this.field.getChild(index);
		const targetElement = this.element.children[index].querySelector(".select-zone");

		// const dragElements = this.sliceElements(selection.index, selection.length);

		for (let element of this.dragElements) {

			element.style.transform = "translate(0, 0)";

		}



		// this.field.save("reorder");

		this.element = targetElement;

		if (index < this.dragIndex) {

			this.insertElementsBefore(this.dragElements, null); // -> insert at the end
			this.dragIndex = this.element.children.length - this.dragLength;

		} else {

			this.insertElementsBefore(this.dragElements, targetElement.firstElementChild); // -> insert at begin
			this.dragIndex = 0;

		}

		// this.field.swapToChild(targetField);
		// this.field.unselect();
		// this.field = targetField;
		// this.field.setFocus(true);


		// this.field.reParent(index, targetField);
		// this.field.setSelection({ index, length: selection.length });


		this.dragOrigin = this.getElementsBox(...this.dragElements);

		this.drag();

	}

	swapToParent(direction) {

		// const selection = this.field.getSelection();
		const parentElement = this.element.parentNode.closest(".select-zone");

		// const dragElements = this.sliceElements(selection.index, selection.length);

		for (let element of this.dragElements) {

			element.style.transform = "translate(0, 0)";

		}

		// this.field.save("reorder");

		this.element = parentElement;

		if (direction === 1) {

			this.insertElementsBefore(this.dragElements, this.element.nextSiblingElement); // -> insert after
			// this.field.parent.setSelection({ index: this.field.index + 1, length: selection.length });

		} else {

			this.insertElementsBefore(this.dragElements, this.element); // -> insert efore
			// this.field.parent.setSelection({ index: this.field.index, length: selection.length });

		}



		// this.field.swapToParent();
		// this.field.unselect();
		// this.field = this.field.parent;
		// this.field.setFocus(true);

		this.dragOrigin = this.getElementsBox(...this.dragElements);

		this.drag();

	}

	// isDraggingOver(target, orientation) {

	// 	const targetElement = this.element.children[target];

	// 	if (targetElement) {

	// 		const targetBox = targetElement.getBoundingClientRect();

	// 		if (!orientation) {

	// 			if (targetBox.y > this.dragOrigin.y + this.dragOrigin.height || targetBox.y + targetBox.height < this.dragOrigin.y) {

	// 				orientation = "column";

	// 			} else {

	// 				orientation = "row";

	// 			}

	// 		}

	// 		if (orientation === "row") {

	// 			if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

	// 				if (target > this.dragIndex) { // -> right

	// 					if (this.diffX > 0) {

	// 						if (this.x - this.dragOffset.x + this.dragOrigin.width > targetBox.x + targetBox.width/2) {

	// 							return true;

	// 						}

	// 					}

	// 				} else { // -> left

	// 					if (this.diffX < 0) {

	// 						if (this.x - this.dragOffset.x < targetBox.x + targetBox.width/2) {

	// 							return true;

	// 						}

	// 					}

	// 				}

	// 			}

	// 		} else { // orientation === "column"

	// 			if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

	// 				if (target > selection.index) { // -> down

	// 					if (this.diffY > 0) {

	// 						if (this.y - this.dragOffset.y + this.dragOrigin.height > targetBox.y + targetBox.height/2) {

	// 							return true;

	// 						}

	// 					}

	// 				} else { // -> up

	// 					if (this.diffY < 0) {

	// 						if (this.y - this.dragOffset.y < targetBox.y + targetBox.height/2) {

	// 							return true;

	// 						}

	// 					}

	// 				}

	// 			}

	// 		}

	// 	}

	// 	return false;

	// }

	// isDraggingOver(target) {

	// 	const targetElement = this.element.children[target];

	// 	if (targetElement) {

	// 		const targetBox = targetElement.getBoundingClientRect();
	// 		const containerBox = this.element.getBoundingClientRect();
	// 		const dragBox = this.getDragbox();

	// 		return target > this.dragIndex && (this.diffX > 0 && dragBox.x + dragBox.width < containerBox.x + containerBox.width && dragBox.x + dragBox.width > targetBox.x + targetBox.width / 2 || this.diffY > 0 && dragBox.y + dragBox.height < containerBox.y + containerBox.height && dragBox.y + dragBox.height > targetBox.y + targetBox.height / 2) || target < this.dragIndex && (this.diffX < 0 && dragBox.x > containerBox.x && dragBox.x < targetBox.x + targetBox.width / 2 || this.diffY < 0 && dragBox.y > containerBox.y && dragBox.y < targetBox.y + targetBox.height / 2);

	// 	}

	// 	return false;

	// }

	// isDraggingOver(target) {

	// 	const targetElement = this.element.children[target];

	// 	if (targetElement) {

	// 		const targetBox = targetElement.getBoundingClientRect();
	// 		const containerBox = this.element.getBoundingClientRect();
	// 		const dragBox = this.getDragbox();

	// 		// console.log(dragBox.y + dragBox.height, targetBox.y + targetBox.height, this.dragOrigin.y + this.dragOrigin.height + 10);

	// 		// return target > this.dragIndex && (this.diffX > 0 && this.diffX > Math.abs(this.diffY) && dragBox.x + dragBox.width < containerBox.x + containerBox.width && dragBox.x + dragBox.width > targetBox.x + targetBox.width / 2 || this.diffY > 0 && this.diffY > Math.abs(this.diffX) && dragBox.y + dragBox.height < containerBox.y + containerBox.height && dragBox.y + dragBox.height > Math.max(targetBox.y + targetBox.height/2, this.dragOrigin.y + this.dragOrigin.height + 10)) || target < this.dragIndex && (this.diffX < 0 && Math.abs(this.diffX) > Math.abs(this.diffY) && dragBox.x > containerBox.x && dragBox.x < targetBox.x + targetBox.width / 2 || this.diffY < 0 && Math.abs(this.diffY) > Math.abs(this.diffX) && dragBox.y > containerBox.y && dragBox.y < Math.min(targetBox.y + targetBox.height/2, this.dragOrigin.y - 10));

	// 		return target > this.dragIndex && (this.diffX > 0 && dragBox.x + dragBox.width < containerBox.x + containerBox.width && dragBox.x + dragBox.width > targetBox.x + targetBox.width / 2 || this.diffY > 0 && dragBox.y + dragBox.height < containerBox.y + containerBox.height && dragBox.y + dragBox.height > Math.max(targetBox.y + targetBox.height/2, this.dragOrigin.y + this.dragOrigin.height + 10)) || target < this.dragIndex && (this.diffX < 0 && Math.abs(this.diffX) > Math.abs(this.diffY) && dragBox.x > containerBox.x && dragBox.x < targetBox.x + targetBox.width / 2 || this.diffY < 0 && Math.abs(this.diffY) > Math.abs(this.diffX) && dragBox.y > containerBox.y && dragBox.y < Math.min(targetBox.y + targetBox.height/2, this.dragOrigin.y - 10));

	// 	}

	// 	return false;

	// }

	isDraggingAfter() {

		const children = [...this.element.children];
		const containerBox = this.element.getBoundingClientRect();
		const dragBox = this.getDragbox();

		let target = this.dragIndex + this.dragLength;

		if (target < children.length) {

			if (this.orientation === "row" && this.diffX > 0 && dragBox.x + dragBox.width < containerBox.x + containerBox.width) {

				const targetBox = children[target].getBoundingClientRect();

				if (dragBox.x + dragBox.width > targetBox.x + targetBox.width / 2) {

					return true;

				}

			}

			if (this.orientation === "column" && this.diffY > 0 && dragBox.y + dragBox.height < containerBox.y + containerBox.height) {

				const targetBox = children[target].getBoundingClientRect();

				if (dragBox.y + dragBox.height > targetBox.y + targetBox.height / 2) {

					return true;

				}

			}

			if (this.orientation === "inline") {

				if (this.diffX > 0 && dragBox.x + dragBox.width < containerBox.x + containerBox.width) {

					const targetBox = children[target].getBoundingClientRect();

					if (targetBox.x > this.dragOrigin.x + this.dragOrigin.width && dragBox.x + dragBox.width > targetBox.x + targetBox.width / 2) {

						return true;

					}

				}

				if (this.diffY > 0  && dragBox.y + dragBox.height < containerBox.y + containerBox.height) {

					while (target < children.length) {

						const targetBox = children[target].getBoundingClientRect();

						if (targetBox.y > this.dragOrigin.y + this.dragOrigin.height) {

							return dragBox.y + dragBox.height > targetBox.y + targetBox.height / 2;

						}

						target++;

					}

				}

			}

		}

		return false;

	}

	isDraggingBefore() {

		const children = [...this.element.children];
		const containerBox = this.element.getBoundingClientRect();
		const dragBox = this.getDragbox();

		let target = this.dragIndex - 1;

		if (target >= 0) {

			if (this.orientation === "row" && this.diffX < 0 && dragBox.x > containerBox.x) {

				const targetBox = children[target].getBoundingClientRect();

				if (dragBox.x < targetBox.x + targetBox.width / 2) {

					return true;

				}

			}

			if (this.orientation === "column" && this.diffY < 0 && dragBox.y > containerBox.y) {

				const targetBox = children[target].getBoundingClientRect();

				if (dragBox.y < targetBox.y + targetBox.height / 2) {

					return true;

				}

			}

			if (this.orientation === "inline") {

				if (this.diffX < 0 && dragBox.x > containerBox.x) {

					const targetBox = children[target].getBoundingClientRect();

					if (targetBox.x + targetBox.width < this.dragOrigin.x && dragBox.x < targetBox.x + targetBox.width / 2) {

						return true;

					}

				}

				if (this.diffY < 0  && dragBox.y > containerBox.y) {

					while (target >= 0) {

						const targetBox = children[target].getBoundingClientRect();

						if (targetBox.y + targetBox.height < this.dragOrigin.y) {

							return dragBox.y < targetBox.y + targetBox.height / 2;

						}

						target--;

					}

				}

			}

		}

		return false;

	}

	// isDraggingInlineAfter() {

	// 	const children = [...this.element.children];
	// 	const containerBox = this.element.getBoundingClientRect();
	// 	const dragBox = this.getDragbox();

	// 	let target = this.dragIndex + this.dragLength;

	// 	if (target < children.length && this.diffX > 0 && dragBox.x + dragBox.width < containerBox.x + containerBox.width) {

	// 		const targetBox = children[target].getBoundingClientRect();

	// 		if (targetBox.x > this.dragOrigin.x + this.dragOrigin.width && dragBox.x + dragBox.width > targetBox.x + targetBox.width / 2) {

	// 			return true;

	// 		}

	// 	}

	// 	if (this.diffY > 0  && dragBox.y + dragBox.height < containerBox.y + containerBox.height) {

	// 		while (target < children.length) {

	// 			const targetBox = children[target].getBoundingClientRect();

	// 			if (targetBox.y > this.dragOrigin.y + this.dragOrigin.height) {

	// 				return dragBox.y + dragBox.height > targetBox.y + targetBox.height / 2;

	// 			}

	// 			target++;

	// 		}

	// 	}

	// 	return false;

	// }

	// isDraggingInlineBefore() {

	// 	const children = [...this.element.children];
	// 	const containerBox = this.element.getBoundingClientRect();
	// 	const dragBox = this.getDragbox();

	// 	let target = this.dragIndex - 1;

	// 	if (target >= 0 && this.diffX < 0 && dragBox.x > containerBox.x) {

	// 		const targetBox = children[target].getBoundingClientRect();

	// 		if (targetBox.x + targetBox.width < this.dragOrigin.x && dragBox.x < targetBox.x + targetBox.width / 2) {

	// 			return true;

	// 		}

	// 	}

	// 	if (this.diffY < 0  && dragBox.y > containerBox.y) {

	// 		while (target >= 0) {

	// 			const targetBox = children[target].getBoundingClientRect();

	// 			if (targetBox.y + targetBox.height < this.dragOrigin.y) {

	// 				return dragBox.y < targetBox.y + targetBox.height / 2;

	// 			}

	// 			target--;

	// 		}

	// 	}

	// 	return false;

	// }

	// isDraggingInto(target) {

	// 	const selection = this.field.getSelection();

	// 	if (!selection) {

	// 		return false;

	// 	}

	// 	const targetField = this.field.getChild(target);

	// 	if (!targetField) {

	// 		return false;

	// 	}

	// 	const dragField = this.field.getChild(selection.index) // -> just need to check the first one

	// 	if (!targetField.canContain(dragField)) {

	// 		return false;

	// 	}

	// 	if ((Math.abs(this.diffX) > Math.abs(this.diffY)) !== (this.field.getOrientation() === "row")) {

	// 		return false;

	// 	}

	// 	const children = this.getChildren();

	// 	const targetElement = children[index];

	// 	if (!targetElement) {

	// 		return false;

	// 	}

	// 	const targetBox = targetElement.getBoundingClientRect();

	// 	const dragElement = children[selection.index];

	// 	if (!dragElement) {

	// 		return false;

	// 	}

	// 	const orientation = this.field.getOrientation();

	// 	if (orientation === "row") {

	// 		if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

	// 			return false;

	// 		}

	// 		if (target > selection.index) {

	// 			if (this.diffX < 0) {

	// 				return false;

	// 			}

	// 			if (this.x - this.dragOffset.x + this.dragOrigin.width < targetBox.x) {

	// 				return false;

	// 			}

	// 		} else {

	// 			if (this.diffX > 0) {

	// 				return false;

	// 			}

	// 			if (this.x - this.dragOffset.x > targetBox.x + targetBox.width) {

	// 				return false;

	// 			}

	// 		}

	// 	} else { // orientation === "column"

	// 		if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

	// 			return false;

	// 		}

	// 		if (target > selection.index) {

	// 			if (this.diffY < 0) {

	// 				return false;

	// 			}

	// 			if (this.y - this.dragOffset.y + this.dragOrigin.height < targetBox.y) {

	// 				return false;

	// 			}

	// 		} else {

	// 			if (this.diffY > 0) {

	// 				return false;

	// 			}

	// 			if (this.y - this.dragOffset.y > targetBox.y + targetBox.height) {

	// 				return false;

	// 			}

	// 		}

	// 	}

	// 	return true;

	// }

	isDraggingInto(target, orientation) {

		const targetElement = this.element.children[target];

		if (targetElement) {

			const targetBox = targetElement.getBoundingClientRect();

			if (orientation === "row") {

				if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

					if (target > this.dragIndex) { // -> right

						if (this.diffX > 0) {

							if (this.x - this.dragOffset.x + this.dragOrigin.width > targetBox.x) {

								return true;

							}

						}

					} else { // -> left

						if (this.diffX < 0) {

							if (this.x - this.dragOffset.x < targetBox.x + targetBox.width) {

								return true;

							}

						}

					}

				}

			} else { // orientation === "column"

				if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

					if (target > this.dragIndex) { // ->bottom

						if (this.diffY > 0) {

							if (this.y - this.dragOffset.y + this.dragOrigin.height > targetBox.y) {

								return true;

							}

						}

					} else { // -> left

						if (this.diffY < 0) {

							if (this.y - this.dragOffset.y < targetBox.y + targetBox.height) {

								return true;

							}

						}

					}

				}

			}

		}

		return false;

	}

	isDraggingOut(direction, orientation) {

		const box = this.element.getBoundingClientRect();

		if (orientation === "row") {

			if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

				if (direction > 0) { // -> test right

					if (this.diffX > 0) {

						if (this.x - this.dragOffset.x + this.dragOrigin.width > box.x + box.width) {

							return true;

						}

					}

				} else { // -> test left

					if (this.diffX < 0) {

						if (this.x - this.dragOffset.x < box.x) {

							return true;

						}

					}

				}

			}

		} else { // orientation === "column"

			if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

				if (direction > 0) { // -> test bottom

					if (this.diffY > 0) {

						if (this.y - this.dragOffset.y + this.dragOrigin.height > box.y + box.height) {

							return true;

						}

					}

				} else { // -> test up

					if (this.diffY < 0) {

						if (this.y - this.dragOffset.y < box.y) {

							return true;

						}

					}

				}

			}

		}

		return false;

	}

}
