KarmaFieldsAlpha.field.dropdownGroup = class extends KarmaFieldsAlpha.field.dropdown {

	// async exportValue() {
	// 	const key = this.getKey();
	// 	const value = await this.get("string");
	// 	const options = await this.fetchOptions();
	// 	const option = options.find(option => option.id === value);
	//
	// 	if (option) {
	// 		return option.name;
	// 	}
	//
	// 	return "";
	// }
	//
	// async importValue(value) {
	// 	const key = this.getKey();
	// 	const options = await this.fetchOptions();
	// 	const option = options.find(option => option.name === value);
	//
	// 	if (option) {
	// 		await this.parent.request("set", {data: option.id}, key);
	// 	}
	// }
	//
	// async export(keys = []) {
	//
	// 	const key = this.getKey();
	// 	const defaults = {};
	//
	// 	if (keys.length === 0 || keys.includes(key)) {
	//
	// 		const value = await this.getString();
	// 		const options = await this.fetchOptions();
	// 		const option = options.find(option => option.id === value);
	//
	// 		if (option) {
	// 			defaults[key] = option.name;
	// 		}
	//
	// 	}
	//
	// 	return defaults;
  // }
	//
	// async import(object) {
	//
	// 	const key = this.getKey();
	//
	// 	if (object[key]) {
	//
	// 		const options = await this.fetchOptions();
	// 		const option = options.find(option => option.name === object[key]);
	//
	// 		if (option) {
	// 			await this.parent.request("set", {data: option.id}, key);
	// 		} else {
	// 			const defaults = await this.getDefault();
	// 			console.log(defaults);
	// 			await this.parent.request("set", {data: defaults[key]}, key);
	// 		}
	//
	// 	}
	//
  // }
	//
	//
	// async getDefault() {
	//
	// 	const options = await this.fetchOptions();
	// 	const defaults = {};
	// 	const key = this.getKey();
	//
	// 	if (key) {
	//
	// 		if (this.resource.default !== undefined) {
	//
	// 			defaults[key] = await this.parse(this.resource.default);
	//
	// 		} else if (options.length > 0) {
	//
	// 			defaults[key] = options[0].id;
	//
	// 		}
	//
	// 	}
	//
	// 	return defaults;
	//
	// }


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
				// if (this.resource.label) {
				// 	this.id = "karma-fields-"+this.getUniqueId();
				// 	dropdown.element.id = this.id;
				// }
			},
			update: async dropdown => {
				dropdown.element.classList.add("loading");

				const key = this.getKey();
				const optGroups = await this.fetchOptions();
				const response = await this.parent.request("get", {}, key);
				const value = KarmaFieldsAlpha.Type.toString(response);

				optGroups.forEach(group => {
					const optGroupElement = document.createElement("optgroup");
					optGroupElement.label = group.name;
					group.options.forEach(option => {
						const optionElement = document.createElement("option");
						optionElement.value = option.id;
						optionElement.textContent = option.name;
						optGroupElement.appendChild(optionElement);
					});
					dropdown.element.appendChild()
				});

				dropdown.element.onchange = async event => {
					dropdown.element.classList.add("editing");

					KarmaFieldsAlpha.History.save();

					await this.parent.request("set", {data: dropdown.element.value}, key);

					if (this.resource.onchange) {
						await this.parse(this.resource.onchange);
					}

					await this.parent.request("edit");

					dropdown.element.classList.remove("editing");
				}

				if (this.resource.disabled) {
					dropdown.element.disabled = Boolean(await this.parent.parse(this.resource.disabled));
				}

				dropdown.element.parentNode.classList.toggle("modified", await this.isModified());

				dropdown.element.classList.remove("loading");


			}

		};
	}

}
