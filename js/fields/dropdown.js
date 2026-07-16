KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

	getDefault() {

		const options = this.getOptions();

		if (options !== undefined) {

			let value;

			if (this.resource.default) {

				value = this.parseString(this.resource.default);

			}

			if (content === undefined || !options.some(item => item.id === content.value)) {

				value = options[0].id; // -> allowing default value not in options may lead in infinite loop !

			}

			return value;

		}

	}

	export() {

		if (this.resource.export === "name") {

			const values = this.getValue();
			const options = this.getOptions();

			if (values !== undefined && options !== undefined) {

				const option = options.find(option => option.id === values[0]);

				if (option) {

					return [option.name || ""];

				} else {

					return [values[0] || ""];

				}



			}

		} else {

			return super.export();

		}

	}






	*build() {

		yield {
			tag: "select",
			class: "dropdown karma-field",
			children: this.buildOptions(),
			init: element => {
				element.id = this.uid;
			},
			update: element => {

				// let options = this.getOptions();
				// let values = this.getValue();
				// const mixed = this.isMixed();

				// if (options !== undefined && values !== undefined) {

					// let value = values || "";

					// if (mixed) {

					// 	value = "*";
					// 	options = [...options, { id: "*", name: "[mixed value]" }]

					// }

					// const elementOptions = [...element.options];

					// if (elementOptions.length !== options.length || elementOptions.some((option, index) => option.value !== options[index].id)) {

					// 	element.length = 0;

					// 	for (let option of options) {

					// 		const selected = value === option.id;

					// 		let optionElement = new Option(option.name, option.id, selected, selected);

					// 		element.add(optionElement);

					// 	}

					// } else if (value !== element.value) {

					// 	element.value = value;

					// }

					element.onchange = event => {

						if (element.value === "*") {
							return;
						}

						this.save("change", "Change");
						this.setValue([element.value]);
						this.render();

					}

					element.onfocus = async event => {

						const mixed = this.isMixed();

						this.setFocus(mixed);

					}

					element.onmousedown = event => {

						event.stopPropagation();

					}

					element.disabled = this.isDisabled();
					// element.parentNode.classList.toggle("modified", Boolean(values.modified));

				// }

			}

		};
	}


	*buildOptions() {

		const options = this.getOptions();
		const values = this.getValue();
		const mixed = this.isMixed();

		if (options && values) {

			for (let option of options) {

				yield {
					tag: "option",
					update: element => {
						element.value = option.id;
						element.label = option.name;
						element.selected = !mixed && option.id === values[0];
					}
				};

			}

			if (mixed) {

				yield {
					tag: "option",
					update: element => {
						element.value = "*";
						element.label = "[mixed value]";
						element.selected = true;
					}
				}

			}

		}
	}

}
