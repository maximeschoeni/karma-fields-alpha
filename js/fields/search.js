KarmaFieldsAlpha.fields.search = function(fieldManager) {
	return {
		class: "search",
		tag: "input",
		init: function(input) {
			this.element.type = "search";
			this.element.id = fieldManager.getId();
			this.element.placeholder = fieldManager.resource.title || "Search";
			this.element.addEventListener("input", function(event) {
				if (this.value.length !== 1 && fieldManager.resource.auto) {
					fieldManager.setValue(this.value, "change");
				}
			});
			this.element.addEventListener("search", function() {
				fieldManager.setValue(this.value, "change");
			});

			// if (fieldManager.resource.style) {
			// 	this.element.style = fieldManager.resource.style;
			// }
		},
		update: function() {
			this.element.value = fieldManager.getValue() || "";
		}
	};
}
