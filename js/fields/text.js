KarmaFieldsAlpha.fields.text = class extends KarmaFieldsAlpha.fields.field {

	async update() {
		const value = await super.update();
		if (this.resource.driver) {
			const queryString = KarmaFieldsAlpha.Form.encodeParams({
				key: this.resource.key
			}, "?"); //this.getParamString("?"); // "?"+key+"="+field.resource.key
			const results = await this.getRemoteOptions(queryString, this.resource.driver);
			const options = results.items || results || [];
			const option = options.find(option => option.key === value);
			if (option) {
				return option[this.resource.option_property || "name"];
			}
		}
		return value;
	}

	build() {
		return {
			tag: "p",
			class: "text karma-field",
			init: p => {
				a.element.setAttribute('tabindex', '-1');
			},
			update: async input => {
				input.element.classList.add("loading");
				input.element.innerHTML = await this.update();
				input.element.classList.remove("loading");
			}
		};
	}


}
