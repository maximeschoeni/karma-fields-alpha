KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {

	getDefault() {
		if (this.resource.default === null) {
			return null; // -> no default
		}
		return this.resource.default || "";
	}

	async importValue(value) {
		const event = this.createEvent();
		event.action = "set";
		event.type = "string";
		event.autosave = this.resource.autosave;
		event.setValue(value);

		await this.dispatch(event);
	}

	async exportValue() {
		const event = this.createEvent();
		event.action = "get";
		event.type = "string";

		await this.dispatch(event);

		return event.getValue();
	}


	async getValue() {

		// this.promise = Promise.resolve(this.promise).then(async () => {

		// let [id, key] = this.getPath();
		// if (id == 353) debugger;

			// const event = this.createEvent();
			// event.action = "get";
			// event.type = "string";
			// event.default = this.getDefault(); // -> no care if promise
			// // event.checkModified = true;
			//
			// await this.dispatch(event);

			// const event = this.createEvent();
			// event.action = "get";
			// event.type = "string";
			// event.default = this.getDefault(); // -> no care if promise
			// event.checkModified = true;

			const event = await this.dispatch({
				action: "get",
				type: "string",
				default: await this.getDefault()
				// default: this.getDefault()
			});


			// return event.getValue();
			// return event.data[0];

			return KarmaFieldsAlpha.Type.toString(event.data);
		// });
		//
		// return this.promise;

	}


	async setValue(value) {

		// this.promise = Promise.resolve(this.promise).then(async () => {

		// debugger;

			// const event = this.createEvent();
			// event.action = "set";
			// event.type = "string";
			// event.backup = "always";
			// event.autosave = this.resource.autosave;
			// event.splash = true;
			// event.setValue(value);
			//
			// await this.dispatch(event);

			// const event = this.createEvent();
			// event.action = "set";
			// event.type = "string";
			// event.backup = "always";
			// event.autosave = this.resource.autosave;
			// event.splash = true;
			// event.setValue(value);

			// await this.dispatch({
			// 	action: "backup"
			// });
			//
			// await this.dispatch({
			// 	action: "stage"
			// });


			if (this.resource.autosave) {

				await this.dispatch({
					action: "send",
					data: KarmaFieldsAlpha.Type.toArray(value)
				});

			} else {

				await this.dispatch({
					action: "set",
					type: "string",
					backup: this.isBusy() ? "pack" : "tie",
					// autosave: this.resource.autosave,
					// splash: true, // deprec -> use 'edit'
					data: KarmaFieldsAlpha.Type.toArray(value)
					// edit: true
				});

			}


			if (this.resource.onchange) {
				await this.parse(this.resource.onchange);
			}

			await this.dispatch({
				action: "edit",
				data: this.resource.editmode || "splash"
			});

	}


	isBusy(duration = 3000) {
		if (!this.busy) {
			setTimeout(() => {
				this.busy = false;
			}, duration);
			this.busy = true;
			return false;
		}
		return true;
	}


	async enqueue(callback) {
		this.queueNext = callback;
		if (this.queue) {
			await this.queue;
		}
		if (this.queueNext === callback) {
			this.queue = this.queueNext();
			await this.queue;
			return true;
		}
		return false;
	}

	throttle(callback, interval = 500) {
		if (this.throttleTimer) {
			clearTimeout(this.throttleTimer);
		}
		this.throttleTimer = setTimeout(callback, interval);
	}


	// // called when a row is added
	// setDefault() {
	// 	console.error("deprecated");
	// 	let value = "";
	// 	if (this.resource.default) {
	// 		value = this.resource.default.toString();
	// 	}
  //   this.initValue(value);
  // }
	//
	// update() {
	// 	if (this.resource.disabled || this.resource.hidden) {
	// 		this.render();
	// 	}
	// }



	build() {
		return {
			tag: "input",
			class: "text-input karma-field",
			init: input => {
				input.element.type = this.resource.input_type || "text"; // compat
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.placeholder) {
					input.element.placeholder = this.resource.placeholder;
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
				if (this.resource.readonly) {
					input.element.readOnly = true;
				}

				this.render = input.render;

				if (this.resource.active || this.resource.disabled) {
					// this.setEventListener(event => input.render());
					this.update = event => input.render();
				}

			},
			update: async input => {

				input.element.classList.add("loading");

				// await this.updateState();

				// this.dispatchEvent({action: "get"}).then(async (event) => {

				// debugger;
				// this.getValue().then(value => {
				//
				//
				// 	// this.update();
				//
				// 	// this.isModified().then(modified => input.element.classList.toggle("modified", modified));
				//
				// 	input.element.classList.toggle("modified", await this.isModified()));
				//
				// 	input.element.value = value;
				// 	input.element.classList.remove("loading");
				// });

				// input.element.value = await this.getValue();

				const request = await this.dispatch({
					action: "get",
					type: "string",
					default: await this.getDefault()
				});

				input.element.value = KarmaFieldsAlpha.Type.toString(request.data);

				input.element.placeholder = request.manifold && "— No Change —" || this.resource.placeholder || "";



				input.element.parentNode.classList.toggle("modified", await this.isModified());
				input.element.classList.remove("loading");

				input.element.onpaste = event => {

					event.preventDefault();

					// const request = this.createEvent({
					// 	action: "set",
					// 	type: "string",
					// 	backup: "always",
					// 	pasted: true
					// });
					//
					// request.setValue(event.clipboardData.getData("text"));
					//
					// this.dispatch(request);


					this.dispatch({
						action: "set",
						type: "string",
						backup: "always",
						pasted: true,
						data: [event.clipboardData.getData("text").normalize()]
					});
				}

				// input.element.onkeydown = event => {
				// 	if (event.key === "Enter") {
				// 		event.preventDefault();
				// 		this.dispatchEvent({
				// 			action: "submit"
				// 		});
				// 	}
				// }

				input.element.oninput = async event => {

					// input.element.classList.add("editing"); // -> search fields

					// await this.enqueue(() => this.setValue(input.element.value));

					this.throttle(async () => {
						input.element.classList.add("editing");
						await this.setValue(input.element.value.normalize());

						input.element.parentNode.classList.toggle("modified", await this.isModified());
						input.element.classList.remove("editing");
					});

					// _.throttle(() => {
					// 	this.setValue(input.element.value);
					// }, 1000);

					// await this.setValue(input.element.value);


				};


				if (this.resource.disabled) {
					const disabled = await this.parent.parse(this.resource.disabled);
					input.element.disabled = Boolean(disabled);
					// this.parent.check(this.resource.disabled).then(disabled => {
					// 	input.element.disabled = disabled;
					// });
				}
				if (this.resource.active) {
					input.element.classList.toggle("active", Boolean(await this.parent.parse(this.resource.active)));
					// this.parent.check(this.resource.active).then(active => {
					// 	input.element.classList.toggle("active", active);
					// });
				}
				// if (this.resource.hidden) {
				// 	input.element.parentNode.classList.toggle("active", Boolean(await this.parent.parse(this.resource.hidden)));
				// }

			}
		};
	}





}
