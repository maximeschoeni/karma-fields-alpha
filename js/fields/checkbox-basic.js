
KarmaFieldsAlpha.fields.checkbox_basic = KarmaFieldsAlpha.fields.checkbox = class extends KarmaFieldsAlpha.fields.field {

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	setDefault() {
		this.initValue(this.resource.default === this.true() ? this.true() : this.false());
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
			class: "checkbox-container",
			child: {
				tag: "input",
				init: checkbox => {
					checkbox.element.type = "checkbox";
					checkbox.element.id = this.getId();
				},
				update: async checkbox => {
					this.render = checkbox.render;
					checkbox.element.classList.add("loading");
					const value = await this.fetchValue();
					// let modified = this.isModified();

					// checkbox.element.onchange = async event => {
					// 	this.backup();
					// 	checkbox.element.classList.add("editing");
					// 	await this.editValue(checkbox.element.checked ? this.true() : this.false());
					// 	modified = this.isModified();
					//
					// 	checkbox.element.classList.toggle("modified", modified);
					// 	checkbox.element.classList.remove("editing");
					// }



					checkbox.element.onmousemove = async event => {
						if (this.constructor.mousedown && !this.constructor.selected.includes(this)) {
							checkbox.element.checked = this.constructor.state;
							this.constructor.selected.push(this);
						}
					}

					checkbox.element.onmouseup = async event => {
						event.preventDefault();
					}
					checkbox.element.onclick = async event => {
						event.preventDefault();
					}

					checkbox.element.onmousedown = async event => {

						checkbox.element.checked = !checkbox.element.checked;

						this.constructor.mousedown = true;
						this.constructor.state = checkbox.element.checked ? true : false;
						this.constructor.selected = [this];



						let mouseup = event => {

							event.preventDefault();
							this.constructor.mousedown = false;
							this.constructor.selected.forEach(field => {
								field.write();
							});
							KarmaFieldsAlpha.History.backup();
							this.constructor.selected.forEach(field => {
								field.setValue(this.constructor.state ? this.true() : this.false());
							});
							this.constructor.selected = [];

							this.edit();
							window.removeEventListener("mouseup", mouseup);
						}

						window.addEventListener("mouseup", mouseup);
					}

					checkbox.element.checked = value === this.true();
					// checkbox.element.classList.toggle("modified", modified);
					checkbox.element.classList.remove("loading");
				}
			}
		};
	}

}
