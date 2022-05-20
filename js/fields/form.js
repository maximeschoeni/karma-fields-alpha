
KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);

		// this.buffer = new KarmaFieldsAlpha.LocalStorage(...(this.resource.bufferPath || ["form", this.resource.id || this.getId()]));
		this.buffer = new KarmaFieldsAlpha.Buffer(...(this.resource.bufferPath || ["form", this.resource.id || this.getId()]));


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

				// const event = this.createEvent({
				// 	path: path,
				// 	action: "get",
				// 	type: type
				// });
				//
				// await super.dispatch(event);
				//
				// return KarmaFieldsAlpha.DeepObject.differ(value, event.getValue());

				const event = await super.dispatch({
					path: path,
					action: "get"
				});

				return KarmaFieldsAlpha.DeepObject.differ(value, event.data);
			}

		} else {

			const delta = this.buffer.get();

			for (let key in delta) {
				// const event = this.createEvent({
				// 	path: [key],
				// 	action: "get",
				// 	type: KarmaFieldsAlpha.Type.getType(delta[key])
				// });
				//
				// await super.dispatch(event);
				//
				// if (KarmaFieldsAlpha.DeepObject.differ(delta[key], event.getValue())) {
				//
				// 	return true;
				//
				// }

				const event = await super.dispatch({
					path: [key],
					action: "get",
				});

				await super.dispatch(event);

				if (KarmaFieldsAlpha.DeepObject.differ(delta[key], event.data)) {

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
						event.modified = KarmaFieldsAlpha.DeepObject.differ(value, event.data);
					}
					// event.setValue(value);
					// event.data = value || [];
					event.data = KarmaFieldsAlpha.Type.toArray(value);
				} else {
					const path = [...event.path];
					await super.dispatch(event);
					// if (!event.hasValue() && event.default) { // -> event.default is a promise
					// if ((!event.data || !event.data.length) && event.default) { // -> event.default is a promise
					if (!event.data || !event.data.length) { // -> event.default is a promise
						value = await event.field.getDefault();
						value = KarmaFieldsAlpha.Type.toArray(value);
						this.buffer.set(value, ...path);
						event.data = value;

						await super.dispatch({
							action: "edit"
						});
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


				// if (event.backup === "once") {
				// 	const id = event.path.join("/");
				// 	if (id !== this.historyId) {
				// 		await this.write(...event.path);
				// 		this.save(id);
				// 	}
				// } else if (event.backup === "always") {
				// 	await this.write(...event.path);
				// 	this.save();
				// }

				// -> save current value and step up history
				if (event.backup) {
					// const backupRequest = this.createEvent();
					// backupRequest.action = "backup";
					// backupRequest.data = undefined;
					// backupRequest.path = [...event.path];
					// backupRequest.type = "array";
					// backupRequest.save = true;
					// // backupRequest.id = event.path.join("/");
					// backupRequest.backup = event.backup; // -> "once" | "always"
					// await super.dispatch(backupRequest);

					await super.dispatch(this.createEvent({
						action: "backup",
						data: undefined,
						path: [...event.path],
						stage: true,
						backup: event.backup
					}));
				}


				if (event.autosave) {
					await super.dispatch(event);
				} else {
					if (event.checkModified) {
						const request = await super.dispatch({
							action: "get",
							type: event.type,
							path: [...event.path]
						});
						event.modified = KarmaFieldsAlpha.DeepObject.differ(event.data, request.data);
					}


					// this.buffer.set(event.getArray(), ...event.path);
					const value = KarmaFieldsAlpha.Type.toArray(event.data);
					this.buffer.set(value, ...event.path);

					await super.dispatch({
						action: "edit"
					});
				}

				// -> save new value. No step up history.
				if (event.backup) {
					// const backupRequest = this.createEvent();
					// backupRequest.action = "backup";
					// backupRequest.data = event.data;
					// backupRequest.path = [...event.path];
					// backupRequest.type = "array";
					// await super.dispatch(backupRequest);
					await super.dispatch(this.createEvent({
						action: "backup",
						data: event.data,
						path: [...event.path],
					}));
				}

				break;


			case "submit":
				await this.submit();
				// for (let listener of this.listeners) {
				// 	await listener();
				// }
				break;

			case "backup": {
				event.data = event.data || this.buffer.get(...event.path);
				await super.dispatch(event);
				break;
			}

			default:
				await super.dispatch(event);
				break;

		}



		return event;
	}

	async submit() {

		// const event = this.createEvent({
		// 	action: "send",
		// 	type: "object"
		// });
		//
		// event.setValue(this.buffer.get());
		//
		// this.buffer.empty();
		//
		// await super.dispatch(event);


		await super.dispatch({
			action: "send",
			data: this.buffer.get()
		});

		this.buffer.empty();
	}



	async set(value, ...path) {

		this.buffer.set(value, ...path); // -> value is an array

	}

	async remove(...path) {

		this.buffer.remove(...path);

	}

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
