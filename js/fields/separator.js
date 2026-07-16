KarmaFieldsAlpha.field.separator = class extends KarmaFieldsAlpha.field {

	constructor(resources, ...args) {

		super({ style: "flex-grow: 1", ...resources }, ...args);

	}
	// build() {
	// 	return {
	// 		class: "separator",
  //     update: separator => {
  //       separator.element.style = this.resource.style;
  //     }
	// 	};
	// }
	*build() {
		yield {
			class: "separator",
		};
	}

	// *buildBlock() {
	// 	yield* this.build();
	// }
}
