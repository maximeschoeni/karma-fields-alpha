
KarmaFieldsAlpha.fields.formHistory = class extends KarmaFieldsAlpha.fields.form {

	constructor(...args) {
		super(...args);

		// this.history = new KarmaFieldsAlpha.LocalStorage("history");
		this.history = new KarmaFieldsAlpha.Buffer("history", this.resource.id || this.getId());

	}

	async set(value, ...path) {

		await super.set(value, ...path);

		this.writeHistory(value, ...path);

	}

	async remove(...path) {

		await super.remove(...path);

		this.writeHistory(null, ...path);

	}

	async setState(value, ...path) {

		const key = path.pop();

		switch (context) {

			case "write": {
				let value = await super.get(...path) || null;
				this.writeHistory(value, ...path);
				break;
			}

			case "nextup": {
				this.nextup(path.join("/"));
				break;
			}

			default:
				await super.setState(value, ...path, key);
				break;

		}

  }


	nextup(id) {

		if (!id || id !== this.historyId) {

			// -> increase index and max
			let index = this.history.get(location.hash, "index") || 0;
			index++;

			this.history.set(index, location.hash, "index");
			this.history.set(index, location.hash, "max");

			// erase history forward
			if (this.history.has(location.hash, index)) {
				this.history.remove(location.hash, index);
			}

			this.historyId = id;
		}

	}



	writeHistory(value, ...path) {


		// KarmaFieldsAlpha.History.write(value, this.resource.driver || this.resource.key, ...path);
		const index = this.history.get(location.hash, "index") || 0;

		this.history.set(value, location.hash, index, ...path);

	}

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


};
