KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.input {

	async exportValue() {
		const value = await this.getValue();
		const options = await this.fetchOptions();
		const option = value.length && options.find(option => option.id === value.toString());
		return option && option.name || value;
  }

	async importValue(value) {
		const options = await this.fetchOptions();
		const option = options.find(option => option.name === value);
		if (option) {
			await this.setValue(option.key);
		}
  }

	async getDefault() {
		const options = await this.fetchOptions();

		let value = await this.parse(this.resource.default);

		if (!options.some(option => option.id === value) && options.length) {
			value = options[0].id;
		}

		return value;
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

	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			init: dropdown => {
				if (this.resource.label) {
					dropdown.element.id = this.getId();
				}

				this.render = dropdown.render;

				if (this.resource.disabled || this.resource.dynamic) {
					// this.setEventListener(event => dropdown.render());
					this.update = () => dropdown.render();
				}
				// if (this.resource.dynamic) {
				// 	// this.setEventListener(event => dropdown.render());
				// }
			},
			update: async dropdown => {


				dropdown.element.classList.add("loading");


				// const queryString = await this.getOptionsParamString();


				// if (queryString !== dropdown.element.getAttribute("querystring")) {
				const options = await this.fetchOptions();
				let value = await this.getValue();

				if (true || this.queriedArrayRequest !== dropdown.element.getAttribute("querystring")) {



					// var [path] = this.getPath();
					// if (path == 187) debugger;



					// if (!options.some(option => option.id === value)) {
					// 	value = options[0].id;
					// 	// console.log("reset dropdown", this.resource.key);
					// 	await this.dispatch({
					// 		action: "set",
					// 		data: [value],
					// 		edit: true,
					// 		backup: "save"
					// 	});
					// }



					// dropdown.children = this.buildOptions(options, value);

					dropdown.element.length = 0;

					options.forEach(option => {

						// console.log(value, option.id, value === option.id, this.resource);

						dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
					});


					dropdown.element.setAttribute("querystring", this.queriedArrayRequest);
				} else {
					this.getValue().then(async (value) => {
						dropdown.element.value = value;
					});
				}

				dropdown.element.onchange = async event => {

					dropdown.element.classList.add("editing");
					// if (this.resource.autosave) {
					// 	dropdown.element.parentNode.classList.add("autosaving");
					// }



					// -> compat
					if (this.resource.retrodependencies) {
						console.warn("DEPRECATED retrodependencies");
						this.resource.retrodependencies.forEach(key => {
							this.parent && this.parent.removeValue([key]);
						});
					}

					// -> compat
					if (this.resource.unfilters) {
						console.warn("DEPRECATED unfilters");
						this.resource.unfilters.forEach(filter => {
							KarmaFieldsAlpha.Nav.remove(filter);
						});
					}

					// if (this.resource.onchange) {
					// 	await this.parse(this.resource.onchange);
					// }

					
					await this.setValue(dropdown.element.value);




					dropdown.element.parentNode.classList.toggle("modified", await this.isModified());
					// if (this.resource.autosave) {
					// 	dropdown.element.parentNode.classList.remove("autosaving");
					// }
					dropdown.element.classList.remove("editing");
				}




				if (this.resource.disabled) {
					dropdown.element.disabled = Boolean(await this.parent.parse(this.resource.disabled));
				}
				// if (this.resource.hidden) {
				// 	dropdown.element.parentNode.classList.toggle("active", Boolean(await this.parent.parse(this.resource.hidden)));
				// }

				dropdown.element.parentNode.classList.toggle("modified", await this.isModified());
				dropdown.element.classList.remove("loading");
			}
		};
	}

}
