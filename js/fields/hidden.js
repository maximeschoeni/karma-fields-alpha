KarmaFieldsAlpha.field.hidden = class extends KarmaFieldsAlpha.field.input {

	build() {

		return {
			// class: "hidden-input",
			tag: "input",
			init: input => {
				input.element.type = "hidden";
				// input.element.disabled = true;
			},
			update: async input => {

        let content = this.getContent();

				if (!content.loading) {

					const value = this.parse(this.resource.value);

					if (!value.loading && !KarmaFieldsAlpha.DeepObject.equal(value.toSingle(), content.toSingle())) {

						this.setContent(value);

						input.element.value = value.toString();

					}

				}

				// let content = this.getContent();
				//
				// if (!content.loading) {
				//
				// 	// this.setContent(content);
				//
				// 	// console.log(content);
				//
				// 	input.element.value = content.toString();
				//
				// }

			}

		};
	}

}
