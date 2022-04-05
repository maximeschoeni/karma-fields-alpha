KarmaFieldsAlpha.fields.submit = class extends KarmaFieldsAlpha.fields.button {

	constructor(...args) {
		super(...args);

		this.resource.primary = true;
		this.resource.title ||= "Submit";
		this.resource.action = "submit";
		this.resource.disabled = "!modified";
	}

}

// KarmaFieldsAlpha.fields.submit = class extends KarmaFieldsAlpha.fields.field {
//
// 	build() {
// 		return {
// 			tag: "button",
// 			class: "karma-submit karma-button primary karma-field",
// 			child: {
// 				tag: "span",
// 				init: span => {
// 					span.element.textContent = this.resource.title || "Submit";
// 				}
// 			},
// 			init: button => {
// 				this.update = button.render;
// 			},
// 			update: async button => {
//
// 				button.element.onclick = async event => {
// 					event.preventDefault();
//
// 					button.element.classList.add("loading");
// 					button.element.disabled = true;
//
// 					await this.submit(this.resource.value);
// 					button.element.classList.remove("loading");
// 				}
//
// 				button.element.classList.add("loading");
// 				const isModified = await this.isModified();
// 				button.element.disabled = !isModified || this.getState() === "disabled";
// 				button.element.classList.remove("loading");
// 			}
// 		};
//
// 	}
//
// }
