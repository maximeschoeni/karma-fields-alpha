KarmaFieldsAlpha.fields.submit = {};

KarmaFieldsAlpha.fields.submit.build = function(field) {
	return {
		tag: "button",
		class: "karma-submit",
		init: function(button) {
			this.element.textContent = field.resource.title || "Submit";

			this.element.addEventListener("click", function(event) {
				event.preventDefault();
				field.trigger("submit", field);
			});

			field.events.update = function() {


				button.element.disabled = !field.parent.getModifiedValue() || field.getResourceAttribute("disabled") || false;

				// console.log(!field.parent.getModifiedValue(), field.getResourceAttribute("disabled"), button.element.disabled);
			}

			field.parent.events.change = function(currentField) {
				field.trigger("update");
			}

			// monkey patch parent change event
			// let onChange = field.parent.events.change;
			// field.parent.events.change = function(currentField) {
			// 	if (currentField === field) {
			// 		if (onChange) {
			// 			onChange(currentField);
			// 		} else if (field.parent.parent) {
			// 			field.parent.parent.trigger("change", currentField);
			// 		}
			// 	} else {
			// 		field.trigger("update");
			// 	}
			// }
		},
		update: function() {
			field.trigger("update");
		}
	};
}
