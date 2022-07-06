KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.text {

	build() {
		return {
			tag: "a",
			class: "karma-link",

			update: async a => {

				a.element.innerHTML = await this.parse(this.resource.value || "");

				if (this.resource.active) {
					this.update = () => a.render();
				}

				if (this.resource.href) {
					a.element.href = this.resource.href;
				} else if (this.resource.action) {
					a.element.onclick = async event => {
						if (!a.element.classList.contains("editing")) {
							a.element.classList.add("editing");
							requestIdleCallback(() => {
								this.dispatch({
									action: this.resource.action
								}).then(() => {
									a.element.classList.remove("editing");
								});
							});
						}
					}
				}



				if (this.resource.active) {
					a.element.classList.toggle("active", Boolean(await this.parse(this.resource.active)));
				}

			}
		};

	}

}
