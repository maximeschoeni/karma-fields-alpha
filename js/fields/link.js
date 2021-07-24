KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.container {

	initField() {
    this.link = this.createChild({
      key: this.resource.link.key,
      type: "field"
    });
		this.text = this.createChild({
      key: this.resource.text.key,
      type: "text"
    });
  }

	build() {
		return {
			tag: "a",
			class: "text karma-field",
			init: a => {
				a.element.setAttribute('tabindex', '-1');
			},
			update: async a => {
				a.element.classList.add("loading");
				const link = await this.link.update();
				const text = await this.text.update();

				if (this.resource.href) {
					a.element.href = this.resource.href.replace("%value%", link);
					// +"#"+this.encodeParams({
					// 	[this.resource.target_key || this.resource.key]: value,
					// 	...this.resource.target_params
					// }); //this.getParamString("#");

				} else {
					a.element.onclick = event => {
						event.preventDefault();


						this.setParam(this.resource.link.key, link);
						this.edit();
					}
				}

				a.element.innerHTML = text;
				a.element.classList.remove("loading");
			}
		};
	}

}
