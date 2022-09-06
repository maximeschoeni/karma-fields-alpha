KarmaFieldsAlpha.fields.submit = class extends KarmaFieldsAlpha.fields.button {

	constructor(resource) {
		super({
			primary: true,
			title: "Submit",
			action: "submit",
			disabled: ["!", ["modified"]],
			...resource
		});


	}

}
