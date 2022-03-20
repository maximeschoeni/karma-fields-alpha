


KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.group {

	constructor(...args) {
		super(...args);

		// this.prefix = "karma";

		// KarmaFieldsAlpha.forms[this.resource.driver || this.resource.key] = this;


		this.buffer = new KarmaFieldsAlpha.DeepObject();

	}

	async submit() {
		// await this.save(this.buffer.getObject());
		await this.send(this.buffer.getObject());
		this.buffer.empty();
	}





	// when something get edited inside the form
	async edit(value) {

		if (value === "submit") {

			await this.submit();

		} else {

			// await super.edit(value);
			// -> forms like options form should filter out all actions

			this.update(); // -> update up to submit buttons

		}

	}

	getForm() {
    return this;
  }

	getPath() {
		return [];
	}


	fetchValue(expectedType, ...path) {

		// attention si empty path -> return un object pas un array !!!
		return this.buffer.get(...path) || super.fetchValue(null, ...path);

  }

	setValue(type, value, ...path) {

		if (!value || !Array.isArray(value)) {
			console.error("Value must be an array!");
		}

		// this.setDeltaValue(value, ...path);
		this.buffer.set(value, ...path);

  }


	// removeValue(keys) {
	removeValue(...path) {

		// this.removeDeltaValue(...path);
		this.delta.remove(...path);

  }

	getValue(...path) {

		return this.buffer.get(...path);

  }


	async isModified(...path) {

		// return !this.parent.buffer.equal(this.buffer.get(...path), ...path);
		//
		//
		// return !this.getValue(...path).equal(this.buffer.get(...path), ...path);

		const value = await super.fetchValue(null, ...path) || [];
		const bufferValue = path.length ? this.buffer.get(...path) : [this.buffer.getObject()]

		console.log(path, value[0], this.buffer.get(...path));


		return !this.buffer.equal(value, ...path);

	}

	async fetchState(value) {

		if (value === "submit") {

			// debugger;

			return await this.isModified() === false;

    } else {

			return super.fetchState(value);
		}

	}


};
