
KarmaFieldsAlpha.field.checkbox = class extends KarmaFieldsAlpha.field.input {

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	getDefault() {

		return this.resource.default || this.false();

	}

	*build() {

		yield {
			tag: "label",
			class: "checkbox-container",
			update: element => {
				element.onmousedown = event => {
					event.stopPropagation(); // why?
				}
			},
			children: [
				{
					tag: "input",
					init: element => {
						element.type = "checkbox";
					},
					update: element => {

						let values = this.getValue();

						if (values !== undefined) {

							element.classList.toggle("mixed", Boolean(values.mixed));
							element.checked = values[0] === this.true();

							element.onchange = () => {

								let value;

								if (values.mixed || values[0] === this.true()) {

									value = this.false();

								} else {

									value = this.true();

								}

								this.save("check", "Check");
								this.setValue([value]);
								this.render();

							}

							if (this.resource.disabled) {

								element.disabled = this.parseBoolean(this.resource.disabled) || false;

							} else if (this.resource.enabled) {

								element.disabled = !this.parseBoolean(this.resource.enabled);

							}

						}

					}
				},
				{
					class: "checkbox-text",
					update: element => {
						element.innerHTML = this.resource.text || "";
					}
				}
			]
		};
	}

}
