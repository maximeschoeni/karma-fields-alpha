
KarmaFieldsAlpha.field.checkboxes = class extends KarmaFieldsAlpha.field {

	getDefault() {

		return this.parse(this.resource.default);

	}

	// getValue(key) {
	//
	// 	if (key) {
	//
	// 		const array = this.getValue();
	//
	// 		if (array) {
	//
	// 			if (array[0] === KarmaFieldsAlpha.mixed) {
	//
	// 				const mixedValues = this.getMixedValues();
	//
	// 				if (mixedValues.every(array => array.includes(key))) {
	//
	// 					return ["1"];
	//
	// 				} else if (!mixedValues.some(array => array.includes(key))) {
	//
	// 					return [""];
	//
	// 				} else {
	//
	// 					return [KarmaFieldsAlpha.mixed];
	//
	// 				}
	//
	// 		 	} else {
	//
	// 				if (array.includes(key)) {
	//
	// 					return ["1"];
	//
	// 				} else {
	//
	// 					return [""];
	//
	// 				}
	//
	// 			}
	//
	// 		}
	//
	// 	} else {
	//
	// 		let array = super.getValue();
	//
	// 		if (array) {
	//
	// 			if (array.length === 0) {
	//
	// 				array = this.getDefault();
	//
	// 				if (array && array.length) {
	//
	// 					this.setValue(array);
	//
	// 				}
	//
	// 			}
	//
	// 			return array;
	//
	// 		}
	//
	// 	}
	//
  // }

	getContent(subkey) {

		if (subkey) {

			const key = this.getKey();
			const content = this.parent.getContent(key);

			if (!content.loading) {

				const array = content.toArray();

				if (content.mixed) {

					// const mixedValues = this.getMixedValues();
					//
					// if (mixedValues.every(array => array.includes(key))) {
					//
					// 	return ["1"];
					//
					// } else if (!mixedValues.some(array => array.includes(key))) {
					//
					// 	return [""];
					//
					// } else {
					//
					// 	return [KarmaFieldsAlpha.mixed];
					//
					// }

					return content.mixed;

			 	} else {

					if (array.includes(subkey)) {

						return new KarmaFieldsAlpha.Content("1");

					} else {

						return new KarmaFieldsAlpha.Content("");

					}

				}

			}

		} else {

			const key = this.getKey();

			return this.parent.getContent(key);

		}

  }

	setContent(subcontent, subkey) {

		if (subkey) {

			const key = this.getKey();
			let content = super.getContent(key);

			if (!content.loading) {

				const array = content.toArray();

				if (subcontent.toString() === "1") {

					if (!array.includes(subkey)) {

						// this.setValue([...array, key]);
						content = content.clone();
						content.value = [...array, subkey];
						this.parent.setContent(content, key);

					}

				} else {

					if (array.includes(subkey)) {

						// this.setValue(array.filter(item => item !== key));
						content = content.clone();
						content.value = array.filter(item => item !== subkey);
						this.parent.setContent(content, key);

					}

				}

			}

		} else {

			const key = this.getKey();

			this.parent.setContent(subcontent, key);

		}

	}

	// setValue(value, key) {
	//
	// 	if (key) {
	//
	// 		const array = this.getValue();
	//
	// 		if (array) {
	//
	// 			if (value === "1") {
	//
	// 				if (!array.includes(key)) {
	//
	// 					this.setValue([...array, key]);
	//
	// 				}
	//
	// 			} else {
	//
	// 				if (array.includes(key)) {
	//
	// 					this.setValue(array.filter(item => item !== key));
	//
	// 				}
	//
	// 			}
	//
	// 		}
	//
	// 	} else {
	//
	// 		super.setValue(value);
	//
	// 	}
	//
	// }


	// getDefault() {
	//
	// 	if (this.resource.default) {
	//
	// 		const key = this.getKey();
	// 		const defaultValue = this.parse(this.resource.default);
	// 		const values = KarmaFieldsAlpha.Type.toArray(defaultValue);
	//
	// 		return {
	// 			[key]: values
	// 		}
	//
	// 	}
	//
	// 	return [];
	// }

	// async dispatch(event) {
	//
	// 	switch (event.action) {
	//
	// 		case "get": {
	//
	// 			const [key] = event.path;
	//
	// 			const set = await super.dispatch({
	// 				action: "get",
	// 				type: "array"
	// 			}).then(request => new Set(KarmaFieldsAlpha.Type.toArray(request.data)));
	//
	// 			event.data = set.has(key);
	// 			break;
	// 		}
	//
	// 		case "set": {
	// 			// const key = event.path[0];
	// 			// if (event.getValue()) {
	// 			// 	await this.add(key);
	// 			// } else {
	// 			// 	await this.remove(key);
	// 			// }
	// 			// break;
	// 			// const key = event.path[0];
	// 			// const array = await this.getArray();
	// 			// if (event.getValue()) {
	// 			// 	array.push(key);
	// 			// } else {
	// 			// 	const index = array.indexOf(key);
	// 			// 	if (index > -1) {
	// 			// 		array.splice(index, 1);
	// 			// 	}
	// 			// }
	// 			// const options = await this.fetchOptions(this.resource.driver);
	// 			// await this.setArray(options.map(option => option.key).filter(key => array.indexOf(key) > -1));
	// 			// break;
	//
	// 			const [key] = event.path;
	// 			// const options = await this.parse(this.resource.options);
	// 			const set = await super.dispatch({
	// 				action: "get",
	// 				type: "array"
	// 			}).then(request => new Set(KarmaFieldsAlpha.Type.toArray(request.data)));
	//
	// 			if (event.data && !set.has(key)) {
	// 				set.add(key);
	// 			} else if (!event.data && set.has(key)) {
	// 				set.delete(key);
	// 			}
	//
	// 			await super.dispatch({
	// 				action: "set",
	// 				data: [...set]
	// 			})
	//
	// 		}
	//
	// 	}
	//
	// 	return event;
	// }

  // getOptions(driver, params) {
	//
  //   if (!KarmaFieldsAlpha.drivers[driver]) {
	//
  //     console.error("Driver not found", driver);
	//
  //   }
	//
	//
  //   const results = KarmaFieldsAlpha.Query.getResults(driver, params) || [{id: "", name: "..."}];
	//
  //   const options = [];
  //   const alias = KarmaFieldsAlpha.drivers[driver].alias;
  //   const idAlias = alias.id || "id";
  //   const nameAlias = alias.name || "name";
	//
  //   for (let item of results) {
	//
  //     options.push({
  //       id: item[idAlias],
  //       name: item[nameAlias] || KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Query.getValue(driver, item[idAlias], nameAlias) || ["..."])
  //     });
	//
  //   }
	//
  //   return options;
	//
  // }

	// request(subject, content = {}, ...path) {
	//
  //   const key = this.getKey();
	//
  //   if (key) {
	//
  //     switch (subject) {
	//
  //       case "get": {
	//
  //         const [childKey] = path;
	//
  //         const values = this.parent.request("get", {}, key);
	//
  //         if (values) {
	//
  //           return KarmaFieldsAlpha.Type.toArray(values.includes(childKey) ? "1" : "");
	//
  //         }
	//
  //       }
	//
  //       case "set": {
	//
  //         const [childKey] = path;
  //         const values = this.parent.request("get", {}, key);
  //         // const array = KarmaFieldsAlpha.Type.toArray(response);
	//
  //         if (values) {
  //           const set = new Set([...values]);
	//
  //           if (content && !set.has(childKey)) {
	//
  //             set.add(childKey);
	//
  //           } else if (!content && set.has(childKey)) {
	//
  //             set.delete(childKey);
	//
  //           }
	//
  //           this.parent.request("set", [...set], key);
  //         }
	//
  //         break;
  //       }
	//
  //       default: {
	//
  //         this.parent.request(subject, content, key);
  //         break;
  //       }
	//
  //     }
	//
  //   } else {
	//
  //     return super.request(subject, content, ...path);
	//
  //   }
	//
	//
	//
	// }


	// export() {
	//
	// 	const key = this.getKey();
	// 	const defaults = {};
  //   const values = this.parent.request("get", {}, key);
	//
	// 	if (values) {
	//
	// 		defaults[key] = KarmaFieldsAlpha.Type.toArray(response);
	//
	// 	}
	//
	// 	return defaults;
	// }
	//
	// import(object) {
	//
	// 	const key = this.getKey();
  //   const array = KarmaFieldsAlpha.Type.toArray(object[key]);
	//
	// 	this.parent.request("set", array, key);
	// }

	// fetchOptions() {
	//
	// 	const dropbox = new KarmaFieldsAlpha.field.dropdown(this.resource);
	//
	// 	// return KarmaFieldsAlpha.field.dropdown.prototype.fetchOptions.call(this);
	//
	// 	return dropbox.fetchOptions();
	//
	// }





	// export(items = []) {
	//
	// 	const array = this.getValue() || [];
	// 	const grid = new KarmaFieldsAlpha.Grid();
	//
	// 	grid.addColumn(array);
	//
	// 	const csv = grid.toString();
	//
	// 	items.push(csv);
	//
  //   return items;
	// }
	//
  // import(items) {
	//
	// 	const value = items.shift() || "";
	//
	// 	const grid = new KarmaFieldsAlpha.Grid(value);
	//
	// 	const array = grid.getColumn(0);
	//
	// 	this.setValue(array);
	//
	//
  // }


	// as dropdown
	getOptions() {

		let options;

		if (this.resource.options) {

			options = this.parse(this.resource.options);

		} else {

      options = new KarmaFieldsAlpha.Content([]);

    }

		if (this.resource.driver) {

      const moreOptions = KarmaFieldsAlpha.Query.getResults(this.resource.driver, this.resource.params || {});

      if (moreOptions.loading) {

        options.loading = true;

      } else {

        options.value = [...options.toArray(), ...moreOptions.toArray()]

      }

		}

		return options;

	}

	build() {
		return {
			class: "karma-field checkboxes",
			update: dropdown => {

				const options = this.getOptions();
				// let array = this.getValue();
				let content = this.getContent();

				dropdown.element.classList.toggle("loading", Boolean(content.loading || options.loading));

				if (!content.loading && !options.loading) {

					dropdown.child = {
						tag: "ul",
						init: ul => {
							if (this.resource.columns) {
								ul.element.style.columnCount = parseInt(this.resource.columns);
							}
						},
						update: ul => {
							ul.children = options.toArray().map((option, index) => {
								return {
									tag: "li",
									child: this.createChild({
										type: "checkbox",
										key: option.id,
										text: option.name,
										tag: "label",
										false: "",
										true: "1",
										index: index,
										uid: `${this.resource.uid}-${index}`
									}).build()
								}
							});
						}
					};

				}

			}
		};
	}
}
