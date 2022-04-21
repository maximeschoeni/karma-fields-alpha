KarmaFieldsAlpha.fields.textarea = class extends KarmaFieldsAlpha.fields.input {

	build() {
		return {
			tag: "textarea",
			class: "karma-field",
			init: input => {
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.readonly) {
					input.element.readOnly = true;
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
			},
			update: async input => {
				this.render = input.render;
				input.element.classList.add("loading");
				input.element.value = "";

				input.element.oninput = async event => {
					// input.element.classList.add("editing");
					// await this.backup();
					// await this.editValue(input.element.value);

					// debugger;

					// await this.setValue(input.element.value);

					this.throttle(async () => {
						await this.setValue(input.element.value);

						input.element.parentNode.classList.toggle("modified", await this.isModified());
						// input.element.classList.remove("editing");
					});

					// modified = await this.isModified();

					// input.element.classList.remove("editing");
					// input.element.classList.toggle("modified", modified);
				};

				input.element.value = await this.getValue();
				input.element.parentNode.classList.toggle("modified", await this.isModified());
				input.element.classList.remove("loading");
				// input.element.disabled = this.getState() === "disabled";
			}
		};
	}

}
