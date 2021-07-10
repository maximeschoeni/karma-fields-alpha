KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.field {

	// constructor(resource, domain, parent) {
	// 	super(resource, domain, parent);
	// }


	getOptionsAsync() {
		const field = this;
		if (this.resource.options) {
			const options = field.prepareOptions(this.resource.options)
			return Promise.resolve(options);
		} else {
			return field.fetchOptions().then(function(options) {
				options = field.prepareOptions(options);
				return options;
			});
		}
	}

	update() {
		const field = this;
		return super.update().then(function(value) {
			if (field.resource.options) {
				let options = field.prepareOptions(field.resource.options);
				field.try("onOptions", options, value, "resource");
				return value;
      } else {
				return field.load(field.fetchOptions().then(function(options) {
					options = field.prepareOptions(options);
					let queryString = field.getOptionsParamString();
					field.try("onOptions", options, value, queryString);
					return value;
				}));
			}
		});
  }

	fetch(queryString) {
		if (this.resource.driver) {
			return KarmaFieldsAlpha.Form.fetch2(this.resource.driver, queryString);
		} else {
			return super.fetch(queryString);
		}
  }



	// getDriver() {
	// 	return this.resource.driver || super.getDriver();
	// }



	exportValue() {
		const field = this;
		return super.exportValue().then(function(value) {
			return field.getOptionsAsync().then(function(options) {
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

	validate(value) {

		return this.getOptionsAsync().then(options => {
			if (options.length) {
				if (!options.some(option => option.key === value)) {

					// value = options[0].key;
					//
	        // // only save if value is different
					// const rawValue = this.stringify(value);
	        // if (validatedRawValue !== rawValue) {
	        //   rawValue = validatedRawValue;
	        //   this.write(rawValue);
	        // }

					return options[0].key;
				}
			}
			return value;
		});
  }

	prepareOptions(options) {
		options = options.filter(function(option) {
			return option.key;
		});
		options.forEach(function(option) {
      option.key = option.key.toString(); //this.convert(option.key, "string", this.resource.datatype || this.datatype);
    });
		if (this.resource.empty !== undefined) {
			options.unshift({
				key: this.resource.empty,
				name: this.resource.empty_option_name || "–"
			});
		}
		// deprecated
		if (this.resource.novalue !== undefined) {
			options.unshift({
				key: this.getEmpty(),
				name: this.resource.novalue === true && "-" || this.resource.novalue
			});
		}
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
		const field = this;

		return {
			tag: "select",
			class: "dropdown karma-field",
			init: function(dropdown) {
				if (field.resource.label) {
					this.element.id = field.getId();
				}
				field.init(this.element);
			},
			update: function(dropdown) {

				this.element.onchange = function() {
					field.backup();
					field.changeValue(this.value);
				}

				field.onOptions = function(options, value, queryString) {
					if (queryString !== dropdown.element.getAttribute("querystring")) {
						dropdown.children = field.buildOptions(options, value);
						dropdown.render(true);
						dropdown.element.setAttribute("querystring", queryString);
					}
				}
				field.onLoad = function(loading) {
					dropdown.element.classList.toggle("loading", loading);
				}
				field.onSet = function(value) {
					dropdown.element.value = value;
				}
				field.onModified = function(isModified) {
					dropdown.element.classList.toggle("modified", isModified);
				}

				// field.fetchValue();
				// field.fetchOptions();
				field.update();
			}
		};
	}

}
