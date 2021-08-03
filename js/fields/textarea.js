KarmaFieldsAlpha.fields.textarea = class extends KarmaFieldsAlpha.fields.input {

	build() {
		return {
			tag: "textarea",
			class: "karma-field",
			init: input => {
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
				this.init(input.element);
				this.render = input.render;
			},
			update: async input => {
				input.element.classList.add("loading");
				let value = await this.fetchValue();
				let modified = this.isModified();

				if (this.resource.readonly) {
					input.element.readOnly = true;
				} else {
					input.element.oninput = async event => {
						this.backup();
						input.element.classList.add("editing");
						// this.setValue(input.element.value);
						await this.editValue(input.element.value);
						modified = this.isModified();

						input.element.classList.remove("editing");
						input.element.classList.toggle("modified", modified);
					};
				}

				input.element.value = value;
				input.element.classList.toggle("modified", modified);
				input.element.classList.remove("loading");
				input.element.disabled = this.getState() === "disabled";
			}
		};
	}

}

// KarmaFieldsAlpha.fields.textarea = class extends KarmaFieldsAlpha.fields.field {
//
// 	build() {
// 		const field = this;
// 		return {
// 			tag: "textarea",
// 			class: "karma-field",
// 			init: function(input) {
// 				if (field.resource.label) {
// 					this.element.id = field.getId();
// 				}
// 				if (field.resource.textarea || field.resource.input) {
// 					Object.assign(this.element, field.resource.textarea || field.resource.input);
// 				}
// 				field.init(this.element);
// 			},
// 			update: function(input) {
//
// 				if (field.resource.readonly) {
// 					this.element.readOnly = true;
// 				} else {
// 					this.element.oninput = function(event) {
// 						field.backup();
// 						field.saveValue(this.value);
// 					};
// 				}
//
// 				field.onLoad = function(loading) {
// 					input.element.classList.toggle("loading", loading);
// 				}
// 				field.onModified = function(modified) {
// 					input.element.classList.toggle("modified", modified);
// 				}
// 				field.onSet = function(value) {
// 					input.element.value = value;
// 				}
// 				field.onDisabled = function(disabled) {
// 					input.element.disabled = disabled;
// 				}
// 				field.update();
// 			}
// 		};
// 	}
//
// 	// build() {
// 	// 	const field = this;
// 	//
// 	// 	return {
// 	// 		tag: "textarea",
// 	// 		class: "karma-field",
// 	// 		init: function(input) {
// 	// 			if (field.resource.label) {
// 	// 				this.element.id = field.getId();
// 	// 			}
// 	//
// 	// 			// // not used
// 	// 			// this.element.addEventListener("focus", function() {
// 	// 			// 	field.triggerEvent("focus", true);
// 	// 			// });
// 	// 			// // not used
// 	// 			// this.element.addEventListener("focusout", function() {
// 	// 			// 	field.triggerEvent("focusout", true);
// 	// 			// });
// 	//
// 	// 			if (field.resource.input) {
// 	// 				Object.assign(this.element, field.resource.input);
// 	// 			}
// 	//
// 	// 			if (!field.hasValue()) {
// 	// 				field.fetchValue().then(function(value) {
// 	// 					// field.endLoad();
// 	// 					field.triggerEvent("set");
// 	// 					field.triggerEvent("modify");
// 	// 					// input.value = value;
// 	// 					// input.element.classList.remove("loading");
// 	// 				});
// 	// 			}
// 	// 			field.init(this.element);
// 	// 		},
// 	// 		update: function(input) {
// 	// 			// this.element.value = field.getValue();
// 	// 			// if (field.disabled) {
// 	// 			// 	this.element.disabled = true;
// 	// 			// }
// 	//
// 	// 			this.element.oninput = function(event) {
// 	// 				field.triggerEvent("history", true);
// 	// 				field.setValue(this.value);
// 	// 				let promise = field.triggerEvent("change", true);
// 	// 				if (promise) {
// 	// 					field.startLoad();
// 	// 					// input.element.classList.add("loading");
// 	// 					promise.then(function() {
// 	// 						field.endLoad();
// 	// 						field.triggerEvent("modify");
// 	// 						// input.element.classList.remove("loading");
// 	// 					});
// 	// 				}
// 	// 				field.triggerEvent("modify");
// 	// 			};
// 	//
// 	// 			field.events.modify = function() {
// 	// 				input.element.classList.toggle("modified", field.isModified());
// 	// 			}
// 	// 			field.events.load = function() {
// 	// 				input.element.classList.toggle("loading", field.loading > 0);
// 	// 			}
// 	// 			field.events.set = function() {
// 	// 				input.element.value = field.getValue();
// 	// 			}
// 	//
// 	// 			field.triggerEvent("load");
// 	// 			field.triggerEvent("set");
// 	// 			field.triggerEvent("modify");
// 	//
// 	// 			// this.element.classList.toggle("loading", field.loading > 0);
// 	// 			// this.element.classList.toggle("modified", field.isModified());
// 	// 		}
// 	// 	};
// 	// }
//
// }
