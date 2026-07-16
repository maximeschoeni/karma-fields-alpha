KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field {

	newChild(index) {

		const children = this.resource.children || [];

		let resource = children[index];

		if (resource) {

			return this.createChild(resource, index);

		}

	}

	getValue(key) {

		const groupKey = this.getKey();

		if (groupKey) {

			const values = this.parent.getValue(groupKey);

			if (values !== undefined) {

				return values[0] && values[0][key] || [];

			}

		} else if (this.parent) {

			return this.parent.getValue(key);

		}

	}

	setValue(value, key) {

		const groupKey = this.getKey();

		if (groupKey) {

			let values = this.parent.getValue(groupKey);

			if (values === undefined) {

				console.error("setting value but group value is undefined");

			}

			const newValue = { ...values[0], [key]: value };

			this.parent.setValue([newValue], groupKey);

		} else {

			return this.parent.setValue(value, key);

		}

	}

	export() {

		const groupKey = this.getKey();

		if (groupKey) {

			return this.parent.getValue(groupKey);

		} else {

			return super.export();

		}

	}

	import(collection) {

		const key = this.getKey();

		if (key) {

			const value = collection.shift();

			this.parent.setValue(value, key);

		} else {

			super.import(collection);

		}

	}

	// isHidden(field) {

	// 	if (field.resource.hidden) {

	// 		return field.parseBoolean(field.resource.hidden) || false;

	// 	} else if (field.resource.visible) {

	// 		return !field.parseBoolean(field.resource.visible);

	// 	}

	// 	return false;
	// }

	inline() {

		return this.resource.display === "flex" || this.resource.display === "inline";

	}

	// *buildChild(field) {

	// 	if (field.resource.label) {

	// 		yield {
	// 			class: "label",
	// 			update: element => {
	// 				element.textContent = field.getLabel();
	// 			}
	// 		};

	// 	}

	// 	if (field.build) { // -> not separators

	// 		yield* field.build();

	// 	}

	// 	if (field.resource.description) {

	// 		yield {
	// 			tag: "p",
	// 			class: "field-description",
	// 			init: element => {
	// 				element.textContent = field.resource.description;
	// 			}
	// 		};

	// 	}

	// }


	// *buildChildren() {

	// 	const children = this.getChildren();

	// 	for (let i = 0; i < children.length; i++) {

	// 		const field = this.createChild(children[i], i);
	// 		const type = field.resource.model || field.resource.type;
	// 		const tag = (type === "input" || type === "textarea" || type === "dropdown") && "label" || "div";

	// 		yield {
	// 			tag: tag,
	// 			class: `karma-field-frame karma-field-${type} field-container`,
	// 			init: element => {
	// 				if (field.resource.style) {
	// 					element.style = field.resource.style;
	// 				}
	// 				if (field.resource.width) {
	// 					if (this.inline()) { // -> flex-direction: row
	// 						if (field.resource.width === "1fr") {
	// 							element.style.flexGrow = 1;
	// 						} else {
	// 							element.style.width = field.resource.width;
	// 						}
	// 					} else { // -> flex-direction: column
	// 						if (field.resource.width === "auto") {
	// 							element.style.alignSelf = "flex-start";
	// 						} else if (field.resource.width !== "1fr") {
	// 							element.style.width = field.resource.width;
	// 						}
	// 					}
	// 				}
	// 			},
	// 			children: this.buildChild(field),
	// 			update: element => {
	// 				let hidden = this.isHidden(field);
	// 				element.classList.toggle("hidden", hidden);
	// 			}
	// 		};

	// 	}

	// }

	// *buildBlock() {

	// 	yield {
	// 		class: "field-block",
	// 		children: this.buildBlockContent(),
	// 		update: element => {
	// 			element.classList.toggle("hidden", this.isHidden());
	// 			if (this.resource.width) {
	// 				if (this.resource.width === "1fr") {
	// 					element.style.flexGrow = 1;
	// 				} else {
	// 					element.style.width = this.resource.width;
	// 				}
	// 			}
	// 		}
	// 	};

	// }

	*buildChildren() {

		const children = this.getChildren();

		for (let i = 0; i < children.length; i++) {

			const field = this.createChild(children[i], i);
			const hidden = field.isHidden() || false;

			if (this.resource.display === "table") { // deprecated

				yield {
					tag: "tr",
					update: element => {
						element.classList.toggle("hidden", hidden);
					},
					children: [
						{
							tag: "th",
							children: field.buildLabel()
						},
						{
							tag: "td",
							children: this.buildGridCell(field)
						}
					]
				};

			} else if (this.resource.display === "grid") {

				yield {
					class: "field-group-grid-cell header-grid-cell",
					update: element => {
						element.classList.toggle("hidden", hidden);
					},
					children: field.buildLabel()
				};

				yield {
					class: "field-group-grid-cell body-grid-cell",
					update: element => {
						element.classList.toggle("hidden", hidden);
					},
					children: this.buildGridCell(field)
				};

			} else {

				yield {
					class: `field-group-item field-block`,
					children: this.buildBlock(field),
					init: element => {
						if (field.resource.style) {
							element.style = field.resource.style;
						}
					},
					update: element => {
						element.classList.toggle("hidden", hidden);
						if (field.resource.width) {
							if (field.resource.width === "1fr") {
								element.style.flexGrow = 1;
							} else {
								element.style.width = field.resource.width;
							}
						}
					}
				};

			}

		}

	}

	*buildBlock(field) {

		yield* field.buildLabel();
		yield* field.build();
		yield* field.buildDescription();

	}

	*buildGridCell(field) {

		yield* field.build();
		yield* field.buildDescription();

	}

	// *buildBlock() {

	// 	if (this.resource.label) {

	// 		yield* this.buildLabel();

	// 	}

	// 	yield* this.build();

	// }

	*build(context) {

		if (context === "frame" || context === "dialog") {

			yield* super.build(context);

		} else {

			if (this.resource.display === "table") { // -> deprec (use grid)

				yield {
					init: element => {
						if (this.resource.scrollContainer) {
							element.classList.add("scroll-container");
						}
					},
					child: {
						tag: "table",
						class: "form-table",
						children: this.buildChildren(),
						init: element => {
							if (this.resource.style) {
								element.style = this.resource.style;
							}
						},
						update: element => {
							element.classList.toggle("hidden", this.isHidden());
						}
					}
				};

			} else {

				yield {
					class: "group-field display-"+(this.resource.display || "block"),
					children: this.buildChildren(),
					init: element => {
						if (this.resource.container && this.resource.container.style) {
							element.style = this.resource.container.style; // -> compat
						}
						if (this.resource.style) {
							element.style = this.resource.style;
						}
						if (this.resource.wrap === false) {
							element.style.flexWrap = "nowrap";
						}
						if (this.resource.align) {
							element.style.alignItems = this.resource.align;
						}
						if (this.resource.scrollContainer) {
							element.classList.add("scroll-container");
						}
					},
					update: element => {
						element.classList.toggle("hidden", this.isHidden());
					}
				};

			}

		}

	}

	// *buildTableRows() {

	// 	const children = this.getChildren();

	// 	for (let i = 0; i < children.length; i++) {

	// 		const field = this.createChild(children[i], i);

	// 		yield {
	// 			tag: "tr",
	// 			children: field.buildTableCells()
	// 		};

	// 	}

	// }

}









KarmaFieldsAlpha.field.foldableGroup = class extends KarmaFieldsAlpha.field.group {

	build() {

		const isOpen = this.getState("open") || false;

		return [
			{
				class: "foldable",
				children: [
					{
						tag: "label",
						children: [
							{
								tag: "span",
								update: element => {
									if (isOpen) {
										element.className = "dashicons dashicons-arrow-down";
									} else {
										element.className = "dashicons dashicons-arrow-right";
									}
								}
							},
							{
								tag: "span",
								update: element => {
									element.htmlFor = this.getId();
									element.textContent = this.resource.label || "";
								}
							}
						],
						update: element => {
							element.style.display = "flex";
							element.style.alignItems = "center";
							element.onclick = event => {
								const content = element.nextElementSibling;
								content.style.height = content.children[0].clientHeight.toFixed()+"px";
								if (isOpen) {
									requestAnimationFrame(() => {
										content.style.height = "0";
									});
									this.setState(false, "open");
								} else {
									this.setState(true, "open");
								}
								this.render();
							};
						}
					},
					{
						class: "group-fold-content",
						update: element => {
							element.style.overflow = "hidden";
							element.style.height = "0";
							element.style.transition = "height 200ms";
							element.style.display = "flex";
							element.style.alignItems = "flex-end";
							element.ontransitionend = () => {
								element.style.height = isOpen ? "auto" : "0";
							};
						},
						children: this.buildChildren()
					}
				]
			}
		];

	}

}
