
KarmaFieldsAlpha.field.blocks = class extends KarmaFieldsAlpha.field.container {


	getItems() {

		const values = this.getValue();

		if (values !== undefined) {

			const items = this.createItems(values);

			return items;

		}

	}


	createItems(values) {

		const items = [];

		for (let i = 0; i < values.length; i++) {

			const value = values[i];

			// const block = this.resource.footer.find(block => block.id === value.type);

			const block = this.resource.blocks && this.resource.blocks[value.type];

			if (block) {

				// const { media, fields, name } = block;
				const children = value.children && this.createItems(value.children) || [];
				const resource = { ...block, value, children, index: i };

				items.push(resource);

			}

		}

		return items;
	}

	*listSelectedBlocks(items = this.getItems()) {

		if (items) {

			const selection = this.getSelection();

			if (selection) {

				const { index = 0, length = 0 } = selection;

				for (let item of items) {

					if (item.index >= index && item.index < index + length) {

						yield item;

					}

					if (selection[item.index] && item.children) {

						yield* this.listSelectedBlocks(item.children);

					}

				}

			}

		}

	}

	getValue() {

		const value = super.getValue();

		if (value !== undefined) {

			return [{ children: value, type: "group" }];

		}

	}

	setValue(value, subkey) {

		if (subkey !== "children") {

			console.error("Base block should just set children value");

		}

		if (!value || !value[0] || !value[0][subkey]) {

			console.error("Wrong value format");

		}

		super.setValue(value[0][subkey]);

	}

	getBody() {

		const resource = this.getBlockResource("group");
		const values = this.getValue();

		if (values !== undefined) {

			const value = values[0];

			return new KarmaFieldsAlpha.field.block({ ...resource, index: 0, value }, "body", this);

		}

	}

	getBlockResource(type) {

		const library = this.resource.blocks || {};

		if (library[type]) {

			return library[type];

		}

		return library.group; // -> undefined block type

	}

	add(type, preset) {



		const body = this.getBody();

		if (body) {
			body.add(type, preset);
		}

	}

	getFocusPathInside() {

		let path = this.getFocusPath();

		if (path.length > this.path.length && this.path.every((id, index) => id === path[index])) {

			return path.slice(this.path.length);

		}

	}


	// newChild(id) {

	// 	if (id === "modal") {

	// 		if (this.resource.modal) {

	// 			return new KarmaFieldsAlpha.field.grid.modal(this.resource.modal, "modal", this);

	// 		}

	// 	} else if (id === "popup") {

	// 		// const selectedBlocks = this.listSelectedBlocks().toArray();
	// 		const pathInside = this.getFocusPathInside();

	// 		if (pathInside) {
	// 			const block = this.getChild(...pathInside);
	// 		}


	// 		return new KarmaFieldsAlpha.field.container({
	// 			type: "container",
	// 			body: {
	// 				type: "group",
	// 				children: [
	// 					{
	// 						type: "input",
	// 						key: "test",
	// 						label: "test"
	// 					}
	// 				]
	// 			}
	// 		}, "popup", this);

	// 	} else if (id === "root") {

	// 		const items = this.getItems();

	// 		if (items !== undefined) {

	// 			return new KarmaFieldsAlpha.field.block({ children: items }, "groupBlock", this);

	// 		}

	// 	}

	// }

	open() {

		// const popup = this.getChild("popup");

		// popup.setFocus(true);

	}


	// *buildRoot() {

	// 	const block = this.getChild("root");

	// 	if (block) {

	// 		yield {
	// 			// tag: "ul",
	// 			class: "karma-field-table-grid-container karma-field-frame karma-field-group final table-body-column table-body-main-column",
	// 			children: block.build()
	// 		};

	// 		yield* this.buildPopup();

	// 	}

	// }


	// *buildBody() {

	// 	yield {
	// 		class: "table-body",
	// 		children: this.buildRoot()
	// 	};

	// }

}



KarmaFieldsAlpha.field.block = class extends KarmaFieldsAlpha.field.sortable {

	getIndex() {

		return this.resource.index;

	}

	getValue(key) {

		const values = this.parent.getValue("children");

		if (values === undefined) {

			return;

		}

		const object = values[this.resource.index] || {};

		let value = object[key] || [];

		if (!Array.isArray(value)) {

			value = [value];

		}

		return value;

	}

	setValue(value, key) {

		let parentValues = this.parent.getValue("children");

		if (parentValues === undefined) {

			console.error("setting value but value is not loaded");

		}

		// const object = parentValues[this.resource.index] || {};

		// if (key) {

		// 	object[key] = value;

		// }

		parentValues = [...parentValues];
		parentValues[this.resource.index] = { ...parentValues[this.resource.index], [key]: value }

		this.parent.setValue(parentValues, "children");

	}

	getValuesAt(index, length) {

		const values = this.getValue("children");

		if (values === undefined) {

			return;

		}

		return values.slice(index, index + length);

	}

	insertAt(values, index, length = 0) {

		let currentValues = this.getValue("children");

		if (values === undefined) {

			return;

		}

		const newValues = [...currentValues];

		if (index === undefined) {

			index = newValues.length;

		}

		newValues.splice(index, length, ...values);

		this.setValue(newValues, "children");

	}

	removeAt(index, length) {

		this.insertAt([], index, length);

	}

	// getSelection

	isSelected(index) {

		const selection = this.parent.isSelectedAt(this.index);

		if (selection && !selection.child) {

			return KarmaFieldsAlpha.Segment.contain(selection, index);

		}

		return false;

	}

	unselectDeep() {

		this.unselect();

		const children = this.getValue("children");

		if (children) {

			for (let i = 0; i < children.length; i++) {

				const child = this.getChild(i);

				child.unselectDeep();

			}

		}

	}

	add(type, preset = {}) {

		// const focus = this.hasFocus();
		// const selection = this.getSelection();



		// const path = this.getFocusPath() || [];

		// console.log(path);
		// return;

		// if (path.length) {

		// 	return this.getChild(...path.slice(1));

		// }

		let children = this.getValue("children");

		const child = this.getChildWithFocus();

		if (children === undefined) {

			console.error("Adding value while loading");

		}

		// const resource = this.getBlockResource(blockId);

		// const type = resource.blockType || blockId;

		if (child && type === "group") {

			// const child = this.getChild();
			// const index = selection.index;
			// const resource = this.getBlockResource("group");
			// const child = new KarmaFieldsAlpha.field.block({ ...resource, index, value }, index, this);

			child.add(type, preset);

		} else {

			console.log(preset);

			this.setValue([...children, { type, ...preset }], "children");

		}

	}

	swapAt(index, newIndex, length) {

		let children = this.getValue("children");

		if (!children) {

			console.error("Swaping items but value is not ready");

		}

		children = [...children];

		children.splice(newIndex, 0, ...children.splice(index, length));

		this.setValue(children, "children");

	}


	// getValue(key) {

	// 	const parentValues = this.parent.getValue();

	// 	if (parentValues === undefined) {
	// 		return;
	// 	}

	// 	const object = parentValues[this.id] || {};

	// 	return object[key] || [];

	// }

	getBlockResource(type) {

		// if (type === undefined) {

		// 	const value = this.getBlockValue();
		// 	type = value.type || "";

		// }

		return this.parent.getBlockResource(type);

	}

	newChild(index) {

		// const blockResource = this.getBlockResource();

		// if (!blockResource) {
		// 	return // loading
		// }

		if (index === "media") {

			if (this.resource.media) {

				return new KarmaFieldsAlpha.field.media({
					display: "thumb",
					caption: this.resource.name,
					...this.resource.media
				}, "media", this);

			}

		} else if (index === "dialog") {

			if (this.resource.dialog) {

				return new KarmaFieldsAlpha.field.block.dialog(this.resource.dialog, "dialog", this);

			}

		} else {

			const values = this.getValue("children");

			if (values) {

				const value = values[index];

				if (value) {

					const blockResource = this.getBlockResource(value.type);

					return new KarmaFieldsAlpha.field.block({ ...blockResource, index, value }, index, this);

				}

			}



		}

	}

	*buildChildren() {

		const children = this.getValue("children");

		// if (this.resource.value.children) {
		if (children) {

			// const selecting = this.getData("selecting");
			// const draggable = this.getData("draggable");
			//

			// for (let i = 0; i < this.resource.value.children.length; i++) {
			for (let i = 0; i < children.length; i++) {

				const block = this.getChild(i);

				if (block) {

					// console.log(this.isSelectedAt(i), this.hasFocus());

					yield {
						tag: "li",
						class: "frame block-field-item",
						children: block.build(),
						update: element => {

							const selected = this.isSelectedAt(i);
							element.classList.toggle("draggable", selected && !KarmaFieldsAlpha.Tracker.selecting);
							element.classList.toggle("selected", selected);
							element.classList.toggle("focus", this.hasFocus());
							element.ondblclick = event => {
								this.save("open");
								this.open();
								this.render();
							}
						}
					};

				}

			}

		}



		// const item = this.getValue();

		// for (let i = 0; i < item.children.length; i++) {

		// 	const child = item.children[i];

		// 	const resource = this.resource.footer.find(block => block.id === child.type);

		// 	const block = new KarmaFieldsAlpha.field.block({
		// 		children: child.children,
		// 		...resource
		// 	}, i, this);

		// 	yield {
		// 		tag: "li",
		// 		children: block.build()
		// 	};

		// }

	}

	*buildMedia() {

		const mediaField = this.getChild("media");

		if (mediaField) {

			yield* mediaField.build();

		}

	}

	*buildDialog() {

		const dialog = this.getChild("dialog");
		const hasFocus = dialog.hasFocusInside();
		const selection = this.getSelection() || {};

		if (hasFocus && selection.length) {

			yield {
				class: "dialog",
				update: element => {
					element.onmousedown = event => {
						event.stopPropagation();
						dialog.setFocus(true);
						dialog.render();
					}
				},
				children: dialog.build("dialog")
			};

		}

	}

	*buildChildrenContainer() {

		const types = this.getSingleValue("type");

		// console.log(types);

		// if (this.resource.value.type === "group") {
		if (types === "group") {

			yield {
				tag: "ul",
				class: "block-field-children",
				children: this.buildChildren(),
				update: element => {

					element.classList.toggle("horizontal", this.getDirection() === "horizontal");

					// KarmaFieldsAlpha.Tracker.register(element, this, 0, 1);

					element.onmousedown = event => {
						KarmaFieldsAlpha.Tracker.trackMouse(element, event, this);
						// const tracker = new KarmaFieldsAlpha.Tracker(element, event);

						// if (event.button === 0 && !this.isTouch) {
						// 	this.trackMouse(event);
						// }
					}

					element.ontouchstart = event => {
						KarmaFieldsAlpha.Tracker.trackTouch(element, event);
						// this.isTouch = true;
						// this.trackTouch(event);
					}

					// const selection = this.getSelection();
					// KarmaFieldsAlpha.Tracker.register({
					// 	element,
					// 	selection,
					// 	onDragStart: () => {
					// 		this.setData(true, "dragging");
					// 		this.render();
					// 	},
					// 	onDrag: (index, length) => {
					// 		this.save("reorder");
					// 		this.swapAt(selection.index, index, selection.length);
					// 		this.setSelection({ index, length });
					// 		this.render();
					// 	},
					// 	onSelectStart: () => {
					// 		this.setData(true, "selecting");
					// 		this.setSelection(tie);
					// 		this.render();
					// 	},
					// 	onSelect: (index, length) => {
					// 		this.setSelection({ index, length });
					// 		this.render();
					// 	},
					// });


					// const tracker = new KarmaFieldsAlpha.Tracker(element, 0, 1);

					// tracker.oninit = () => {
					// 	const selection = this.getSelection();
					// 	if (tracker.index > -1 && selection && tracker.index >= selection.index && tracker.index < selection.index + selection.length) {
					// 		this.setData(true, "dragging");
					// 		tracker.startDrag(selection.index, selection.length);
					// 	} else {
					// 		const tie = tracker.startSelect(selection.index, selection.length);
					// 		this.setData(true, "selecting");
					// 		this.setSelection(tie);
					// 	}
					// 	this.render();
					// }

					// tracker.onupdate = () => {
					// 	const selection = this.getSelection();
					// 	if (tracker.dragging) {
					// 		const { index, length } = tracker.drag(selection.index, selection.length);
					// 		if (index !== selection.index) {
					// 			this.save("reorder");
					// 			this.swapAt(selection.index, index, selection.length);
					// 			this.setSelection({ index, length });
					// 			this.render();
					// 		}
					// 	} else {
					// 		const { index, length } = tracker.growSelect(selection.index, selection.length);
					// 		if (!selection || index !== selection.index || length !== selection.length) {
					// 			this.setSelection({ index, length });
					// 			this.render();
					// 		}
					// 	}
					// }

					// tracker.oncomplete = () => {
					// 	this.setData(false, "selecting");
					// 	this.setData(false, "dragging");
					// 	const selection = this.getSelection();
					// 	if (selection && selection.length) {
					// 		tracker.dragEnd(selection.index, selection.length);
					// 		if (selection.length === 1) {
					// 			const child = this.getChild(selection.index);
					// 			child.setFocus(true);
					// 		} else {
					// 			this.setFocus(true);
					// 		}
					// 		this.render();
					// 	}
					// }





						// const selection = this.hasFocus() && this.getSelection();
						// const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

						// sorter.onSelect = elements => {
						// 	elements.map(element => element.classList.add("selected"));
						// 	this.setSelection(sorter.state.selection);
						// }

						// sorter.onUnselect = elements => {
						// 	elements.map(element => element.classList.remove("selected"));
						// }

						// sorter.onSelectionComplete = () => {
						// 	this.setFocus(true);
						// 	const selection = this.getSelection();
						// 	if (!selection.length) {
						// 		this.parent.setSelection({
						// 			index: this.resource.index,
						// 			length: 1
						// 		});
						// 		this.parent.setFocus(true);
						// 	}
						// 	this.render();
						// }

						// sorter.onSwap = (newState, lastState) => {
						// 	this.save("reorder");
						// 	this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
						// 	this.setSelection(newState.selection);
						// };

						// sorter.onSort = (newSelection, lastSelection) => {
						// 	if (!KarmaFieldsAlpha.Collection.equal(newSelection, lastSelection)) {
						// 		this.setFocus(true);
						// 		this.render();
						// 	}
						// }

				}
			};

		}

	}

	*build() {

		yield {
			class: "media",
			children: this.buildMedia(),
			// update: element => {
			// 	element.classList.toggle("hidden", !this.resource.media);
			// }
		};

		yield {
			class: "block-children-container",
			children: this.buildChildrenContainer()
		};

		yield {
			class: "dialog-container",
			children: this.buildDialog()
		};



	}

	getDirection() {

		return this.getSingleValue("mode") || "vertical";

	}


	drag(tracker) { // -> called by Tracker

		return false
			|| tracker.swapToChildBefore()
			|| tracker.swapToChildAfter()

		 	|| tracker.swapAbove()
			|| tracker.swapBelow()

			|| tracker.swapToParentBefore()
			|| tracker.swapToParentAfter();

		// tracker.swapAbove() || tracker.swapBelow() || tracker.swapToChild();



		// if (tracker.reorder()) {

		// 	return;

		// }

		// const selection = this.getSelection();

		// const containerBox = tracker.element.getBoundingClientRect();

		// for (let [element, zone] of tracker.zones) {

		// 	if (zone.field.parent === this) {

		// 		const box = element.getBoundingClientRect();

		// 		if (tracker.isDraggingIn(box)) {

		// 			for (let element of tracker.elements) {

		// 				element.style.transform = "translate(0, 0)";

		// 			}

		// 			this.save("reorder");

		// 			const values = this.getValuesAt(selection.index, selection.length);

		// 			this.unselect();

		// 			const newSelection = { index: 0, length: selection.length };
		// 			zone.field.insertAt(values, 0);

		// 			this.removeAt(selection.index, selection.length);

		// 			zone.field.setSelection(newSelection);

		// 			tracker.element = element;

		// 			tracker.insertBefore(tracker.elements, element.firstElementChild);
		// 			tracker.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");
		// 			tracker.dragOrigin = tracker.getElementsBox(tracker.elements);

		// 			tracker.tx = tracker.x - tracker.dragOrigin.x - tracker.dragOffset.x;
		// 			tracker.ty = tracker.y - tracker.dragOrigin.y - tracker.dragOffset.y;

		// 			this.render();

		// 			return true;

		// 		}

		// 	}

		// }



		// if (tracker.isDraggingOut(containerBox)) {

		// 	for (let [element, zone] of tracker.zones) {

		// 		if (zone.field === this.parent) {

		// 			// debugger;

		// 			for (let element of tracker.elements) {

		// 				element.style.transform = "translate(0, 0)";

		// 			}

		// 			this.save("reorder");

		// 			const values = this.getValuesAt(selection.index, selection.length);


		// 			this.removeAt(selection.index, selection.length);
		// 			zone.field.insertAt(values, 0);

		// 			this.unselect();
		// 			const newSelection = { index: 0, length: selection.length };
		// 			zone.field.setSelection(newSelection);

		// 			tracker.element = element;
		// 			tracker.insertBefore(tracker.elements, element.firstElementChild);
		// 			tracker.scrollContainer = element.closest(".scroll-container,.interface-navigable-region");
		// 			tracker.dragOrigin = tracker.getElementsBox(tracker.elements);

		// 			tracker.tx = tracker.x - tracker.dragOrigin.x - tracker.dragOffset.x;
		// 			tracker.ty = tracker.y - tracker.dragOrigin.y - tracker.dragOffset.y;

		// 			this.render();

		// 			return true;

		// 		}

		// 	}

		// }

	}

	getChildContainer(element, index) {

		const child = [...element.children][index];

		return child && child.querySelector(".block-field-children");

	}

	getParentContainer(element) {

		if (this.parent instanceof KarmaFieldsAlpha.field.block) {

			const item = element.closest(".block-field-item");

			return item && item.parentNode;

		}

	}

}

KarmaFieldsAlpha.field.block.dialog = class extends KarmaFieldsAlpha.field {

	getValue(key) {

		return this.parent.getSelectedValue(key);

	}

	setValue(value, key) {

		this.parent.setSelectedValue(value, key);

	}

	newChild(id) {

		return this.createChild(this.resource, id);

	}


	close() {

		super.close();

	}

	*build() {

		const content = this.getChild("content");

		yield* content.build("dialog");

	}

}
