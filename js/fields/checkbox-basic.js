
KarmaFieldsAlpha.fields.checkbox_basic = class extends KarmaFieldsAlpha.fields.field {

	convert(value) {
		return value.toString();
	}

	getEmpty() {
		return this.resource.false || "";
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
					checkbox.element.classList.add("editing");
					await this.changeValue(checkbox.element.checked ? (this.resource.true || "1") : (this.resource.false || ""));
					checkbox.element.classList.toggle("modified", this.modified);
					checkbox.element.classList.remove("editing");
				}
				checkbox.element.classList.add("loading");
				const value = await this.update();
				checkbox.element.checked = value === (this.resource.true || "1");
				checkbox.element.classList.toggle("modified", this.modified);
				checkbox.element.classList.remove("loading");
			}
		};
	}

}
