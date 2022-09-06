KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.field {


	// async dispatch(event, parent) {
	//
	// 	// if (this.resource.key) {
	//
	// 		switch (event.action) {
	//
	// 			// case "get": {
	// 			// 	await super.dispatch(event, this);
	// 			// 	KarmaFieldsAlpha.Type.toArray(event.data);
	// 			// 	break;
	// 			//
	// 			// 	// KarmaFieldsAlpha.Type.convert(e)
	// 			//
	// 			// 	// const request = await super.dispatch({
	// 			// 	// 	action: "get"
	// 			// 	// });
	// 			// 	// const object = KarmaFieldsAlpha.Type.toObject(request.data);
	// 			// 	// const value = KarmaFieldsAlpha.DeepObject.get(object, ...event.path);
	// 			// 	// event.data = KarmaFieldsAlpha.Type.toArray(value);
	// 			// 	// break;
	// 			// }
	//
	// 			// case "set": {
	// 			// 	const type = this.resource.keyTypes && this.resource.keyTypes[event.path[0]];
	// 			//
	// 			// 	if (this.resource.key && ) {
	// 			//
	// 			// 		KarmaFieldsAlpha.Type.convert(e)
	// 			//
	// 			// 		await super.dispatch(event, this);
	// 			//
	// 			//
	// 			// 	}
	// 			//
	// 			//
	// 			// 	this.promise = Promise.resolve(this.promise).then(async () => {
	// 			//
	// 			// 		const request = await super.dispatch({
	// 			// 			action: "get"
	// 			// 		}) || {};
	// 			//
	// 			// 		let object = KarmaFieldsAlpha.Type.toObject(request.data);
	// 			//
	// 			// 		object = KarmaFieldsAlpha.DeepObject.clone(object);
	// 			// 		KarmaFieldsAlpha.DeepObject.assign(object, event.data, ...event.path);
	// 			//
	// 			// 		await super.dispatch({
	// 			// 			action: "set",
	// 			// 			backup: "tie",
	// 			// 			data: object
	// 			// 		});
	// 			//
	// 			// 	});
	// 			// 	await this.promise;
	// 			// 	break;
	// 			// }
	//
	// 			// case "edit": {
	// 			// 	await this.splash(parent, event.field);
	// 			// 	await super.dispatch(event, this);
	// 			// 	break;
	// 			// }
	//
	// 			default: {
	// 				await super.dispatch(event, this);
	// 				break;
	// 			}
	//
	// 		}
	//
	// 	// } else {
	// 	//
	// 	// 	await super.dispatch(event, this);
	// 	//
	// 	// }
	//
	// 	return event;
	// }

	async request(subject, content, ...path) {

		const key = this.getKey();

		if (key) {

			return this.parent.request(subject, content, key, ...path);

		}

		return this.parent.request(subject, content, ...path);

	}

	async getDefault() {

		let defaults = {};

		for (let index in this.resource.children) {

			const child = this.createChild(this.resource.children[index], index.toString());

			defaults = {
				...defaults,
				...await child.getDefault()
			};

		}

		return defaults;
	}

	async export(keys = []) {

		let object = {};

		for (let index in this.resource.children) {

			const child = this.createChild(this.resource.children[index], index.toString());

			object = {
				...object,
				...await child.export(keys)
			};

		}

		return object;
	}

	async import(object) {

		for (let index in this.resource.children) {

			const child = this.createChild(this.resource.children[index], index.toString());

			await child.import(object);

		}

	}

	buildLabel(field) {
		return {
			tag: "label",
			init: label => {
				if (field.resource.label) {
					label.element.htmlFor = field.getId();
					label.element.textContent = field.getLabel();
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
				if (this.resource.class) {
					group.element.classList.add(this.resource.class);
				}
			},
			update: async group => {

				group.children = (this.resource.children || []).map((child, index) => {

					const field = this.createChild(child, index.toString());

					return {
						class: "karma-field-frame karma-field-"+field.resource.type,
						init: (container) => {
							if (field.resource.style) {
								container.element.style = field.resource.style;
							}
							if (field.resource.class) {
								field.resource.class.split(" ").forEach(name => container.element.classList.add(name));
							}
							if (field.resource.flex) {
								container.element.style.flex = field.resource.flex;
							}
						},
						update: async (container) => {
							container.children = [];

							const hidden = field.resource.hidden && await this.parse(field.resource.hidden)
								|| field.resource.visible && !await this.parse(field.resource.visible);

							container.element.classList.toggle("hidden", Boolean(hidden));

							if (field.resource.fold) {
								container.children = [this.buildFoldable(field)];
							} else {

								if (!hidden) {

									if (field.resource.label) {
										container.children.push(this.buildLabel(field));
									}
									if (field.build) { // -> not separators
										container.children.push(field.build());
									}

								}

							}

						}
					}
				});

			}

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
