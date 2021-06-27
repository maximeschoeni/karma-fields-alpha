
KarmaFieldsAlpha.fields.checkbox_basic = class extends KarmaFieldsAlpha.fields.field {

	convert(value) {
		if (this.resource.datatype === "boolean") {
			return value === "true";
		} else if (this.resource.datatype === "number") {
			return Number(value);
		} else {
			return value ? "1" : "";
		}
	}

	getEmpty() {
		return 0;
	}

	build() {
		const field = this;

		return {
			tag: "input",
			init: function() {
				this.element.type = "checkbox";
				this.element.id = field.getId();
				field.init(this.element);
			},
			update: function(checkbox) {
				this.element.onchange = function() {
					field.backup();
					if (this.checked) {
						if (field.resource.datatype === "boolean") {
							field.saveValue("true");
						} else if (field.resource.datatype === "number") {
							field.saveValue(1);
						} else {
							field.saveValue("1");
						}
					} else {
						field.saveValue(field.getDefault());
					}
				}
				field.onSet = function(value) {
					checkbox.element.checked = value;
				}
				field.onLoad = function(loading) {
					checkbox.element.classList.toggle("loading", loading);
				}
				field.onMdofied = function(modified) {
					checkbox.element.classList.toggle("modified", modified);
				}
				field.update();
			}
		};
	}

}
