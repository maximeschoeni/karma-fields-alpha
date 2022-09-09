KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field {

	constructor(...args) {
    super(...args);

  }

	// async splash(fromField, request) {
	// 	for (let child of this.children) {
  //     if (child !== fromField) {
  //       await child.splash(request);
  //     }
	// 	}
	// }



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

	// async splash(request) {
	// 	for (let child of this.children) {
	// 		await child.splash(request);
	// 	}
	// }

	// async dispatch(event, parent) {
	//
	// 	if (this.resource.key) {
	//
	// 		switch (event.action) {
	//
	// 			case "get": {
	// 				const request = await super.dispatch({
	// 					action: "get"
	// 				});
	// 				const object = KarmaFieldsAlpha.Type.toObject(request.data);
	// 				const value = KarmaFieldsAlpha.DeepObject.get(object, ...event.path);
	// 				event.data = KarmaFieldsAlpha.Type.toArray(value);
	// 				break;
	// 			}
	//
	// 			case "set": {
	// 				this.promise = Promise.resolve(this.promise).then(async () => {
	//
	// 					const request = await super.dispatch({
	// 						action: "get"
	// 					}) || {};
	//
	// 					let object = KarmaFieldsAlpha.Type.toObject(request.data);
	//
	// 					object = KarmaFieldsAlpha.DeepObject.clone(object);
	// 					KarmaFieldsAlpha.DeepObject.assign(object, event.data, ...event.path);
	//
	// 					await super.dispatch({
	// 						action: "set",
	// 						backup: "tie",
	// 						data: object
	// 					});
	//
	// 				});
	// 				await this.promise;
	// 				break;
	// 			}
	//
	// 			case "edit": {
	// 				await this.splash(parent, event.field);
	// 				await super.dispatch(event, this);
	// 				break;
	// 			}
	//
	// 			default: {
	// 				await super.dispatch(event, this);
	// 				break;
	// 			}
	//
	// 		}
	//
	// 	} else {
	//
	// 		await super.dispatch(event, this);
	//
	// 	}
	//
	// 	// if (event.splash || event.action === "set") {
	// 	// 	// event.splash = false;
	// 	// 	// await this.splash(event);
	// 	// 	for (let child of this.children) {
	// 	// 		if (child !== parent) {
	// 	// 			await child.splash(event);
	// 	// 		}
	// 	// 	}
	// 	// }
	//
	// 	return event;
	// }

	async dispatch(event, parent) {

		// if (this.resource.key) {

			switch (event.action) {

				// case "get": {
				// 	await super.dispatch(event, this);
				// 	KarmaFieldsAlpha.Type.toArray(event.data);
				// 	break;
				//
				// 	// KarmaFieldsAlpha.Type.convert(e)
				//
				// 	// const request = await super.dispatch({
				// 	// 	action: "get"
				// 	// });
				// 	// const object = KarmaFieldsAlpha.Type.toObject(request.data);
				// 	// const value = KarmaFieldsAlpha.DeepObject.get(object, ...event.path);
				// 	// event.data = KarmaFieldsAlpha.Type.toArray(value);
				// 	// break;
				// }

				// case "set": {
				// 	const type = this.resource.keyTypes && this.resource.keyTypes[event.path[0]];
				//
				// 	if (this.resource.key && ) {
				//
				// 		KarmaFieldsAlpha.Type.convert(e)
				//
				// 		await super.dispatch(event, this);
				//
				//
				// 	}
				//
				//
				// 	this.promise = Promise.resolve(this.promise).then(async () => {
				//
				// 		const request = await super.dispatch({
				// 			action: "get"
				// 		}) || {};
				//
				// 		let object = KarmaFieldsAlpha.Type.toObject(request.data);
				//
				// 		object = KarmaFieldsAlpha.DeepObject.clone(object);
				// 		KarmaFieldsAlpha.DeepObject.assign(object, event.data, ...event.path);
				//
				// 		await super.dispatch({
				// 			action: "set",
				// 			backup: "tie",
				// 			data: object
				// 		});
				//
				// 	});
				// 	await this.promise;
				// 	break;
				// }

				// case "edit": {
				// 	await this.splash(parent, event.field);
				// 	await super.dispatch(event, this);
				// 	break;
				// }

				default: {
					await super.dispatch(event, this);
					break;
				}

			}

		// } else {
		//
		// 	await super.dispatch(event, this);
		//
		// }

		return event;
	}

	async getValue() {

		// const event = this.createEvent({
		// 	action: "get",
		// 	type: "object"
		// });
		//
		// await super.dispatch(event);
		//
		// return event.getObject() || {};

		const request = await super.dispatch({
			action: "get"
		}) || {};
		return KarmaFieldsAlpha.Type.toObject(request.data);

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


		//
		// const subResources = this.getSubResources(this.resource);
		//
		// for (let resource in subResources) {
		// 	value[resource.key] = await this.createChild(resource).getDefault();
		// }
		//
		// return value;

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


	createField(resource) {

    if (typeof resource === "string") {

      resource = {
        type: resource
      };

    }

    const type = resource.type || "group";

    if (KarmaFieldsAlpha.field[type]) {
      return new KarmaFieldsAlpha.field[type](resource);
    }

    if (this.constructor[type] && typeof this.constructor[type] === "function") {
      return new this.constructor[type](resource);
    }

    if (this.constructor[type] && typeof this.constructor[type] === "object" && this.constructor[type].type !== type) {
      return this.createField({...this.constructor[type], ...resource, type: this.constructor[type].type});
    }

    if (this.parent) {
      return this.parent.createField(resource);
    }



    console.error("Field type does not exist", resource);

  }

	createChild(resource) {

    child = this.createField(resource);
    child.parent = this;

    return child;
  }

	request(subject, query, ...path) {

		const key = this.getKey();

		if (key) {

			switch (subject) {

				case "get":
					return this.parent.request(subject, query, key, ...path);

				case "render":
					return this.render();


			}

		} else {

			return this.parent.request(subject, query, ...path);

		}

	}

	build(request) {
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

				// if (this.resource.hidden) {
				// 	// this.setEventListener(async request => {
				// 	// 	group.element.parentNode.classList.toggle("hidden", await this.check(this.resource.hidden));
				// 	// });
				// 	// group.element.parentNode.classList.add("hidden");
				//
				// 	this.update = () => group.render();
				// }

				// if (this.resource.key) {
				// 	this.content = this.createChild({
				// 		key: 0,
				// 		type: "field"
				// 	});
				// }
			},
			update: async group => {



				const childRequest = (subject, query, ...path) => {

					const key = this.getKey();

					if (key) {

						switch (subject) {

							case "get":
								return request(subject, query, key, ...path);

							case "render":
								return group.render();


						}

					} else {

						return request(subject, query, ...path);

					}

				}

				// if (this.resource.hidden) {
				// 	const hidden = await this.parse(this.resource.hidden);
				// 	group.element.parentNode.classList.toggle("hidden", Boolean(hidden));
				// }


				// if (this.resource.hidden && await this.parse(this.resource.hidden)) {
				//
				// 	group.children = [];
				//
				// } else {
					// const hidden = await this.parse(this.resource.hidden);
					// group.element.parentNode.classList.toggle("hidden", Boolean(hidden));

					group.children = (this.resource.children || []).map((child, index) => {

						// child = this.sanitizeResource(child);

						// child.id = child.id || index.toString();

						// const field = this.createChild({
						// 	...child,
						// 	id: index
						// }, index.toString());

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
								// if (field.build) { // -> not separators
								// 	container.onclick = event => {
								// 		event.preventDefault(); // -> prevent losing focus on table selection...
								// 	}
								// }
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

								// container.element.classList.toggle("final", field.resource.final || !field.resource.children || !field.resource.children.some(child => child.type && child.type === "group"));
							}
						}
					});
				// }







				// group.element.classList.toggle("disabled", this.getState() === "disabled");
			}
			// children: this.children.map(field => {
			// children: (this.resource.children || []).map((child, index) => {
			//
			// 	// -> compat
			// 	if (typeof child === "string" && KarmaFieldsAlpha.field.presets[child]) {
			// 		child = KarmaFieldsAlpha.field.presets[child];
			// 	}
			//
			// 	// if (typeof child === "string" && this.constructor[child]) {
			// 	// 	child = this.constructor[child];
			// 	// }
			//
			// 	// const field = this.getRelativeParent().createChild({
			// 	// 	type: "group",
			// 	// 	id: this.fieldId+"-"+index.toString(),
			// 	// 	...child
			// 	// });
			//
			// 	// -> compat.
			// 	if (typeof child === "object") {
			// 		child = {
			// 			type: "field",
			// 			id: index.toString(),
			// 			...child
			// 		}
			// 	}
			//
			// 	// const field = this.createChild({
			// 	// 	type: "field",
			// 	// 	id: index.toString(),
			// 	// 	...child
			// 	// });
			//
			// 	const field = this.createChild(child);
			//
			//
			//
			// 	return {
			// 		class: "karma-field-frame karma-field-"+field.resource.type,
			// 		init: (container) => {
			// 			if (field.resource.style) {
			// 				container.element.style = field.resource.style;
			// 			}
			// 			if (field.resource.class) {
			// 				field.resource.class.split(" ").forEach(name => container.element.classList.add(name));
			// 				// container.element.classList.add(field.resource.class);
			// 			}
			// 			if (field.resource.flex) {
			// 				container.element.style.flex = field.resource.flex;
			// 			}
			// 		},
			// 		update: async (container) => {
			// 			container.children = [];
			//
			// 			if (field.resource.fold) {
			// 				container.children = [this.buildFoldable(field)];
			// 			} else {
			//
			// 				if (field.resource.label) {
			// 					container.children.push(this.buildLabel(field));
			// 				}
			// 				container.children.push(field.build());
			//
			// 			}
			//
			// 			// if (field.resource.hidden) {
			// 			// 	container.element.classList.add("hidden");
			// 			// }
			// 			//
			// 			// field.update = async () => {
			// 		  //   for (let child of field.children) {
			// 		  //     await child.update();
			// 		  //   }
			// 			//
			// 		  //   if (field.resource.active && field.activate) {
			// 		  //     field.activate(await this.check(field.resource.active));
			// 		  //   }
			// 			//
			// 		  //   if (field.resource.disabled && field.disable) {
			// 		  //     field.disable(await this.check(field.resource.disabled));
			// 		  //   }
			// 			//
			// 		  //   if (field.resource.hidden) {
			// 			// 		container.element.classList.toggle("hidden", await this.check(field.resource.hidden));
			// 		  //   }
			// 		  // }
			//
			// 			// if (field.resource.hidden || field.resource.active || field.resource.disabled) {
			// 			// 	field.update();
			// 			// }
			//
			// 			container.element.classList.toggle("final", field.resource.final || !field.resource.children || !field.resource.children.some(child => child.type && child.type === "group"));
			// 		}
			// 	}
			// })
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
