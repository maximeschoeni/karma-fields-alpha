
KarmaFieldsAlpha.fields.formHistory = class extends KarmaFieldsAlpha.fields.form {

	constructor(...args) {
		super(...args);

		this.history = new KarmaFieldsAlpha.LocalStorage("history");

	}

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


		this.writeHistory(currentValue || null, "content", ...path);
	}

	removeValue(...path) {

		this.writeHistory(null, ...path);

		super.remove(...path);

  }

	createValue(value, ...path) {

		this.writeHistory(value, ...path);

		super.createValue(value, ...path);

	}


	nextup(value) {

		if (!value || value !== this.historyId) {

			// -> increase index and max
			let index = this.history.get(location.hash, "index") || 0;
			index++;

			this.history.set(index, location.hash, "index");
			this.history.set(index, location.hash, "max");

			// erase history forward
			if (this.history.has(location.hash, index)) {
				this.history.remove(location.hash, index);
			}

			this.historyId = value;
		}

	}



	writeHistory(value, ...path) {


		// KarmaFieldsAlpha.History.write(value, this.resource.driver || this.resource.key, ...path);
		const index = this.history.get(location.hash, "index") || 0;

		this.history.set(value, location.hash, index, ...path);

	}


	// deprecated??
	// async backup(...path) {
	//
	// 	const id = path.join("/");
	//
	// 	if (id !== KarmaFieldsAlpha.History.id) {
	//
	// 		KarmaFieldsAlpha.History.id = id;
	//
	// 		await this.write(...path);
	//
	// 		KarmaFieldsAlpha.History.backup();
	//
	// 	}
	// }

	undo() {
		let index = this.history.get(location.hash, "index") || 0;

		if (index > 0) {

			// decrement index and save
			index--;
			this.history.set(index, location.hash, "index");

			// rewind previous state
			const state = this.history.get(location.hash, index) || {};
			this.buffer.merge(state);

			// clear history id
			this.historyId = undefined;
		}

	}

	hasUndo() {
		const index = this.history.get(location.hash, "index") || 0;
		return index > 0;
	}

	redo() {
		let index = this.history.get(location.hash, "index") || 0;
		let max = this.history.get(location.hash, "max") || 0;

		if (index < max) {

			// increment index and save
			index++;
			this.history.set(index, location.hash, "index");

			// merge state in delta
			const state = this.history.get(location.hash, index) || {};
			this.buffer.merge(state);

			// clear history id
			this.historyId = undefined;
		}

	}

	hasRedo() {
		const index = this.history.get(location.hash, "index") || 0;
		const max = this.history.get(location.hash, "max") || 0;
		return index < max;
	}

	// undo() {
	// 	let index = KarmaFieldsAlpha.History.get("index") || 0;
	//
	// 	if (index > 0) {
	//
	// 		// decrement index and save
	// 		index--;
	// 		KarmaFieldsAlpha.History.set(index, "index");
	//
	// 		// rewind previous state
	// 		const state = KarmaFieldsAlpha.History.get(index) || {};
	// 		this.buffer.merge(state);
	//
	// 		// clear history id
	// 		KarmaFieldsAlpha.History.id = undefined;
	// 	}
	//
	// }
	//
	// hasUndo() {
	// 	const index = KarmaFieldsAlpha.History.get("index") || 0;
	// 	return index > 0;
	// }
	//
	// redo() {
	// 	let index = KarmaFieldsAlpha.History.get("index") || 0;
	// 	let max = KarmaFieldsAlpha.History.get("max") || 0;
	//
	// 	if (index < max) {
	//
	// 		// increment index and save
	// 		index++;
	// 		KarmaFieldsAlpha.History.set(index, "index");
	//
	// 		// merge state in delta
	// 		const state = KarmaFieldsAlpha.History.get(index) || {};
	// 		this.buffer.merge(state);
	//
	// 		// clear history id
	// 		KarmaFieldsAlpha.History.id = undefined;
	// 	}
	//
	// }
	//
	// hasRedo() {
	// 	const index = KarmaFieldsAlpha.History.get("index") || 0;
	// 	const max = KarmaFieldsAlpha.History.get("max") || 0;
	// 	return index < max;
	// }

};
