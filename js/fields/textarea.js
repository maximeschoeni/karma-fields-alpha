KarmaFieldsAlpha.field.textarea = class extends KarmaFieldsAlpha.field.input {


	// write(value, lastValue = "") {
	//
	// 	this.setValue(value);
	//
	// 	if (value.length < lastValue.length) {
	//
	// 		this.save(`${this.resource.uid}-delete`);
	//
	// 	} else {
	//
	// 		this.save(`${this.resource.uid}-input`);
	//
	// 	}
	//
	// }
	//
	// inputText(value, inputType) {
	//
	// 	value = value.normalize();
	//
	// 	const current = this.lastValue || "";
	//
	// 	if (inputType === "insertText") {
	//
	// 		this.debounce(() => {
	//
	// 			this.write(value)
	//
	// 		}, 300);
	//
	// 	} else {
	//
	// 		this.write(value)
	//
	// 	}
	//
	//
	//
	//
	// }


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

        let content = this.getContent();

        input.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

					if (content.notFound) {

						content = this.getDefault();

						if (!content.loading) {

							await this.setContent(content);

							KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering

						}

					}

					input.element.placeholder = this.getPlaceholder();

					input.element.classList.toggle("mixed", Boolean(content.mixed));
					// input.element.classList.toggle("selected", Boolean(content.mixed && this.selection));
					input.element.classList.toggle("selected", Boolean(content.mixed && this.hasFocus()));

          if (content.mixed) {

            input.element.value = "[mixed values]";
            input.element.readOnly = true;

          } else {

            input.element.readOnly = Boolean(this.resource.readonly && this.parse(this.resource.readonly).toBoolean());

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

					const value = content.toString();

          input.element.oninput = async event => {

						const newValue = input.element.value.normalize();

						if (newValue !== value) {

							await this.save(newValue.length < value.length);

							const content = new KarmaFieldsAlpha.Content(newValue);

							await this.setContent(content);

							if (event.inputType === "insertText" || event.inputType === "deleteContentBackward") {

								this.debounce(() => void this.request("render"), this.resource.debounce || 300);

							} else {

								await this.request("render");

							}

						}

          }

					input.element.onfocus = async event => {

						// this.setSelection({});
						//
						// if (content.mixed) {
						//
						// 	this.request("deferFocus");
						//
						// 	// KarmaFieldsAlpha.Clipboard.focus();
						//
						// }

						await this.setFocus(content.mixed);

						await this.request("render"); // update clipboard textarea, unselect other stuffs

					}

					input.element.onmousedown = event => {

						event.stopPropagation(); // -> prevent selecting parent stuffs

					}

        } else {

					input.element.value = "";

				}

				this.resource.disabled = this.isDisabled();


			}
		};
	}

}
