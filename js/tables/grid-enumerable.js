
KarmaFieldsAlpha.field.enumerable = class extends KarmaFieldsAlpha.field.dialog {

	getLength() {

		return this.resource.length || 0;

	}

	*generateIndexes() {

		for (let i = 0; i < this.resource.length; i++) {

			yield i;

		}

	}

	*listKeys() {

		if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const resource = this.resource.children[i];
				const child = this.createChild(resource, i);

				yield* child.listKeys();

			}

		}

		yield* super.listKeys(); // -> list keys in dialog

	}

	getRow(index) {

		return this.createChild(this.resource.row, index);

	}

	newChild(index) {

		if (index < this.resource.length) {

			return this.getRow(index);

		}

		return super.newChild(index); // -> dialog

	}



	doAction(action, ...args) {

		switch (action) {

			// case "swap":
			// 	this.swap(...args);
			// 	break;

			// case "deleteAt":
			// case "removeAt":
			// 	this.deleteAt(...args);
			// 	break;

			// case "setValueAt": {
			// 	this.setValueAt(params.value, params.key, params.index);
			// }

			default:
				super.doAction(action, ...args)

		}

	}

	isMixed(key, index, length) {

		const value = this.parent.getValue(key, index);

		if (value === undefined) {

			return;

		}

		for (let i = 1; i < length; i++) {

			const otherValue = this.parent.getValueAt(key, index + i);

			if (otherValue === undefined) {

				return;

			}

			if (!KarmaFieldsAlpha.DeepObject.equal(value, otherValue)) {

				return true;

			}

		}

		return false;

	}

	getValue(key, index, length = 1) {

		const value = this.parent.getValue(key, index);

		if (value === undefined) {

			return;

		}

		if (length > 1) {

			for (let i = 1; i < length; i++) {

				const otherValue = this.parent.getValue(key, index + i);

				if (otherValue === undefined) {

					return;

				}

				if (!KarmaFieldsAlpha.DeepObject.equal(value, otherValue)) {

					return [];

				}

			}

		}

		return value;

	}

	setValue(value, key, index, length = 1) {

		for (let i = 0; i < length; i++) {

			this.parent.setValue(value, key, index + i);

		}

	}



	getValueAt(key, index) {

		return this.parent.getValueAt(key, index);

	}

	setValueAt(value, key, index) {

		this.parent.setValueAt(value, key, id);

	}

	hasValue(value, key) {

		for (let i = 0; i < this.resource.length; i++) {

			const values = this.parent.getValueAt(key, i);

			if (values === undefined) {

				return;

			}

			if (values[0] === value) {

				return true;

			}

		}

		return false;
	}

	getAllValues(key, index, length) {

		const values = [];

		for (let i = 0; i < length; i++) {

			const value = this.parent.getValueAt(key, index + i);

			if (value === undefined) {

				return;

			}

			values.push(value[0]);

		}

		return values;
	}

	getIds() {

		return this.getAllValues("id");

	}

	slice(index = 0, length = this.resource.length) {

		const array = [];

		for (let i = 0; i < length; i++) {

			const rowField = this.getRow(index + i);

			rowField.import(array[i]);

			const collection = rowField.export();

			array.push(collection);

		}

		if (array.some(collection => collection === undefined)) {

			return;

		}

		return array;

	}

	insert(array, index = 0, length = this.resource.length) {

		if (array.length < length) {

			this.parent.delete(index + array.length, length - array.length);

		} else if (array.length > length) {

			this.parent.add(index, array.length - length);

		}

		for (let i = 0; i < array.length; i++) {

			const rowField = this.getRow(index + i);

			rowField.import(array[i]);

		}

	}

	duplicate(index, length) {

		KarmaFieldsAlpha.Store.addPromise(done => {

			const array = this.slice(index, length);

			if (array !== undefined) {

				this.insert(array, index + length, 0); // append new items just after

				done();

			}

		}, "duplicate");

		// return new Promise(resolve => {

		// 	KarmaFieldsAlpha.Store.addPromise(done => {

		// 		const array = this.slice(index, length);

		// 		if (array !== undefined) {

		// 			this.insert(array, index + length, length);

		// 			done(() => {
		// 				resolve(index + length);
		// 			});

		// 		}

		// 	}, "duplicate");

		// });

	}




	getDefaultIndex() {

		if (this.resource.defaultIndex !== undefined) {

			return this.resource.defaultIndex;

		} else {

			return this.getLength();

		}

	}

	getNewItemIndex() {

		return this.getDefaultIndex();

	}



	export() {

		const array = this.slice();

		if (array === undefined) {

			return;

		}

		const csv = new KarmaFieldsAlpha.field.CSV({ array });

		return [csv.toString()];

	}

	import(collection) {

		const string = collection.shift();

		if (string) {

			const csv = new KarmaFieldsAlpha.field.CSV({ string });

			const array = csv.toArray(); // -> array of arrays

			this.insert(array);

		}

	}

}


KarmaFieldsAlpha.field.enumerable.row = class extends KarmaFieldsAlpha.field.group {

	getValue(key) {

		return this.parent.getValue(key, this.resource.index);

	}

	setValue(value, key) {

		this.parent.setValue(value, key, this.resource.index);

	}

	getIndex() {

		return this.resource.index;

	}

	doAction(action, ...args) {

		switch (action) {

			case "delete":
			case "remove":
				this.parent.doAction("delete", this.index, 1);
				break;

			case "open":
				this.parent.doAction("open", this.index, 1);
				break;

			case "getIndex":
				return this.getIndex();

			default:
				return super.doAction(action, ...args)

		}

	}

	isSelected() {

		return this.parent.isSelected(this.index);

	}


}
