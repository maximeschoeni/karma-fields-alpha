KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {



	// async fetchValue() {
	// 	let value = await super.fetchValue();
	//
	// 	if (Array.isArray(value)) {
	// 		value = value[0];
	// 	}
	//
	// 	if (value === undefined) {
	// 		value = "";
	// 	}
	//
  //   return value;
  // }

	// format(value) {
	// 	if (Array.isArray(value)) {
	// 		value = value[0];
	// 	}
	// 	return value;
	// }

	async fetchArray(...path) {

		console.log("Deprecated fetchArray");

		let array = await this.fetchValue(null, ...path) || [];

		if (!Array.isArray(array)) {
			array = [array];
		}

		return value;
	}

	async fetchString(...path) {

		console.log("Deprecated fetchString");

		let array = this.fetchArray(...path);

		if (array.length === 0) {
			array = await this.geDefault();
		}

		return array.toString();
	}

	async fetchInput(...path) {

		let value = await this.get(0);


		// compat
		// if (!Array.isArray(array)) {
		// 	array = [array];
		// }

		// preset empty
		// if (array.length === 0) {
		// 	array = await this.getDefault();
		// 	// await this.setValue(null, array);
		// 	await this.set(array, this.resource.context || "value");
		// }
		if (value === undefined) {
			value = await this.getDefault();
			await this.set(value, 0);
		}

		return value;
		// return array[this.resource.index || 0] || "";
	}



	async getInputValue() {
		console.error("Deprecated getInputValue()")
		let array = await this.fetchValue();


		if (!Array.isArray(array)) {
			array = [array];
		}
		if (!array.length) {
			array = this.getDefault();
			this.setValue(null, array);
		}
		return array.toString();
	}


	async importValue(value) {
    // await this.setValue(null, [value]);
		await this.set([value], this.resource.context || "value");
  }


	// async input(value, context) { // value is an array
	//
	// 	// await this.write();
	// 	await this.set(null, "write");
	//
	// 	// this.nextup();
	// 	await this.set(null, "nextup");
	//
	// 	// await this.setValue(null, value);
	// 	await this.set(value, context || this.resource.autosave && "submit" || this.resource.context || "value");
	//
	// 	// if (this.resource.autosave) {
	// 	// 	// await this.send(value);
	// 	// 	await this.set(value, "submit");
	// 	// }
	//
	// 	await this.edit(this.resource.value); // -> à supprimer !
	//
	// }

	async input(value, context) { // value is a string

		// await this.write();
		await this.setState(null, "write");

		// this.nextup();
		await this.setState(null, "nextup");

		// await this.setValue(null, value);

		if (this.resource.autosave) {

			await this.setState(value, 0, "submit");

		} else {

			await this.set(value, 0);

		}

		await this.setState(null, "edit");


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
				// if (this.resource.focus) {
				// 	input.element.focus();
				// }
				// this.init(input.element);

				this.render = input.render;
			},
			update: async input => {


				input.element.classList.add("loading");

				this.fetchInput().then(async (value) => {

					// // compat
					// if (!Array.isArray(array)) {
					// 	array = [array];
					// }
					//
					// // preset empty
					// if (!array.length) {
					// 	array = await this.getDefault();
					// 	await this.setValue(null, array);
					// }
					//
					// let value = array.toString();

					if (this.resource.disabled) {
						input.element.disabled = Boolean(await this.check(this.resource.disabled));
					}

					let modified = await this.isModified();

					if (this.resource.readonly || this.resource.input && this.resource.input.readOnly) {
						input.element.readOnly = true;
					} else {

						input.element.onpaste = event => {

							// this.input([event.clipboardData.getData("text")], "pastedvalue");
							await this.setState("pastedValue");
							this.input(event.clipboardData.getData("text"));

							// this.input(new KarmaFieldsAlpha.PastedString(event.clipboardData.getData("text")));
							// event.preventDefault();
						}

						input.element.onkeydown = event => {
							if (event.key === "Enter") {
								event.preventDefault();
								this.setState("submit");
							}
						}

						input.element.oninput = async event => {

							input.element.classList.add("editing");

							await this.input(input.element.value);
							input.element.classList.remove("editing");

							// if (await this.enqueue(() => this.input(input.element.value))) {
							// 	input.element.classList.remove("editing");
							// }
							// input.element.classList.toggle("modified", await this.isModified());

						};
					}

					input.element.value = value.toString();
					input.element.classList.toggle("modified", modified);
					input.element.classList.remove("loading");
					// input.element.disabled = this.getState() === "disabled";
				});



				// let value = await this.fetchValue() || [];
				//
				//
				//
				// if (!value.length) {
				// 	value = this.getDefault();
				// 	this.setValue(null, value);
				// }
				// // let value = await this.getInputValue();
				//
				// let modified = await this.isModified();
				//
				// if (this.resource.readonly || this.resource.input && this.resource.input.readOnly) {
				// 	input.element.readOnly = true;
				// } else {
				//
				// 	input.element.onpaste = event => {
				// 		this.input(new KarmaFieldsAlpha.PastedString(event.clipboardData.getData("text")));
				// 		event.preventDefault();
				// 	}
				//
				// 	input.element.oninput = async event => {
				// 		input.element.classList.add("editing");
				//
				// 		input.element.classList.toggle("modified", await this.isModified());
				//
				// 		if (await this.enqueue(async () => {
				// 			return this.input([input.element.value]);
				// 		})) {
				// 			input.element.classList.remove("editing");
				// 		}
				//
				// 	};
				// }
				//
				// input.element.value = value.toString();
				// input.element.classList.toggle("modified", modified);
				// input.element.classList.remove("loading");
				// input.element.disabled = this.getState() === "disabled";
			}
		};
	}





}

KarmaFieldsAlpha.PastedString = class extends Array {}




// KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {
//
// 	build() {
// 		const field = this;
//
// 		return {
// 			tag: "input",
// 			class: "text karma-field",
// 			init: function(input) {
// 				this.element.type = field.resource.input_type || "text"; // compat
// 				// field.triggerEvent("init", this.element);
// 				if (field.resource.label) {
// 					this.element.id = field.getId();
// 				}
//
// 				// not used yet
// 				this.element.addEventListener("focus", function() {
// 					field.triggerEvent("focus", true);
// 				});
// 				// not used yet
// 				this.element.addEventListener("focusout", function() {
// 					field.triggerEvent("focusout", true);
// 				});
//
// 				if (field.resource.input) {
// 					Object.assign(this.element, field.resource.input);
// 				}
//
// 				if (!field.hasValue()) {
// 					field.fetchValue().then(function(value) {
// 						// field.endLoad();
// 						field.triggerEvent("set");
// 						field.triggerEvent("modify");
// 						// input.value = value;
// 						// input.element.classList.remove("loading");
// 					});
// 				}
// 				field.init(this.element);
// 			},
// 			update: function(input) {
//
// 				if (field.resource.readonly) {
// 					this.element.readOnly = true;
// 				} else {
// 					this.element.oninput = function(event) {
// 						field.triggerEvent("history", true);
// 						field.setValue(this.value);
// 						let promise = field.triggerEvent("change", true);
// 						if (promise) {
// 							field.startLoad();
// 							// input.element.classList.add("loading");
// 							promise.then(function() {
// 								field.endLoad();
// 								field.triggerEvent("modify");
// 								// input.element.classList.remove("loading");
// 							});
// 						}
// 						field.triggerEvent("modify");
// 					};
// 				}
//
// 				field.events.modify = function() {
// 					input.element.classList.toggle("modified", field.isModified());
// 				}
// 				field.events.load = function() {
// 					input.element.classList.toggle("loading", field.loading > 0);
// 				}
// 				field.events.set = function() {
// 					input.element.value = field.getValue();
// 					input.element.disabled = field.bubble("disabled");
// 				}
//
// 				field.triggerEvent("load");
// 				field.triggerEvent("set");
// 				field.triggerEvent("modify");
//
// 				// this.element.classList.toggle("loading", field.loading > 0);
// 				// this.element.classList.toggle("modified", field.isModified());
// 			}
// 		};
// 	}
//
//
// }
