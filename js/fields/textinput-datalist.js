KarmaFields.fields.textinput_datalist = function(field) {
	return {
		class: "field-datalist-input",
		update: function() {
			this.children = [
				{
					tag: "input",
					class: "text",
					init: function(input) {
						this.element.type = field.resource.type || "text";
						this.element.id = field.getId();
						// this.element.htmlList = field.getId()+"-list";
						this.element.setAttribute("list", field.getId()+"-list");
						if (field.resource.readonly) {
							this.element.readOnly = true;
						} else {
							this.element.addEventListener("input", function(event) {
								field.setValue(this.value, "input");
							});

							this.element.addEventListener("keyup", function(event) {
								if (event.key === "Enter") {
									field.setValue(this.value, "enter");
								}
							});
						}
						if (field.resource.width) {
							this.element.style.width = field.resource.width;
						}
						if (field.resource.style) {
							this.element.style = field.resource.style;
						}

						field.fetchValue().then(function(value) { // -> maybe undefined
							input.update(input);
						});
					},
					update: function(input) {
						var value = field.getValue();
						var isModified = field.isModified();
						this.element.value = value || "";
						this.element.classList.toggle("modified", isModified);
					}
				},
				{
					tag: "datalist",
					init: function(datalist) {
						this.element.id = field.getId()+"-list";
						Promise.resolve(field.resource.options || field.fetchOptions()).then(function(results) {
							datalist.children = results.items.map(function(item) {
								return {
									tag: "option",
									init: function() {
										this.element.value = item.name;
									}
								}
							});
							datalist.render();
						});
					}
				}
			];
		}
	};
}
