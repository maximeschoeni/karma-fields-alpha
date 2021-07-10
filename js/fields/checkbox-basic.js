
KarmaFieldsAlpha.fields.checkbox_basic = class extends KarmaFieldsAlpha.fields.field {

	convert(value) {
		if (this.resource.datatype === "boolean") {
			return value === "true";
		} else if (this.resource.datatype === "number") {
			return Number(value || 0);
		} else {
			return value ? "1" : "";
		}
	}

	getChecked() {
		if (field.resource.datatype === "boolean") {
			field.setValue("true");
		} else if (field.resource.datatype === "number") {
			field.setValue(1);
		} else {
			field.setValue("1");
		}
	}

	getEmpty() {
		if (this.resource.datatype === "boolean") {
			return false;
		} else if (this.resource.datatype === "number") {
			return 0;
		} else {
			return "";
		}
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
					field.changeValue(field.convert(this.checked));
				}
				field.onSet = function(value) {
					checkbox.element.checked = value;
				}
				field.onLoad = function(loading) {
					checkbox.element.classList.toggle("loading", loading);
				}
				field.onModified = function(modified) {
					checkbox.element.classList.toggle("modified", modified);
				}
				field.update();
			}
		};
	}

}
