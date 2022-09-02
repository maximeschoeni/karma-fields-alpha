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
						await this.setValue(input.element.value.normalize());

						input.element.parentNode.classList.toggle("modified", await this.isModified());
					});


					// input.element.style.height = "auto";
					// input.element.style.height = (input.element.scrollHeight) + "px";

				};




				// input.element.value = await this.getValue();

				const request = await this.dispatch({
					action: "get",
					type: "string",
					default: await this.getDefault()
				});

				input.element.value = KarmaFieldsAlpha.Type.toString(request.data);

				// input.element.style.height = "auto";
				// input.element.style.height = (input.element.scrollHeight) + "px";

				input.element.placeholder = request.manifold && "— No Change —" || this.resource.placeholder || "";


				input.element.parentNode.classList.toggle("modified", await this.isModified());
				input.element.classList.remove("loading");
			}
		};
	}

}
