KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
    super(...args);

  }



	// async get(...path) {
	//
	// 	let value = await super.get() || [];
	//
	// 	if (path.length) {
	//
	// 		value = KarmaFieldsAlpha.DeepObject.get(value, 0, ...path) || [];
	//
	// 	}
	//
	// 	return value;
	//
	// }
	//
	// async set(value, ...path) {
	//
	// 	if (path.length) {
	//
	// 		this.promise = Promise.resolve(this.promise).then(() => super.get()).then((array = []) => {
	// 			array = KarmaFieldsAlpha.DeepObject.clone(array);
	// 			KarmaFieldsAlpha.DeepObject.assign(array, value, 0, ...path);
	// 			return super.set(array);
	// 		});
	//
	// 	} else {
	//
	// 		this.promise = Promise.resolve(this.promise).then(() => super.set(value));
	//
	// 	}
	//
	// 	await this.promise;
	//
	// }

	async splash(request) {
		for (let child of this.children) {
			await child.splash(request);
		}
	}

	async dispatch(event, parent) {

		if (this.resource.key) {

			switch (event.action) {

				case "get": {
					event.setValue(KarmaFieldsAlpha.DeepObject.get(await this.getValue(), ...event.path));
					break;
				}

				case "set": {
					this.promise = Promise.resolve(this.promise).then(() => this.getValue()).then(object => {
						object = KarmaFieldsAlpha.DeepObject.clone(object);
						KarmaFieldsAlpha.DeepObject.assign(object, event.getValue(), ...event.path);
						return this.setValue(object);
					});
					await this.promise;
					break;
				}

				default: {
					await super.dispatch(event, this);
					break;
				}

			}

		} else {

			await super.dispatch(event, this);

		}

		if (event.splash || event.action === "set") {
			// event.splash = false;
			// await this.splash(event);
			for (let child of this.children) {
				if (child !== parent) {
					await child.splash(event);
				}
			}
		}

		return event;
	}

	async getValue() {

		const event = this.createEvent({
			action: "get",
			type: "object"
		});

		await super.dispatch(event);

		return event.getObject() || {};

	}

	async setValue(value) {

		const event = this.createEvent({
			action: "set",
			type: "object", // -> must be send as array of object
			backup: "once",
			edit: true
		});

		event.setValue(value);

		await super.dispatch(event);

	}

	async getDefault() {
		const value = {};

		const subResources = this.getSubResources(this.resource);

		for (let resource in subResources) {
			value[resource.key] = await this.createChild(resource).getDefault();
		}

		return value;
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
				if (this.resource.class) {
					group.element.classList.add(this.resource.class);
				}

				// this.hide = hidden => {
				// 	group.element.parentNode.classList.toggle("hidden", hidden);
				// }

				if (this.resource.hidden) {
					// this.setEventListener(async request => {
					// 	group.element.parentNode.classList.toggle("hidden", await this.check(this.resource.hidden));
					// });
					group.element.parentNode.classList.add("hidden");

					this.splash = request => group.render();
				}

				// if (this.resource.key) {
				// 	this.content = this.createChild({
				// 		key: 0,
				// 		type: "field"
				// 	});
				// }
			},
			update: async group => {

				// await this.updateState();
				if (this.resource.hidden) {
					const hidden = await this.parse(this.resource.hidden);
					group.element.parentNode.classList.toggle("hidden", Boolean(hidden));
					// this.check(this.resource.hidden).then(hidden => {
					// 	group.element.parentNode.classList.toggle("hidden", hidden);
					// });
				}



				// group.element.classList.toggle("disabled", this.getState() === "disabled");
			},
			// children: this.children.map(field => {
			children: (this.resource.children || []).map((child, index) => {

				if (typeof child === "string") {
					child = KarmaFieldsAlpha.fields.presets[child] || {};
				}

				// const field = this.getRelativeParent().createChild({
				// 	type: "group",
				// 	id: this.fieldId+"-"+index.toString(),
				// 	...child
				// });

				const field = this.createChild({
					type: "field",
					id: index.toString(),
					...child
				});



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

						// if (field.resource.hidden) {
						// 	container.element.classList.add("hidden");
						// }
						//
						// field.update = async () => {
					  //   for (let child of field.children) {
					  //     await child.update();
					  //   }
						//
					  //   if (field.resource.active && field.activate) {
					  //     field.activate(await this.check(field.resource.active));
					  //   }
						//
					  //   if (field.resource.disabled && field.disable) {
					  //     field.disable(await this.check(field.resource.disabled));
					  //   }
						//
					  //   if (field.resource.hidden) {
						// 		container.element.classList.toggle("hidden", await this.check(field.resource.hidden));
					  //   }
					  // }

						// if (field.resource.hidden || field.resource.active || field.resource.disabled) {
						// 	field.update();
						// }

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
