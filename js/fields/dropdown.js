KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.input {

	async exportValue() {
		const value = await this.getValue();
		const options = await this.fetchOptions();
		const option = value.length && options.find(option => option.id === value.toString());
		return option && option.name || value;
  }

	async importValue(value) {
		const options = await this.fetchOptions();
		const option = options.find(option => option.name === value) || options[0];
		if (option) {
			await this.setValue(option.key);
		}
  }

	async getDefault() {

		const options = await this.parse(this.resource.options || []);

		const defaults = {};
		const key = this.getKey();

		if (key && options.length > 0) {

			defaults[key] = options[0].id;

		}

		return defaults;

		// let value = await this.parse(this.resource.default);
		//
		// if (!options.some(option => option.id === value) && options.length) {
		// 	value = options[0].id;
		// }
		//
		// return value;
	}

	async fetchOptions() {
		// let options = await super.fetchOptions(this.resource.driver);

		if (this.resource.options) {
			return this.parse(this.resource.options);
		} else if (this.resource.driver) {
			return this.parse([
				"...",
				{id: "", name: "-"},
				["queryArray", this.resource.driver]
			]);
		} else if (this.resource.postdriver) {
			return this.parse([
				"...",
				{id: "", name: "-"},
				[
					"map",
					["queryArray", this.resource.postdriver],
					[
						"object",
						{
							id: ["item", "ID"],
							name: ["item", "post_title"]
						}
					]
				]
			]);
		}

		return [];

		//
		//
		//
		//
		// var dropdown = [
		// 	options: [
		// 		"cat",
		// 		[
		// 			"array",
		// 			[
		// 				{id: "", name: "-"}
		// 			],
		// 		],
		// 		["getArray", "myKey"]
		// 	]
		// ];
		//
		// var dropdown = [
		// 	options: [
		// 		"options",
		// 		"": "-",
		// 		"a": "A",
		// 		"b": "B"
		// 	]
		// ];
		//
		// var dropdown = [
		// 	options: [
		// 		"...",
		// 		{id: "", name: "-"},
		// 		["queryArray", "driver"]
		// 	]
		// ];
		//
		// var dropdown = [
		// 	options: [
		// 		"...",
		// 		{id: "", name: "-"},
		// 		[
		// 			"map",
		// 			["queryArray", "driver"],
		// 			[
		// 				"object",
		// 				{
		// 					id: ["item", "ID"],
		// 					name: ["item", "post_title"]
		// 				}
		// 			]
		// 		]
		// 	]
		// ];
		//
		//
		// let options = this.resource.options || [];
		//
		// if (this.resource.driver) {
		// 	let query = KarmaFieldsAlpha.Query.create(this.resource.driver);
		// 	let results = await query.get();
		//
		// 	if (this.resource.mapfieldname) {
		// 		options = options.map(option => options.name = options[this.resource.mapfieldname])
		// 	}
		//
		// 	options = [...options, ...results];
		// }
		//
		//
		// if (options.some(option => option.id === undefined || option.name === undefined || typeof option.id !== "string")) {
		// 	console.error("id or name parameter missing in option list items", options);
		// }

		// deprecated
		// if (this.resource.empty !== undefined) {
		// 	options = [{
		// 		key: this.resource.empty,
		// 		name: this.resource.empty_option_name || "–"
		// 	}].concat(options);
		//
		// }
		//
		// // deprecated
		// if (this.resource.novalue !== undefined) {
		// 	options = [{
		// 		key: "",
		// 		name: this.resource.novalue === true ? "-" : this.resource.novalue
		// 	}].concat(options);
		// }

		// options.forEach(option => {
    //   option.id = option.id.toString();
    // });

		// return options;
	}

	hasOptgroups(options) {
		return options.some(function(item) {
			return item.group;
		});
	}

	getOptgroups(options) {

		return options.reduce(function(obj, item) {
			let group = obj.find(function(group) {
				return group.name === (item.group || "default");
			});
			if (!group) {
				group = {
					name: item.group || "default",
					children: []
				};
				obj.push(group);
			}
			group.children.push(item);
			return obj;
		}, []);
	}

	buildOptions(options, value) {
		const field = this;

		if (field.hasOptgroups(options)) {

			return field.getOptgroups(options).map(function(optgroup) {
				return {
					tag: "optgroup",
					update: function() {
						this.element.label = optgroup.name;
						this.children = optgroup.children.map(function(option) {
							return {
								tag: "option",
								update: function() {
									if (option.count && field.resource.count) {
										this.element.textContent = option.name + " ("+option.count+")";
									} else {
										this.element.textContent = option.name;
									}
									this.element.value = option.key;

									if (value === option.key) {
										this.element.selected = true;
									}
								}
							};
						})
					}
				};
			});

		} else {

			return options.map(option => {
				return {
					tag: "option",
					update: node => {
						node.element.textContent = option.name;
						node.element.value = option.key;
						if (value === option.key) {
							node.element.selected = true;
						}
					}
				};
			});

		}
	}

	async createDropdown(onChange) {

		const dropdown = document.createElement("select");

		const options = await this.fetchOptions();
		let value = await this.getValue();

		options.forEach(option => {
			dropdown.add(new Option(option.name, option.id, false, value === option.id));
		});

		dropdown.onchange = async event => onChange(dropdown.value);

		return dropdown;

	}

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

				// if (this.resource.disabled || this.resource.dynamic) {
				// 	this.update = () => dropdown.render();
				// }

			},
			update: async dropdown => {
				dropdown.element.classList.add("loading");

				const options = await this.fetchOptions();
				// const value = await this.getValue();

				const value = await this.dispatch({
					action: "get",
				}).then(request => KarmaFieldsAlpha.Type.toString(request.data));

				// -> set default
				let currentOption = options.find(option => option.id == value);

				if (!currentOption && options.length) {

					currentOption = options[0];

					await this.dispatch({
						action: "set",
						data: [currentOption.id]
					});
					await this.dispatch({
						action: "edit"
					});

				} else {

					const currentOptions = [...dropdown.element.options];


					if (options.length && !currentOptions.some(option => option.value == value)) {
						let option = options.find(option => option.id == value) || options[0];
						if (this.resource.map) {
							[option] = await KarmaFieldsAlpha.Expression.map(this, [option], this.resource.map);
						}
						dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
					}

					dropdown.element.value = value;

					dropdown.element.onfocus = async event => {
						if (currentOptions.length !== options.length) {
							let mappedOptions;
							if (this.resource.map) {
								mappedOptions = await KarmaFieldsAlpha.Expression.map(this, options, this.resource.map);
							} else {
								mappedOptions = options;
							}
							dropdown.element.length = 0;
							mappedOptions.forEach(option => {
								dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
							});
						}
					}

					dropdown.element.onchange = async event => {
						dropdown.element.classList.add("editing");
						await this.setValue(dropdown.element.value);
						// await dropdown.render();
						dropdown.element.classList.remove("editing");
					}




					if (this.resource.disabled) {
						dropdown.element.disabled = Boolean(await this.parent.parse(this.resource.disabled));
					}

					dropdown.element.parentNode.classList.toggle("modified", await this.isModified());


				}

				dropdown.element.classList.remove("loading");

			}
		};
	}

}
