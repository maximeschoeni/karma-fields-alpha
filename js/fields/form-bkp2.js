


KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.group {

	constructor(...args) {
		super(...args);

		// this.prefix = "karma";

		// KarmaFieldsAlpha.forms[this.resource.driver || this.resource.key] = this;


		// this.buffer = new KarmaFieldsAlpha.Buffer();
		this.buffer = new KarmaFieldsAlpha.DeepObject();

	}

	// async submit() {
	// 	// await this.send(this.buffer.getObject());
	// 	await super.set(this.buffer.getObject(), "delta");
	// 	this.buffer.empty();
	// }




	//
	// // when something get edited inside the form
	// async edit(action, ...path) {
	//
	// 	if (action === "submit") {
	//
	// 		await this.submit();
	//
	// 	} else if (action) {
	//
	// 		await super.edit(action, ...path);
	// 		// -> forms like options form should filter out all actions
	// 		// -> ... tinymce link form needs actions to go through
	//
	//
	//
	// 	} else {
	//
	// 		// -> any input
	//
	// 		this.update(); // -> update up to submit buttons
	//
	// 	}
	//
	//
	//
	// }

	// used for checkboxes
	getForm() {
    return this;
  }

	// used for checkboxes
	getPath() {
		return [];
	}



	// fetchValue(expectedType, ...path) {
	//
	// 	return this.buffer.get(...path) || super.fetchValue(null, ...path) || [];
	//
  // }


	// setValue(type, value, ...path) {
	//
	// 	if (!value || !Array.isArray(value)) {
	// 		console.error("Value must be an array!");
	// 	}
	//
	// 	this.buffer.set(value, ...path);
	//
  // }


	// removeValue(...path) {
	//
	// 	this.buffer.remove(...path);
	//
  // }
	//
	// getValue(...path) {
	// 	console.log("Deprecated");
	//
	// 	return this.buffer.get(...path);
	//
  // }


	async isModified(...path) {

		let value = this.buffer.get(...path);

		return Boolean(value) && KarmaFieldsAlpha.DeepObjectAsync.some(value, async (object, ...path) => {

			const original = await super.get(...path, this.resource.context || "value");

			return KarmaFieldsAlpha.DeepObject.differ(object, original);
		}, ...path);

	}

	// async isUnmodified(...path) {
	//
	// 	let value = this.buffer.get(...path);
	//
	// 	return !value || KarmaFieldsAlpha.DeepObjectAsync.every(value, async (object, ...path) => {
	// 		const original = await super.fetchValue(null, ...path);
	// 		return KarmaFieldsAlpha.DeepObject.equal(object, original);
	// 	}, ...path);
	//
	// }

	// async getState(...path) {
	//
	// 	const state = path.pop();
	//
	// 	switch (state) {
	//
	// 		case "modified":
	// 			return this.isModified(...path);
	//
	// 		default:
	// 			return (await this.fetchValue(null, ...path, state) || []).toString();
	//
	// 			// return super.getState(...path, state);
	//
	// 	}
	//
	// }


	async get(...path) {

		const context = path.pop();

		switch (context) {

			case "value":

				// console.log(path, JSON.stringify(this.buffer.get(...path)));
				// return [];

				return this.buffer.get(...path) || await super.get(...path, context) || [];

			case "modified":
				return [await this.isModified(...path)];

			case "save":
			case "send":
			case "write":
			case "nextup":
				console.log("!! Form get", context);
				return [];

			default:
				return this.get(...path, context, "value"); // -> use value for condition checks

		}

	}

	async set(value, ...path) {

		const context = path.pop();

		switch (context) {

			case "value":
				if (!Array.isArray(value)) {
					console.error("Value must be an array!");
				}

				console.log(value, path);

				if (path.length) {
					this.buffer.set(value, ...path);
				} else {
					this.buffer.setObject(value[0]);
				}

				// this.buffer.set(value, ...path);

				this.update(); // -> render buttons
				break;

			case "submit":
				// await this.submit();
				if (value.length === 0) {
					value[0] = this.buffer.getObject();
					this.buffer.empty();
				}
				await super.set(value, ...path, "submit");
				break;

			case "save":
			case "send":
			case "write":
			case "nextup":
				// console.log("Form set", context);
				break;

			default:
				await super.set(value, ...path, context);
				break;

		}

		// if (action === "submit") {
		//
		//
		//
		// } else if (action) {
		//
		// 	await super.edit(action, ...path);
		// 	// -> forms like options form should filter out all actions
		// 	// -> ... tinymce link form needs actions to go through
		//
		//
		//
		// } else {
		//
		// 	// -> any input
		//
		// 	this.update(); // -> update up to submit buttons
		//
		// }



	}


};
