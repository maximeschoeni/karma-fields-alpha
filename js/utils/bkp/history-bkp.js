

KarmaFieldsAlpha.History = class {

	static buffer = new KarmaFieldsAlpha.Buffer();

	static save() {

		// -> increase index and max
		let index = this.getIndex() || 0;
		index++;

		this.buffer.set(index, "history", "index");
		this.buffer.set(index, "history", "max");

		// erase history forward
		if (this.buffer.has("history", index)) {
			this.buffer.remove("history", index);
		}

	}

	static get(index, ...path) {
		return this.buffer.get("history", index, ...path);
	}

	static set(value, index, ...path) {
		this.buffer.set(value, "history", index, ...path);
	}

	static remove(...path) {
		this.buffer.remove("history", ...path);
	}

	static getIndex() {
		return this.buffer.get("history", "index") || 0;
	}

	static setIndex(index) {
		return this.buffer.set(index, "history", "index");
	}

	// static tie(newValue, ...path) {

	// 	let index = this.getIndex() || 0;

	// 	const lastValue = this.get(index, ...path);

	// 	if (KarmaFieldsAlpha.DeepObject.differ(newValue, lastValue)) {
	// 		this.save();
	// 	}

	// }

	// static pack(newValue, currentValue, ...path) {

	// 	const index = this.getIndex();
	// 	const lastValue = this.get(index-1, ...path);

	// 	this.set(newValue, index, ...path);

	// 	if (lastValue === undefined && index > 0) {
	// 		this.set(currentValue, index-1, ...path);
	// 	}

  // }

	// static push(value, ...path) {
	// 	const index = this.getIndex();
	// 	this.set(value, index, ...path);
  // }

	// static backup(newValue, currentValue, tie, ...path) {

	// 	if (tie) {
	// 		this.save();
	// 	}

	// 	let index = this.getIndex();

	// 	// if (index === 0) {
	// 	// 	index++;
	// 	// }

	// 	newValue = KarmaFieldsAlpha.DeepObject.clone(newValue);

	// 	this.set(newValue, index, ...path);

	// 	if (index > 0) {

	// 		const lastValue = this.get(index-1, ...path);

	// 		if (lastValue === undefined) {

	// 			if (currentValue === undefined) {
	// 				currentValue = null;
	// 			} else {
	// 				currentValue = KarmaFieldsAlpha.DeepObject.clone(currentValue);
	// 			}


	// 			this.set(currentValue, index-1, ...path);
	// 		}

	// 	}

  // }

  static backup(newValue, currentValue, ...path) {

		let index = this.getIndex();

		newValue = KarmaFieldsAlpha.DeepObject.clone(newValue);

		this.set(newValue, index, ...path);

		if (index > 0) {

			const lastValue = this.get(index-1, ...path);

			if (lastValue === undefined) {

				// if (currentValue === undefined) {
				// 	currentValue = null;
				// } else {
				// 	currentValue = KarmaFieldsAlpha.DeepObject.clone(currentValue);
				// }


				this.set(currentValue, index-1, ...path);
			}

		}


  }


	// static backup(...path) { // path = ["data", "driver", "id", "key"]
	// 	const value = this.buffer.get(...path) || null;
	// 	this.write(value, ...path);
	// }

	// static write(value, ...path) {
	// 	const index = this.buffer.get("history", "index") || 0;
	// 	this.buffer.set(value, "history", index, ...path);
	// }

	static undo() {
		let index = this.buffer.get("history", "index") || 0;

		if (index > 0) {

			// decrement index and save
			index--;
			this.buffer.set(index, "history", "index");

			// rewind previous state
			const data = this.buffer.get("history", index, "data") || {};
			this.buffer.merge(data, "data");

      const nav = this.buffer.get("history", index, "nav") || {};
			// KarmaFieldsAlpha.Nav.merge(nav);

      history.replaceState({...history.state, ...nav}, "");

			// const state = this.buffer.get("history", index, "state") || {};
			// this.buffer.merge(state, "state");


      

		}

	}

	static hasUndo() {
		const index = this.buffer.get("history", "index") || 0;
		return index > 0;
	}

  static redo() {
		let index = this.buffer.get("history", "index") || 0;
		let max = this.buffer.get("history", "max") || 0;

		if (index < max) {

			// increment index and save
			index++;
			this.buffer.set(index, "history", "index");

			// merge state in delta
			const data = this.buffer.get("history", index, "data") || {};
			this.buffer.merge(data, "data");
			// this.buffer.clean("data");

      const nav = this.buffer.get("history", index, "nav") || {};
			// KarmaFieldsAlpha.Nav.merge(nav);

      history.replaceState({...history.state, ...nav}, "");

			// const state = this.buffer.get("history", index, "state") || {};
			// this.buffer.merge(state, "state");

		}

	}

	static hasRedo() {
		const index = this.buffer.get("history", "index") || 0;
		const max = this.buffer.get("history", "max") || 0;

		return index < max;
	}

	// static hasChange(...path) {
	// 	const index = this.buffer.get("history", "index") || 0;
	// 	return this.buffer.has("history", index, ...path);
	// }

}

// document.addEventListener("keydown", event => {
//   if (event.key === "z" && event.metaKey) {
//     event.preventDefault();
//     KarmaFieldsAlpha.History.undo();

//   } else if (event.key === "z" && event.metaKey && event.shiftKey) {
//     event.preventDefault();
//     KarmaFieldsAlpha.History.redo();
//   }
// });