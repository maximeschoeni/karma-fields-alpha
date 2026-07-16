KarmaFieldsAlpha.field.hidden = class extends KarmaFieldsAlpha.field.input {

	*build() {

		let values = this.getValues();

		if (values !== undefined) {

			const value = this.parseString(this.resource.value);

			if (value !== undefined && !KarmaFieldsAlpha.DeepObject.equal(value, values[0])) {

				this.setValue([value]);

			}

		}

		yield {
			tag: "input",
			init: element => {
				element.type = "hidden";
			},
			update: element => {
				element.value = values[0] || "";
			}
		};
	}

}
