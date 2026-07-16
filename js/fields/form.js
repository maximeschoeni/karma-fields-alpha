
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.table {

	getBody() {

		const query = this.getQuery();

		if (query === undefined) {

			return;

		}

		const length = query.getLength();

		if (length === undefined) {

			return;

		}

		// return query.createChild({
		// 	// id: this.getId(),
		// 	// length,
		// 	offsetContainer: true,
		// 	scrollContainer: this.isScrollContainer(),
		// 	pad: true,
		// 	scroll: this.isScrollContainer(),
		// 	border: false,
		// 	...this.resource.body || { children: this.resource.children || {} },
		// 	type: "single"
		// }, "body");

		return new KarmaFieldsAlpha.field.form.single({
			// id: this.getId(),
			// length,
			offsetContainer: true,
			scrollContainer: this.isScrollContainer(),
			pad: true,
			scroll: this.isScrollContainer(),
			border: false,
			...this.resource.body || { children: this.resource.children || {} }
			// type: "single"
		}, "body", query);

	}

	*buildSections() {

		yield* super.buildSections();

		if (this.resource.postform) {

			const postform = new KarmaFieldsAlpha.field.form.postform({}, "postform", this);

			yield* postform.build();

		}

	}

}

KarmaFieldsAlpha.field.form.single = class extends KarmaFieldsAlpha.field.group {

	getValue(key) {

		return this.parent.getValue(key, 0, 1);

	}

	setValue(value, key) {

		this.parent.setValue(value, key, 0, 1);

	}

	// *build() {

	// 	yield {
	// 		class: "hgkgflj",
	// 		init: element => {
	// 			element.innerHTML = "lglG";
	// 		}
	// 	};

	// }



}



KarmaFieldsAlpha.field.form.header = class extends KarmaFieldsAlpha.field.container.header {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			children: [
				"title",
				"close"
			],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.form.footer = class extends KarmaFieldsAlpha.field.container.footer {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			children: [
				"save"
			],
			...resource
		}, id, parent);

	}

}


KarmaFieldsAlpha.field.form.postform = class extends KarmaFieldsAlpha.field.form {

	*build() {

		// if (!document.getElementById("karmafieldsalpha-form-input")) {

		// yield* super.build();

		// if (this.resource.hiddenfield !== false) {

			yield {
				tag: "input",
				init: element => {
					element.id = "karmafieldsalpha-form-input";
					element.type = "hidden";
					element.name = "karma-fields-items[]";
				},
				update: element => {
					const delta = KarmaFieldsAlpha.server.getEdits();
					if (delta) {
						element.value = JSON.stringify(delta);
					} else {
						element.value = "";
					}
				}
			};

			yield {
				tag: "input",
				init: element => {
					element.type = "hidden";
					element.name = "karma-fields-queries[]";
				},
				update: element => {
					const delta = KarmaFieldsAlpha.server.getAdds();
					if (delta) {
						element.value = JSON.stringify(delta);
					} else {
						element.value = "";
					}
				}
			};

		}

	// }

}
