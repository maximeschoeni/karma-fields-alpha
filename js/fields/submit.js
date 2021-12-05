KarmaFieldsAlpha.fields.submit = class extends KarmaFieldsAlpha.fields.field {

	// constructor(resource, domain, parent) {
	// 	super(resource, domain, parent);
	//
	//
	// }

	initField() {
		this.parent.events.change = () => {
			this.render();
		}
		this.parent.edit = () => {
			this.render();
		}
	}


	build() {
		return {
			tag: "button",
			class: "karma-submit karma-button primary karma-field",
			child: {
				tag: "span",
				init: span => {
					span.element.textContent = this.resource.title || "Submit";
				}
			},
			init: button => {
				// this.init(button.element);
			},
			update: button => {
				this.render = button.render;

				button.element.onclick = async event => {
					event.preventDefault();

					button.element.classList.add("loading");
					button.element.disabled = true;
					// await field.bubble("submit");
					await this.submit();
					button.element.classList.remove("loading");
					// this.update();
				}
				// button.element.disabled = !this.parent.hasModifiedValue() || this.getState() === "disabled";
				const form = this.getForm();
				button.element.disabled = !form || !form.isModified() || this.getState() === "disabled";



			}
			// complete: () => {
			// 	button.element.classList.remove("loading");
			// }
		};

	}

}
