


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

	static trackers = new Map();

	constructor(element, offset = 0, groupLength = 1) {

		this.element = element;
		this.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");
		this.offset = offset;
		this.groupLength = groupLength;

		this.oninit = () => { };
		this.onupdate = () => { };
		this.oncomplete = () => { };

		element.onmousedown = event => {
			if (event.button === 0 && !this.isTouch) {
				this.trackMouse(event);
			}
		}

		element.ontouchstart = event => {
			this.isTouch = true;
			this.trackTouch(event);
		}

		this.constructor.trackers.set(element, this);

	}

	trackMouse(event) {

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
			this.lastTarget = event.target;
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

	trackTouch(event) {

		const ontouchmove = event => {
			this.x = event.touches[0].clientX;
			this.y = event.touches[0].clientY;
			this.event = event;
			this.update();
		}

		const ontouchend = event => {
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

	init() {

		this.lastX = this.x;
		this.lastY = this.y;
		this.index = this.findIndex();

		if (this.oninit) {
			this.oninit();
		}

	}

	update() {

		this.diffX = this.x - this.lastX;
		this.diffY = this.y - this.lastY;
		this.lastX = this.x;
		this.lastY = this.y;
		this.index = this.findIndex();

		if (this.onupdate) {
			this.onupdate();
		}

	}

	complete() {
		if (this.oncomplete) {
			this.oncomplete();
		}
	}

	isInside(box) {
		return this.x >= box.x && this.x < box.x + box.width && this.y >= box.y && this.y < box.y + box.height;
	}

	findIndex() {

		let index = 0;
		let child = this.element.firstElementChild;

		while (index < this.offset && child) {
			index++;
			child = child.nextElementSibling;
		}

		while (child) {
			const box = child.getBoundingClientRect();
			if (this.x >= box.x && this.x < box.x + box.width && this.y >= box.y && this.y < box.y + box.height) {
				return Math.floor((index - this.offset) / this.groupLength);
			}
			index++;
			child = child.nextElementSibling;
		}

		return -1;

	}

	startSelect(index, length) {

		// const selection = this.getSelection();

		// if (index > -1 && selection && selection.length) {

		// 	// ->drag/sort

		// }

		if (this.index > -1) {

			this.tie = { index: this.index, length: 1 };

			if (length && this.event.shiftKey) {

				this.tie.index = Math.min(index, this.index);
				this.tie.length = Math.max(this.index + 1, index + length) - this.tie.index;

			}

			return this.tie;

		}

		// else {

		// 	this.unselect();

		// }

		// this.render();

	}

	growSelect(index, length) {

		if (this.index > -1 && this.tie) {

			index = Math.min(this.index, this.tie.index);
			length = Math.max(this.tie.index + this.tie.length, this.index + 1) - index;

		}

		return { index, length };

	}

	getElements(index, length = 1) {

		const children = [...this.element.children];

		return children.slice(this.offset + index*this.groupLength, this.offset + index*this.groupLength + length*this.groupLength);

	}

	getBox(index, length = 1) {

		const elements = this.getElements(index, length);

		if (elements.length) {

			const box1 = elements[0].getBoundingClientRect();

			if (elements.length > 1) {

				const box2 = elements[elements.length - 1].getBoundingClientRect();

				return { x: box1.x, y: box1.y, width: box2.x + box2.width - box1.x, height: box2.y + box2.height - box1.y };

				// return new DOMRect(box1.x, box1.y, box2.x + box2.width, box2.y + box2.height);

			} else {

				return box1;

			}

		}

	}

	insertBefore(elements, targetElement) {

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

	startDrag(index, length) {

		this.dragging = true;

		this.dragOrigin = this.getBox(index, length);
		this.dragOffset = { x: this.x - this.dragOrigin.x, y: this.y - this.dragOrigin.y };

		let elements = this.getElements(index, length);

		for (let element of elements) {

			element.classList.add("dragging");

		}

		this.event.stopPropagation();

	}

	drag(index, length) {

		let elements = this.getElements(index, length);

		let tx = this.x - this.dragOrigin.x - this.dragOffset.x;
		let ty = this.y - this.dragOrigin.y - this.dragOffset.y;

		const firstElement = elements[0];
		const elementBefore = firstElement.previousElementSibling;
		const firstElementBox = firstElement.getBoundingClientRect();
		const elementBeforeBox = elementBefore && elementBefore.getBoundingClientRect();

		const swapAbove = elementBefore && this.diffY < 0 && this.dragOrigin.y + ty < elementBeforeBox.y + elementBeforeBox.height / 2;


		const lastElement = elements[elements.length - 1];
		const elementAfter = lastElement.nextElementSibling;
		const lastElementBox = firstElement.getBoundingClientRect();
		const elementAfterBox = elementAfter && elementAfter.getBoundingClientRect();

		const swapBelow = elementAfter && this.diffY > 0 && lastElementBox.y + lastElementBox.height + ty > elementAfterBox.y + elementAfterBox.height / 2;



		if (swapAbove) {

			this.insertBefore(elements, elementBefore);

			index--;

		}

		if (swapBelow) {

			this.insertBefore(elements, elementAfter.nextElementSibling);

			index++;

		}


		if (swapAbove || swapBelow) {


			// this.save("reorder");
			// this.swapAt(selection.index, newSelection.index, newSelection.length);

			// elements.forEach(element => element.style.transform = `translate(0, 0)`);

			for (let element of elements) {

				element.style.transform = "translate(0, 0)";

			}

			this.dragOrigin = this.getBox(index, length);
			// origin = { x: box.x, y: box.y, width: box.width, height: box.height };
			// this.setData(origin, "dragOrigin");

			tx = this.x - this.dragOrigin.x - this.dragOffset.x;
			ty = this.y - this.dragOrigin.y - this.dragOffset.y;

			// this.render();
		}

		// elements.forEach(element => element.style.transform = `translate(${tx}px, ${ty}px)`);

		for (let element of elements) {

			element.style.transform = `translate(${tx}px, ${ty}px)`;

		}

		return { index, length };

	}

	dragEnd(index, length) {

		const elements = this.getElements(index, length);

		for (let element of elements) {

			element.style.transform = `translate(0, 0)`;
			element.classList.remove("dragging");

		}

	}

	checkExit(index, length) {

		const containerBox = this.element.getBoundingClientRect();

		const elements = this.getElements(index, length);

		if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

			if (this.diffX > 0) {

				const element = elements[elements.length - 1];
				const box = element.getBoundingClientRect();

				if (box.x + box.width > containerBox.x + containerBox.width) {

					return box;

				}

			} else {

				const element = elements[0];
				const box = element.getBoundingClientRect();

				if (box.x < containerBox.x) {

					return box;

				}

			}

		} else {

			if (this.diffY > 0) {

				const element = elements[elements.length - 1];
				const box = element.getBoundingClientRect();

				if (box.y + box.height > containerBox.y + containerBox.height) {

					return box;

				}

			} else {

				const element = elements[0];
				const box = element.getBoundingClientRect();

				if (box.y < containerBox.y) {

					return box;

				}

			}

		}

	}

	checkEntrance() {


		for (let element in this.constructor.trackers) {

			if (element !== this.element) {

				const box = element.getBoundingClientRect();

				// if () {


				// }

			}



		}

	}

	dragOut(index, length) {

		const containerBox = this.element.getBoundingClientRect();

		const elements = this.getElements(index, length);

		for (let element in this.constructor.trackers) {

			if (Math.abs(this.diffX) > Math.abs(this.diffY)) {

				if (this.diffX > 0) {

					const element = elements[elements.length - 1];
					const box = element.getBoundingClientRect();

					if (box.x + box.width > containerBox.x + containerBox.width) {

						return "right";

					}

				} else {

					const element = elements[0];
					const box = element.getBoundingClientRect();

					if (box.x < containerBox.x) {

						return "left";

					}

				}

			} else {

				if (this.diffY > 0) {

					const element = elements[elements.length - 1];
					const box = element.getBoundingClientRect();

					if (box.y + box.height > containerBox.y + containerBox.height) {

						return "bottom";

					}

				} else {

					const element = elements[0];
					const box = element.getBoundingClientRect();

					if (box.y < containerBox.y) {

						return "top";

					}

				}

			}



		}

	}

}
