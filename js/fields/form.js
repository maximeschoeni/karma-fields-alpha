
KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);

		// this.buffer = new KarmaFieldsAlpha.LocalStorage(...(this.resource.bufferPath || ["form", this.resource.id || this.getId()]));
		// this.buffer = new KarmaFieldsAlpha.Buffer(...(this.resource.bufferPath || ["form", this.resource.id || this.getId()]));
		const bufferPath = this.resource.bufferPath || ["data", this.resource.driver || this.resource.key || "nodriver"];
		this.buffer = new KarmaFieldsAlpha.Buffer(...bufferPath);


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

		// return this.buffer.has(...path);

		return false;


		if (path.length) {

			let value = this.buffer.get(...path); // -> value is an array

			if (value) {

				value = KarmaFieldsAlpha.Type.toArray(value);

				const event = await super.dispatch({
					path: path,
					action: "get"
				});

				const original = KarmaFieldsAlpha.Type.toArray(event.data);

				return KarmaFieldsAlpha.DeepObject.differ(value, original);
			}

		} else {

			const delta = this.buffer.get();

			for (let key in delta) {

				const event = await super.dispatch({
					path: [key],
					action: "get",
				});

				let original = KarmaFieldsAlpha.Type.toArray(event.data);
				let value = KarmaFieldsAlpha.Type.toArray(delta[key]);

				if (KarmaFieldsAlpha.DeepObject.differ(value, original)) {

					return true;

				}

			}

		}

		return false;
	}

	// async getValue(...path) {
	// 	let value = this.buffer.get(...path);
	// 	if (!value) {
	// 		const event = this.createEvent({
	// 			action: "get",
	// 			type: "array"
	// 		});
	//
	// 		await this.dispatch(event);
	//
	// 		return event.getArray();
	// 	}
	//
	// }


	// not used
	// async set(value, ...path) {
	//
	// 	let current = this.buffer.get(...path); // -> value is an array
	//
	// 	if (!current) {
	//
	// 		const event = await super.dispatch({
	// 			path: path,
	// 			action: "get"
	// 		});
	//
	// 		current = KarmaFieldsAlpha.Type.toArray(event.data);
	//
	// 	}
	//
	// 	if (KarmaFieldsAlpha.DeepObject.differ(value, current)) {
	// 		this.buffer.set(value, ...path);
	// 	}
	//
	// }




	async dispatch(event, parent) {

		switch (event.action) {

			// case "modified":
			//
			// 	// event.data = await this.isModified(...event.path);
			// 	event.delta = this.buffer.get(...event.path);
			//
			// 	console.log(event.delta, event.path);
			//
			//
			//
			// 	await super.dispatch(event);
			//
			//
			//
			// 	break;

			case "get": {
				let value = this.buffer.get(...event.path);
				if (value) {
					// if (event.checkModified) {
					// 	await super.dispatch(event);
					// 	event.modified = KarmaFieldsAlpha.DeepObject.differ(value, event.data);
					// }
					// event.setValue(value);
					// event.data = value || [];
					event.data = KarmaFieldsAlpha.Type.toArray(value);
				} else {
					const path = [...event.path];
					await super.dispatch(event);
					// if (!event.hasValue() && event.default) { // -> event.default is a promise
					// if ((!event.data || !event.data.length) && event.default) { // -> event.default is a promise
					// if (!event.data || !event.data.length) { // -> event.default is a promise
					//
					// 	value = await event.field.getDefault();
					//
					// 	value = KarmaFieldsAlpha.Type.toArray(value);
					// 	this.buffer.set(value, ...path);
					// 	event.data = value;
					//
					// }



					//
					// // if ((!event.data || !event.data.length) && event.default !== null && event.default !== undefined) { // -> event.default is an expression or a string
					// if (!event.data) { // -> event.default is an expression or a string
					//
					// 	// value = await KarmaFieldsAlpha.Expression.resolve(event.field, event.default);
					//
					// 	value = await event.field.getDefault();
					//
					// 	// if (value !== undefined && value !== null) { // -> e.g. gallery field
					//
					// 	value = KarmaFieldsAlpha.Type.toArray(value);
					//
					// 	if (value.length) { // -> e.g. gallery field
					//
					//
					//
					// 		this.buffer.backup(value, ...path); // -> backup or not?
					// 		this.buffer.set(value, ...path);
					//
					// 		event.data = value;
					//
					// 	}
					//
					// 	event.data = value;
					//
					// }
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

			case "set": {
				// if (event.backup === "pack") debugger;
				const newValue = KarmaFieldsAlpha.Type.toArray(event.data);

				let currentValue = this.buffer.get(...event.path);


				if (!currentValue) {

					let request = await super.dispatch({
						action: "get",
						path: [...event.path]
					});

					currentValue = KarmaFieldsAlpha.Type.toArray(request.data);

				}

				if (KarmaFieldsAlpha.DeepObject.differ(newValue, currentValue)) {

					if (event.autosave) {

						await super.dispatch(event);

					} else {

						this.buffer.set(currentValue, ...event.path); // -> todo get ride of this
						this.buffer.backup(newValue, ...event.path);
						this.buffer.set(newValue, ...event.path);

					}

				}

				break;
			}

			// case "modified": {
			// 	const delta = this.grid.buffer.get(...event.path);
			// 	if (delta) {
			// 		event.data = await this.dispatch({
			// 			action: "compare",
			// 			data: delta
			// 		}).then(request => KarmaFieldsAlpha.Type.toBoolean(request.data));
			// 	} else {
			// 		event.data = false;
			// 	}
			// 	break;
			// }

			case "modified": {
				const delta = this.buffer.get(...event.path);

				if (event.data) {
					event.data = KarmaFieldsAlpha.DeepObject.differ(event.data, delta);
				} else if (delta) {
					event.data = delta;
					await super.dispatch(event);
					// event.data = await this.dispatch({
					// 	action: "compare",
					// 	data: delta
					// }).then(request => KarmaFieldsAlpha.Type.toBoolean(request.data));
				}
				break;
			}





			case "submit":
				// await this.submit();
				// for (let listener of this.listeners) {
				// 	await listener();
				// }
				await super.dispatch({
					action: "send",
					data: this.buffer.get()
				});

				this.buffer.empty(); // backup or not?
				break;

			case "send":
				event.action = "set";
				await super.dispatch(event);
				break;

			// case "backup": {
			// 	event.data = event.data || this.buffer.get(...event.path);
			// 	await super.dispatch(event);
			// 	break;
			// }

			default:
				await super.dispatch(event);
				break;

		}



		return event;
	}

	// async submit() {
	//
	// 	// const event = this.createEvent({
	// 	// 	action: "send",
	// 	// 	type: "object"
	// 	// });
	// 	//
	// 	// event.setValue(this.buffer.get());
	// 	//
	// 	// this.buffer.empty();
	// 	//
	// 	// await super.dispatch(event);
	//
	//
	// 	await super.dispatch({
	// 		action: "send",
	// 		data: this.buffer.get()
	// 	});
	//
	// 	this.buffer.empty();
	// }



	// async set(value, ...path) {
	//
	// 	this.buffer.set(value, ...path); // -> value is an array
	//
	// }
	//
	// async remove(...path) {
	//
	// 	this.buffer.remove(...path);
	//
	// }

	// async sendBackupRequest(data, ) {
	// 	const backupRequest = this.createEvent({
	// 		action: "backup",
	// 		data: data,
	//
	// 	});
	// 	backupRequest.action = "backup";
	// 	backupRequest.data = undefined;
	// 	backupRequest.path = [...event.path];
	// 	backupRequest.type = "array";
	// 	backupRequest.save = true;
	// 	backupRequest.backup = event.backup; // -> "once" | "always"
	// 	await super.dispatch(this.createEvent({
	// 		action: "backup",
	// 		data: data,
	//
	// 	}));
	// }

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
