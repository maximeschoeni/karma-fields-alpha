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

			let values = this.parent.getValues(groupKey);

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

	isHidden(field) {

		if (field.resource.hidden) {

			return field.parseBoolean(field.resource.hidden) || false;

		} else if (field.resource.visible) {

			return !field.parseBoolean(field.resource.visible);

		}

		return false;
	}

	inline() {

		return this.resource.display === "flex";

	}

	*buildChild(field) {

		if (field.resource.label) {

			yield {
				class: "label",
				update: element => {
					element.textContent = field.getLabel();
				}
			};

		}

		if (field.build) { // -> not separators

			yield* field.build();

		}

		if (field.resource.description) {

			yield {
				tag: "p",
				class: "field-description",
				init: element => {
					element.textContent = field.resource.description;
				}
			};

		}

	}


	*buildChildren() {

		const children = this.getChildren();




		for (let i = 0; i < children.length; i++) {

			const field = this.createChild(children[i], i);
			const type = field.resource.model || field.resource.type;
			const tag = (type === "input" || type === "textarea" || type === "dropdown") && "label" || "div";

			yield {
				tag: tag,
				class: `karma-field-frame karma-field-${type} field-container`,
				init: element => {
					if (field.resource.style) {
						element.style = field.resource.style;
					}
					// if (field.resource.class) {
					// 	element.classList.add(...field.resource.class.split(" "));
					// }
					// if (field.resource.classes) {
					// 	element.classList.add(...field.resource.classes);
					// }
					// if (field.resource.flex) { // deprecated
					// 	element.style.flex = field.resource.flex;
					// }
					if (field.resource.width) {
						if (this.inline()) { // -> flex-direction: row
							if (field.resource.width === "1fr") {
								element.style.flexGrow = 1;
							} else {
								element.style.width = field.resource.width;
							}
						} else { // -> flex-direction: column
							if (field.resource.width === "auto") {
								element.style.alignSelf = "flex-start";
							} else if (field.resource.width !== "1fr") {
								element.style.width = field.resource.width;
							}
						}
					}
				},
				children: this.buildChild(field),
				update: element => {
					let hidden = this.isHidden(field);
					element.classList.toggle("hidden", hidden);
				}
			};

		}

	}

	*build() {
		yield {
			class: "karma-field karma-field-container display-"+(this.resource.display || "block"),
			init: element => {
				if (this.resource.container && this.resource.container.style) {
					element.style = this.resource.container.style;
				}
				// if (this.resource.class) {
				// 	group.element.classList.add(this.resource.class);
				// }
				// if (this.resource.classes) {
				// 	group.element.classList.add(...this.resource.classes);
				// }
				if (this.resource.wrap === false) {
					element.style.flexWrap = "nowrap";
				}
				if (this.resource.align) {
					element.style.alignItems = this.resource.align;
				}
			},
			children: this.buildChildren()
			// update: group => {
			// 	group.children = this.getChildren().map((resource, index) => {
			// 		const field = this.createChild(resource, index);

			// 		const labelable = field.resource.type === "input"
			// 			|| field.resource.type === "textarea"
			// 			|| field.resource.type === "checkbox"
			// 			|| field.resource.type === "dropdown";

			// 		return {
			// 			tag: labelable ? "label" : "div",
			// 			class: `karma-field-frame karma-field-${field.resource.type} field-container`,
			// 			init: (container) => {
			// 				if (field.resource.style) {
			// 					container.element.style = field.resource.style;
			// 				}
			// 				if (field.resource.class) {
			// 					field.resource.class.split(" ").forEach(name => container.element.classList.add(name));
			// 				}
			// 				if (field.resource.classes) {
			// 					container.element.classList.add(...field.resource.classes);
			// 				}
			// 				if (field.resource.flex) { // deprecated
			// 					container.element.style.flex = field.resource.flex;
			// 				}
			// 				if (field.resource.width) {
			// 					if (this.inline()) { // -> flex-direction: row
			// 						const fr = field.resource.width.match(/(.*)fr/);
			// 						if (fr) {
			// 							// container.element.style.flexGrow = fr[1];
			// 							container.element.style.flex = `1 ${fr[1]} 0`;
			// 						} else {
			// 							container.element.style.width = field.resource.width;
			// 						}
			// 					} else { // -> flex-direction: column
			// 						if (field.resource.width === "auto") {
			// 							container.element.style.alignSelf = "flex-start";
			// 						} else if (!field.resource.width.match(/(.*)fr/)) {
			// 							container.element.style.width = field.resource.width;
			// 						}
			// 					}
			// 				}
			// 			},
			// 			update: (container) => {
			// 				container.children = [];

			// 				let hidden = this.isHidden(field);

			// 				container.element.classList.toggle("hidden", hidden);

			// 				if (!hidden) {

			// 					container.children = this.buildChildren(field, labelable);

			// 				}

			// 			}
			// 		}
			// 	});

			// }

		};
	}

}


KarmaFieldsAlpha.field.tabs = class extends KarmaFieldsAlpha.field {

	*buildTabHeaders() {

		const children = this.getChildren();
		const currentIndex = this.getState("index") || 0;

		for (let i = 0; i < children.length; i++) {
			yield {
				tag: "a",
				class: "tab-handler",
				update: element => {
					element.innerHTML = children[i].label;
					element.classList.toggle("active", i === currentIndex);
					element.onclick = async event => {
						this.setState(i, "index");
						this.render();
					}
				}
			};
		}
	}

	*buildTabBodies() {

		const children = this.getChildren();
		const currentIndex = this.getState("index") || 0;

		for (let i = 0; i < children.length; i++) {
			if (i === currentIndex) {
				const child = this.getChild(i);
				yield {
					class: "tab-content",
					update: element => {
						element.classList.remove("hidden");
					},
					children: child.build()
				};
			} else {
				yield {
					class: "tab-content",
					update: element => {
						element.classList.add("hidden");
					}
				};
			}
		}
	}

	*build() {

		yield {
			class: "tabs",
			children: [
				{
					class: "tabs-header",
					children: this.buildTabHeaders()
				},
				{
					class: "tabs-body",
					children: this.buildTabBodies()
				}
			]
		};

	}


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
