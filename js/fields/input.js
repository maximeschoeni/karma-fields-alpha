KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {

	convert(value) {
		return value.toString();
	}

	build() {
		return {
			tag: "input",
			class: "text karma-field",
			init: input => {
				input.element.type = this.resource.input_type || "text"; // compat
				// field.triggerEvent("init", this.element);
				if (this.resource.label) {
					input.element.id = this.getId();
				}

				// // not used yet
				// this.element.addEventListener("focus", function() {
				// 	field.triggerEvent("focus", true);
				// });
				// // not used yet
				// this.element.addEventListener("focusout", function() {
				// 	field.triggerEvent("focusout", true);
				// });

				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}

				// if (!field.hasValue()) {
				// 	field.fetchValue().then(function(value) {
				// 		// field.endLoad();
				// 		field.triggerEvent("set");
				// 		field.triggerEvent("modify");
				// 		// input.value = value;
				// 		// input.element.classList.remove("loading");
				// 	});
				// }
				this.init(input.element);
			},
			update: async input => {

				if (this.resource.readonly) {
					input.element.readOnly = true;
				} else {
					input.element.oninput = async event => {

						this.backup();
						input.element.classList.add("loading");

						// await this.promise;
						// this.promise = this.changeValue(input.element.value);
						// await this.promise;

						await this.changeValue(input.element.value);

						// const value = input.element.value;
						// this.setDeltaValue(value);
				    // const originalValue = this.getOriginal();
				    // this.modified = value === originalValue;
						//
						// await this.promise;
				    // this.promise = this.bubble("change", this, value);
						// await this.promise;



						input.element.classList.remove("loading");
						input.element.classList.toggle("modified", this.modified);
					};
				}

				// field.onLoad = function(loading) {
				// 	input.element.classList.toggle("loading", loading);
				// }
				// field.onModified = function(modified) {
				// 	input.element.classList.toggle("modified", modified);
				// }
				// field.onSet = function(value) {
				// 	input.element.value = value;
				// }
				// field.onState = function(state) {
				// 	input.element.disabled = state === "disabled";
				// }

				input.element.classList.add("loading");
				const value = await this.update();
				input.element.value = value;
				input.element.classList.toggle("modified", this.modified);
				input.element.classList.remove("loading");
				// field.onSet = function(value) {
				// 	input.element.value = value;
				// }
				// this.onState = function(state) {
				// 	input.element.disabled = state === "disabled";
				// }
				input.element.disabled = this.getState() === "disabled";

			}
		};
	}


}


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
