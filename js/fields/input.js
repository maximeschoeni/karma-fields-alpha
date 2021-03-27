KarmaFieldsAlpha.fields.input = {};
KarmaFieldsAlpha.fields.input.create = function(resource) {
	let field = KarmaFieldsAlpha.Field(resource);
	if (resource.input && resource.input.type === "number") {
		field.datatype = "number";
	}
	return field;
};
KarmaFieldsAlpha.fields.input.build = function(field) {
	return {
		tag: "input",
		class: "text",
		init: function(input) {
			this.element.type = field.resource.input_type || "text";
			this.element.id = field.getId();
			this.element.addEventListener("input", function(event) {
				field.setValue(this.value, "change");
			});
			this.element.addEventListener("focus", function() {
				field.trigger("focus");
			});
			if (field.resource.input) {
				Object.assign(this.element, field.resource.input);
			}
		},
		update: function() {
			if (field.getResourceAttribute("disabled")) {
				this.element.disabled = true;
			} else if (field.getResourceAttribute("readonly")) {
				this.element.readOnly = true;
			}
			this.element.value = field.value || "";
		}
	};
}
