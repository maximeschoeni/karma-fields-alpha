
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field.container {

  // constructor(resource) {
  //
  //   super(resource);
  //
  //   // if (!resource.body) {
  //   //
  //   //   resource.body = {
  //   //     type: "grid",
  //   //     children: resource.columns || resource.children
  //   //   };
  //   //
  //   // }
  //
  //   if (!resource.footer) {
  //
  //     resource.footer = {
  //       type: "footer",
  //       children: ["add"]
  //     };
  //
  //   }
  //
  // }

  // newChild(id) {
  //
  //   if (id === "body") {
  //
  //     return new KarmaFieldsAlpha.field.grid({
  //       children: this.resource.columns || this.resource.children || [],
  //       sortable: this.resource.sortable,
  //       ...this.resource.body
  //     }, "body", this);
  //
  //   } else if (id === "footer") {
  //
  //     return new KarmaFieldsAlpha.field.array.footer({
  //       children: ["add"],
  //       ...this.resource.footer
  //     }, "footer", this);
  //
  //   }
  //
  // }

	getBody() {

		const constructor = this.getConstructor(this.resource.body && this.resource.body.type || "grid");

		return new constructor({
			children: this.resource.columns || this.resource.children || [],
			sortable: this.resource.sortable,
			...this.resource.body
		}, "body", this);

	}

	// used for button delete
	hasSelection() {

		const body = this.getChild("body");

		if (body && body.hasSelection) {

			return body.hasSelection();

		}

		return false;

	}


	getIndex() { // -> base index for row indexes

		return 0;

	}


	export() {

		// const output = new KarmaFieldsAlpha.Content();

		if (this.resource.export !== false) {

			const body = this.getChild("body");

			if (!body) {

				console.error("exporting array but body is not set");

			}

			const grid = body.export(0, length.toNumber());

			if (grid !== undefined) {

				const string = KarmaFieldsAlpha.CSV.stringify(grid);

				return [string];

			}

		}

	}

	import(collection) {

		const string = collection.shift();

		const grid = KarmaFieldsAlpha.CSV.parse(string);

		// const grid = new KarmaFieldsAlpha.Content.Grid(string);

		const body = this.getChild("body");

		body.import(grid);

	}


	getLength() {

		const arrayKey = this.getKey();

		if (arrayKey) {

			const values = this.parent.getValue(arrayKey);

			if (values) {

				return values.length;

			}

		} else {

			const keys = this.getKeys();

			let length = 0;

			for (let key of keys) {

				const value = this.parent.getValue(key);

				if (value === undefined) {

					return;

				}

				length = Math.max(length, value.length);

			}

			return length;

		}

	}

	*listIds() {


		const length = this.getLength() || 0;

		for (let i = 0; i < length; i++) {

			yield i;

		}

	}

	getIds() {

		return this.listIds().toArray();

	}

	// getQuery() {

	// 	const ids = this.getIds();

	// 	return { ids, count: ids.length };

	// }

	getValue(key, id, driver) {

		// why?
		// if (id === undefined) {

		// 	return [this.getParam(key)];

		// } else

		if (!key) {

			return super.getValue();

		} else if (!driver) {

			const arrayKey = this.getKey();

			if (arrayKey) {

				const values = this.parent.getValue(arrayKey);

				if (values !== undefined) {

					if (!values[id]) {

						return [];

					}

					let value = values[id][key] || [];

					if (!Array.isArray(value)) {

						value = [value];

					}

					return value;

				}

			} else {

				const values = this.parent.getValue(key);

				if (values !== undefined) {

					if (id >= values.length) {

						return [];

						//console.error("getting value but index is out of range", key, id, values);

					}

					return [values[id]];

				}

			}

		} else {

			return KarmaFieldsAlpha.server.getValue(driver, id, key, paramstring);

		}

	}

	setValue(value, key, id, driver) {

		if (!Array.isArray(value)) {

			console.error("setting value but value is not an array");

		}

		// why?
		// if (id === undefined) {

		// 	this.setParam(value[0], key);

		// } else

		if (!driver) {

			const arrayKey = this.getKey();

			if (arrayKey) {

				let values = this.parent.getValue(arrayKey);

				if (values === undefined) {

					console.error("setting value but value is undefined");

				}

				values = [...values];

				if (this.resource.singles) {

					values[id] = { ...values[id], [key]: value[0] };

				} else {

					values[id] = { ...values[id], [key]: value };

				}

				this.parent.setValue(values, arrayKey);

			} else {

				let values = this.parent.getValue(key);

				if (values !== undefined) {

					// if (id >= values.length) {

					// 	console.error("getting value but index is out of range");

					// }

					values = [...values];

					values[id] = value[0]; // -> never save value as array there

					this.parent.setValue(values, key);

				}

			}

		} else {

			super.setValue(value, key, id, driver);

		}

	}

	setOrder(newIds) {

		const arrayKey = this.getKey();

		if (arrayKey) {

			const values = this.parent.getValue(arrayKey);

			if (values === undefined) {

				console.error("reordering but values are not loaded");

			}

			const newValues = [];

			for (let i = 0; i < values.length; i++) {

				const index = newIds[i];

				if (index !== undefined) {

					newValues[index] = values[i];

				}

			}

			this.parent.setValue(newValues, arrayKey);

		} else {

			const keys = this.getKeys();

			for (let key of keys) {

				const values = this.parent.getValue(key);

				if (values === undefined) {

					console.error("reordering but values are not loaded");

				}

				const newValues = [];

				for (let i = 0; i < values.length; i++) {

					const index = newIds[i];

					if (index !== undefined) {

						newValues[index] = values[i];

					}

				}

				this.parent.setValue(newValues, key);

			}


		}

	}

	deleteAt(index, length = 1) {

		const ids = [];

		for (let i = 0; i < length; i++) {

			ids.push(i + index);

		}

		this.delete(...ids);

	}

	delete(...ids) {

		if (ids.length === 0) {

			const body = this.getChild("body");

			ids = body.getSelectedIds();

			body.removeSelection();

		}

		const key = this.getKey();

		if (key) {

			let values = this.parent.getValue(key);

			if (values) {

				values = values.filter((value, index) => !ids.includes(index));

				this.parent.setValue(values, key);

			}

		} else {

			const keys = this.listKeys();

			for (let key of keys) {

				let values = this.parent.getValue(key);

				if (values) {

					values = values.filter((value, index) => !ids.includes(index));

					this.parent.setValue(values, key);

				}

			}

		}



	}

	add(num = 1, params = {}) {

		const key = this.getKey();

		if (key) {

			const values = this.parent.getValue(key);

			if (values) {

				const newValues = [];

				for (let i = 0; i < num; i++) {

					newValues.push({});

				}

				this.parent.setValue([...values, ...newValues], key);

			}

		} else {

			const keys = this.listKeys();

			for (let key of keys) {

				const values = this.parent.getValue(key);

				if (values) {

					const newValues = [];

					for (let i = 0; i < num; i++) {

						newValues.push("");

					}
					this.parent.setValue([...values, ...newValues], key);

				}

			}

		}





		// const body = this.getChild("body");
		// const tokens = [];
		// const length = this.getLength();

		// if (length === undefined) {

		// 	console.error("adding item but length is undefined");

		// }

		// for (let i = 0; i < num; i++) {

		// 	tokens.push(num + i);

		// }

		// body.addIds(tokens, length - 1);

	}


  // async sortUp(index, length = 1) {

  //   if (index > 0) {

  //     return this.swap(index, length, index-1);

  //   }

  // }

  // async sortDown(index, length = 1) {

  //   if (index + length < this.getLength().toNumber()) {

  //     return this.swap(index, length, index+1);

  //   }

  // }


  *buildBody() {

		const body = this.getBody();

		if (body) {

			yield* body.build(); // -> don't wrap with body-content in tables

		}

	}

}

KarmaFieldsAlpha.field.array.footer = class extends KarmaFieldsAlpha.field.table.footer {

  constructor(resource, id, parent) {

    super({
      children: [
        "add"
      ],
      ...resource
    }, id, parent);

  }

}

// KarmaFieldsAlpha.field.array.add = class extends KarmaFieldsAlpha.field.table.add {}
// KarmaFieldsAlpha.field.array.delete = class extends KarmaFieldsAlpha.field.table.delete {}

// KarmaFieldsAlpha.field.array.row.delete = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource) {
//     super({
//       request: ["delete"],
//       title: "Delete",
//       dashicon: "remove",
//       classes: ["array-delete", "simple-buttons"],
//       width: "min-content",
//       ...resource
//     });
//   }
// };


KarmaFieldsAlpha.field.grid.row.sortArrows = class extends KarmaFieldsAlpha.field.group {
  constructor(resource, id, parent) {
    super({
      visible: [">", ["length", ["getValue"]], "1"],
      children: [
        {
          action: "sortUp",
          value: ["index"],
          type: "button",
          title: "Move Up",
          disabled: ["<", ["length", ["getValue"]], 1],
          dashicon: "arrow-up-alt2",
          class: "array-sort-up",
          width: "auto"
        },
        {
          action: "sortDown",
          value: ["index"],
          type: "button",
          title: "Move Down",
          disabled: [">=", ["+", ["getIndex"], 1], ["length", ["getValue"]]],
          dashicon: "arrow-down-alt2",
          class: "array-sort-up",
          width: "auto"
        }
      ]
    }, id, parent);
  }
};
