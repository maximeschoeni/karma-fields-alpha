KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {

	// constructor(resource, domain) {
	// 	super(resource, domain);
	//
	// 	// verify resource
	// 	// if (!resource.key) {
	// 	// 	console.error("key's missing in resource");
	// 	// }
	//
	// 	// if (resource.input && resource.input.type === "number") {
	// 	// 	this.datatype = "number";
	// 	// }
	// }

	// buildLabel(container) {
	// 	const field = this;
	// 	return {
	// 		tag: "label",
	// 		init: function(label) {
	// 			if (field.resource.label) {
	// 				this.element.htmlFor = field.getId();
	// 				this.element.textContent = field.resource.label;
	// 			}
	// 		}
	// 	};
	// }
	//
	// buildLoader(container) {
	// 	const field = this;
	// 	return {
	// 		class: "karma-field-spinner"
	// 	};
	// }

	build() {
		const field = this;

		return {
			tag: "input",
			class: "text karma-field",
			init: function(input) {
				this.element.type = field.resource.input_type || "text"; // compat
				// field.triggerEvent("init", this.element);
				if (field.resource.label) {
					this.element.id = field.getId();
				}

				// not used yet
				this.element.addEventListener("focus", function() {
					field.triggerEvent("focus", true);
				});
				// not used yet
				this.element.addEventListener("focusout", function() {
					field.triggerEvent("focusout", true);
				});

				if (field.resource.input) {
					Object.assign(this.element, field.resource.input);
				}

				if (!field.hasValue()) {
					field.fetchValue().then(function(value) {
						// field.endLoad();
						field.triggerEvent("set");
						field.triggerEvent("modify");
						// input.value = value;
						// input.element.classList.remove("loading");
					});
				}
				field.init(this.element);
			},
			update: function(input) {


				// this.element.value = field.getValue();
				// if (field.disabled) {
				// 	this.element.disabled = true;
				// }

				if (field.resource.readonly) {
					this.element.readOnly = true;
				} else {
					this.element.oninput = function(event) {
						field.triggerEvent("history", true);
						field.setValue(this.value);
						let promise = field.triggerEvent("change", true);
						if (promise) {
							field.startLoad();
							// input.element.classList.add("loading");
							promise.then(function() {
								field.endLoad();
								field.triggerEvent("modify");
								// input.element.classList.remove("loading");
							});
						}
						field.triggerEvent("modify");
					};
				}

				field.events.modify = function() {
					input.element.classList.toggle("modified", field.isModified());
				}
				field.events.load = function() {
					input.element.classList.toggle("loading", field.loading > 0);
				}
				field.events.set = function() {
					input.element.value = field.getValue();
					input.element.disabled = field.bubble("disabled");
				}

				field.triggerEvent("load");
				field.triggerEvent("set");
				field.triggerEvent("modify");

				// this.element.classList.toggle("loading", field.loading > 0);
				// this.element.classList.toggle("modified", field.isModified());
			}
		};
	}

	// buildFrame() {
	// 	const field = this;
	//
	// 	return {
	// 		class: "karma-field-"+field.resource.type,
	// 		init: function(container) {
	// 			field.events.set = function() {
	// 				container.render(); // -> when field value is changed by outside
	// 			}
	// 			if (field.resource.style) {
	// 				this.element.style = field.resource.style;
	// 			}
	// 		},
	// 		update: function(container) {
	// 			this.children = [
	// 				field.buildLabel(container),
	// 				{
	// 					class: "karma-field-item",
	// 					children: [
	// 						field.buildInput(container),
	// 						field.buildLoader(container)
	// 					]
	// 				}
	// 			];
	// 		}
	// 	};
	// }

	// build() {
	// 	const field = this;
	//
	// 	return {
	// 		class: "karma-field-"+field.resource.type,
	// 		init: function(container) {
	// 			// field.init();
	// 			// field.events.render = function() {
	// 			// 	container.render();
	// 			// }
	//
	// 			field.events.set = function() {
	// 				container.render(); // -> when field value is changed by outside
	// 			}
	//
	// 			if (field.resource.style) {
	// 				this.element.style = field.resource.style;
	// 			}
	// 		},
	// 		update: function() {
	// 			this.children = [
	// 				{
	// 					tag: "label",
	// 					init: function(label) {
	// 						if (field.resource.label) {
	// 							this.element.htmlFor = field.getId();
	// 							this.element.textContent = field.resource.label;
	// 						}
	// 					}
	// 				},
	// 				{
	// 					tag: "input",
	// 					class: "text",
	// 					init: function(input) {
	// 						this.element.type = field.resource.input_type || "text"; // compat
	// 						if (field.resource.label) {
	// 							this.element.id = field.getId();
	// 						}
	// 						this.element.addEventListener("input", function(event) {
	// 							let promise = field.setValue(this.value, "change");
	// 							if (promise) {
	// 								this.element.classList.add("loading");
	// 								promise.then(function() {
	// 									this.element.classList.remove("loading");
	// 								});
	// 							}
	// 						});
	// 						this.element.addEventListener("focus", function() {
	// 							field.triggerEvent("focus");
	// 						});
	// 						if (field.resource.input) {
	// 							Object.assign(this.element, field.resource.input);
	// 						}
	//
	// 						// field.getValue().then(function(value) {
	// 						// 	input.value = value;
	// 						// });
	//
	// 						if (field.hasValue()) {
	// 							input.value = field.getValue();
	// 						} else {
	// 							input.element.classList.add("loading");
	// 							field.fetchValue().then(function(value) {
	// 								input.value = value;
	// 								input.element.classList.remove("loading");
	// 							});
	// 						}
	//
	// 					},
	// 					update: function() {
	// 						this.element.value = field.getValue();
	// 						if (field.disabled) {
	// 							this.element.disabled = true;
	// 						}
	// 						// this.element.classList.toggle("loading", field.loading > 0);
	// 						this.element.classList.toggle("modified", field.isModified());
	// 					}
	// 				},
	// 				{
	// 					class: "karma-field-spinner"
	// 				}
	// 			];
	// 		}
	// 	};
	// }

}
