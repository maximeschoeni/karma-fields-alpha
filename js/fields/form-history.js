
KarmaFieldsAlpha.fields.formHistory = class extends KarmaFieldsAlpha.fields.formBasic {

	setValue(type, value, ...path) {

		super.setValue(null, value, ...path);

		this.writeHistory(value, ...path);
  }

	async write(...path) {
		let currentValue = await this.fetchValue(null, ...path);

		// if (currentValue === undefined) {
		//
		// 	currentValue = null;
		//
		// }

		this.writeHistory(currentValue || null, ...path);
	}

	removeValue(...path) {

		this.writeHistory(null, ...path);

		this.removeDeltaValue(...path);

  }

	writeHistory(value, ...path) {

		KarmaFieldsAlpha.History.write(value, this.resource.driver || this.resource.key, ...path);

	}


	// deprecated??
	async backup(...path) {

		const id = path.join("/");

		if (id !== KarmaFieldsAlpha.History.id) {

			KarmaFieldsAlpha.History.id = id;

			await this.write(...path);

			KarmaFieldsAlpha.History.backup();

		}
	}

};
