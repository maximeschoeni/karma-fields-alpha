KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.field {

	// constructor(resource, domain, parent) {
	// 	super(resource, domain, parent);
	// }


	// async getOptionsAsync() {
	// 	// if (this.resource.options) {
	// 	// 	return this.prepareOptions(this.resource.options)
	// 	// } else {
	// 	// 	return this.fetchOptions().then(options => {
	// 	// 		return this.prepareOptions(options);
	// 	// 	});
	// 	// }
	//
	// 	const options = this.fetchOptions();
	// 	return this.prepareOptions(options);
	// }

	// convert(value) {
	// 	if (this.resource.datatype === "number") {
	// 		return Number(value) || 0;
	// 	}
	// 	// else if (this.resource.datatype === "string") {
	// 	// 	return value && value.toString() || "";
	// 	// }
	// 	return value;
	// }

	async updateOptions() {
		// const field = this;
		// return super.update().then(function(value) {
		// 	if (field.resource.options) {
		// 		let options = field.prepareOptions(field.resource.options);
		// 		field.try("onOptions", options, value, "resource");
		// 		return value;
    //   } else {
		// 		return field.load(field.fetchOptions().then(function(options) {
		// 			options = field.prepareOptions(options);
		// 			let queryString = field.getOptionsParamString();
		// 			field.try("onOptions", options, value, queryString);
		// 			return value;
		// 		}));
		// 	}
		// });

		// const value = await super.update();
		const options = await this.load(this.fetchOptions());
		const queryString = this.getOptionsParamString();

		this.try("onOptions", options, value, queryString);

		// return super.update().then(function(value) {
		// 	if (field.resource.options) {
		// 		let options = field.prepareOptions(field.resource.options);
		// 		field.try("onOptions", options, value, "resource");
		// 		return value;
    //   } else {
		// 		return field.load(field.fetchOptions().then(function(options) {
		// 			options = field.prepareOptions(options);
		// 			let queryString = field.getOptionsParamString();
		// 			field.try("onOptions", options, value, queryString);
		// 			return value;
		// 		}));
		// 	}
		// });
  }

	getRemoteOptions(queryString, driver) {
		// if (this.resource.driver) {
		// 	return KarmaFieldsAlpha.Form.fetch2(this.resource.driver, queryString);
		// } else {
		// 	return super.fetch(queryString);
		// }

		return super.getRemoteOptions(queryString, this.resource.driver);
  }



	// getDriver() {
	// 	return this.resource.driver || super.getDriver();
	// }



	exportValue() {
		const field = this;
		return super.exportValue().then(function(value) {
			return field.fetchOptions().then(function(options) {
				const option = options.find(function(option) {
					return option.key === value;
				});
				return option && option.name || value;
			});
		});
  }

	// getEmpty() {
	// 	return this.resource.empty || "";
	// }

  // importValue(value) {
	// 	const options = this.getOptions();
	// 	const option = options.find(function(option) {
	// 		return option.name === value;
	// 	});
	// 	if (option) {
	// 		this.setValue(option.key, context);
	// 	}
  // }

	// fetchDefault() {
	// 	const field = this;
	// 	return this.fetchOptions().then(function(options) {
	//
	// 		if (options.length) {
	// 			return options[0].key;
	// 		}
	// 	});
	// }

	async getDefault() {
		const options = await this.fetchOptions();
		if (this.resource.default !== undefined && options.some(option => option.key === this.resource.default)) {
			return this.resource.default;
		}
		if (options.length) {
			return options[0].key;
		}
		return this.getEmpty();
	}

	async validate(value) {
		const options = this.fetchOptions();
		if (options.length && !options.some(option => option.key === value)) {
			return options[0].key;
		}
		return value;
  }

	async fetchOptions() {
		let options = await super.fetchOptions();
	// }
	//
	// prepareOptions(options) {

		if (options.some(option => option.key === undefined)) {
			console.error("Missing key options");
		}



		if (this.resource.empty !== undefined) {
			options = [{
				key: this.convert(this.resource.empty),
				name: this.resource.empty_option_name || "–"
			}].concat(options);

			// options.unshift({
			// 	key: this.convert(this.resource.empty),
			// 	name: this.resource.empty_option_name || "–"
			// });
		}

		// deprecated
		if (this.resource.novalue !== undefined) {
			// options.unshift({
			// 	key: this.getEmpty(),
			// 	name: this.resource.novalue === true && "-" || this.resource.novalue
			// });
			options = [{
				key: this.getEmpty(),
				name: this.resource.novalue === true && "-" || this.resource.novalue
			}].concat(options);
		}

		options.forEach(option => {
      option.key = option.key.toString();
    });

		return options;
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

			return options.map(function(option) {
				return {
					tag: "option",
					update: function() {
						this.element.textContent = option.name + (option.count && field.resource.count && " ("+option.count+")" || "");
						this.element.value = option.key;
						if (value === option.key) {
							this.element.selected = true;
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
				this.init(dropdown.element);
			},
			update: async dropdown => {

				dropdown.element.onchange = async() => {
					this.backup();
					dropdown.element.classList.add("loading");
					await this.changeValue(dropdown.element.value);
					dropdown.element.classList.toggle("modified", this.modified);
					dropdown.element.classList.remove("loading");
				}

				// field.onOptions = function(options, value, queryString) {
				// 	if (queryString !== dropdown.element.getAttribute("querystring")) {
				// 		dropdown.children = field.buildOptions(options, value);
				// 		//dropdown.render(true);
				// 		dropdown.clean = true;
				// 		dropdown.element.setAttribute("querystring", queryString);
				// 	}
				// }
				// field.onLoad = function(loading) {
				// 	dropdown.element.classList.toggle("loading", loading);
				// }
				// field.onSet = function(value) {
				// 	dropdown.element.value = value;
				// }
				// field.onModified = function(isModified) {
				// 	dropdown.element.classList.toggle("modified", isModified);
				// }

				// console.log(this.getPath());
				// console.trace();

				dropdown.element.classList.add("loading");

				const value = await this.update();
				const options = await this.fetchOptions();
				const queryString = this.getOptionsParamString();

				if (queryString !== dropdown.element.getAttribute("querystring")) {
					// console.log("y", this.getPath());
					dropdown.children = this.buildOptions(options, value);
					dropdown.element.setAttribute("querystring", queryString);
					dropdown.clean = true;
				} else {
					// console.log("x", this.getPath(), dropdown.children, dropdown.child);
					// dropdown.children = undefined;
					dropdown.element.value = value;
					dropdown.clean = false;

				}

				dropdown.element.classList.toggle("modified", this.modified);
				dropdown.element.classList.remove("loading");






			}
		};
	}

}
