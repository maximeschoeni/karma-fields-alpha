
KarmaFieldsAlpha.fields.checkbox_basic = class extends KarmaFieldsAlpha.fields.field {

	convert(value) {
		if (this.resource.datatype === "boolean") {
			return value && true || false;
		} else if (this.resource.datatype === "number") {
			return Number(value) || 0;
		} else {
			return value && "1" || "";
		}
	}

	// getChecked() {
	// 	if (field.resource.datatype === "boolean") {
	// 		field.setValue("true");
	// 	} else if (field.resource.datatype === "number") {
	// 		field.setValue(1);
	// 	} else {
	// 		field.setValue("1");
	// 	}
	// }

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
		return {
			tag: "input",
			init: checkbox => {
				checkbox.element.type = "checkbox";
				checkbox.element.id = this.getId();
				this.init(checkbox.element);
			},
			update: async checkbox => {
				checkbox.element.onchange = async event => {
					this.backup();
					checkbox.element.classList.add("loading");
					await this.changeValue(this.convert(checkbox.element.checked));
					checkbox.element.classList.toggle("modified", this.modified);
					checkbox.element.classList.remove("loading");
				}
				// field.onSet = function(value) {
				// 	checkbox.element.checked = value;
				// }
				// field.onLoad = function(loading) {
				// 	checkbox.element.classList.toggle("loading", loading);
				// }
				// field.onModified = function(modified) {
				// 	checkbox.element.classList.toggle("modified", modified);
				// }
				checkbox.element.classList.add("loading");
				const value = await this.update();
				checkbox.element.checked = value && true || false;
				checkbox.element.classList.toggle("modified", this.modified);
				checkbox.element.classList.remove("loading");
			}
		};
	}

}
