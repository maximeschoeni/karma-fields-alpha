KarmaFieldsAlpha.field.textarea = class extends KarmaFieldsAlpha.field.input {

	build() {
		return {
			tag: "textarea",
			class: "textarea karma-field",
			init: input => {
				input.element.id = this.getUid();
				if (this.resource.height) {
					input.element.style.height = this.resource.height;
				}
				if (this.resource.textarea || this.resource.input) {
					Object.assign(input.element, this.resource.textarea || this.resource.input);
				}
			},
			update: input => {

        let content = this.getContent();
				const hasFocus = this.hasFocus();

        input.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

					input.element.placeholder = this.getPlaceholder().toString();

					input.element.classList.toggle("mixed", Boolean(content.mixed));
					input.element.classList.toggle("selected", Boolean(content.mixed && hasFocus));

          if (content.mixed) {

            input.element.value = "[mixed values]";
            input.element.readOnly = true;

          } else {

						if (this.resource.readonly) {

							input.element.readOnly = this.parse(this.resource.readonly).toBoolean();

						} else {

							input.element.readOnly = false;

						}

            input.element.parentNode.classList.toggle("modified", Boolean(content.modified));

            if (content.toString() !== input.element.value.normalize()) { // -> replacing same value will reset caret index !

              input.element.value = content.toString();

							input.element.style.height = "1px";
						  input.element.style.height = (25+input.element.scrollHeight)+"px";

            }

          }

					// input.element.onpaste = event => {
					// 	event.preventDefault();
					//
					// 	console.log("onpaste", event);
					// }

				} else {

					input.element.value = "";

				}

				const value = content.toString();

        input.element.oninput = async event => {

					// this.write(input.element.value, content);


					const newValue = input.element.value;
					const normalizedValue = newValue.normalize();

					if (normalizedValue.length < content.toString().length) {

						await this.save(`${this.uid}-delete`, "Delete");

					} else {

						await this.save(`${this.uid}-insert`, "Insert");

					}

					// const newContent = new KarmaFieldsAlpha.Content(normalizedValue);

					await this.setValue(normalizedValue);

					this.debounce(() => {
						this.request("render");
					}, 400);

        }

				input.element.onfocus = async event => {

					await this.setFocus(content.mixed);

					// await this.request("render"); // update clipboard textarea, unselect other stuffs
					await this.parent.render(); // -> render parent in case this is a textarea inside tinymce

				}

				input.element.onmousedown = event => {

					event.stopPropagation(); // -> prevent selecting parent stuffs

				}

				if (this.resource.disabled) {

		      this.disabled = this.parse(this.resource.disabled).toBoolean();

		    } else if (this.resource.enabled) {

		      this.disabled = !this.parse(this.resource.enabled).toBoolean();

		    }


			}
		};
	}

}
