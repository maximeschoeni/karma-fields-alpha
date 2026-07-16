
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.form {

	*buildBody() {



		// const body = this.getBody();

		// yield {
		// 	class: "table-body",
		// 	children: body.build()
		// };

		yield* super.buildBody();

		if (this.resource.hiddenfield !== false) {

			yield {
				tag: "input",
				init: element => {
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

	}

}
