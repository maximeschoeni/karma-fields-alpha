
KarmaFieldsAlpha.History = class {


	static get(...path) {
		return KarmaFieldsAlpha.SessionStorage.get("history", location.hash, ...path);
	}

	static has(...path) {
		return KarmaFieldsAlpha.SessionStorage.has("history", location.hash, ...path);
	}

	static set(value, ...path) {
		KarmaFieldsAlpha.SessionStorage.set(value, "history", location.hash, ...path);
	}

	static remove(...path) {
		KarmaFieldsAlpha.SessionStorage.remove("history", location.hash, ...path);
	}

	static backup() {

		// -> increase index and max
		let index = this.get("index") || 0;
		index++;

		this.set(index, "index");
		this.set(index, "max");

		// erase history forward
		if (this.has(index)) {
			this.remove(index);
		}

	}

	static write(value, ...path) {

		const index = this.get("index") || 0;

		this.set(value, index, ...path);

	}

	static undo() {
		let index = this.get("index") || 0;

		if (index > 0) {

			// decrement index and save
			index--;
			this.set(index, "index");

			// rewind previous state
			const state = this.get(index) || {};
			KarmaFieldsAlpha.Delta.merge(state);

			// clear history id
			this.id = undefined;
		}

	}

	static hasUndo() {
		const index = this.get("index") || 0;
		return index > 0;
	}

	static redo() {
		let index = this.get("index") || 0;
		let max = this.get("max") || 0;

		if (index < max) {

			// increment index and save
			index++;
			this.set(index, "index");

			// merge state in delta
			const state = this.get(index) || {};
			KarmaFieldsAlpha.Delta.merge(state);

			// clear history id
			this.id = undefined;
		}

	}

	static hasRedo() {
		const index = this.get("index") || 0;
		const max = this.get("max") || 0;
		return index < max;
	}

}









KarmaFieldsAlpha.HistoryB = class {

	static backup() {

		let index = this.getIndex();
		index++;

		this.set(index, "index");
		this.set(index, "max");

		if (this.has(index)) {
			this.remove(index);
		}

	}

	static write(value, ...path) {

		const index = this.getIndex();
		this.set(value, index, ...path);

	}

	static undo() {

		let index =  this.getIndex();

		if (index > 0) {

			// decrement index and save
			index--;
			this.set(index, "index");

			// rewind previous state
			const prevState = this.get(index) || {};
			KarmaFieldsAlpha.Delta.merge(prevState);


			// clear history id
			this.id = undefined;
		}

	}

	static hasUndo() {
		return this.getIndex() > 0;
	}

	static redo() {
		let index = this.getIndex();
		let max = this.getMax();

		if (index < max) {

			// increment index and save state
			index++;
			this.set(index, "index");

			// merge state in delta
			const nextState = this.get(index) || {};
			KarmaFieldsAlpha.Delta.merge(nextState);

			// clear history id
			this.id = undefined;
		}

	}

	static getIndex() {
		return history.state && history.state.index || 0;
	}

	static getMax() {
		return history.state && history.state.max || 0;
	}

	static hasRedo() {
		return (this.get("index") || 1) < (this.get("max") || 1);
	}

	static get(...path) {
		return KarmaFieldsAlpha.DeepObject.get(history.state || {}, ...path);
	}

	static has(...path) {
		return KarmaFieldsAlpha.DeepObject.has(history.state || {}, ...path);
	}

	static set(value, ...path) {
		const state = history.state || {};
		KarmaFieldsAlpha.DeepObject.assign(state, value, ...path);
		history.replaceState(state, null);
	}

	static remove(...path) {
		const state = history.state || {};
		KarmaFieldsAlpha.DeepObject.remove(state, ...path);
		history.replaceState(state, null);
	}

}
