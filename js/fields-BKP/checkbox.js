
KarmaFieldsAlpha.field.checkbox = class extends KarmaFieldsAlpha.field.input {

	// static mousedown = false;
	// static state = false;
	// static selected = [];


	// getContent() {
	//
	// 	const key = this.getKey();
	//
	// 	return this.parent.getContent(key);
	//
	// }
	//
	// setContent(content) {
	//
	// 	const key = this.getKey();
	//
	// 	this.parent.setContent(content, key);
	//
	// }

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	getDefault() {

		return this.parse(this.resource.default || this.false());

	}


	build() {

		return {
			tag: this.resource.tag || "label",
			class: "checkbox-container",
			update: container => {

				container.element.onmousedown = event => {
					event.stopPropagation();
				}

				container.children = [
					{
						tag: "input",
						init: checkbox => {
							checkbox.element.type = "checkbox";
							// const id = this.getId();
							checkbox.element.id = this.uid;
						},
						update: checkbox => {

							let content = this.getContent();

							if (!content.loading) {

								// -> set default
								// if (content.notFound) {
								//
								// 	// const defaultValue = this.getDefault();
								// 	//
								// 	// if (defaultValue !== undefined && defaultValue !== null) {
								// 	//
								// 	// 	this.setValue(defaultValue);
								// 	//
								// 	// }
								//
								// 	// content = this.getDefault();
								// 	//
								// 	// if (!content.loading) {
								// 	//
								// 	// 	this.setContent(content);
								// 	//
								// 	// 	KarmaFieldsAlpha.Query.init(); // -> add fake task to force rerendering
								// 	//
								// 	// }
								//
								// 	if (this.resource.createWhenNotFound) {
								//
								// 		this.createTask("create");
								//
								// 	}
								//
								// }

								checkbox.element.classList.toggle("mixed", Boolean(content.mixed));
								checkbox.element.checked = content.toString() === this.true();

								checkbox.element.onchange = async () => {

									let value;

									if (content.mixed || content.toString() === this.true()) {

										value = this.false();

									} else {

										value = this.true();

									}

									// const newContent = new KarmaFieldsAlpha.Content(value);

									await this.save("check", "Check");
									await this.setValue(value);
									await this.request("render");

								}

								if (this.resource.disabled) {

									input.element.disabled = this.parse(this.resource.disabled).toBoolean();

						    } else if (this.resource.enabled) {

									input.element.disabled = !this.parse(this.resource.enabled).toBoolean();

						    }

							}

						}
					},
					{
						class: "checkbox-text",
						update: label => {
							label.element.innerHTML = this.resource.text || "";
						}
					}
				];
			}

		};
	}

}
