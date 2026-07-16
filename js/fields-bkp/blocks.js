
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
				header: false
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

		const footer = new KarmaFieldsAlpha.field.blocks.footer(this.resource.footer, "footer", this);

		return footer;

	}

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

			const { index, length } = this.getSelection();

			if (length === 1) {

				const child = this.getChild(index);

				child.open();

				return;

			} else if (length > 1) {

				return;

			}

		}

		const dialog = this.getChild("dialog");

		dialog.setFocus(true);

	}

	close() {

		this.parent.setFocus();

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

		} else if (index === "dialog") {

			if (this.resource.dialog) {

				return new KarmaFieldsAlpha.field.block.dialog(this.resource.dialog, "dialog", this);

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

		// const children = this.getValue("children");
		const children = this.getChildren();

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

	*build2() {

		yield {
			tag: "li",
			class: `frame block-field-item block-field-${block.getBlockType()}`,
			children: [
				{
					class: "block-field-header header-content",
					children: this.buildHeader()
				},
				{
					class: "block-field-body",
					children: this.buildBody()
				},
				{
					class: "block-field-footer container-footer",
					children: this.buildFooter()
				},
				{
					class: "dialog-container",
					children: this.buildDialog()
				}
			],
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

	*buildMedia() {

		const mediaField = this.getChild("media");

		if (mediaField) {

			yield* mediaField.build();

		}

	}

	*buildDialog() {

		if (this.resource.dialog) {

			const dialog = this.getChild("dialog");

			if (dialog) {

				const hasFocus = dialog.hasFocusInside();

				if (hasFocus) {



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

		}



	}

	*buildChildrenContainer() {

			if (this.isGroup()) {

			yield {
				tag: "ul",
				class: "block-field-children",
				children: this.buildChildren(),
				update: element => {

					element.classList.toggle("row", this.getOrientation() === "row");

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

				}
			};

		}

	}

	*build() {

		yield {
			class: "block-field-header header-content",
			children: this.buildHeader()
		}

		yield {
			class: "block-field-body",
			children: this.buildBody()
		}

		yield {
			class: "block-field-footer container-footer",
			children: this.buildFooter()
		}

		yield {
			class: "dialog-container",
			children: this.buildDialog()
		};

	}

	*buildBody() {

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

			const group = this.createChild({ type: "group", ...this.resource.content }, "content");

			yield* group.build("frame");

		}

	}

	getHeader() {

		if (this.resource.header !== false) {

			return this.createChild({
				type: "header",
				display: "flex",
				children: [
					// {
					// 	type: "button",
					// 	dashicon: "move",
					// 	action: "move",
					// 	simplebuttons: true
					// },
					{
						type: "title",
						content: this.resource.name
					},
					// {
					// 	type: "button",
					// 	dashicon: "arrow-up",
					// 	action: "collapse",
					// 	simplebuttons: true
					// },
					{
						type: "button",
						dashicon: "plus",
						action: "open",
						simplebuttons: true
					}
				],
				...this.resource.header
			}, "header");

		}



	}

	*buildHeader() {

		if (this.resource.header !== false) {

			const header = this.getHeader();

			yield* header.build();

		}

	}

	*buildFooter() {

		if (this.resource.footer) {

			const footer = this.createChild({
				type: "footer",
				display: "flex",
				...this.resource.footer
			}, "header");

			yield {
				class: "footer-content",
				children: footer.build()
				// update: element => {
				// 	const loading = KarmaFieldsAlpha.Store.hasDownload() || KarmaFieldsAlpha.Store.hasUpload();
				// 	element.classList.toggle("loading", loading);
				// }
			};


		}

	}



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


KarmaFieldsAlpha.field.block.dialog = class extends KarmaFieldsAlpha.field.container {

	constructor(resource, id, parent) {

		super({
			width: "60rem",
			header: {
				children: [
					{
						type: "title",
						content: `Block ${parent.resource.name || ""}`
					},
					{
						type: "close",
						simplebuttons: true
					}
				]
			},
			// body: {
			// 	type: "group",
			// 	children: [
			// 		{
			// 			type: "input",
			// 			key: "key",
			// 			label: "Key"
			// 		},
			// 		{
			// 			type: "input",
			// 			key: "label",
			// 			label: "Label"
			// 		}
			// 	]
			// },
			...resource
		}, id, parent);

	}

}

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
