
KarmaFieldsAlpha.fields.formHistory = class extends KarmaFieldsAlpha.fields.form {

	constructor(...args) {
		super(...args);

		// this.history = new KarmaFieldsAlpha.Buffer("history", this.resource.id || this.getId());

		this.history = new KarmaFieldsAlpha.LocalStorage("history", this.resource.id || this.getId());

	}

	async dispatch(event) {

		switch (event.action) {

			case "backup":
				await this.write(...event.path);
				break;

			case "save":
				this.save(event.id);
				break;

			case "backup&save":
				await this.write(...event.path);
				this.save();
				break;

			case "set": {
				if (event.backup === "once") {
					const id = event.path.join("/");
					if (id !== this.historyId) {
						await this.write(...event.path);
						this.save(id);
						// this.historyId = id;
					}
				} else if (event.backup === "always") {
					await this.write(...event.path);
					this.save();
					// this.historyId = null;
				}
				const path = [...event.path]; // -> prevent append "content"
				await super.dispatch(event);

				this.writeHistory(event.getArray(), ...path);
				break;
			}

			default:
				await super.dispatch(event);
				break;

		}

		return event;
	}



	async write(...path) {

		const event = this.createEvent({
			action: "get",
			type: "array",
			path: [...path]
		});

		await super.dispatch(event);

		this.writeHistory(event.getArray(), ...path);
	}

	save(id) {

		// -> increase index and max
		let index = this.history.get("index") || 0;
		index++;

		this.history.set(index, "index");
		this.history.set(index, "max");

		// erase history forward
		if (this.history.has(index)) {
			this.history.remove(index);
		}

		this.historyId = id;

	}



	writeHistory(value, ...path) {

		// KarmaFieldsAlpha.History.write(value, this.resource.driver || this.resource.key, ...path);
		const index = this.history.get("index") || 0;

		this.history.set(value, index, ...path);
		this.history.set(location.hash, "hash", index);

	}

	getHash() {
		let index = this.history.get("index") || 0;
		return this.history.get("hash", index);
	}

	undo() {
		let index = this.history.get("index") || 0;

		if (index > 0) {

			// decrement index and save
			index--;
			this.history.set(index, "index");

			// rewind previous state
			const state = this.history.get(index) || {};
			this.buffer.merge(state);

			// clear history id
			this.historyId = undefined;

			// let hash = this.history.get("hash", index);

			// await super.dispatch(this.createEvent({
			// 	action: "undo",
			// 	hash: hash
			// }));

			// if (location.hash !== hash) {
			// 	location.hash = hash;
			// } else {
			// 	// this.triggerListeners();
			// }

		}

	}

	hasUndo() {
		const index = this.history.get("index") || 0;
		return index > 0;
	}

	redo() {
		let index = this.history.get("index") || 0;
		let max = this.history.get("max") || 0;
		// let hash = this.history.get("hash", index);

		if (index < max) {

			// increment index and save
			index++;
			this.history.set(index, "index");

			// merge state in delta
			const state = this.history.get(index) || {};
			this.buffer.merge(state);

			// clear history id
			this.historyId = undefined;


			// await super.dispatch(this.createEvent({
			// 	action: "redo",
			// 	hash: hash
			// }));

			// if (location.hash !== hash) {
			// 	location.hash = hash;
			// } else {
			// 	await this.triggerListeners();
			// }
		}

	}

	hasRedo() {
		const index = this.history.get("index") || 0;
		const max = this.history.get("max") || 0;
		return index < max;
	}


};
