

KarmaFieldsAlpha.field.selectable = class extends KarmaFieldsAlpha.field.enumerable {

	doAction(action, ...args) {

		switch (action) {

			case "swap":
				this.swap(...args);
				break;

			case "getValue":
				return this.getValue(...args);

			case "setValue":
				this.setValue(...args);
				break;

			case "isSelected":
				return this.isSelected(...args);

			case "select":
				this.select(...args);
				break;

			default:
				super.doAction(action, ...args)

		}

	}


	// getDialog() {

	// 	const resource = this.getDialogResource();

	// 	return new KarmaFieldsAlpha.field.selectable.dialog(resource, "dialog");

	// }

	// isMixed(key) {

	// 	const indexes = this.getSelectedIndexes();

	// 	if (indexes.length > 1) {

	// 		let index = 0;
	// 		const firstValue = this.parent.getValueAt(key, index++);

	// 		if (firstValue === undefined) {

	// 			return;

	// 		}

	// 		while (index < ids.length) {

	// 			const value = this.parent.getValueAt(key, index++);

	// 			if (value === undefined) {

	// 				return;

	// 			}

	// 			if (!KarmaFieldsAlpha.DeepObject.equal(value, firstValue)) {

	// 				return true;

	// 			}

	// 		}

	// 	}

	// 	return false;

	// }

	getRawSelection() {

		return KarmaFieldsAlpha.Store.getAttribute(this.uid, "selection");

	}

	setRawSelection(selection) {

		if (selection && selection.length === undefined) {

			console.error("Setting selection but length is not set");

		}

		if (selection && selection.index === undefined) {

			console.error("Setting selection but index is not set");

		}

		KarmaFieldsAlpha.Store.setAttribute(selection, this.uid, "selection");

	}



	getSelection() {

		return this.getRawSelection() || this.resource.preselection;

	}

	setSelection(selection) {

		this.setRawSelection(selection);

	}

	getQuerySelection() { // -> to be overrided by gallery

		return this.getSelection();

	}

	setQuerySelection(selection) { // -> to be overrided by gallery

		this.setSelection(selection);

	}

	select(index, length) {

		this.setSelection({ index, length });

	}

	removeSelection() {

		// this.unselect();
		KarmaFieldsAlpha.Store.removeAttribute(this.uid, "selection");

	}

	unselect() {

		this.removeSelection();

	}

	isMixed(key, index, length) {

		if (index === undefined) {

			const selection = this.getSelection();

			if (selection) {

				return super.isMixed(key, selection.index, selection.length);

			}

			return false;

		}

		return super.isMixed(key, index, length);

	}

	// getSelectedValue(key) {

	// 	const selection = this.getQuerySelection();

	// 	if (selection) {

	// 		return super.getValue(key, selection.index, selection.length);

	// 	}

	// 	return [];

	// }

	// setSelectedValue(value, key) {

	// 	const selection = this.getQuerySelection();

	// 	if (selection) {

	// 		super.setValue(value, key, selection.index, selection.length);

	// 	}

	// }

	getValue(key, index, length) {

		if (index === undefined) {

			const selection = this.getSelection();

			if (selection) {

				return super.getValue(key, selection.index, selection.length);

			}

			return [];

		}

		return super.getValue(key, index, length);

	}

	setValue(value, key, index, length) {

		if (index === undefined) {

			// this.setSelectedValue(value, key);

			const selection = this.getSelection();

			if (selection) {

				super.setValue(value, key, selection.index, selection.length);

			}

		} else {

			super.setValue(value, key, index, length);

		}

	}

	getSelectedIndexes() {

		const indexes = [];
		const selection = this.getSelection();

		if (selection) {

			for (let i = 0; i < selection.length; i++) {

				indexes.push(i + selection.index);

			}

		}

		return indexes;
	}

	getAllSelectedValues(key) {

		const indexes = this.getSelectedIndexes();
		const values = [];

		for (let index of indexes) {

			const value = this.getValueAt(key, index);

			values.push(value);

		}

		if (values.some(value => value === undefined)) {

			return;

		}

		return values;

	}

	getAllValues(key, index, length) {

		if (index === undefined) {

			return this.getAllSelectedValues(key);

		}

		return super.getAllValues(key, index, length);
	}



	open(index, length = 1) {

		if (index !== undefined) {

			this.setSelection({ index, length });

		}

		super.open();

	}


	// setSelectedValues(value, key) {

	// 	const indexes = this.getSelectedIndexes();

	// 	for (let index of indexes) {

	// 		this.setValueAt(value, key, index);

	// 	}

	// }

	hasSelection() {

		const selection = this.getQuerySelection();

		return selection && selection.length > 0 || false;

	}

	hasSelectionInside() { // deprecated -> use hasSelection + hasFocus

		const selection = this.getSelection();

		if (selection) {

			return this.hasFocus() && selection.length > 0;

		}

		return false;

	}

	// isSelected(id) { // deprecated

	// 	const ids = this.getSelectedIds();

	// 	if (ids) {

	// 		return ids.includes(id);

	// 	}

	// 	return false;

	// }

	isSelected(index) {

		const selection = this.getSelection();

		if (selection) {

			return index >= selection.index && index < selection.index + selection.length;

		}

		return false;

	}

	isRawIndexSelected(rawIndex) {

		const selection = this.getRawSelection();

		if (selection) {

			return rawIndex >= selection.index && rawIndex < selection.index + selection.length;

		}

		return false;

	}

	// getSelectedIds() { // deprecated

	// 	const selection = this.getSelection();
	// 	const ids = this.getIds();

	// 	if (ids && selection ) {

	// 		const { index = 0, length = 0 } = selection;

	// 		return ids.slice(index, index + length);

	// 	}

	// }

	// // DEPRECATED
	// selectAt(index, length = 1) { // -> used by gallery to set right selection in case of exit item

	// 	this.setSelection({ index, length });
	// 	this.setFocus(true);

	// }

	// selectByIds(ids) {

	// 	KarmaFieldsAlpha.server.promise(done => {

	// 		const currentIds = this.getIds();

	// 		if (currentIds !== undefined) {

	// 			const index = currentIds.indexOf(ids[0]);

	// 			if (index > -1) {

	// 				this.setSelection({ index, length: ids.length }); // -> lets hope ids are consecutives
	// 				this.setFocus(true);

	// 			} else {

	// 				this.removeSelection();

	// 			}

	// 			done();
	// 		}

	// 	}, "selectByIds");

	// }

	// selectByIds(ids) {

	// 	this.selectBy(ids, "id");

	// }

	// selectBy(values, key) {

	// 	KarmaFieldsAlpha.Store.addPromise(done => {

	// 		const currentValues = this.getAllValues(key, 0, this.resource.length);

	// 		if (currentValues !== undefined) {

	// 			const index = currentValues.indexOf(values[0]);

	// 			if (index > -1) {

	// 				this.setSelection({ index, length: ids.length }); // -> lets hope values are consecutives...
	// 				this.setFocus(true);

	// 			} else {

	// 				this.removeSelection();

	// 			}

	// 			done();
	// 		}

	// 	}, "selectBy");

	// }

	selectAll() {

		this.setQuerySelection({
			index: 0,
			length: this.resource.length
		});

	}

	delete(queryIndex, length) { // -> delete from pressing delete key

		if (queryIndex === undefined) {

			// this.deleteSelection();

			const selection = this.getQuerySelection();

			if (selection) {

				this.parent.delete(selection.index || 0, selection.length || 0);

			}

		} else {

			this.parent.delete(queryIndex, length);

		}

	}

	// deleteSelection() { // to be overrided by Gallery

	// 	const selection = this.getSelection();

	// 	if (selection) {

	// 		this.delete(selection.index, selection.length);

	// 	}

	// }

	// sliceSelection() { // -> to be overrided by gallery!

	// 	const selection = this.getSelection();

	// 	if (selection) {

	// 		return this.slice(selection.index, selection.length);

	// 	}

	// 	return [];
	// }

	slice(queryIndex, length) {

		if (queryIndex === undefined) {

			// return this.sliceSelection();

			const selection = this.getQuerySelection();

			if (selection) {

				return super.slice(selection.index, selection.length);

			}

			return [];

		}

		return super.slice(queryIndex, length);

	}

	// insertSelection(array) { // -> to be overrided by gallery

	// 	const selection = this.getSelection();

	// 	if (selection) {

	// 		return this.insert(array, selection.index, selection.length);

	// 	}

	// }

	insert(array, queryIndex, length) {

		if (queryIndex === undefined) {

			// this.insertSelection(array);
			const selection = this.getQuerySelection();

			if (selection) {

				return this.insert(array, selection.index, selection.length);

			}

		} else {

			super.insert(array, queryIndex, length);

		}

	}


	duplicate(index, length) { // -> to be overrided by gallery

		if (index === undefined) {

			const selection = this.getQuerySelection();

			if (selection) {

				super.duplicate(selection.index, selection.length);

				index = selection.index + selection.length;
				length = selection.length;

				this.setQuerySelection({ index, length });

			}

		} else {

			super.duplicate(index, length);

		}

	}

	hasPrev() { // -> to be overrided by gallery

		const selection = this.getQuerySelection();

		return selection && selection.index > 0;

	}

	hasNext() { // -> to be overrided by gallery

		const selection = this.getQuerySelection();

		return selection && selection.index + 1 < this.resource.length;

	}

	prev() {  // -> to be overrided by gallery

		const selection = this.getQuerySelection();

		if (selection && selection.index > 0) {

			this.setSelection({ index: selection.index - 1, length: selection.length });

		}

	}

	next() {  // -> to be overrided by gallery

		const selection = this.getQuerySelection();

		if (selection && selection.index + 1 < this.resource.length) {

			this.setSelection({ index: selection.index + 1, length: selection.length });

		}

	}


	*listSelectedChildren() { // ??

		const selection = this.getSelection();

		if (selection) {

			for (let i = 0; i < selection.length; i++) {

				yield this.getChild(selection.index + i);

			}

		}

	}

	registerTracker(element) {

		const tracker = new KarmaFieldsAlpha.field.selectable.MouseTracker(element);

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


	mouseDown(tracker) {

		const selection = this.getRawSelection();

		this.unselect();

		if (tracker.index > -1) {

			tracker.startSelection = { index: tracker.index, length: 1 };

			if (selection && tracker.event.shiftKey) {

				tracker.startSelection.index = Math.min(selection.index, tracker.index);
				tracker.startSelection.length = Math.max(index + 1, selection.index + selection.length) - tracker.startSelection.index;

			}

			this.setRawSelection(tracker.startSelection);
			this.setFocus();
			this.render();

		}

	}

	mouseMove(tracker) {

		const index = tracker.findIndex(tracker.x, tracker.y);

		if (index > -1) {

			if (tracker.selection) {

				const min = Math.min(index, tracker.selection.index);
				const max = Math.max(tracker.selection.index + tracker.selection.length, index + 1);

				const newSelection = { index: min, length: max - min };

				this.setRawSelection(newSelection);

			} else {

				tracker.selection = { index, length: 1 };

				this.setRawSelection(tracker.selection);

			}

			this.render();

		}

	}

	mouseUp(tracker) {

		this.setFocus(true);
		this.render();

	}

}


KarmaFieldsAlpha.field.selectable.MouseTracker = class {

	constructor(element) {

		this.element = element;

		this.registerSelectZone(element);

		// element.classList.add("select-zone");

		// element.onmousedown = event => {

		// 	this.event = event;
		// 	this.x = event.clientX;
		// 	this.y = event.clientY;

		// 	const scrollContainer = this.element.closest(".scroll-container,.interface-navigable-region");

		// 	const onmousemove = event => {
		// 		this.x = event.clientX;
		// 		this.y = event.clientY;
		// 		this.event = event;
		// 		this.update();
		// 	}

		// 	const onscroll = event => {
		// 		if (event.target.contains(element)) {
		// 			this.update();
		// 		}
		// 	}

		// 	const onmouseup = event => {
		// 		this.event = event;
		// 		this.complete();
		// 		document.removeEventListener("mousemove", onmousemove);
		// 		document.removeEventListener("mouseup", onmouseup);
		// 		(scrollContainer || document).removeEventListener("scroll", onscroll);
		// 	}

		// 	document.addEventListener("mousemove", onmousemove);
		// 	document.addEventListener("mouseup", onmouseup);
		// 	(scrollContainer || document).addEventListener("scroll", onscroll);

		// 	this.init();

		// }

	}


	registerSelectZone(element) {

		element.classList.add("select-zone");

		element.onmousedown = event => {

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

	}

	trackTouch() { // (not used)

		this.element.ontouchstart = event => {

			this.event = event;
			this.x = event.touches[0].clientX;
			this.y = event.touches[0].clientY;

			const ontouchmove = event => {
				this.x = event.touches[0].clientX;
				this.y = event.touches[0].clientY;
				this.event = event;
				this.update();
			}

			const ontouchend = event => {
				this.isTouch = false;
				this.event = event;
				this.completeSelection();
				document.removeEventListener("touchmove", ontouchmove);
				document.removeEventListener("touchend", ontouchend);
			}

			document.addEventListener("touchmove", ontouchmove);
			document.addEventListener("touchend", ontouchend);

			this.init();

		}

	}

	onInit() { }
	onUpdate() { }
	onComplete() { }

	init() {

		this.diffX = 0;
		this.diffY = 0;

		this.lastX = this.x;
		this.lastY = this.y;

		this.index = this.findIndex(this.x, this.y);

		this.onInit();

		this.event.stopPropagation(); // not sure

	}

	update() {

		this.diffX = this.x - this.lastX;
		this.diffY = this.y - this.lastY;

		this.lastX = this.x;
		this.lastY = this.y;

		this.onUpdate();

	}

	complete() {

		this.onComplete();

	}

	findIndex(x = this.x, y = this.y) {

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

		return this.getElementsBox(...children);

	}

	toggleClassAt(className, bool, index, length = 1) {

		const elements = this.sliceElements(index, length);

		for (let element of elements) {

			element.classList.toggle(className, bool);

		}

	}

}
