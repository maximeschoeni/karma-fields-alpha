KarmaFieldsAlpha.fields.submit = class extends KarmaFieldsAlpha.fields.field {

	// constructor(resource, domain, parent) {
	// 	super(resource, domain, parent);
	//
	//
	// }

	initField() {
		const field = this;
		this.parent.events.change = function() {
			field.updateState();
		}
	}

	updateState() {
		this.try("onState", this.parent.getModifiedValue() ? this.getState() : "disabled");
	}

	getModifiedValue() {
		return;
	}

	getFromPath() {}

	build() {
		const field = this;

		return {
			tag: "button",
			class: "karma-submit karma-button primary",
			init: function(button) {
				this.element.textContent = field.resource.title || "Submit";
				field.init(this.element);
			},
			update: function(button) {
				this.element.onclick = function(event) {
					event.preventDefault();
					field.load(field.bubble("submit")).then(function() {
						field.updateState();
					});
					// if (!field.loading) {
					// 	field.startLoad();
					// 	field.bubble("submit").then(function() {
					// 		field.endLoad();
					// 		field.try("onSet");
					// 	});
					// }
				}

				// field.onSet = function() {
				// 	button.element.disabled = !field.parent.getModifiedValue() || field.disabled || false;
				// }
				field.onLoad = function(loading) {
					button.element.parentNode.classList.toggle("loading", loading);
				}
				field.onModified = function(modified) {
					button.element.parentNode.classList.toggle("modified", modified);
				}
				// field.parent.events.change = function(currentField) {
				// 	field.try("onSet");
				// }
				field.onState = function(state) {
					button.element.disabled = state === "disabled";
				}
				field.update();
			}
		};

	}

}
