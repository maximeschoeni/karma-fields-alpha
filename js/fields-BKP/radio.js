KarmaFieldsAlpha.field.radio = class extends KarmaFieldsAlpha.field.dropdown {

	*buildOptions() {

		const values = this.getValue();
		const options = this.getOptions();

		if (options !== undefined && values !== undefined) {

			for (let option of options) {

				yield {
					tag: "li",
					child: {
						tag: "a",
						update: element => {
							element.classList.toggle("active", option.id === values[0]);
							element.innerHTML = option.name;
							element.onclick = event => {
								this.save("radio", "Radio");
								this.setValue([option.id]);
								this.render();
							}
						}
					}
				};

			}

		}

	}

	*build() {

		yield {
			class: "radio",
			tag: "ul",
			init: element => {
				const displayMode = this.resource.display || "inline";
				element.classList.toggle("display-inline", displayMode === "inline");
			},
			children: this.buildOptions()
		};

	}


}
