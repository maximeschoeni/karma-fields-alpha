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

	async getValue() {
		const array = await this.fetchValue() || [];
		return array[0];
	}


	async importValue(value) {
    await this.setValue(null, [value]);
  }


	async input(value) {

		await this.write();

		if (KarmaFieldsAlpha.History.lastField !== this) {
			KarmaFieldsAlpha.History.backup();
			KarmaFieldsAlpha.History.lastField = this;
		}

		if (this.resource.autosave) {
			await this.saveValue(null, value);
		} else {
			await this.setValue(null, value);
		}



		await this.edit();

		if (this.resource.submit === "auto" || this.resource.autosubmit) {
			await this.submit();
		}

	}


	// called when a row is added
	setDefault() {
		console.error("deprecated");
		let value = "";
		if (this.resource.default) {
			value = this.resource.default.toString();
		}
    this.initValue(value);
  }

	getDefault() {
		return this.resource.default || "";
  }


	build() {
		return {
			tag: "input",
			class: "text-input karma-field",
			init: input => {
				input.element.type = this.resource.input_type || "text"; // compat
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
				// this.init(input.element);
			},
			update: async input => {
				this.render = input.render;

				input.element.classList.add("loading");
				let value = await this.fetchValue() || [];

				if (!value.length) {
					value.push(this.getDefault());
					this.setValue(null, value);
				}

				let modified = await this.isModified();

				if (this.resource.readonly || this.resource.input && this.resource.input.readOnly) {
					input.element.readOnly = true;
				} else {
					input.element.oninput = async event => {

						if (event.inputType === "insertFromPaste") {
							await this.input(new KarmaFieldsAlpha.PastedString(input.element.value));
						} else {
							await this.input([input.element.value]);
						}



						// await this.backup();
						// await this.editValue(input.element.value);

						input.element.classList.toggle("modified", await this.isModified());
					};
				}

				input.element.value = value[0] || "";
				input.element.classList.toggle("modified", modified);
				input.element.classList.remove("loading");
				input.element.disabled = this.getState() === "disabled";
			}
		};
	}


}

KarmaFieldsAlpha.PastedString = class extends String {}

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
