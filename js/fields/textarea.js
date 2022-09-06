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
				input.element.classList.add("loading");

				const key = this.getKey();

				input.element.oninput = async event => {

					this.throttle(async () => {

						await this.parent.request("set", {
							data: input.element.value.normalize(),
							autosave: this.resource.autosave
						}, key);

						const modified = await this.isModified();

						input.element.parentNode.classList.toggle("modified", modified);
					});

				};

				const response = await this.parent.request("get", {}, key);

				if (Array.isArray(response) && response.multivalue) {

					input.element.placeholder =  "— No Change —" || this.resource.placeholder || "";
					input.element.value = "";

				} else {

					input.element.value = KarmaFieldsAlpha.Type.toString(response);

				}

				const modified = await this.isModified();

				input.element.parentNode.classList.toggle("modified", modified);
				input.element.classList.remove("loading");
			}
		};
	}

}
