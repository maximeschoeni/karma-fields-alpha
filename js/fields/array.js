
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field.container {

	getBody() {

		const length = this.getLength();

		if (length !== undefined) {

			return this.createChild({
				type: "grid",
				children: this.resource.children, // -> compat
				length,
				...this.resource.body
			}, "body");

		}

	}

	hasFooter() {

		return this.resource.footer !== false;

	}

	getFooter() {

		return this.createChild({
			type: "group",
			display: "flex",
			align: "flex-bottom",
			children: [
				{type: "add"},
				{type: "delete"}
			],
			...this.resource.footer,
			offsetContainer: true,
			pad: true
		}, "footer");

	}

	doAction(action, ...args) {

		switch (action) {

			case "setValueAt":
				this.setValueAt(...args);
				break;

			case "setOrder":
				this.setOrder(...args);
				break;

			default:
				super.doAction(action, ...args);

		}

	}

	// query(params) {

	// 	switch (params.action) {

	// 		case "hasSelection":
	// 			return this.getBody()?.hasSelection();

	// 		case "getLength":
	// 			return this.getLength();

	// 		// case "getValueAt":
	// 		// 	return this.getValueAt(params.key, params.id);

	// 		default:
	// 			return super.query(params);

	// 	}

	// }

	export() {

		if (this.resource.export !== false) {

			return this.getChild("body")?.exportAt();

		}

	}

	import(collection) {

		if (this.resource.export !== false) {

			this.getChild("body")?.importAt(collection);

		}

		// const string = collection.shift();

		// const grid = KarmaFieldsAlpha.CSV.parse(string);

		// // const grid = new KarmaFieldsAlpha.Content.Grid(string);

		// const body = this.getChild("body");

		// body.import(grid);

	}


	getLength() {

		const arrayKey = this.getKey();

		if (arrayKey) {

			const values = this.parent.getValue(arrayKey);

			if (values) {

				return values.length;

			}

		} else {

			const keys = this.listKeys();

			let length = 0;

			for (let key of keys) {

				const value = this.parent.getValue(key);

				if (value === undefined) {

					return;

				}

				if (value.length > length) {

					length = value.length;

				}

			}

			return length;

		}

	}

	*listIds() { // deprecated

		const length = this.getLength() || 0;

		for (let i = 0; i < length; i++) {

			yield i;

		}

	}

	getIds() { // deprecated

		return this.listIds().toArray();

	}

	getValue(key, index) {

		const arrayKey = this.getKey();

		if (arrayKey) {

			const values = this.parent.getValue(arrayKey);

			if (values !== undefined) {

				if (!values[index]) {

					return [];

				}

				let value = values[index][key] || [];

				if (!Array.isArray(value)) {

					value = [value];

				}

				return value;

			}

		} else {

			const values = this.parent.getValue(key);

			if (values !== undefined) {

				if (index >= values.length) {

					return [];

				}

				return [values[index]];

			}

		}

	}

	setValue(value, key, index) {

		const arrayKey = this.getKey();

		if (arrayKey) {

			let values = this.parent.getValue(arrayKey);

			if (values === undefined) {

				console.error("setting value but value is undefined");

			}

			values = [...values];

			if (this.resource.singles) {

				values[index] = { ...values[index], [key]: value[0] };

			} else {

				values[index] = { ...values[index], [key]: value };

			}

			this.parent.setValue(values, arrayKey);

		} else {

			let values = this.parent.getValue(key);

			if (values !== undefined) {

				values = [...values];

				values[index] = value[0]; // -> never save value as array there

				this.parent.setValue(values, key);

			}

		}

	}

	setOrder(newIndexes) { // -> new indexes

		const arrayKey = this.getKey();

		if (arrayKey) {

			const values = this.parent.getValue(arrayKey);

			if (values === undefined) {

				console.error("reordering but values are not loaded");

			}

			if (values.length !== newIndexes.lenth) {

				console.error("reordering but values length does not match");

			}

			const newValues = [];

			for (let i = 0; i < values.length; i++) {

				const newIndex = newIndexes[i];

				newValues[i] = values[newIndex];

			}

			this.parent.setValue(newValues, arrayKey);

		} else {

			const keys = this.listKeys();

			for (let key of keys) {

				const values = this.parent.getValue(key);

				if (values === undefined) {

					console.error("reordering but values are not loaded");

				}

				if (values.length !== newIndexes.lenth) {

					console.error("reordering but values length does not match");

				}

				const newValues = [];

				for (let i = 0; i < values.length; i++) {

					const newIndex = newIndexes[i];

					newValues[i] = values[newIndex];

				}

				this.parent.setValue(newValues, key);

			}

		}

	}

	deleteAt(index, length = 1) {

		if (this.resource.key) {

			const arrayKey = this.resource.key;

			let values = this.parent.getValue(this.resource.key);
			values = [...values];
			values.splice(index, length);

			this.parent.setValue(values, this.resource.key);

		} else {

			const keys = this.listKeys();

			for (let key of keys) {

				let values = this.parent.getValue(key);
				values = [...values];
				values.splice(index, length);

				this.parent.setValue(values, key);

			}

		}

	}

	// delete(...ids) {

	// 	console.error("deprecated. Use removeIds()");

	// 	this.removeIds(ids);

	// }

	// removeIds(ids) {

	// 	if (ids.length === 0) {

	// 		const body = this.getChild("body");

	// 		ids = body.getSelectedIds();

	// 		body.removeSelection();

	// 	}

	// 	const key = this.getKey();

	// 	if (key) {

	// 		let values = this.parent.getValue(key);

	// 		if (values) {

	// 			values = values.filter((value, index) => !ids.includes(index));

	// 			this.parent.setValue(values, key);

	// 		}

	// 	} else {

	// 		const keys = this.listKeys();

	// 		for (let key of keys) {

	// 			let values = this.parent.getValue(key);

	// 			if (values) {

	// 				values = values.filter((value, index) => !ids.includes(index));

	// 				this.parent.setValue(values, key);

	// 			}

	// 		}

	// 	}



	// }

	addAt(num = 1, index, params = {}) {

		if (this.resource.key) {

			let values = this.parent.getValue(this.resource.key);

			if (values === undefined) {

				console.error("Adding but values are not ready");

			}

			values = [...values];

			const newValues = [];

			for (let i = 0; i < num; i++) {

				newValues.push({});

			}

			if (index === undefined) {

				index = values.length;

			}

			values.splice(index, 0, ...newValues);

			this.parent.setValue(values, key);

		} else {

			const keys = this.listKeys();

			for (let key of keys) {

				let values = this.parent.getValue(key);

				if (values === undefined) {

					console.error("Adding but values are not ready for key: ", key);

				}

				const newValues = [];

				for (let i = 0; i < num; i++) {

					newValues.push("");

				}

				if (index === undefined) {

					index = values.length;

				}

				values = [...values];
				values.splice(index, 0, ...newValues);

				this.parent.setValue(values, key);

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


	// *buildBody() {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		yield* body.build(); // -> don't wrap with body-content in tables

	// 	}

	// }

	// *build(context) {

	// 	if (!this.resource.pad || !this.resource.offsetContainer) {

	// 		yield {
	// 			class: "container-field",
	// 			children: super.build()
	// 		};

	// 	} else {

	// 		yield* super.build();

	// 	}

	// 	// yield* this.buildExport();
	// }

}

// KarmaFieldsAlpha.field.array.footer = class extends KarmaFieldsAlpha.field.table.footer {

//   constructor(resource, id, parent) {

//     super({
//       children: [
//         "add"
//       ],
//       ...resource
//     }, id, parent);

//   }

// }

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


// KarmaFieldsAlpha.field.grid.row.sortArrows = class extends KarmaFieldsAlpha.field.group {
//   constructor(resource, id, parent) {
//     super({
//       visible: [">", ["length", ["getValue"]], "1"],
//       children: [
//         {
//           action: "sortUp",
//           value: ["index"],
//           type: "button",
//           title: "Move Up",
//           disabled: ["<", ["length", ["getValue"]], 1],
//           dashicon: "arrow-up-alt2",
//           class: "array-sort-up",
//           width: "auto"
//         },
//         {
//           action: "sortDown",
//           value: ["index"],
//           type: "button",
//           title: "Move Down",
//           disabled: [">=", ["+", ["getIndex"], 1], ["length", ["getValue"]]],
//           dashicon: "arrow-down-alt2",
//           class: "array-sort-up",
//           width: "auto"
//         }
//       ]
//     }, id, parent);
//   }
// };
