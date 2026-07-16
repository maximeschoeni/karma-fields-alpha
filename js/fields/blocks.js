
KarmaFieldsAlpha.field.blocks = class extends KarmaFieldsAlpha.field.container {

	getValue() {

		let value = super.getValue();

		if (value !== undefined) {

			if (value.length === 1 && typeof value[0] === "string") {

				value = JSON.parse(value[0]);

			}



		}

		return value;
	}

	insertAt(array, index, length = 0) {

		this.setValue(array[0].children);

	}

	getBody() {

		const values = this.getValue();

		if (values !== undefined) {

			return new KarmaFieldsAlpha.field.block({
				index: 0,
				group: true,
				orientation: this.resource.orientation || "column",
				value: { children: values },
				header: false,
				scrollContainer: this.resource.scrollContainer
			}, "body", this);

		}

	}

	getBlockResource(type) {

		const library = this.resource.blocks || {};

		if (library[type]) {

			return library[type];

		}

		return library[this.resource.defaultBlock || "group"]; // -> undefined block type

	}

	add(type, preset) {

		let child = this.getDescendantWithFocus() || this.getBody();

		if (child) {

			const resource = this.getBlockResource(type);
			child.setFocus(true);
			child.add(type, { ...resource.preset, ...preset });

		}

	}

	remove() {

		let child = this.getDescendantWithFocus();

		if (child) {

			child.remove();

		}

	}

	canAdd(type) {

		let child = this.getDescendantWithFocus() || this.getBody();

		if (child) {

			return !child.resource.available || child.resource.available.includes(type);

		}

		return false;

	}

	hasSelection() {

		let child = this.getDescendantWithFocus() || this.getBody();

		if (child) {

			return child.hasSelection();

		}

		return false;
	}

	open() {

		let child = this.getDescendantWithFocus() || this.getBody();

		if (child) {

			return child.open();

		}

	}

	unselectAncestors() {}

	unselectBlocks() {

		const body = this.getChild("body");

		body.unselectChildren();

	}

	getFooter() {

		const footer = new KarmaFieldsAlpha.field.blocks.footer({
			...this.resource.footer,
			offsetContainer: true
		}, "footer", this);

		return footer;

	}

	// *build() {

	// 	// yield* this.buildHeader();
	// 	yield* this.buildBody();
	// 	// yield* this.buildFooter();
	// }

	// *buildBody(context) {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		yield {
	// 			class: "container-body",
	// 			children: body.build()
	// 		};

	// 	}

	// }

}



KarmaFieldsAlpha.field.block = class extends KarmaFieldsAlpha.field {

	getIndex() {

		return this.resource.index;

	}

	getChildren() {

		return this.getValue(this.resource.childrenKey || "children");

		// return this.resource.value[this.resource.childrenKey || "children"] || [];

	}

	setChildren(values) {

		this.setValue(values, this.resource.childrenKey || "children");

	}

	getValue(key) {



		// const values = this.parent.getValue("children");
		// const values = this.parent.getChildren();

		// if (values === undefined) {

		// 	return;

		// }

		if (!this.resource.value) {

			console.error("value not set in block resource");

		}

		let value = this.resource.value[key] || [];

		if (!Array.isArray(value)) {

			value = [value];

		}

		return value;

	}

	formatValue(value, key) {

		if (this.resource.properties) {

			const format = this.resource.properties[key];

			if (format === "string") {

				return (value[0] || "").toString();

			} else if (format === "number") {

				return Number(value[0] || 0);

			} else if (format === "boolean") {

				return value[0] ? true : false;

			}

		}

		return value;

	}

	setValue(value, key) {

		// const values = this.parent.getValue("children");
		//


		// const format = this.resource.properties && this.resource.properties[key] || "array";

		// if (format === "string") {

		// 	value = (value[0] || "").toString();

		// } else if (format === "number") {

		// 	value = Number(value[0] || 0);

		// } else if (format === "boolean") {

		// 	value = value[0] ? true : false;

		// }

		value = this.formatValue(value, key);


		// let children = this.parent.getChildren();

		// children = [...children];

		// children.splice(this.resource.index, 1, { ...this.resource.value, [key]: value });

		// this.parent.setChildren(children);

		this.resource.value = { ...this.resource.value, [key]: value };

		this.parent.insertAt([this.resource.value], this.resource.index, 1);

	}

	getSelectedValue(key) {

		const selection = this.getSelection();

		let value;

		if (selection?.length) {

			for (let i = 0; i < selection.length; i++) {

				const child = this.getChild(i + selection.index);

				if (child) {

					const childValue = child.getValue(key);

					if (value === undefined) {

						value = childValue;

					} else if (!KarmaFieldsAlpha.DeepObject.equal(value, childValue)) {

						return [];

					}

				}

			}

		}

		return value;

	}

	setSelectedValue(value, key) {

		const selection = this.getSelection();

		if (selection?.length) {

			for (let i = 0; i < selection.length; i++) {

				const child = this.getChild(i + selection.index);

				if (child) {

					child.setValue(value, key);

				}

			}

		}

	}

	*listChildren() {

		// const values = this.geValue("children");
		const values = this.getChildren();

		if (values) {

			for (let index = 0; index < values.length; index++) {

				const value = values[index];
				const blockResource = this.getBlockResource(value.type);

				yield new KarmaFieldsAlpha.field.block({ ...blockResource, index, value }, index, this);


			}

		}


	}

	getValuesAt(index, length) {

		const values = this.getChildren();

		if (values === undefined) {

			return;

		}

		return values.slice(index, index + length);

	}

	insertAt(values, index, length = 0) {

		let children = this.getChildren();

		children = [...children];

		if (index === undefined) {

			index = children.length;

		}

		children.splice(index, length, ...values);

		this.setChildren(children);

	}

	removeAt(index, length) {

		this.insertAt([], index, length);

	}

	remove() {

		const { index = 0, length = 0} = this.getSelection();

		if (length) {

			this.removeAt(index, length);

		}

	}

	open() { // trigger by [+] button or by [space] bar

		if (this.isGroup()) {

			const selection = this.getSelection();

			if (selection?.length === 1) {

				const dialog = this.getChild("dialog");

				dialog?.setFocus(true);

			}

		} else {

			this.parent.setSelection({ index: this.getIndex(), length: 1 });
			this.parent.open();

		}



	}

	close() {

		this.setFocus();

	}


	isSelected(index) {

		const selection = this.parent.isSelectedAt(this.index);

		if (selection && !selection.child) {

			return KarmaFieldsAlpha.Segment.contain(selection, index);

		}

		return false;

	}

	unselectDeep() {

		this.unselectAncestors();

		this.unselectChildren();

	}

	unselectBlocks() {

		this.parent.unselectBlocks();

	}

	unselectChildren() {

		this.unselect();

		// const children = this.getValue("children");
		const children = this.getChildren();

		if (children) {

			for (let i = 0; i < children.length; i++) {

				const child = this.getChild(i);

				child.unselectChildren();

			}

		}

	}

	// unselectAncestors() {

	// 	this.unselect();

	// 	if (this.parent.unselectAncestors) {

	// 		this.parent.unselectAncestors();

	// 	}

	// }

	hasSelection() {

		const { length = 0 } = this.getSelection();

		return length > 0;

	}

	// hasSelectionInside() {

	// 	const selection = this.getSelection();

	// 	if (selection && selection.length) {

	// 		return true;

	// 	}

	// 	for (let child of this.listChildren()) {

	// 		if (child.hasSelectionInside()) {

	// 			return true;

	// 		}

	// 	}

	// 	return false;

	// }

	add(type, preset = {}) {


		// let children = this.getValue("children");
		let children = this.getChildren();

		// const child = this.getDescendantWithFocus();

		if (children === undefined) {

			console.error("Adding value while loading");

		}

		if (!this.canContain(type)) {

			return;

		}

		// if (child && type === "group") {

		// 	child.add(type, preset);

		// } else {

		// 	console.log(preset);

		// this.setValue([...children, { type, ...preset }], "children");
		this.setChildren([...children, { type, ...preset }]);

		// }

	}

	swapAt(index, newIndex, length) {

		// let children = this.getValue("children");
		let children = this.getChildren();

		if (!children) {

			console.error("Swaping items but value is not ready");

		}

		children = [...children];

		children.splice(newIndex, 0, ...children.splice(index, length));

		// this.setValue(children, "children");
		this.setChildren(children);

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

		} else if (index === "header") {

			if (this.resource.header !== false) {

				return new KarmaFieldsAlpha.field.container.header({
					type: "header",
					display: "flex",
					offsetContainer: true,
					children: [
						// {
						// 	type: "button",
						// 	dashicon: "move",
						// 	action: "move",
						// 	simplebuttons: true
						// },
						{
							type: "title",
						},
						// {
						// 	type: "button",
						// 	dashicon: "arrow-up",
						// 	action: "collapse",
						// 	simplebuttons: true
						// },
						{
							type: "open",
							// dashicon: "plus",
							action: "open"
						}
					],
					...this.resource.header
				}, "header", this);

			}



		} else if (index === "dialog") {

			const selection = this.getSelection();
			// const hasFocus = this.hasFocusInside();

			if (selection && selection.length === 1) {

				const child = this.getChild(selection.index);

				if (child.resource.dialog) {

					// return new KarmaFieldsAlpha.field.dialog({
					// 	content: {
					// 		type: "container",
					// 		header: {
					// 			children: [
					// 				{type: "title"},
					// 				{type: "close"}
					// 			]
					// 		},
					// 		...child.resource.dialog
					// 	}
					// }, "dialog", this);

					return new KarmaFieldsAlpha.field.dialog(child.resource.dialog, "dialog", this);

				}

			}

		} else {

			// const values = this.getValue("children");
			const values = this.getChildren();
			if (values) {

				const value = values[index];

				if (value) {

					const blockType = value.type;
					const blockResource = this.getBlockResource(blockType);

					return new KarmaFieldsAlpha.field.block({ ...blockResource, index, value, blockType }, index, this);

				}

			}



		}

	}

	// getSibling(index) {

	// 	return this.parent.getChild(index);

	// }

	isGroup() {

		return this.resource.group === true;

	}

	isAvailableIn(block) {

		return !block.resource.available || block.resource.available.includes(this.resource.blockType);

	}

	canContain(type) {

		return !this.resource.available || block.resource.available.includes(type);

	}

	canContainField(...fields) {

		return fields.every(field => this.canContain(field.getBlockType()));

	}

	getBlockType() {

		return this.resource.blockType;

	}

	*buildChildren() {

		const children = this.getChildren();

		if (children) {

			for (let i = 0; i < children.length; i++) {

				const block = this.getChild(i);

				if (block) {

					yield {
						// tag: "li",
						class: `frame block-field-item block-field-${block.getBlockType()}`,
						children: block.build(),
						update: element => {

							const selected = this.isSelectedAt(i);
							element.classList.toggle("draggable", selected && !KarmaFieldsAlpha.Tracker.selecting);
							element.classList.toggle("selected", selected);
							element.classList.toggle("focus", this.hasFocus());
							element.ondblclick = event => {
								this.save("open");
								block.open();
								this.render();
							}
						}
					};

				}

			}

		}

	}

	// *build2() {

	// 	yield {
	// 		tag: "li",
	// 		class: `frame block-field-item block-field-${block.getBlockType()}`,
	// 		children: [
	// 			{
	// 				class: "block-field-header header-content",
	// 				children: this.buildHeader()
	// 			},
	// 			{
	// 				class: "block-field-body",
	// 				children: this.buildBody()
	// 			},
	// 			{
	// 				class: "block-field-footer container-footer",
	// 				children: this.buildFooter()
	// 			},
	// 			{
	// 				class: "dialog-container",
	// 				children: this.buildDialog()
	// 			}
	// 		],
	// 		update: element => {

	// 			const selected = this.isSelectedAt(i);
	// 			element.classList.toggle("draggable", selected && !KarmaFieldsAlpha.Tracker.selecting);
	// 			element.classList.toggle("selected", selected);
	// 			element.classList.toggle("focus", this.hasFocus());
	// 			element.ondblclick = event => {
	// 				this.save("open");
	// 				block.open();
	// 				this.render();
	// 			}
	// 		}
	// 	};

	// }

	*buildMedia() {

		const mediaField = this.getChild("media");

		if (mediaField) {

			yield* mediaField.build();

		}

	}

	*buildDialog() {

		const dialog = this.getChild("dialog");

		if (dialog) {

			const hasFocus = dialog.hasFocusInside();
			const selection = this.getSelection();

			if (hasFocus && selection && selection.length) {

				// yield* dialog.build();
				yield* dialog.buildChild();

			}

		}

	}

	*buildToolbox() {

		const dialog = this.getChild("dialog");

		if (dialog) {


			const hasFocus = dialog.hasFocusInside();
			const rectangle = this.getData("rectangle");

			// console.log(hasFocus, selection);

			if (hasFocus && rectangle) {

				// yield* dialog.build();
				// yield* dialog.buildChild();

				yield {
					class: "toolbox dark",
					init: element => {
						if (dialog.resource.width) {
							element.style.maxWidth = dialog.resource.width;
						}
					},
					update: element => {
						const dialogBox = element.getBoundingClientRect();

						const offset = 10;
						let x, y;

						element.classList.remove("top", "bottom", "left", "right", "align-top", "align-bottom", "align-left", "align-right");

						if (dialog.resource.position === "bottom" || dialog.resource.position === "top") {

							if (dialog.resource.position === "top") {

								y = rectangle.y - dialogBox.height - offset;
								element.classList.add("top");

							} else {

								y = rectangle.y + rectangle.height + offset;
								element.classList.add("bottom");

							}

							if (dialog.resource.align === "right") {

								x = rectangle.x + rectangle.width - dialogBox.width;
								element.classList.add("align-right");

							} else {

								x = rectangle.x;
								element.classList.add("align-left");

							}

						} else {

							if (dialog.resource.position === "left") {

								x = rectangle.x - dialogBox.width - offset;
								element.classList.add("left");

							} else {

								x = rectangle.x + rectangle.width + offset;
								element.classList.add("right");

							}

							if (dialog.resource.align === "bottom") {

								y = rectangle.y + rectangle.height - dialogBox.height;
								element.classList.add("align-bottom");

							} else {

								y = rectangle.y;
								element.classList.add("align-top");

							}

						}

						element.style.left = `${x}px`;
						element.style.top = `${y}px`;

						element.onmousedown = event => {
							event.stopPropagation();
							dialog.setFocus(true);
							this.render();
						}
					},
					children: dialog.build2() // dialog.build is used for old system

				};

			}

		}

	}

	*buildChildrenContainer() {

		if (this.isGroup()) {

			// yield {
			// 	class: "content-frame",
			// 	children: [

					yield {
						// tag: "ul",
						class: "block-field-children group-field",
						children: this.buildChildren(),
						update: element => {

							this.element = element;

							element.classList.toggle("row", this.getOrientation() === "row");

							// KarmaFieldsAlpha.Tracker.register(element, this, 0, 1);

							element.onmousedown = event => {
								KarmaFieldsAlpha.Tracker.trackMouse(element, event, this);
							}

							element.ontouchstart = event => {
								KarmaFieldsAlpha.Tracker.trackTouch(element, event);
							}

							const selection = this.getSelection();

							if (selection && selection.length) {

								const children = [...element.children];

								if (children.length) {

									const elements = children.slice(selection.index, selection.index + selection.length);
									const containerRectangle = KarmaFieldsAlpha.Rectangle.fromElement(this.element);
									const rectangle = KarmaFieldsAlpha.Rectangle.fromElement(...elements).offset(-containerRectangle.x, -containerRectangle.y).toObject();

									this.setData(rectangle, "rectangle");

								}

							}


						}
					};
					// ...this.buildToolbox()
					// // {
					// 	// class: "dialog-container",
					// 	// // update: element => {
					// 	// // 	const selection = this.getSelection();
					// 	// // 	if (selection && selection.length) {
					// 	// // 		const children = [...element.previousElementSibling.children];
					// 	// // 		const selectedElements = children.slice(selection.index, selection.index + selection.length);
					// 	// // 		const box = KarmaFieldsAlpha.Tracker.getElementsBox(selectedElements);
					// 	// // 		console.log(box, element, element.firstElementChild);
					// 	// // 	}
					// 	// // },
					// 	// // child: {
					// 	// // 	class: "dialog-box",
					// 	// // 	update: element => {
					// 	// // 		const selection = this.getSelection();
					// 	// // 		if (selection && selection.length) {
					// 	// // 			const children = [...element.parentNode.previousElementSibling.children];
					// 	// // 			const selectedElements = children.slice(selection.index, selection.index + selection.length);
					// 	// // 			const box = KarmaFieldsAlpha.Tracker.getElementsBox(selectedElements);
					// 	// // 			console.log(box, element, element.firstElementChild);
					// 	// // 		}
					// 	// // 	},
					// 	// // 	children: this.buildDialog()
					// 	// // },
					// 	// child: {
					// 		class: "toolbox",
					// 		init: element => {
					// 			if (this.resource.dialog) {
					// 				if (this.resource.dialog.width) {
					// 					element.style.maxWidth = this.resource.dialog.width;
					// 				}
					// 				if (this.resource.dialog.mode === "toolbox") {
					// 					element.classList.add("toolbox");
					// 					element.classList.add("dark");
					// 				}
					// 			}
					// 		},
					// 		update: element => {
					// 			const selection = this.getSelection();
					// 			const focus = this.hasFocusInside();

					// 			if (focus && selection && selection.length) {
					// 				const children = [...element.previousElementSibling.children];
					// 				const selectedElements = children.slice(selection.index, selection.index + selection.length);
					// 				const targetBox = KarmaFieldsAlpha.Tracker.getElementsBox(selectedElements);

					// 				const box = element.getBoundingClientRect();
					// 				const offset = 10;

					// 				// -> to right
					// 				const x = targetBox.x + targetBox.width + offset;
					// 				const y = targetBox.y;
					// 				element.style.left = `${x}px`;
					// 				element.style.top = `${y}px`;
					// 			}
					// 			element.onmousedown = event => {
					// 				event.stopPropagation();
					// 				this.setFocus(true);
					// 				this.render();
					// 			}
					// 		},
					// 		children: this.buildDialog()

					// }

			// 	]
			// };

			yield* this.buildToolbox();


			// yield {
			// 	class: "dialog-container",
			// 	children: this.buildDialog()
			// 	// children: dialog?.build()
			// };

		}

	}

	*build() {

		const header = this.getChild("header");

		yield {
			class: "container-header",
			children: header?.build()
		};


		yield {
			class: "container-body",

			child: {
				class: "content-frame block-content-frame",
				children: this.buildBody()
			},

			init: element => {
				if (this.resource.scrollContainer) {
					element.classList.add("scroll-container");
				}
			}
		};

	}

	*buildBody() {

		// yield* this.buildChildrenContainer();

		yield {
			class: "block-children-container",
			children: this.buildChildrenContainer()
		};

		yield {
			class: "block-field-content",
			children: this.buildBlockContent()
		};



	}

	*buildBlockContent() {

		if (this.resource.content) {

			const group = this.createChild({
				type: "group",
				...this.resource.content,
				offsetContainer: true
			}, "content");

			yield* group.build("frame");

		}

	}

	// getHeader() {

	// 	if (this.resource.header !== false) {

	// 		return this.createChild({
	// 			type: "header",
	// 			display: "flex",
	// 			children: [
	// 				// {
	// 				// 	type: "button",
	// 				// 	dashicon: "move",
	// 				// 	action: "move",
	// 				// 	simplebuttons: true
	// 				// },
	// 				{
	// 					type: "title",
	// 					content: this.resource.name
	// 				},
	// 				// {
	// 				// 	type: "button",
	// 				// 	dashicon: "arrow-up",
	// 				// 	action: "collapse",
	// 				// 	simplebuttons: true
	// 				// },
	// 				{
	// 					type: "button",
	// 					dashicon: "plus",
	// 					action: "open",
	// 					simplebuttons: true
	// 				}
	// 			],
	// 			...this.resource.header
	// 		}, "header");

	// 	}



	// }

	// *buildHeader() {

	// 	if (this.resource.header !== false) {

	// 		const header = this.getHeader();

	// 		yield* header.build();

	// 	}

	// }

	// *buildFooter() {

	// 	if (this.resource.footer) {

	// 		const footer = this.createChild({
	// 			type: "footer",
	// 			display: "flex",
	// 			...this.resource.footer
	// 		}, "header");

	// 		yield {
	// 			class: "footer-content",
	// 			children: footer.build()
	// 			// update: element => {
	// 			// 	const loading = KarmaFieldsAlpha.Store.hasDownload() || KarmaFieldsAlpha.Store.hasUpload();
	// 			// 	element.classList.toggle("loading", loading);
	// 			// }
	// 		};


	// 	}

	// }



	getOrientation() {

		return this.resource.orientation || "column";

		// return this.getSingleValue("orientation") || "column";

	}


	drag(tracker) { // -> called by Tracker

		return false
			|| tracker.swapAbove()
			|| tracker.swapBelow()

			|| tracker.swapToChildBefore()
			|| tracker.swapToChildAfter()

			|| tracker.swapToParentBefore()
			|| tracker.swapToParentAfter();

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

	*listSelectedChildren() {

		const selection = this.getSelection();

		if (selection) {

			for (let i = 0; i < selection.length; i++) {

				yield this.getChild(selection.index + i);

			}

		}

	}

	getBox() {

		const selection = this.getSelection();

		if (this.element && selection && selection.length) {

			const children = [...this.element.children];

			const parentBox = this.element.getBoundingClientRect();

			const box = children[selection.index].getBoundingClientRect();

			if (selection.length > 1) {

				const box2 = children[selection.index + children.length - 1].getBoundingClientRect();

				return {
					x: box.x - parentBox.x,
					y: box.y - parentBox.y,
					width: box2.x + box2.width - box.x,
					height: box2.y + box2.height - box.y
				};

			} else {

				return {
					x: box.x - parentBox.x,
					y: box.y - parentBox.y,
					width: box.width,
					height: box.height
				};

			}

		}

	}

	// getBox() {

	// 	const children = [...this.listSelectedChildren()];

	// 	console.log("getBox", children);

	// 	if (children.length) {

	// 		const first = children[0];

	// 		console.log(first, first.element);

	// 		if (first.element) {

	// 			const box = first.element.getBoundingClientRect();

	// 			if (children.length > 1) {

	// 				const last = children[children.length - 1];

	// 				if (last) {

	// 					const box2 = last.element.getBoundingClientRect();

	// 					return {
	// 						x: box.x,
	// 						y: box.y,
	// 						width: box2.x + box2.width - box.x,
	// 						height: box2.y + box2.height - box.y
	// 					};

	// 				}

	// 			}

	// 			return box;

	// 		}

	// 	}

	// }

	// *listSelectedElements() {

	// 	for (let child of this.listSelectedChildren()) {

	// 		yield child.element;

	// 	}

	// }

}

// KarmaFieldsAlpha.field.block.dialog = class extends KarmaFieldsAlpha.field {

// 	constructor(resource, id, parent) {

// 		super({

// 			...resource
// 		}, id, parent);

// 		'dialog' => [
// 			'type' => 'container',
// 			'width' => '60rem',
// 			'header' => [
// 				'children' => [
// 					[
// 						'type' => 'title',
// 						'content' => 'Block Input'
// 					],
// 					[
// 						'type' => 'close',
// 						'simplebuttons' => true
// 					]
// 				]
// 			],
// 			'body' => [
// 				'type' => 'group',
// 				'children' => [
// 					[
// 						'type' => 'input',
// 						'key' => 'key',
// 						'label' => 'Key'
// 					],
// 					[
// 					'type' => 'input',
// 					'key' => 'label',
// 					'label' => 'Label'
// 					]
// 				]
// 			]
// 		]

// 	}

// 	getValue(key) {

// 		return this.parent.getValue(key);

// 	}

// 	setValue(value, key) {

// 		this.parent.setValue(value, key);

// 	}

// 	newChild(id) {

// 		return this.createChild(this.resource, id);

// 	}


// 	close() {

// 		super.close();

// 	}

// 	*build() {

// 		const content = this.getChild("content");

// 		yield* content.build("dialog");

// 	}

// }


// KarmaFieldsAlpha.field.block.dialog = class extends KarmaFieldsAlpha.field.dialog {

// 	constructor(resource, id, parent) {

// 		super({
// 			width: "60rem",
// 			header: {
// 				children: [
// 					{
// 						type: "title",
// 						content: `Block ${parent.resource.name || ""}`
// 					},
// 					{
// 						type: "close",
// 						simplebuttons: true
// 					}
// 				]
// 			},
// 			// body: {
// 			// 	type: "group",
// 			// 	children: [
// 			// 		{
// 			// 			type: "input",
// 			// 			key: "key",
// 			// 			label: "Key"
// 			// 		},
// 			// 		{
// 			// 			type: "input",
// 			// 			key: "label",
// 			// 			label: "Label"
// 			// 		}
// 			// 	]
// 			// },
// 			...resource
// 		}, id, parent);

// 	}

// }

KarmaFieldsAlpha.field.blocks.footer = class extends KarmaFieldsAlpha.field.container.footer {

	createChild(resource, id) {

		if (typeof resource === "string") {

			const blockResource = this.request("getBlockResource", resource);

			if (blockResource) {

				const child = new KarmaFieldsAlpha.field.blocks.addBlock({
					text: blockResource.name || resource,
					blockType: resource
				}, id, this);

				return child;

			}

		}

		return super.createChild(resource, id);

	}

}

KarmaFieldsAlpha.field.blocks.addBlock = class extends KarmaFieldsAlpha.field.button {

	// constructor(resource, id, parent) {
	// 	super({
	// 		action: "add",
	// 		title: "Add",
	// 		text: ,
	// 		save: "add block",
	// 	}, id, parent);
	// }

	click() {

		this.save("add block");
		this.request("add", this.resource.blockType);
		this.render();

	}

}
