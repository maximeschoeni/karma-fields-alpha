
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
      class: "array",
      style: "align-items: flex-start",
			...this.resource.body
		}, "body", this);

	}


  // getChild(index, ...path) {
  //
  //   let child = this.newChild(index);
  //
  //   if (child && path.length) {
  //
  //     return child.getChild(...path);
  //
  //   }
  //
  //   return child;
  //
  // }

  // hasFocusInside() {

  //   // const focus = await this.getFocus();
  //   //
  //   // return focus && focus.length <= this.path.length + 1 && this.path.every((id, index) => id === focus[index]);

  //   return super.hasFocusInside();
  // }

  // deprecated: should use directly the body's one
  hasSelection() {

    const body = this.getChild("body");

    if (body && body.hasSelection) {

      return body.hasSelection();

    }

    return false;

  }

  // getChild(index) {
  //
  //   if (index === "body") {
  //
  //     return this.createChild({
  //       type: "grid",
  //       children: this.resource.columns || this.resource.children || [],
  //       ...this.resource.body
  //     }, "body");
  //
  //   // } else if (index === "header" && this.resource.header) {
  //   //
  //   //   return this.createChild({
  //   //     type: "header",
  //   //     ...this.resource.header
  //   //   }, "header");
  //
  // } else if (index === "footer" && this.resource.footer !== false) {
  //
  //     return this.createChild({
  //       type: "footer",
  //       children: ["add"],
  //       ...this.resource.footer
  //     }, "footer");
  //
  //   }
  //
  //
  //
  // }

  // getIndexOffset() {
  //
  //   return 0;
  //
  // }

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


  // queryLength() {

  //   const keys = this.getKeys();

  //   const length = new KarmaFieldsAlpha.Content(0);

  //   for (let key of keys) {

  //     const value = this.getContent(key);

  //     if (value.loading) {

  //       length.loading = true;

  //     } else {

  //       length.value = Math.max(length.value, value.toArray().length);

  //     }

  //   }

  //   return length;
  // }

	getLength() {

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

	*listIds() {

		// const keys = this.getKeys();

		// let length = 0;

		// for (let key of keys) {

		// 	const value = this.parent.getValue(key);

		// 	if (value === undefined) {

		// 		return;

		// 	}

		// 	length = Math.max(length, value.length);

		// }

		const length = this.getLength() || 0;

		for (let i = 0; i < length; i++) {

			yield i;

		}

	}

	getIds() {

		return this.listIds().toArray();

	}

	getQuery() {

		const ids = this.getIds();

		return { ids, count: ids.length };

	}

	getValue(key, id, driver) {

		if (id === undefined) {

			return [this.getParam(key)];

		} else if (!driver) {

			const arrayKey = this.getKey();

			if (arrayKey) {

				const values = this.parent.getValue(arrayKey);

				if (values !== undefined) {

					if (!values[id]) {

						return [];

					}

					if (this.resource.singles) {

						return [values[id][key]];

					} else {

						return values[id][key] || [];

					}

				}

			} else {

				const values = this.parent.getValue(key);

				if (values !== undefined) {

					if (id >= values.length) {

						console.error("getting value but index is out of range");

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



		if (id === undefined) {

			this.setParam(value[0], key);

		} else if (!driver) {

			const arrayKey = this.getKey();

			if (arrayKey) {

				const values = this.parent.getValue(arrayKey);

				if (values === undefined) {

					console.error("setting value but value is undefined");

				}

				values = [...values];

				// if (key === this.resource.sortable) {

				// 	const index = parseInt(value[0]);

				// 	values = values.splice(index, 0, ...values.splice(id, 1));

				// } else

				if (this.resource.singles) {

					values[id] = { ...values[id], key: value[0] };

				} else {

					values[id] = { ...values[id], key: value };

				}

				this.parent.setValue(values, arrayKey);

			} else {

				const values = this.parent.getValue(key);

				if (values !== undefined) {

					if (id >= values.length) {

						console.error("getting value but index is out of range");

					}

					values = [...values];


					// if (key === this.resource.sortable) {

					// 	const index = parseInt(value[0]);

					// 	values = values.splice(index, 0, ...values.splice(id, 1));

					// } else {

						values[id] = value[0]; // -> never save value as array

					// }



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

  // getContentAt(index, key) {

  //   const cellContent = new KarmaFieldsAlpha.Content();
  //   const arrayKey = this.getKey();

  //   if (arrayKey) {

  //     const content = this.getContent(arrayKey);

  //     if (content.loading) {

  //       cellContent.loading = true;

  //     } else {

  //       const array = content.toArray();

  //       if (index < array.length) {

  //         cellContent.value = array[index] && array[index][key];

  //       } else {

  //         cellContent.notFound = true;

  //       }

  //     }

  //   } else {

  //     const content = this.getContent(key);

  //     if (content.loading) {

  //       cellContent.loading = true;

  //     } else {

  //       const array = content.toArray();

  //       if (index < array.length) {

  //         cellContent.value = array[index];

  //       } else {

  //         cellContent.notFound = true;

  //       }

  //     }

  //   }

  //   return cellContent;
  // }

 //  async setValueAt(value, index, key) {

 //    const arrayKey = this.getKey();

 //    if (arrayKey) {

 //      let content = this.getContent(arrayKey);

 //      if (!content.loading) {

 //        const clone = KarmaFieldsAlpha.DeepObject.clone(content.toArray());

 //        if (!clone[index]) {

 //          clone[index] = {};

 //        }

 //        clone[index][key] = value;

 //        await this.setValue(clone, arrayKey);

 //      }

 //    } else {

 //      let content = this.getContent(key);

 //      if (!content.loading) {

 //        const clone = [...content.value];

 //        clone[index] = value;

 //        await this.setValue(clone, key);

 //      }

 //    }

 //  }

 //  // need to override container setValue
 //  async setValue(value, key) {

	// 	await this.parent.setValue(value, key);

	// }

	delete(...ids) {

		const body = this.getChild("body");

		if (ids.length === 0) {

			ids = body.getSelectedIds();

		}

		const arrayKey = this.getKey();

		if (arrayKey) {

			let values = this.parent.getValue(arrayKey);

			values = values.filter((value, index) => !ids.includes(index));

			this.parent.setValue(values, arrayKey);

		} else {

			const keys = this.getKeys();

			for (let key of keys) {

				let values = this.parent.getValue(key);

				values = values.filter((value, index) => !ids.includes(index));

				this.parent.setValue(values, key);

			}

		}

		body.deleteIds(ids);

	}

  // async delete(index, length) {

  //   if (index === undefined && length === undefined) {

  //     const body = this.getChild("body");

  //     if (body) {

  //       const selection = body.querySelection();

  //       index = selection && selection.index || 0;
  //       length = selection && selection.length || 0;

  //     }

  //   }

  //   const keys = this.getKeys();

  //   let contents = keys.map(key => this.getContent(key));

  //   while (contents.some(content => content.loading)) {

  //     await this.render();
  //     contents = keys.map(key => this.getContent(key));

  //   }

  //   for (let j in contents) {

  //     const content = contents[j];
  //     const key = keys[j];

  //     const newContent = [...content.toArray()];

  //     newContent.splice(index, length);

  //     await this.setValue(newContent, key);

  //   }

  //   await this.render();
  // }

  // async swap(index, target, length) {

  //   const keys = this.getKeys();

  //   let contents = keys.map(key => this.getContent(key));

  //   if (contents.some(content => content.loading)) {

  //     console.log(keys, contents);
  //     console.error("content is not loaded");

  //   }


  //   await this.save("sort", "Sort");

  //   for (let j in contents) {

  //     const content = contents[j];
  //     const key = keys[j];

  //     const newContent = [...content.toArray()];

  //     newContent.splice(target, 0, ...newContent.splice(index, length));

  //     await this.setValue(newContent, key);

  //   }

  //   const body = this.getChild("body");

  //   if (body) {

  //     await body.setFocus(true);
  //     await body.select(target, length);

  //   }

  // }

	// async add(num = 1, index = undefined) {

	// 	let length = this.queryLength();

	// 	while (length.loading) {

	// 		await this.render();
	// 		length = this.queryLength();

	// 	}

	// 	const body = this.getChild("body");

	// 	if (index === undefined) {

	// 		if (body) {

	// 			index = body.getNewItemIndex();

	// 		} else {

	// 			index = length.toNumber();

	// 		}

	// 	}


	// 	await this.save("add", "Insert");

	// 	const keys = this.getKeys();
	// 	let contents = keys.map(key => this.getContent(key));

	// 	while (contents.some(content => content.loading)) {

	// 		await this.render();
	// 		contents = keys.map(key => this.getContent(key));

	// 	}

	// 	for (let j in contents) {

	// 		const content = contents[j];
	// 		const key = keys[j];

	// 		const newContent = [...content.toArray()];

	// 		newContent.splice(index, 0, ...Array(num));

	// 		await this.setValue(newContent, key);

	// 	}

	// 	if (body) {

	// 		const rowField = body.getChild(0);

	// 		let defaults = rowField.exportDefaults();

	// 		while (defaults.loading) {

	// 			await this.render();
	// 			defaults = rowField.exportDefaults();

	// 		}

	// 		for (let i = 0; i < num; i++) {

	// 			const rowField = body.getChild(i + index);

	// 			for (let key in defaults.value) {

	// 				await rowField.setValue(defaults[key], key);

	// 			}

	// 		}

	// 		await body.setFocus(true);
	// 		await body.select(index, num);

	// 	}

	// 	await this.render();

	// }

	add(num = 1, params = {}) {

		const body = this.getChild("body");
		const tokens = [];
		const length = this.getLength();

		if (length === undefined) {

			console.error("adding item but length is undefined");

		}

		for (let i = 0; i < num; i++) {

			tokens.push(num + i);

		}

		body.addIds(tokens, length - 1);

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

KarmaFieldsAlpha.field.array.add = class extends KarmaFieldsAlpha.field.table.add {}
KarmaFieldsAlpha.field.array.delete = class extends KarmaFieldsAlpha.field.table.delete {}

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
