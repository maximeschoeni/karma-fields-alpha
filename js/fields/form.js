
KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);

		// this.buffer = new KarmaFieldsAlpha.Buffer("form", this.resource.id || this.getId());
		this.buffer = new KarmaFieldsAlpha.LocalStorage("form", this.resource.id || this.getId());


		this.listeners = [];
	}

	getRelativeParent() {
    return this;
  }


	// used for checkboxes
	getForm() {
    return this;
  }

	// used for checkboxes
	getPath() {
		return [];
	}

	// async isModified(...path) {
	//
	// 	if (path.length) {
	//
	// 		const value = this.buffer.get(...path);
	//
	// 		if (value !== undefined) {
	//
	// 			return KarmaFieldsAlpha.DeepObject.differ(value, await super.get(...path));
	//
	// 		}
	//
	// 	} else {
	//
	// 		const delta = this.buffer.get();
	//
	// 		for (let key in delta) {
	//
	// 			if (KarmaFieldsAlpha.DeepObject.differ(delta[key], await super.get(key))) {
	//
	// 				return true;
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// 	return false;
	// }

	async isModified(...path) {

		if (path.length) {

			const value = this.buffer.get(...path); // -> value is an array
			const type = KarmaFieldsAlpha.Type.getType(value);

			if (value) {

				const event = this.createEvent({
					path: path,
					action: "get",
					type: type
				});

				await super.dispatch(event);

				return KarmaFieldsAlpha.DeepObject.differ(value, event.getValue());
			}

		} else {

			const delta = this.buffer.get();

			// console.log(delta);

			for (let key in delta) {

				const event = this.createEvent({
					path: [key],
					action: "get",
					type: KarmaFieldsAlpha.Type.getType(delta[key])
				});

				await super.dispatch(event);

				// console.log(key, delta[key], event.getValue());

				if (KarmaFieldsAlpha.DeepObject.differ(delta[key], event.getValue())) {

					return true;

				}

			}

		}

		return false;
	}

	async dispatch(event, parent) {

		switch (event.action) {

			case "modified":
				event.setValue(await this.isModified(...event.path));
				break;

			case "get": {
				let value = this.buffer.get(...event.path);
				if (value) {
					if (event.checkModified) {
						await super.dispatch(event);
						event.modified = KarmaFieldsAlpha.DeepObject.differ(value, event.getArray());
					}
					event.setValue(value);
				} else {
					const path = [...event.path];
					await super.dispatch(event);
					if (!event.hasValue() && event.default) { // -> event.default is a promise
						value = await event.default;
						this.buffer.set(value, ...path);
						event.setValue(value);
					}
				}
				break;

				// const value = await this.getValue(...event.path); // -> value is array
				// if (value.length === 0 && event.default !== undefined) {
				// 	this.setValue([event.default], ...event.path);
				// 	event.setValue(event.default);
				// 	await this.update();
				// } else {
				// 	event.setValue(value);
				// }
				// break;
			}

			case "set":
				if (event.autosave) {
					await super.dispatch(event);
				} else {
					if (event.checkModified) {
						const request = this.createEvent();
						request.action = "get";
						request.type = "array";
						request.path = [...event.path];
						await super.dispatch(request);
						event.modified = KarmaFieldsAlpha.DeepObject.differ(event.getArray(), request.getArray());
					}

					this.buffer.set(event.getArray(), ...event.path);
					// await this.setValue(event.getArray(), ...event.path);
				}
				// await this.update();
				// for (let listener of this.listeners) {
				// 	await listener(event);
				// }
				break;

			// case "listen":
			// 	this.listeners.push(event.callback);
			// 	break;

			case "submit":
				await this.submit();
				// for (let listener of this.listeners) {
				// 	await listener();
				// }
				break;

			default:
				await super.dispatch(event);
				break;

		}



		return event;
	}

	async submit() {

		const event = this.createEvent({
			action: "send",
			type: "object"
		});

		event.setValue(this.buffer.get());

		this.buffer.empty();

		await super.dispatch(event);
	}



	async set(value, ...path) {

		this.buffer.set(value, ...path); // -> value is an array

	}

	async remove(...path) {

		this.buffer.remove(...path);

	}

	getContent() {
		return this.createChild({
			display: this.resource.display,
			children: this.resource.children,
			id: "content",
			type: "group"
		});
	}


	build() {
		return this.getContent().build();
	}

	render() {
		this.getContent().render();
	}


};
