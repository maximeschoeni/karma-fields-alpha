

KarmaFieldsAlpha.forms = {};

KarmaFieldsAlpha.fields.formBasic = class extends KarmaFieldsAlpha.fields.group {

	constructor(...args) {
		super(...args);

		this.prefix = "karma";

		KarmaFieldsAlpha.forms[this.resource.driver || this.resource.key] = this;

	}

	// when something get edited outside the form
	update() {

	}

	// when something get edited inside the form
	edit() {

	}

	// when something get submited inside the form
	submit() {

	}

	getForm() {
    return this;
  }

	getPath() {
		return [];
	}


	fetchValue(expectedType, ...path) {

		return this.getDeltaValue(...path);

  }

	getValue(...path) {

		return this.getDeltaValue(...path);

	}

  // setValue(value, keys) {
	setValue(type, value, ...path) {

		if (!value || value.constructor !== Array) {
			console.error("Value must be an array!");
		}

		this.setDeltaValue(value, ...path);

  }


	// removeValue(keys) {
	removeValue(...path) {

		this.removeDeltaValue(...path);

  }

	async isModified(...path) {

		return false;

	}

	getDeltaValue(...path) {
		return (this.delta || KarmaFieldsAlpha.Delta).get(this.resource.driver || this.resource.key, ...path);
	}

	setDeltaValue(value, ...path) {
		(this.delta || KarmaFieldsAlpha.Delta).set(value, this.resource.driver || this.resource.key, ...path);
	}

	removeDeltaValue(...path) {
		(this.delta || KarmaFieldsAlpha.Delta).remove(this.resource.driver || this.resource.key, ...path);
	}

	getState() {
    return this.state || "";
  }




};
