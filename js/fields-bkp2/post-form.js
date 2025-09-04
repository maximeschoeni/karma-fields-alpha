
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.form {

	*buildBody() {

		const body = this.getBody();

		yield {
			class: "table-body",
			children: body.build()
		};


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

		}

	}

}
