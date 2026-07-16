KarmaFieldsAlpha.MouseTracker = class {

	mousedown(event) {

		if (!this.element) {

			console.error("element not defined");

		}

		if (!this.field) {

			console.error("field not defined");

		}

		this.event = event;
		this.x = event.clientX;
		this.y = event.clientY;

		const scrollContainer = this.element.closest(".scroll-container,.interface-navigable-region");

		const onmousemove = event => {
			this.x = event.clientX;
			this.y = event.clientY;
			this.event = event;
			this.update();
		}

		const onscroll = event => {
			if (event.target.contains(element)) {
				this.update();
			}
		}

		const onmouseup = event => {
			this.event = event;
			this.complete();
			document.removeEventListener("mousemove", onmousemove);
			document.removeEventListener("mouseup", onmouseup);
			(scrollContainer || document).removeEventListener("scroll", onscroll);
		}

		document.addEventListener("mousemove", onmousemove);
		document.addEventListener("mouseup", onmouseup);
		(scrollContainer || document).addEventListener("scroll", onscroll);

		this.init();
	}

	// trackTouch(element, event) {

	// 	const zone = new KarmaFieldsAlpha.Zone();
	// 	zone.field = this;
	// 	zone.isTouch = true;
	// 	zone.element = element;
	// 	zone.event = event;
	// 	zone.x = event.touches[0].clientX;
	// 	zone.y = event.touches[0].clientY;
	// 	zone.direction = "column";

	// 	// const scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

	// 	const ontouchmove = event => {
	// 		zone.x = event.touches[0].clientX;
	// 		zone.y = event.touches[0].clientY;
	// 		zone.event = event;
	// 		zone.update();
	// 	}

	// 	const ontouchend = event => {
	// 		this.isTouch = false;
	// 		this.event = event;
	// 		this.completeSelection();
	// 		document.removeEventListener("touchmove", ontouchmove);
	// 		document.removeEventListener("touchend", ontouchend);
	// 	}

	// 	document.addEventListener("touchmove", ontouchmove);
	// 	document.addEventListener("touchend", ontouchend);

	// 	this.init();
	// }

	init() {

		this.lastX = this.x;
		this.lastY = this.y;

		const index = this.findIndex(this.x, this.y);
		const selection = this.field.getSelection();
		const focus = this.field.hasFocus();

		const draggable = this.field.resource.sortable || this.field.resource.draggable;

		if (draggable && focus && index > -1 && selection && index >= selection.index && index < selection.index + selection.length) {

			this.dragging = true;
			this.dragIndex = selection.index;
			this.dragLength = selection.length;
			this.dragElements = this.slice(selection.index, selection.length);

			for (let element of this.dragElements) {

				element.style.transform = "translate(0, 0)";
				element.classList.add("dragging");

			}

			this.dragOrigin = this.getBoxAt(selection.index, selection.length);
			this.dragOffset = { x: this.x - this.dragOrigin.x, y: this.y - this.dragOrigin.y };

			this.event.stopPropagation();

		} else {

			this.field.unselect();

			this.selecting = true;

			const index = this.findIndex(this.x, this.y);

			if (index > -1) {

				this.selection = { index, length: 1 };

				if (selection.length && this.event.shiftKey) {

					this.selection.index = Math.min(selection.index, index);
					this.selection.length = Math.max(index + 1, selection.index + selection.length) - this.selection.index;

				}

				this.field.setSelection(this.selection);
				this.field.setFocus();

			}

		}

		this.event.stopPropagation();

		// this.render("local");

	}

	update(x, y, event) {

		this.diffX = this.x - this.lastX;
		this.diffY = this.y - this.lastY;

		this.lastX = this.x;
		this.lastY = this.y;

		const selection = this.field.getSelection();

		if (this.dragging) {

			this.drag();

			if (this.isDraggingOver(selection.index - 1)) {

				this.swapTo(selection.index - 1);

			} else if (this.isDraggingOver(selection.index + selection.length)) {

				this.swapTo(selection.index + selection.length);

			} else if (this.isDraggingInto(selection.index - 1)) {

				this.swapToChild(selection.index - 1);

			} else if (this.isDraggingInto(selection.index + selection.length)) {

				this.swapToChild(selection.index + selection.length);

			} else if (this.isDraggingOut()) {

				this.swapToParent();

			}

		} else if (this.selecting) {

			const index = this.findIndex(this.x, this.y);

			if (index > -1) {

				if (this.selection) {

					const min = Math.min(index, this.selection.index);
					const max = Math.max(this.selection.index + this.selection.length, index + 1);
					const newSelection = { index: min, length: max - min };

					this.field.setSelection(newSelection);

				} else {

					this.field.setSelection({ index, length: 1 });

				}

			}

		}

	}

	complete() {

		if (this.dragging) {

			for (let child of this.dragElements) {

				child.style.transform = "none";
				child.classList.remove("dragging");

			}

			this.dragging = false;

		}

		if (this.selecting) {

			this.field.setFocus(true);

			this.selecting = false;

			this.field.render();

		}

	}

	findIndex(x, y) {

		let index = 0;
		let child = this.element.firstElementChild;

		while (child) {

			const box = child.getBoundingClientRect();

			if (x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height) {

				return index;

			}

			index++;
			child = child.nextElementSibling;
		}

		return -1;

	}

	sliceElements(index, length = 1) {

		return [...this.element.children].slice(index, index + length);

	}

	getElementsBox(element, ...elements) {

		let box = element.getBoundingClientRect();

		while (elements.length) {

			const newBox = elements.shift().getBoundingClientRect();

			box.x = Math.min(newBox.x, box.x);
			box.y = Math.min(newBox.y, box.y);
			box.width = Math.max(newBox.x + newBox.width, box.x + box.width) - box.x;
			box.height = Math.max(newBox.y + newBox.height, box.y + box.height) - box.y;

		}

		return box;

	}

	getBoxAt(index, length = 1) {

		const children = this.sliceElements(index, length);

		return this.getElementsBox(children);

	}

	getDragbox() {

		return {
			x: this.x - this.dragOffset.x,
			y: this.y - this.dragOffset.y,
			width: this.dragOrigin.width,
			height: this.dragOrigin.height
		};
	}

	insertElementsBefore(elements, targetElement, container) {

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

	drag() {

		// this.dragbox = {
		// 	x: this.x - this.dragOffset.x,
		// 	y: this.y - this.dragOffset.y,
		// 	width: this.dragOrigin.width,
		// 	height: this.dragOrigin.height
		// };

		// const tx = this.dragbox.x - this.dragOrigin.x;
		// const ty = this.dragbox.y - this.dragOrigin.y;

		const tx = this.x - this.dragOrigin.x - this.dragOffset.x;
		const ty = this.y - this.dragOrigin.y - this.dragOffset.y;

		const selection = this.field.getSelection();
		const children = this.getChildren();

		for (let element of children.slice(selection.index, selection.index + selection.length)) {

			element.style.transform = `translate(${tx}px, ${ty}px)`;

		}

	}

	swapTo(index) {

		const selection = this.field.getSelection();
		const targetElement = this.element.children[index];
		const dragElements = this.sliceElements(selection.index, selection.length);

		for (let element of dragElements) {

			element.style.transform = "translate(0, 0)";

		}

		if (index < selection.index) {

			this.insertElementsBefore(dragElements, targetElement, this.element);

		} else {

			this.insertElementsBefore(dragElements, targetElement.nextElementSibling, this.element);

		}

		this.field.save("reorder");
		this.field.swapAt(selection.index, index, selection.length);
		this.field.setSelection({ index, length: selection.length });

		this.dragOrigin = this.getElementsBox(dragElements);

		this.drag();

	}

	swapToChild(index) {

		const selection = this.field.getSelection();
		const targetField = this.field.getChild(index);
		const targetElement = this.element.children[index].querySelector(".select-zone");

		const dragElements = this.sliceElements(selection.index, selection.length);

		for (let element of dragElements) {

			element.style.transform = "translate(0, 0)";

		}

		this.element = targetElement;

		this.field.save("reorder");



		if (index < selection.index) {

			this.insertElementsBefore(dragElements, null, targetElement); // -> insert at the end


		} else {

			this.insertElementsBefore(dragElements, targetElement.firstElementChild, targetElement); // -> insert at begin

		}

		this.field.swapToChild(targetField);
		this.field.unselect();
		this.field = targetField;
		this.field.setFocus(true);


		this.field.reParent(index, targetField);
		this.field.setSelection({ index, length: selection.length });

		this.dragOrigin = this.getElementsBox(dragElements);

		this.drag();

	}

	swapToParent() {

		const selection = this.field.getSelection();
		const parentElement = this.element.parentNode.closest(".select-zone");

		const dragElements = this.sliceElements(selection.index, selection.length);

		for (let element of dragElements) {

			element.style.transform = "translate(0, 0)";

		}

		this.field.save("reorder");

		if (this.field.parent.getOrientation() === "row" && this.diffX > 0 || this.field.parent.getOrientation() === "column" && this.diffY > 0) {

			this.insertElementsBefore(dragElements, this.element.nextSiblingElement, parentElement); // -> insert after
			this.field.parent.setSelection({ index: this.field.index + 1, length: selection.length });

		} else {

			this.insertElementsBefore(dragElements, this.element, parentElement); // -> insert defore
			this.field.parent.setSelection({ index: this.field.index, length: selection.length });

		}

		this.element = parentElement;

		this.field.swapToParent();
		this.field.unselect();
		this.field = this.field.parent;
		this.field.setFocus(true);

		this.dragOrigin = this.getElementsBox(dragElements);

		this.drag();

	}

	isDraggingOver(target) {

		const selection = this.field.getSelection();

		if (!selection) {

			return false;

		}

		const targetField = this.field.getChild(target);

		if (!targetField) {

			return false;

		}

		const dragField = this.field.getChild(selection.index) // -> just need to check the first one

		if (targetField.canContain(dragField)) {

			return false;

		}

		if ((Math.abs(this.diffX) > Math.abs(this.diffY)) !== (this.field.getOrientation() === "row")) {

			return false;

		}

		const children = this.getChildren();

		const targetElement = children[index];

		if (!targetElement) {

			return false;

		}

		const targetBox = targetElement.getBoundingClientRect();

		const orientation = this.field.getOrientation();

		if (orientation === "row") {

			if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

				return false;

			}

			if (target > selection.index) {

				if (this.diffX < 0) {

					return false;

				}

				if (this.x - this.dragOffset.x + this.dragOrigin.width < targetBox.x + targetBox.width/2) {

					return false;

				}

			} else {

				if (this.diffX > 0) {

					return false;

				}

				if (this.x - this.dragOffset.x > targetBox.x + targetBox.width/2) {

					return false;

				}

			}

		} else { // orientation === "column"

			if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

				return false;

			}

			if (target > selection.index) {

				if (this.diffY < 0) {

					return false;

				}

				if (this.y - this.dragOffset.y + this.dragOrigin.height < targetBox.y + targetBox.height/2) {

					return false;

				}

			} else {

				if (this.diffY > 0) {

					return false;

				}

				if (this.y - this.dragOffset.y > targetBox.y + targetBox.height/2) {

					return false;

				}

			}

		}

		return true;

	}

	isDraggingInto(target) {

		const selection = this.field.getSelection();

		if (!selection) {

			return false;

		}

		const targetField = this.field.getChild(target);

		if (!targetField) {

			return false;

		}

		const dragField = this.field.getChild(selection.index) // -> just need to check the first one

		if (!targetField.canContain(dragField)) {

			return false;

		}

		if ((Math.abs(this.diffX) > Math.abs(this.diffY)) !== (this.field.getOrientation() === "row")) {

			return false;

		}

		const children = this.getChildren();

		const targetElement = children[index];

		if (!targetElement) {

			return false;

		}

		const targetBox = targetElement.getBoundingClientRect();

		const dragElement = children[selection.index];

		if (!dragElement) {

			return false;

		}

		const orientation = this.field.getOrientation();

		if (orientation === "row") {

			if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

				return false;

			}

			if (target > selection.index) {

				if (this.diffX < 0) {

					return false;

				}

				if (this.x - this.dragOffset.x + this.dragOrigin.width < targetBox.x) {

					return false;

				}

			} else {

				if (this.diffX > 0) {

					return false;

				}

				if (this.x - this.dragOffset.x > targetBox.x + targetBox.width) {

					return false;

				}

			}

		} else { // orientation === "column"

			if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

				return false;

			}

			if (target > selection.index) {

				if (this.diffY < 0) {

					return false;

				}

				if (this.y - this.dragOffset.y + this.dragOrigin.height < targetBox.y) {

					return false;

				}

			} else {

				if (this.diffY > 0) {

					return false;

				}

				if (this.y - this.dragOffset.y > targetBox.y + targetBox.height) {

					return false;

				}

			}

		}

		return true;

	}

	isDraggingOut() {

		const selection = this.field.getSelection();

		if (!selection) {

			return false;

		}

		const dragField = this.field.getChild(selection.index) // -> just need to check the first one

		if (!dragField) {

			return false;

		}

		if (!this.field.parent.canContain(dragField)) {

			return false;

		}

		const parentBox = this.element.getBoundingClientRect();

		const orientation = this.field.parent.getOrientation();

		if (orientation === "row") {

			if (Math.abs(this.diffX) < Math.abs(this.diffY)) {

				return false;

			}

			if (this.diffX > 0) {

				if (this.x - this.dragOffset.x + this.dragOrigin.width < parentBox.x + parentBox.width) {

					return false;

				}

			} else {

				if (this.x - this.dragOffset.x > parentBox.x) {

					return false;

				}

			}

		} else { // orientation === "column"

			if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

				return false;

			}

			if (this.diffY > 0) {

				if (this.y - this.dragOffset.y + this.dragOrigin.height < targetBox.y + targetBox.height) {

					return false;

				}

			} else {

				if (this.y - this.dragOffset.y > targetBox.y) {

					return false;

				}

			}

		}

		return true;

	}

}
