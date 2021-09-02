KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.container {

	initField() {
    this.link = this.createChild({
			type: "field",
      ...this.resource.link
    });
		this.text = this.createChild({
			type: "text",
      ...this.resource.text
    });
  }

	exportValue(singleCol) {
		return this.text.exportValue(singleCol);
	}

	

	build() {
		return {
			tag: "a",
			class: "link karma-field",
			init: a => {
				a.element.setAttribute('tabindex', '-1');
				if (this.resource.a) {
					Object.assign(a.element, this.resource.a);
				}
			},
			update: async a => {
				a.element.classList.add("loading");
				const link = await this.link.fetchValue();
				// const text = await this.text.update();

				if (this.link.resource.href) {
					a.element.href = this.link.resource.href.replace("%value%", link);
					if (this.link.resource.target) {
						a.element.target = this.link.resource.target;
					}
					// +"#"+this.encodeParams({
					// 	[this.resource.target_key || this.resource.key]: value,
					// 	...this.resource.target_params
					// }); //this.getParamString("#");

				} else {
					let params = KarmaFieldsAlpha.History.getParamsObject();
					params.set(this.resource.link.key, link);

					if (this.resource.params) {
						for (key in this.resource.params) {
							params.set(key, this.resource.params[key]);
						}
					}

					a.element.href = "#"+params.toString();

					a.element.onclick = async event => {
						event.preventDefault();
						// if (this.resource.params) {
						// 	for (let key in this.resource.params) {
						// 		this.setParam(this.resource.link.key, link);
						// 	}
						// }
						// this.setParam(this.resource.link.key, link);
						a.element.classList.add("editing");

						KarmaFieldsAlpha.History.backup();
						KarmaFieldsAlpha.History.setParamsObject(params);
						// KarmaFieldsAlpha.History.setParams({
						// 	[this.resource.link.key]: link,
						// 	...this.resource.params
						// });
						await this.editParam();
						// await this.editFull();
						a.element.classList.remove("editing");
					}
				}

				// a.element.innerHTML = text;
				a.child = this.text.build();
			},
			complete: a => {
				a.element.classList.remove("loading");
			}
		};
	}

}
