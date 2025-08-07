
KarmaFieldsAlpha.field.checkboxes = class extends KarmaFieldsAlpha.field {

	getDefault() {

		return this.parseArray(this.resource.default);

	}

	getValue(subkey) {

		const key = this.getKey();

		if (subkey) {

			const values = this.parent.getValue(key);

			if (values !== undefined) {

				if (values.mixed) {

					return values;

				} else {

					if (values.includes(subkey)) {

						return ["1"];

					} else {

						return [""];

					}

				}

			}

		} else {

			return this.parent.getValues(key);

		}

	}

	setValue(subvalue, subkey) {

		const key = this.getKey();

		if (subkey) {

			let values = parent.getValues(key);

			if (values === undefined) {

				console.error("setting value but value is not loaded");

			}

			if (subvalue === "1") {

				if (!values.includes(subkey)) {

					this.parent.setValue([...values, subkey], key);

				}

			} else {

				if (values.includes(subkey)) {

					this.parent.setValue(values.filter(item => item !== subkey), key);

				}

			}

		} else {

			this.parent.setValue(value, key);

		}

	}


	// as dropdown
	getOptions() {

		return KarmaFieldsAlpha.field.dropdown.prototype.getOptions.call(this);

	}

	*buildChildren() {

		const options = this.getOptions();

		if (options !== undefined) {
			for (let i = 0; i < options.length; i++) {
				const option = options[i];
				yield {
					tag: "li",
					children: this.createChild({
						type: "checkbox",
						key: option.id,
						text: option.name,
						tag: "label",
						false: "",
						true: "1"
					}, i).build()
				};
			}
		}
	}

	*build() {

		// const options = this.getOptions();
		// // let array = this.getValue();
		// let content = this.getContent();

		yield {
			class: "karma-field checkboxes",
			child: {
				tag: "ul",
				init: element => {
					if (this.resource.columns) {
						element.style.columnCount = parseInt(this.resource.columns);
					}
				},
				children: this.buildChildren()
			},
			update: element => {
				// element.classList.toggle("loading", Boolean(content.loading || options.loading));
			}
		};
	}
}
