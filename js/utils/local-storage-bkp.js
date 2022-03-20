
KarmaFieldsAlpha.LocalStorage = class extends KarmaFieldsAlpha.DeepObject {

	// static getObject(...path) {
	// 	const delta = sessionStorage.getItem(this.prefix);
	// 	return delta && JSON.parse(delta) || {};
	// }
	//
	// static setObject(delta) {
	// 	if (delta) {
	// 		sessionStorage.setItem(this.prefix, JSON.stringify(delta));
	// 	} else {
	// 		sessionStorage.removeItem(this.prefix);
	// 	}
	// }

	constructor(...path) {
		super();

		this.path = path;

	}

	getObject() {

		// if (!this.deltaCache) {
		//
		// 	const delta = localStorage.getItem(this.constructor.prefix);
		// 
		// 	this.deltaCache = delta && JSON.parse(delta) || {};
		// }
		//
		// return this.deltaCache;


		const delta = localStorage.getItem(this.constructor.prefix);

		return delta && JSON.parse(delta) || {};

	}

	setObject(delta) {

		localStorage.setItem(this.constructor.prefix, JSON.stringify(delta));

		// this.deltaCache = delta;

	}

	empty() {

		localStorage.removeItem(this.constructor.prefix);

		// this.deltaCache = {};

	}

	get(...path) {
		return super.get(...this.path, ...path);
	}

	set(value, ...path) {
		super.set(value, ...this.path, ...path);
	}

	remove(...path) {
		super.remove(...this.path, ...path);
	}

	has(...path) {
		return super.has(...this.path, ...path);
	}

	merge(value, ...path) {
		super.merge(value, ...this.path, ...path);
  }

	merge(value) {
		if (this.path.length) {
			const object = this.get() || {};
			this.constructor.merge(object, value);
			this.set(object);
		} else {
			super.merge(value);
		}
	}

	deleteObject() {

		this.empty();

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
	// 		this.merge(state);
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
	// 		this.merge(state);
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

}

KarmaFieldsAlpha.LocalStorage.prefix = "karma";
