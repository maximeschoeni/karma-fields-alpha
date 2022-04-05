
KarmaFieldsAlpha.fields.checkbox = class extends KarmaFieldsAlpha.fields.field {

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	async getDefault() {
		return this.resource.default || this.false();
	}

	async importValue(value) {
		await this.setValue(value);
	}

	async exportValue() {
		return this.getValue();
	}

	async getValue() {

		const event = this.createEvent({
			action: "get",
			type: "string",
			default: this.getDefault()
		});

		await this.dispatch(event);

		return event.getString();
	}

	async setValue(value) {
		const event = this.createEvent();
		event.action = "set";
		event.type = "string";
		event.backup = "once";
		event.autosave = this.resource.autosave;
		event.setValue(value);

		await this.dispatch(event);

	}

	async setMultipleFields(checked, fields) {

		for (let field of fields) {
			await field.backup();
		}

		await this.save();

		for (let field of fields) {

			const event = this.createEvent({
				action: "set",
				type: "string",
				autosave: field.resource.autosave
				// default: field.getDefault()
			});

			event.setValue(checked ? field.true() : field.false());

			await field.dispatch(event);

		}

	}

	build() {

		return {
			tag: this.resource.tag || "div",
			class: "checkbox-container",
			update: async container => {
				this.render = container.render;

				container.children = [
					{
						tag: "input",
						init: checkbox => {
							checkbox.element.type = "checkbox";
							checkbox.element.id = this.getId();
						},
						update: checkbox => {

							this.getValue().then(value => {
								checkbox.element.checked = value === this.true();
							});



							// if (value !== this.true() && value !== this.false()) {
							// 	value = this.false();
							// 	if (!this.resource.readonly) {
							// 		await this.set(value, 0);
							// 	}
							// }

							container.element.onmousemove = async event => {
								if (this.constructor.mousedown && !this.constructor.selected.includes(this)) {
									checkbox.element.checked = this.constructor.state;
									this.constructor.selected.push(this);
								}
							}

							container.element.onmouseup = async event => {
								event.preventDefault();
							}
							container.element.onclick = async event => {
								event.preventDefault();
							}

							container.element.onmousedown = async event => {

								checkbox.element.checked = !checkbox.element.checked;

								this.constructor.mousedown = true;
								this.constructor.state = checkbox.element.checked ? true : false;
								this.constructor.selected = [this];

								let mouseup = async event => {

									window.removeEventListener("mouseup", mouseup);

									event.preventDefault();
									this.constructor.mousedown = false;

									this.setMultipleFields(this.constructor.state, this.constructor.selected);

									this.constructor.selected = [];

								}

								window.addEventListener("mouseup", mouseup);
							}


						}
					},
					{
						tag: "label",
						class: "checkbox-text",
						init: label => {
							label.element.htmlFor = this.getId();
						},
						update: label => {
							label.element.innerHTML = this.resource.text || "";
						}
					}
				];
			}

		};
	}

}
