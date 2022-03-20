KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
    super(...args);

  }



	async get(...path) {

		let value = await super.get() || [];

		if (path.length) {

			value = KarmaFieldsAlpha.DeepObject.get(value, 0, ...path) || [];

		}

		return value;

	}

	async set(value, ...path) {

		if (path.length) {

			this.promise = Promise.resolve(this.promise).then(() => super.get()).then((array = []) => {
				array = KarmaFieldsAlpha.DeepObject.clone(array);
				KarmaFieldsAlpha.DeepObject.assign(array, value, 0, ...path);
				return super.set(array);
			});

		} else {

			this.promise = Promise.resolve(this.promise).then(() => super.set(value));

		}

		await this.promise;

	}

	buildLabel(field) {
		return {
			tag: "label",
			init: label => {
				if (field.resource.label) {
					label.element.htmlFor = field.getId();
					label.element.textContent = field.resource.label;
				}
			}
		};
	}

	build() {
		return {
			class: "karma-field karma-field-container display-"+(this.resource.display || "block"),
			init: group => {
				this.render = group.render;
				if (this.resource.container && this.resource.container.style) {
					group.element.style = this.resource.container.style;
				}
				// if (this.resource.key) {
				// 	this.content = this.createChild({
				// 		key: 0,
				// 		type: "field"
				// 	});
				// }
			},
			update: group => {
				// group.element.classList.toggle("disabled", this.getState() === "disabled");
			},
			// children: this.children.map(field => {
			children: this.resource.children.map((child, index) => {


				const field = this.getRelativeParent().createChild({
					type: "group",
					id: this.fieldId+"-"+index.toString(),
					...child
				});

				// if (!KarmaFieldsAlpha.fields[field.resource.type || "group"]) {
				// 	console.error("Field does not exist", field.resource.type);
				// }

				if (field.resource.type === "hidden") {
					return field.build();
				}

				return {
					class: "karma-field-frame karma-field-"+field.resource.type,
					init: (container) => {
						if (field.resource.style) {
							container.element.style = field.resource.style;
						}
						if (field.resource.class) {
							field.resource.class.split(" ").forEach(name => container.element.classList.add(name));
							// container.element.classList.add(field.resource.class);
						}
						if (field.resource.flex) {
							container.element.style.flex = field.resource.flex;
						}
					},
					update: async (container) => {
						container.children = [];

						if (field.resource.fold) {
							container.children = [this.buildFoldable(field)];
						} else {

							if (field.resource.label) {
								container.children.push(this.buildLabel(field));
							}
							container.children.push(field.build());

						}



						if (field.resource.hidden) {
							container.element.classList.add("hidden");
							await this.check(field.resource.hidden).then(hidden => {
								container.element.classList.toggle("hidden", hidden);
							});
						}

						if (field.resource.hidden || field.resource.active || field.resource.disabled) {
							field.update = container.render;
						}

						container.element.classList.toggle("final", field.resource.final || !field.resource.children || !field.resource.children.some(child => child.type && child.type === "group"));
					}
				}
			})
		};
	}

	buildFoldable(field) {
		return {
			class: "foldable",
			init: foldable => {
				let open = false;
				foldable.children = [
					{
						tag: "label",
						children: [
							{
								tag: "span",
								update: span => {
									if (open) {
										span.element.className = "dashicons dashicons-arrow-down";
									} else {
										span.element.className = "dashicons dashicons-arrow-right";
									}
								}
							},
							{
								tag: "span",
								init: span => {
									span.element.htmlFor = field.getId();
									span.element.textContent = field.resource.label || "";
								}
							}
						],
						init: label => {
							label.element.style.display = "flex";
							label.element.style.alignItems = "center";
							label.element.onclick = event => {
								const content = label.element.nextElementSibling;
								content.style.height = content.children[0].clientHeight.toFixed()+"px";
								if (open) {
									requestAnimationFrame(() => {
										content.style.height = "0";
									});
									open = false;
								} else {
									open = true;
								}
								label.render();
							};
						}
					},
					{
						class: "group-fold-content",
						init: content => {
							content.element.style.overflow = "hidden";
							content.element.style.height = "0";
							content.element.style.transition = "height 200ms";
							content.element.style.display = "flex";
							content.element.style.alignItems = "flex-end";
							content.element.ontransitionend = () => {
								content.element.style.height = open ? "auto" : "0";
							};
						},
						child: field.build()
					}
				];
			}
		}
	}

}
