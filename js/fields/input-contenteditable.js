KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {

	async getDefault() {
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

			const event = this.createEvent();
			event.action = "get";
			event.type = "string";
			event.default = this.getDefault(); // -> no care if promise
			// event.checkModified = true;

			await this.dispatch(event);

			return event.getValue();
		// });
		//
		// return this.promise;

	}


	async setValue(value) {

		// this.promise = Promise.resolve(this.promise).then(async () => {

			const event = this.createEvent();
			event.action = "set";
			event.type = "string";
			event.backup = "once";
			event.autosave = this.resource.autosave;
			event.splash = true;
			event.setValue(value);

			await this.dispatch(event);

		// });
		//
		// await this.promise;

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

	throttle(callback) {
		if (this.throttleTimer) {
			clearTimeout(this.throttleTimer);
		}
		this.throttleTimer = setTimeout(callback, 200);
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
			// tag: "input",
			class: "text-input karma-field",
			init: input => {
				input.element.contentEditable = true;
				input.element.style = "display: flex; align-items: center; padding: 0.5em;";

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

				if (this.resource.active || this.resource.disabled || this.resource.hidden) {
					// this.setEventListener(event => input.render());
					this.splash = event => input.render();
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

				input.element.innerHTML = await this.getValue();
				input.element.parentNode.classList.toggle("modified", await this.isModified());
				input.element.classList.remove("loading");

				input.element.onpaste = event => {

					event.preventDefault();

					const request = this.createEvent({
						action: "set",
						type: "string",
						backup: "always",
						pasted: true
					});

					request.setValue(event.clipboardData.getData("text"));

					this.dispatch(request);
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
						await this.setValue(input.element.innerHTML);

						input.element.parentNode.classList.toggle("modified", await this.isModified());
						input.element.classList.remove("editing");
					});

					// _.throttle(() => {
					// 	this.setValue(input.element.value);
					// }, 1000);

					// await this.setValue(input.element.value);


				};


				if (this.resource.disabled) {
					input.element.disabled = await this.parent.check(this.resource.disabled);
					// this.parent.check(this.resource.disabled).then(disabled => {
					// 	input.element.disabled = disabled;
					// });
				}
				if (this.resource.active) {
					input.element.classList.toggle("active", await this.parent.check(this.resource.active));
					// this.parent.check(this.resource.active).then(active => {
					// 	input.element.classList.toggle("active", active);
					// });
				}
				if (this.resource.hidden) {
					input.element.parentNode.classList.toggle("active", await this.parent.check(this.resource.hidden));
					// this.parent.check(this.resource.hidden).then(hidden => {
					// 	input.element.parentNode.classList.toggle("hidden", hidden);
					// });
				}

			}
		};
	}





}
