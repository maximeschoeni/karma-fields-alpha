
KarmaFieldsAlpha.field.sortable = class extends KarmaFieldsAlpha.field.selectable {

	pointerStart(index, tracker) {

		const selection = this.getSelection();

		if (index > -1 && selection && this.insideSelection(selection, index)) {

			tracker.startDrag(selection.index, selection.length);

			// this.setData(true, "dragging");
			// // this.setData({x: tracker.x, y: tracker.y}, "dragPointOrigin");

			// // const elements = tracker.getElements(selection.index, selection.length);
			// const originBox = tracker.getBox(selection.index, selection.length);
			// const offset = { x: tracker.x - originBox.x, y: tracker.y - originBox.y };

			// this.setData(originBox, "dragOrigin");
			// this.setData(offset, "dragOffset");

			// tracker.event.stopPropagation();

			// ->drag/sort

		} else {

			this.setData(false, "draggable");

			super.pointerStart(index, tracker);

		}

	}

	// pointerMove(index, tracker) {

	// 	const dragging = this.getData("dragging");

	// 	if (dragging) {

	// 		const selection = this.getSelection();

	// 		let elements = tracker.getElements(selection.index, selection.length);

	// 		const offset = this.getData("dragOffset");
	// 		let origin = this.getData("dragOrigin");

	// 		let tx = tracker.x - origin.x - offset.x;
	// 		let ty = tracker.y - origin.y - offset.y;

	// 		// let tx = tracker.x - offset.x;
	// 		// let ty = tracker.y - offset.y;




	// 		const firstElement = elements[0];
	// 		const elementBefore = firstElement.previousElementSibling;
	// 		const firstElementBox = firstElement.getBoundingClientRect();
	// 		const elementBeforeBox = elementBefore && elementBefore.getBoundingClientRect();

	// 		const swapAbove = elementBefore && tracker.diffY < 0 && origin.y + ty < elementBeforeBox.y + elementBeforeBox.height / 2;

	// 		// console.log(swapAbove);


	// 		const lastElement = elements[elements.length - 1];
	// 		const elementAfter = lastElement.nextElementSibling;
	// 		const lastElementBox = firstElement.getBoundingClientRect();
	// 		const elementAfterBox = elementAfter && elementAfter.getBoundingClientRect();

	// 		const swapBelow = elementAfter && tracker.diffY > 0 && lastElementBox.y + lastElementBox.height + ty > elementAfterBox.y + elementAfterBox.height / 2;



	// 		if (swapAbove) {


	// 			tracker.insertElements(elements, elementBefore);

	// 			newSelection = { index: selection.index - 1, length: selection.length };

	// 			this.setSelection({ index: dragSelection.index - 1, length: dragSelection.length });

	// 		}

	// 		if (swapBelow) {

	// 			tracker.insertElements(elements, elementAfter.nextElementSibling);

	// 			newSelection = { index: selection.index + 1, length: selection.length };

	// 			this.setSelection({ index: dragSelection.index + 1, length: dragSelection.length });

	// 		}


	// 		if (swapAbove || swapBelow) {

	// 			// const selection = this.getSelection();

	// 			this.save("reorder");
	// 			this.swapAt(dragSelection.index, selection.index, selection.length);


	// 			elements.forEach(element => element.style.transform = `translate(0, 0)`);
	// 			origin = tracker.getBox(selection.index, selection.length);
	// 			// origin = { x: box.x, y: box.y, width: box.width, height: box.height };
	// 			this.setData(origin, "dragOrigin");

	// 			tx = tracker.x - origin.x - offset.x;
	// 			ty = tracker.y - origin.y - offset.y;



	// 			this.render();
	// 		}

	// 		elements.forEach(element => element.style.transform = `translate(${tx}px, ${ty}px)`);

	// 		// for (let element of elements) {

	// 		// 	element.style.transform = `translate(${tx}px, ${ty}px)`;
	// 		// 	element.classList.add("dragging");

	// 		// }

	// 	} else {

	// 		super.pointerMove(index, tracker);

	// 	}

	// }

	pointerMove(index, tracker) {



		// if (tracker.drag(selection.index, selection.length)) {

		if (tracker.dragging) {

			const selection = this.getSelection();

			const newIndex = tracker.drag(selection.index, selection.length);



			// let elements = tracker.getElements(selection.index, selection.length);

			// const offset = this.getData("dragOffset");
			// let origin = this.getData("dragOrigin");

			// let tx = tracker.x - origin.x - offset.x;
			// let ty = tracker.y - origin.y - offset.y;

			// let tx = tracker.x - offset.x;
			// let ty = tracker.y - offset.y;




			// const firstElement = elements[0];
			// const elementBefore = firstElement.previousElementSibling;
			// const firstElementBox = firstElement.getBoundingClientRect();
			// const elementBeforeBox = elementBefore && elementBefore.getBoundingClientRect();

			// const swapAbove = elementBefore && tracker.diffY < 0 && origin.y + ty < elementBeforeBox.y + elementBeforeBox.height / 2;

			// // console.log(swapAbove);


			// const lastElement = elements[elements.length - 1];
			// const elementAfter = lastElement.nextElementSibling;
			// const lastElementBox = firstElement.getBoundingClientRect();
			// const elementAfterBox = elementAfter && elementAfter.getBoundingClientRect();

			// const swapBelow = elementAfter && tracker.diffY > 0 && lastElementBox.y + lastElementBox.height + ty > elementAfterBox.y + elementAfterBox.height / 2;



			// if (swapAbove) {


			// 	tracker.insertElements(elements, elementBefore);

			// 	newSelection = { index: selection.index - 1, length: selection.length };

			// 	this.setSelection({ index: dragSelection.index - 1, length: dragSelection.length });

			// }

			// if (swapBelow) {

			// 	tracker.insertElements(elements, elementAfter.nextElementSibling);

			// 	newSelection = { index: selection.index + 1, length: selection.length };

			// 	this.setSelection({ index: dragSelection.index + 1, length: dragSelection.length });

			// }


			if (newIndex !== selection.index) {

				this.save("reorder");
				this.swapAt(selection.index, newIndex, selection.length);
				this.setSelection({ index: newIndex, length: selection.length });
				this.render();

			}


			// for (let element of elements) {

			// 	element.style.transform = `translate(${tx}px, ${ty}px)`;
			// 	element.classList.add("dragging");

			// }

		} else {

			super.pointerMove(index, tracker);

		}

	}



	pointerEnd(index, tracker) {

		const selection = this.getSelection();

		if (selection && selection.length) {

			this.setData(true, "draggable");
			this.setData(false, "dragging");

			const elements = tracker.getElements(selection.index, selection.length);

			for (let element of elements) {

				element.style.transform = `translate(0, 0)`;
				element.classList.remove("dragging");

			}

		}

		super.pointerEnd(index, tracker);

	}

	// swapAbove(elements, translateX, translateY, tracker) {

	// 	const pivotElement = elements[0].previousElementSibling;

	// 	if (pivot) {

	// 		const pivot = pivotElement.getBoundingClientRect();
	// 		const firstElement = elements[0];
	// 		const firstElementBox = firstElement.getBoundingClientRect();

	// 		if (tracker.clientDiffY < 0 && firstElementBox.y + translateY < pivot.y + pivot.height / 2) {

	// 			tracker.insertElements(elements, pivot);

	// 			const selection = this.getSelection();

	// 			this.setSelection({ index: selection.index - 1, length: selection.length });

	// 			return true;

	// 		}

	// 	}

	// }


};
