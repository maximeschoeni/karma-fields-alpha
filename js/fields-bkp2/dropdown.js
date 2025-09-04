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

			const values = this.getValues();
			const options = this.getOptions();

			if (values !== undefined && options !== undefined) {

				const option = options.find(option => option.id === values[0]);

				return [option.name || ""];

			}

		} else {

			return super.export();

		}

	}






	*build() {

		yield {
			tag: "select",
			class: "dropdown karma-field",
			update: element => {

				let options = this.getOptions();
				let values = this.getValue();

				if (options !== undefined && values !== undefined) {

					if (values.mixed) {

						options = [...options, { id: values[0], name: "[mixed value]" }]

					}

					const elementOptions = [...element.options];

					if (elementOptions.length !== options.length || elementOptions.some((option, index) => option.value !== options[index].id)) {

						element.length = 0;

						for (let option of options) {

							let optionElement = new Option(option.name, option.id, values[0] === option.id, values[0] === option.id);

							element.add(optionElement);

						}

					} else if (values[0] !== element.value && !values.mixed) {

						element.value = values[0]; // || "";

					}

					element.onchange = event => {


						this.save("change", "Change");
						this.setValue([element.value]);
						this.render();

					}

					element.onfocus = async event => {

						this.setFocus(values.mixed);

					}

					element.onmousedown = event => {

						event.stopPropagation();

					}

					element.disabled = this.isDisabled();
					element.parentNode.classList.toggle("modified", Boolean(values.modified));

				}

			}

		};
	}

}
