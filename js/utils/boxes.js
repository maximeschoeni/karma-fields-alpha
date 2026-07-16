KarmaFieldsAlpha.Zone = class {

	init() {

		this.lastX = this.x;
		this.lastY = this.y;

		const index = this.findIndex(this.x, this.y);
		const selection = this.field.getSelection();
		const focus = this.field.hasFocus();

		const draggable = this.field.resource.sortable || this.field.resource.draggable;

		if (draggable && focus && index > -1 && selection && index >= selection.index && index < selection.index + selection.length) {

			// this.dragging = true;
			// this.dragElements = this.slice(selection.index, selection.length);
			// this.draggingIndex = index;
			// // this.dragOrigin = this.getBoxAt(selection.index, selection.length);

			// this.dragOffset = { x: this.x - this.dragOrigin.x, y: this.y - this.dragOrigin.y };


			// for (let element of this.dragElements) {

			// 	element.classList.add("dragging");

			// }

			this.initDrag();

			this.event.stopPropagation();

		} else {

			this.unselect();

			this.selecting = true;

			if (index > -1) {

				this.tie = { index, length: 1 };

				if (selection.length && this.event.shiftKey) {

					this.tie.index = Math.min(selection.index, index);
					this.tie.length = Math.max(index + 1, selection.index + selection.length) - this.tie.index;

				}

				this.field.setSelection(this.tie);
				this.field.setFocus();

			} else {

				// field.unselect();

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

			// this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
			// this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

			// this.field.updateOrder(this);

			// for (let element of this.dragElements) {

			// 	element.style.transform = `translate(${this.tx}px, ${this.ty}px)`;

			// }

			this.drag();

		} else if (this.selecting) {

			const index = this.findIndex(this.x, this.y);

			if (index > -1) {

				if (this.tie) {

					const min = Math.min(index, this.tie.index);
					const max = Math.max(this.tie.index + this.tie.length, index + 1);
					const newSelection = { index: min, length: max - min };

					this.field.setSelection(newSelection);

				} else {

					this.field.setSelection({ index, length: 1 });

				}

			}

		}

	}

	completeSelection() {

		if (this.dragging) {

			for (let child of this.dragElements) {

				child.style.transform = `none`;
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

			// const box = child.getBoundingClientRect();
			const box = KarmaFieldsAlpha.Box.fromElement(child);

			if (box.isPointInside(x, y)) {

				return index;

			}

			index++;
			child = child.nextElementSibling;
		}

		return -1;

	}

	slice(index, length = 1) {

		return [...this.element.children].slice(index, index + length);

	}

	getBoxAt(index, length = 1) {

		const children = this.slice(index, length);

		return KarmaFieldsAlpha.Box.fromElement(...children);

	}

	swapTo(index) {

		const targetElement = this.element.children[index];

		if (target < index) {

			this.insertElementsBefore(this.dragElements, targetElement);

		} else {

			this.insertElementsBefore(this.dragElements, targetElement.nextElementSibling);

		}

		for (let element of this.dragElements) {

			element.style.transform = "translate(0, 0)";

		}

		this.dragOrigin = KarmaFieldsAlpha.Box.fromElement(...this.dragElements);

		this.field.save("reorder");
		this.field.swapAt(this.dragIndex, index, this.dragLength);
		this.field.setSelection({ index: index, length: this.dragLength });

		this.dragIndex = index;

		this.drag();

	}

	insertElementsBefore(elements, targetElement) {

		if (targetElement) {

			for (let element of elements) {

				this.element.insertBefore(element, targetElement);

			}

		} else {

			for (let element of elements) {

				this.element.appendChild(element);

			}

		}

	}

	initDrag() {

		const selection = this.getSelection();

		this.dragging = true;
		this.dragIndex = selection.index;
		this.dragLength = selection.length;
		this.dragElements = this.slice(selection.index, selection.length);

		for (let element of this.dragElements) {

			element.style.transform = "translate(0, 0)";
			element.classList.add("dragging");

		}

		this.dragOrigin = KarmaFieldsAlpha.Box.fromElement(...this.dragElements);
		this.dragOffset = { x: this.x - this.dragOrigin.x, y: this.y - this.dragOrigin.y };


	}

	drag() {

		this.dragbox = new KarmaFieldsAlpha.Box({
			x: this.x - this.dragOffset.x,
			y: this.y - this.dragOffset.y,
			width: this.dragOrigin.width,
			height: this.dragOrigin.height
		});

		const tx = this.dragbox.x - this.dragOrigin.x;
		const ty = this.dragbox.y - this.dragOrigin.y;

		// this.tx = this.x - this.dragOrigin.x - this.dragOffset.x;
		// this.ty = this.y - this.dragOrigin.y - this.dragOffset.y;

		for (let element of this.dragElements) {

			element.style.transform = `translate(${tx}px, ${ty}px)`;

		}

		// this.dragbox = new KarmaFieldsAlpha.Box({
		// 	x: this.x - this.dragOffset.x,
		// 	y: this.y - this.dragOffset.y,
		// 	width: this.dragOrigin.width,
		// 	height: this.dragOrigin.height
		// });

		this.field.updateOrder();

	}



	// getDragbox() {

	// 	return this.dragOrigin.translate(this.tx, this.ty);

	// }

	switchContainer(element) {

		this.element = element;
		this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");

	}

	swapAbove() {

		const elementBefore = this.dragElements[0].previousElementSibling;
		const { index, length } = this.field.getSelection();
		const fieldBefore = this.field.getChild(index - 1);

		if (elementBefore && fieldBefore) {

			// const box = elementBefore.getBoundingClientRect();
			const boxBefore = KarmaFieldsAlpha.Box.fromElement(elementBefore); //elementBefore.getBoundingClientRect();

			if (!fieldBefore.isGroup() && this.isDraggingBefore(boxBefore) || this.dragbox.isBefore(boxBefore)) {

				// this.insertBefore(elementBefore);
				this.swapTo(index - 1);

				// this.field.save("reorder");
				// this.field.swapAt(index, index - 1, length);
				// this.field.setSelection({ index: index - 1, length });
				// this.render();

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

	isDraggingBefore(box) {

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && this.orientation === "row" && this.diffX < 0) {

			return this.dragbox.x < box.x + box.width / 2;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && this.orientation === "column" && this.diffY < 0) {

			return this.dragbox.y < box.y + box.height / 2;

		}

		return false;

	}

	isDraggingAfter(box) {

		if (Math.abs(this.diffX) > Math.abs(this.diffY) && this.orientation === "row" && this.diffX > 0) {

			return this.dragbox.x + this.dragbox.width > box.x + box.width / 2;

		} else if (Math.abs(this.diffX) < Math.abs(this.diffY) && this.orientation === "column" && this.diffY > 0) {

			return this.dragbox.y + this.dragbox.height > box.y + box.height / 2;

		}

		return false;

	}

}

KarmaFieldsAlpha.Box = class {

	constructor(box) {

		this.x = box.x;
		this.y = box.y;
		this.width = box.width;
		this.height = box.height;

		// this.x = x;
		// this.y = y;
		// this.width = width;
		// this.height = height;

	}


	static fromElement(element, ...elements) {

		let box = new this(element.getBoundingClientRect());

		while (elements.length) {

			box = box.merge(new this(elements.shift().getBoundingClientRect()));

		}

		return box;

	}


	isPointInside(x, y) {

		return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;

	}

	merge(box) {

		const x = Math.min(this.x, box.x);
		const y = Math.min(this.y, box.y);
		const width = Math.max(this.x + this.width, box.x + box.width) - x;
		const height = Math.max(this.y + this.height, box.y + box.height) - y;

		return new KarmaFieldsAlpha.Box({ x, y, width, height });

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

	translate(tx, ty) {

		// this.x += tx;
		// this.y += ty;

		const box = new this.constructor();
		box.x = this.x + tx;
		box.y = this.y + ty;
		box.width = this.width;
		box.height = this.height;

		return box;

	}



	isBefore(box, orientation) {

		if (orientation === "row") {

			return this.x < box.x && this.x + this.width < box.x + box.width;

		} else {

			return this.y < box.y && this.y + this.height < box.y + box.height;

		}

	}

	isAfter(box, orientation) {

		if (orientation === "row") {

			return this.x > box.x && this.x + this.width > box.x + box.width;

		} else {

			return this.y > box.y && this.y + this.height > box.y + box.height;

		}

	}

	isDraggingBefore(box, orientation, dX, dY) {

		if (Math.abs(dX) > Math.abs(dY) && orientation === "row" && dX < 0) {

			return this.x < box.x + box.width / 2;

		} else if (Math.abs(dX) < Math.abs(dY) && orientation === "column" && dY < 0) {

			return this.y < box.y + box.height / 2;

		}

		return false;

	}

	isDraggingAfter(box, orientation, dX, dY) {

		if (Math.abs(dX) > Math.abs(dY) && orientation === "row" && dX > 0) {

			return this.x + dragBox.width > box.x + box.width / 2;

		} else if (Math.abs(dX) < Math.abs(dY) && orientation === "column" && dY > 0) {

			return this.y + this.height > box.y + box.height / 2;

		}

		return false;

	}

	isDraggingOutBefore(box, orientation, dX, dY) {

		if (Math.abs(dX) > Math.abs(dY) && orientation === "row" && dX < 0) {

			return this.x < box.x;

		} else if (Math.abs(dX) < Math.abs(dY) && orientation === "column" && dY < 0) {

			return this.y < box.y;

		}

		return false;

	}

	isDraggingOutAfter(box, orientation, dX, dY) {

		if (Math.abs(dX) > Math.abs(dY) && orientation === "row" && dX > 0) {

			return this.x + this.width > box.x + box.width;

		} else if (Math.abs(dX) < Math.abs(dY) && orientation === "column" && dY > 0) {

			return this.y + this.height > box.y + box.height;

		}

		return false;

	}

	isDraggingIntoPrevious(box, orientation, dX, dY) {

		if (Math.abs(dX) > Math.abs(dY) && orientation === "row" && dX < 0) {

			return this.x < box.x + box.width;

		} else if (Math.abs(dX) < Math.abs(dY) && orientation === "column" && dY < 0) {

			return this.y < box.y + box.height;

		}

		return false;

	}

	isDraggingIntoNext(box, orientation, dX, dY) {

		if (Math.abs(dX) > Math.abs(dY) && orientation === "row" && dX > 0) {

			return this.x + this.width > box.x;

		} else if (Math.abs(dX) < Math.abs(dY) && orientation === "column" && dY > 0) {

			return ths.y + this.height > box.y;

		}

		return false;

	}

}
