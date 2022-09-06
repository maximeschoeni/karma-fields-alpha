KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.input {


	// async exportValue() {
	// 	const value = await this.getValue();
	// 	const options = await this.fetchOptions();
	// 	const option = value.length && options.find(option => option.id === value.toString());
	// 	return option && option.name || value;
  // }
	//
	// async importValue(value) {
	// 	const options = await this.fetchOptions();
	// 	const option = options.find(option => option.name === value) || options[0];
	// 	if (option) {
	// 		await this.setValue(option.key);
	// 	}
  // }

	async exportValue() {
		const key = this.getKey();
		const value = await this.get("string");
		const options = await this.fetchOptions();
		const option = options.find(option => option.id === value);

		if (option) {
			return option.name;
		}

		return "";
	}

	async importValue(value) {
		const key = this.getKey();
		const options = await this.fetchOptions();
		const option = options.find(option => option.name === value);

		if (option) {
			await this.parent.request("set", {data: option.id}, key);
		}
	}

	async export(keys = []) {

		const key = this.getKey();
		const defaults = {};

		if (keys.length === 0 || keys.includes(key)) {

			const value = await this.getString();
			const options = await this.fetchOptions();
			const option = options.find(option => option.id === value);

			if (option) {
				defaults[key] = option.name;
			}

		}

		return defaults;
  }

	async import(object) {

		const key = this.getKey();

		if (object[key]) {

			const options = await this.fetchOptions();
			const option = options.find(option => option.name === object[key]);

			if (option) {
				await this.parent.request("set", {data: option.name}, key);
			}

		}

  }


	async getDefault() {

		const options = await this.fetchOptions();
		const defaults = {};
		const key = this.getKey();

		if (key && options.length > 0) {

			defaults[key] = options[0].id;

		}

		return defaults;

	}

	async getOptions(driver, paramString = "", nameField = "name", joins = []) {

    driver = await this.parse(driver);
    paramString = await this.parse(paramString);

    const store = new KarmaFieldsAlpha.Store(driver, joins);

    const ids = await store.queryIds(paramString);
    const options = [];

    for (let id of ids) {
      options.push({
        id: id,
        name: await store.getValue(id, nameField)
      });
    }

    return options;
  }

	async fetchOptions() {

		let options = await this.parse(this.resource.options) || [];

		if (this.resource.driver) {

			const array = await this.getOptions(this.resource.driver, this.resource.paramstring || "", this.resource.namefield || "name");

			options = [...options, ...array];

		}

		return options;

	}

	// hasOptgroups(options) {
	// 	return options.some(function(item) {
	// 		return item.group;
	// 	});
	// }
	//
	// getOptgroups(options) {
	//
	// 	return options.reduce(function(obj, item) {
	// 		let group = obj.find(function(group) {
	// 			return group.name === (item.group || "default");
	// 		});
	// 		if (!group) {
	// 			group = {
	// 				name: item.group || "default",
	// 				children: []
	// 			};
	// 			obj.push(group);
	// 		}
	// 		group.children.push(item);
	// 		return obj;
	// 	}, []);
	// }
	//
	// buildOptions(options, value) {
	// 	const field = this;
	//
	// 	if (field.hasOptgroups(options)) {
	//
	// 		return field.getOptgroups(options).map(function(optgroup) {
	// 			return {
	// 				tag: "optgroup",
	// 				update: function() {
	// 					this.element.label = optgroup.name;
	// 					this.children = optgroup.children.map(function(option) {
	// 						return {
	// 							tag: "option",
	// 							update: function() {
	// 								if (option.count && field.resource.count) {
	// 									this.element.textContent = option.name + " ("+option.count+")";
	// 								} else {
	// 									this.element.textContent = option.name;
	// 								}
	// 								this.element.value = option.key;
	//
	// 								if (value === option.key) {
	// 									this.element.selected = true;
	// 								}
	// 							}
	// 						};
	// 					})
	// 				}
	// 			};
	// 		});
	//
	// 	} else {
	//
	// 		return options.map(option => {
	// 			return {
	// 				tag: "option",
	// 				update: node => {
	// 					node.element.textContent = option.name;
	// 					node.element.value = option.key;
	// 					if (value === option.key) {
	// 						node.element.selected = true;
	// 					}
	// 				}
	// 			};
	// 		});
	//
	// 	}
	// }
	//
	// async createDropdown(onChange) {
	//
	// 	const dropdown = document.createElement("select");
	//
	// 	const options = await this.fetchOptions();
	// 	let value = await this.getValue();
	//
	// 	options.forEach(option => {
	// 		dropdown.add(new Option(option.name, option.id, false, value === option.id));
	// 	});
	//
	// 	dropdown.onchange = async event => onChange(dropdown.value);
	//
	// 	return dropdown;
	//
	// }

	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			init: dropdown => {
				if (this.resource.label) {
					dropdown.element.id = this.getId();
				}

				dropdown.element.tabIndex = -1;

				this.render = dropdown.render;
			},
			update: async dropdown => {
				dropdown.element.classList.add("loading");

				const key = this.getKey();
				const options = await this.fetchOptions();
				const response = await this.parent.request("get", {}, key);
				const value = KarmaFieldsAlpha.Type.toString(response);

				// -> set default
				let currentOption = options.find(option => option.id == value);

				const currentOptions = [...dropdown.element.options];

				if (options.length && !currentOptions.some(option => option.value == value)) {

					let option = options.find(option => option.id == value) || options[0];

					// if (this.resource.map) {
					// 	[option] = await KarmaFieldsAlpha.Expression.map(this, [option], this.resource.map);
					// }

					dropdown.element.add(new Option(option.name, option.id, false, value === option.id));

				}

				dropdown.element.value = value;

				dropdown.element.onfocus = async event => {

					if (currentOptions.length !== options.length) {

						// let mappedOptions;
						//
						// if (this.resource.map) {
						// 	mappedOptions = await KarmaFieldsAlpha.Expression.map(this, options, this.resource.map);
						// } else {
						// 	mappedOptions = options;
						// }
						//
						dropdown.element.length = 0;
						//
						// mappedOptions.forEach(option => {
						// 	dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
						// });

						options.forEach(option => {
							dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
						});

					}

				}


				dropdown.element.onchange = async event => {
					dropdown.element.classList.add("editing");

					await this.parent.request("set", {data: dropdown.element.value}, key);

					await this.parent.request("render");

					dropdown.element.classList.remove("editing");
				}

				if (this.resource.disabled) {
					dropdown.element.disabled = Boolean(await this.parent.parse(this.resource.disabled));
				}

				dropdown.element.parentNode.classList.toggle("modified", await this.isModified());

				dropdown.element.classList.remove("loading");

				if (!currentOption && options.length) {

					currentOption = options[0];

					await this.parent.request("set", {data: currentOption.id});
					this.parent.request("edit");

				}

			}

		};
	}

}
