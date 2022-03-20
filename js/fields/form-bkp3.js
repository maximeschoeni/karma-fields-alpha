
// KarmaFieldsAlpha.buffer = {
// 	formName: [
//
// 	]
// }

KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.group {

	constructor(...args) {
		super(...args);

		// this.prefix = "karma";

		this.buffer = new KarmaFieldsAlpha.Buffer("form", this.resource.id || this.getId());
		// this.buffer = new KarmaFieldsAlpha.Buffer(...(this.resource.bufferPath || [this.resource.id || this.getId()]));


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


		if (value !== undefined) {

			const original = await super.get(...path, this.resource.context || "value") || [];

			return KarmaFieldsAlpha.DeepObject.differ(value, original);

		}

		return false;

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


	async getState(...path) {

		const context = path.pop();

		switch (context) {

			case "modified":
				return this.isModified(...path);

		}


	}


	async get(...path) {

		const context = path.pop();

		switch (context) {

			case "value": {
				let value = this.buffer.get(...path);
				if (value === undefined) {
					value = await super.get(...path, context);
				}
				return value;
			}

				// return this.buffer.get(...path) || await super.get(...path, context) || [];

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


				//
				// if (path.length) {
				// 	this.buffer.set(value, ...path);
				// } else {
				// 	this.buffer.setObject(value[0]);
				// }

				this.buffer.set(value, ...path);


				this.update(); // -> render buttons
				break;

			case "submit":
				// await this.submit();

				if (!value) {
					// value[0] = this.buffer.getObject();
					value = this.buffer.get();
					this.buffer.empty();
				}
				await super.set(value, ...path, "submit");
				break;

			case "save":
			case "send":
			case "write":
			case "nextup":
				// -> deprecated
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
