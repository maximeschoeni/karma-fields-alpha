KarmaFieldsAlpha.field.hidden = class extends KarmaFieldsAlpha.field.input {

	// getDefault() {
	//
	// 	if (this.resource.value !== undefined) {
	//
	// 		// return this.parse(this.resource.value || "");
	//
	// 		// return new KarmaFieldsAlpha.Expression(this.resource.value || "", this).toString();
	//
	//
	// 		const value = this.parse(this.resource.value || "");
	//
	// 		if (value !== KarmaFieldsAlpha.loading) {
	//
	// 			return KarmaFieldsAlpha.Type.toString(value);
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// initValue(value) {
	//
	// 	if (value !== undefined && value !== KarmaFieldsAlpha.loading) {
	//
	//
	//
	// 		this.setValue(value);
	// 		this.save();
	//
	// 	}
	//
  // }
	//
	// export(items = []) {
	//
  //   const value = this.getSingleValue();
	//
  //   items.push(value.toString());
	//
	// }
	//
  // import(items) {
	//
	// 	const value = items.shift() || "";
	// 	this.setValue(value);
	//
  // }

	build() {

		return {
			class: "hidden-input",
			update: input => {

        let content = this.getContent();

				if (!content.loading) {

					if (content.notFound) {

						// const defaultContent = this.getDefault();
						//
						// this.setContent(defaultContent);
						//
						// KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering

					}

				}

			}

		};
	}

}
