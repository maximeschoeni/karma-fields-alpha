
KarmaFieldsAlpha.fields.formHistory = class extends KarmaFieldsAlpha.fields.form {

	constructor(...args) {
		super(...args);

		this.history = new KarmaFieldsAlpha.Buffer("history", this.resource.id || this.getId());

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

			case "set":
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
				await super.dispatch(event);
				this.writeHistory(event.getArray(), ...event.path);
				break;

			default:
				await super.dispatch(event);
				break;

		}

		return event;
	}

	// async set(value, ...path) {
	//
	// 	await super.set(value, ...path);
	//
	// 	this.writeHistory(value, ...path);
	//
	// }
	//
	// async remove(...path) {
	//
	// 	await super.remove(...path);
	//
	// 	this.writeHistory(null, ...path);
	//
	// }
	//
	// async setState(value, ...path) {
	//
	// 	const key = path.pop();
	//
	// 	switch (context) {
	//
	// 		case "write": {
	// 			let value = await super.get(...path) || null;
	// 			this.writeHistory(value, ...path);
	// 			break;
	// 		}
	//
	// 		case "nextup": {
	// 			this.nextup(path.join("/"));
	// 			break;
	// 		}
	//
	// 		default:
	// 			await super.setState(value, ...path, key);
	// 			break;
	//
	// 	}
	//
  // }


	// nextup(id) {
	//
	// 	if (!id || id !== this.historyId) {
	//
	// 		// -> increase index and max
	// 		let index = this.history.get(location.hash, "index") || 0;
	// 		index++;
	//
	// 		this.history.set(index, location.hash, "index");
	// 		this.history.set(index, location.hash, "max");
	//
	// 		// erase history forward
	// 		if (this.history.has(location.hash, index)) {
	// 			this.history.remove(location.hash, index);
	// 		}
	//
	// 		this.historyId = id;
	// 	}
	//
	// }

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

			this.triggerListeners();
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

			this.triggerListeners();
		}

	}

	hasRedo() {
		const index = this.history.get(location.hash, "index") || 0;
		const max = this.history.get(location.hash, "max") || 0;
		return index < max;
	}


};
