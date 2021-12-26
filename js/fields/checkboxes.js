
KarmaFieldsAlpha.fields.checkboxes = class extends KarmaFieldsAlpha.fields.field {

	initField() {
    // this.registerType("json");
	}

	async getDefault() {
		const options = await this.fetchOptions();
		if (this.resource.default && options.some(option => option.key === this.resource.default)) {
			return this.resource.default.split(",");
		}
		const value = KarmaFieldsAlpha.Nav.getParam(this.resource.key);
		if (value && options.some(option => option.key === value)) {
			return [value];
		}
		return [];
	}

	setDefault() {
		// const values = this.getDefault();
		// if (values.length) {
		// 	this.initValue(JSON.stringify(values));
		// }


	}

	getEmpty() {
		return [];
	}

	async fetchValue(expectedType, key) {
		if (key) {
			const values = await super.fetchValue("array");


			return values.indexOf(key) > -1 ? "1" : "";
		}
		return super.fetchValue(expectedType);
	}

	// async setValue(value, key) {
	// 	if (key) {
	// 		const values = await super.fetchValue("array");
	// 		if (this.has(key)) {
	// 			if (!value) {
	// 				await this.remove(key);
	// 			}
	// 		} else {
	// 			if (value) {
	// 				await this.add(key);
	// 			}
	// 		}
	// 	} else {
	// 		await super.setValue(value);
	// 	}
	// }

	async setValue(type, value, key) {
		if (key) {
			if (value) {
				await this.add(key);
			} else {
				await this.remove(key);
			}
		} else {
			await super.setValue(type, value);
		}
	}

	// async input(type, value, key) {
	// 	if (key) {
	// 		if (value) {
	// 			await this.add(key);
	// 		} else {
	// 			await this.remove(key);
	// 		}
	// 	} else {
	// 		await super.input(type, value);
	// 	}
	// }

	async write(key) {
		super.write();
		// if (key) {
		// 	const values = await super.fetchValue("array");
		// 	let index = values.indexOf(key);
		// 	if (index > -1) {
		// 		super.write(index.toString());
		// 	} else {
		// 		super.write(values.length.toString());
		// 	}
		// }
	}

	getEmpty() {
		return [];
	}

	// async add(key) {
	// 	const array = await this.fetchValue("array") || [];
	// 	const index = array.indexOf(key);
	// 	if (index === -1) {
	// 		array.push(key);
	// 		this.setValue(array);
	// 	}
  // }

	async add(key) {
		let array = await this.fetchValue("array") || [];
		const index = array.indexOf(key);
		if (index === -1) {
			// array.push(key);
			// this.setValue(array);
			// super.setValue(key, array.length.toString()); // -> specific value only
			// this.setValue([...array, key]);
			// array = [...array, key];
			// array.sort();
			// this.setValue(array);

			this.setValue(null, [...array, key]);
		}
  }

  async remove(key) {
		const array = await this.fetchValue("array") || [];
		const index = array.indexOf(key);
		if (index > -1) {
			// array.splice(index, 1);
			// this.setValue(array);
			// super.removeValue(index.toString());
			// this.setValue(array.filter(item => item !== key));
			this.setValue(null, array.filter(item => item !== key));
		}
  }

	async has(key) {
		const array = await this.fetchValue("array") || [];
		const index = array.indexOf(key);
		return index > -1;
  }

	// buildCheckboxList(options) {
	// 	return {
	// 		tag: "ul",
	// 		update: ul => {
	// 			ul.children = options.map((option, index) => {
	// 				return {
	// 					tag: "li",
	// 					children: [
	// 						{
	// 							tag: "input",
	// 							init: input => {
	// 								input.element.type = "checkbox";
	// 								input.element.id = this.getId()+"-"+index;
	// 							},
	// 							update: async input => {
	// 								input.element.checked = await this.has(option.key);
	// 								input.element.onchange = async () => {
	// 									if (input.element.checked) {
	// 										await this.add(option.key);
	// 									} else {
	// 										await this.remove(option.key);
	// 									}
	// 									await this.edit();
	// 								}
	// 							}
	// 						},
	// 						{
	// 							tag: "label",
	// 							init: label => {
	// 								label.element.htmlFor = this.getId()+"-"+index;
	// 							},
	// 							update: label => {
	// 								label.element.innerHTML = option.name;
	// 							}
	// 						}
	// 					]
	// 				}
	// 			});
	// 		}
	// 	};
	// }

	// buildCheckboxList(options) {
	// 	return {
	// 		tag: "ul",
	// 		update: ul => {
	// 			ul.children = options.map((option, index) => {
	// 				let checkboxField = this.getChild(option.key) || this.createChild({
	// 					type: "checkbox",
	// 					key: option.key,
	// 					text: option.name,
	// 					tag: "li"
	// 				});
	// 				return checkboxField.build();
	// 			});
	// 		}
	// 	};
	// }

	build() {
		return {
			class: "karma-field checkboxes",
			update: async dropdown => {
				dropdown.element.classList.add("loading");
				const options = await this.fetchOptions();

				dropdown.child = {
					tag: "ul",
					update: ul => {
						ul.children = options.map((option, index) => {
							let checkboxField = this.getChild(option.key) || this.createChild({
								type: "checkbox",
								key: option.key,
								text: option.name,
								tag: "li"
							});
							return checkboxField.build();
						});
					}
				};
				dropdown.element.classList.remove("loading");
			}
		};
	}
}
