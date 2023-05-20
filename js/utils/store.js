
KarmaFieldsAlpha.Store = class {

	static getObject() {

		if (!this.cache) {

			const string = localStorage.getItem(this.storageName);

			if (string) {

				this.cache = JSON.parse(string);

			} else {

				this.cache = {};

			}

		}

		return this.cache;
	}

	static setObject(object) {

		this.cache = object;

		const string = JSON.stringify(this.cache);

		localStorage.setItem(this.storageName, string);

	}

	static get(...path) {

		return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);

	}

	static set(value, ...path) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.set(object, value, ...path);

		this.setObject(object);

	}

	static remove(...path) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.remove(object, ...path);

		this.setObject(object);
	}

	static assign(value, ...path) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.assign(object, value, ...path);

		this.setObject(object);

	}

	static merge(value) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.merge(object, value);

		this.setObject(object);

	}

}

KarmaFieldsAlpha.Store.storageName = "UF0";
