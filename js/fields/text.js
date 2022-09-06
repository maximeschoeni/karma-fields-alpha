KarmaFieldsAlpha.fields.text = class extends KarmaFieldsAlpha.fields.field {

	async getContent() {
		return this.parse(this.resource.value || "");
	}

	async exportValue() {
		return this.getContent();
	}


	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			init: node => {
				if (this.resource.classes) {
					node.element.classList.add(...this.resource.classes);
				}
				node.element.tabIndex = -1;
			},
			update: async node => {
				// node.element.classList.add("loading");

				node.element.innerHTML = await this.getContent();

				if (this.resource.highlight) {
					const highlight = await this.parse(this.resource.highlight);
					node.element.classList.toggle("highlight", Boolean(highlight));
				}

				if (this.resource.disabled) {
					node.element.classList.add("disabled");
					const disabled = await this.parse(this.resource.disabled);
					node.element.classList.toggle("disabled", disabled);
				}

				// node.element.classList.remove("loading");

			}
		};
	}


}
