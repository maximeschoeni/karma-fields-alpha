KarmaFieldsAlpha.field.textarea = class extends KarmaFieldsAlpha.field.input {

	*build() {
		yield {
			tag: "textarea",
			class: "textarea karma-field",
			init: element => {
				element.id = this.getUid();
				if (this.resource.height) {
					element.style.height = this.resource.height;
				}
				if (this.resource.textarea || this.resource.input) {
					Object.assign(element, this.resource.textarea || this.resource.input);
				}
			},
			update: element => {

				debugger;

				let values = this.getValue();
				const hasFocus = this.hasFocus();

				if (values !== undefined) {

					element.placeholder = this.getPlaceholder() || "";

					element.classList.toggle("mixed", Boolean(values.mixed));
					element.classList.toggle("selected", Boolean(values.mixed && hasFocus));

					if (values.mixed) {

						element.value = "[mixed values]";
						element.readOnly = true;

					} else {

						if (this.resource.readonly) {

							element.readOnly = this.parseBoolean(this.resource.readonly) || false;

						} else {

							element.readOnly = false;

						}

						element.parentNode.classList.toggle("modified", Boolean(values.modified));

						if (values[0] !== element.value.normalize()) { // -> replacing same value will reset caret index !

							element.value = values[0];

							element.style.height = "1px";
							element.style.height = (25 + element.scrollHeight) + "px";

						}

					}

				} else {

					// element.value = "";

				}

				// const value = content.toString();

				element.oninput = event => {

					// this.write(input.element.value, content);


					const normalizedValue = element.value.normalize();

					if (normalizedValue.length < values.length) {

						this.save("delete", "Delete");

					} else {

						this.save("insert", "Insert");

					}

					// const newContent = new KarmaFieldsAlpha.Content(normalizedValue);

					this.setValue([normalizedValue]);

					this.render();

				}

				element.onfocus = async event => {

					this.setFocus(values.mixed);

					this.parent.render(); // -> render parent in case this is a textarea inside tinymce

				}

				element.onmousedown = event => {

					event.stopPropagation(); // -> prevent selecting parent stuffs

				}

				if (this.resource.disabled) {

					this.disabled = this.parseBoolean(this.resource.disabled) || false;

				} else if (this.resource.enabled) {

					this.disabled = !this.parseBoolean(this.resource.enabled);

				}

			}

		};
	}

}
