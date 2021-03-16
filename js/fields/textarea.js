KarmaFields.fields.textarea = function(field) {
	return {
		tag: "textarea",
		init: function(input) {
			this.element.id = field.getId();

			if (field.resource.readonly) {
				this.element.readOnly = true;
			} else {
				this.element.addEventListener("input", function(event) {
					field.setValue(input.element.value);
				});
			}

			// if (field.resource.style) {
			// 	this.element.style = field.resource.style;
			// }
			if (field.resource.width) {
				this.element.style.width = field.resource.width;
			}
			if (field.resource.height) {
				this.element.style.height = field.resource.height;
			}
		},
		update: function() {
			this.element.value = field.value || "";
		}
	};
}
