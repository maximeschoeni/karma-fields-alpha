KarmaFields.fields.checkbox = function(field) {
	return {
		class: "checkbox",
		children: [
			{
				tag: "input",
				init: function(input) {
					this.element.id = field.getId();
					this.element.addEventListener("change", function(event) {
						if (field.datatype === "boolean") {
							field.setValue(input.checked);
						} else if (field.datatype === "number") {
							field.setValue(input.checked ? 1 : 0);
						} else {
							field.setValue(input.checked ? "1" : "");
						}
					});
				},
				update: function() {
					this.checked = field.getValue();
				}
			},
			{
				tag: "label",
				init: function() {
					this.element.htmlFor = field.getId();
					if (field.resource.description) {
						this.element.textContent = field.resource.description;
					}
				}
			}
		]
	};
}
