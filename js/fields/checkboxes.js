
KarmaFieldsAlpha.fields.checkboxes = class extends KarmaFieldsAlpha.fields.field {

	initField() {
    this.registerType("json");
	}

	async getDefault() {
		const options = await this.fetchOptions();
		if (this.resource.default && options.some(option => option.key === this.resource.default)) {
			return this.resource.default.split(",");
		}
		const value = KarmaFieldsAlpha.History.getParam(this.resource.key);
		if (value && options.some(option => option.key === value)) {
			return [value];
		}
		return this.getEmpty();
	}

	getEmpty() {
		return [];
	}

	async add(key) {
		const array = await this.fetchValue("array") || [];
		const index = array.indexOf(key);
		if (index === -1) {
			array.push(key);
			this.setValue(array);
		}
  }

  async remove(key) {
		const array = await this.fetchValue("array") || [];
		const index = array.indexOf(key);
		if (index > -1) {
			array.splice(index, 1);
			this.setValue(array);
		}
  }

	async has(key) {
		const array = await this.fetchValue("array") || [];
		const index = array.indexOf(key);
		return index > -1;
  }

	// async add(key) {
	// 	const value = await this.fetchValue() || {};
	// 	if (!value[key]) {
	// 		value[key] = "1";
	// 		this.setValue(value);
	// 	}
  // }
	//
  // async remove(key) {
	// 	const value = await this.fetchValue() || {};
	// 	if (value[key]) {
	// 		delete value[key];
	// 		this.setValue(value);
	// 	}
  // }
	//
	// async has(key) {
	// 	const value = await this.fetchValue() || {};
	// 	return !!value[key];
  // }

	buildCheckboxList(options) {
		return {
			tag: "ul",
			update: ul => {
				ul.children = options.map((option, index) => {
					return {
						tag: "li",
						children: [
							{
								tag: "input",
								init: input => {
									input.element.type = "checkbox";
									input.element.id = this.getId()+"-"+index;
								},
								update: async input => {
									input.element.checked = await this.has(option.key);
									input.element.onchange = async () => {
										if (input.element.checked) {
											await this.add(option.key);
										} else {
											await this.remove(option.key);
										}
										await this.edit();
									}
								}
							},
							{
								tag: "label",
								init: label => {
									label.element.htmlFor = this.getId()+"-"+index;
								},
								update: label => {
									label.element.innerHTML = option.name;
								}
							}
						]
					}
				});
			}
		};
	}

	build() {
		return {
			class: "karma-field checkboxes",
			update: async dropdown => {
				dropdown.element.classList.add("loading");
				const options = await this.fetchOptions();

				dropdown.child = this.buildCheckboxList(options);
				dropdown.element.classList.remove("loading");
			}
		};
	}
}
