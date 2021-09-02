
KarmaFieldsAlpha.fields.checkbox_basic = class extends KarmaFieldsAlpha.fields.field {

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	async fetchValue() {
		let value = await super.fetchValue();
		if (value !== this.true() && value !== this.false()) {
			value = this.false();
			if (!this.resource.readonly) {
				await this.setValue(value);
			}
		}
		return value;
	}


	build() {
		return {
			tag: "input",
			init: checkbox => {
				checkbox.element.type = "checkbox";
				checkbox.element.id = this.getId();
				// this.init(checkbox.element);
			},
			update: async checkbox => {
				this.render = checkbox.render;
				checkbox.element.classList.add("loading");
				const value = await this.fetchValue();
				let modified = this.isModified();

				checkbox.element.onchange = async event => {
					this.backup();
					checkbox.element.classList.add("editing");
					await this.editValue(checkbox.element.checked ? this.true() : this.false());
					modified = this.isModified();

					checkbox.element.classList.toggle("modified", modified);
					checkbox.element.classList.remove("editing");
				}

				checkbox.element.checked = value === this.true();
				checkbox.element.classList.toggle("modified", modified);
				checkbox.element.classList.remove("loading");
			}
		};
	}

}
