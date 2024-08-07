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
			update: async input => {

        let content = await this.getContent();

        input.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

					// if (content.notFound) {
					//
					// 	if (this.resource.createWhenNotFound) {
					//
					// 		this.createTask("create");
					//
					// 	}
					//
					// 	// content = this.getDefault();
					// 	//
					// 	// if (!content.loading) {
					// 	//
					// 	// 	this.setContent(content);
					// 	//
					// 	// 	KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering
					// 	//
					// 	// }
					//
					// }

					input.element.placeholder = await this.getPlaceholder();

					input.element.classList.toggle("mixed", Boolean(content.mixed));
					// input.element.classList.toggle("selected", Boolean(content.mixed && this.selection));
					input.element.classList.toggle("selected", Boolean(content.mixed && this.hasFocus()));

          if (content.mixed) {

            input.element.value = "[mixed values]";
            input.element.readOnly = true;

          } else {

						if (this.resource.readonly) {

							const readonly = await this.parse(this.resource.readonly);
							input.element.readOnly = readonly.toBoolean();

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

					await this.request("render"); // update clipboard textarea, unselect other stuffs

				}

				input.element.onmousedown = event => {

					event.stopPropagation(); // -> prevent selecting parent stuffs

				}

				if (this.resource.disabled) {

					const disabled = await this.parse(this.resource.disabled);
		      this.disabled = disabled.toBoolean();

		    } else if (this.resource.enabled) {

					const enabled = await this.parse(this.resource.enabled);
		      this.disabled = !enabled.toBoolean();

		    }


			}
		};
	}

}
