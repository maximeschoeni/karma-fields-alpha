KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.input {

	async exportValue() {
		const value = await this.getValue();
		const options = await this.fetchOptions();
		const option = value.length && options.find(function(option) {
			return option.key === value.toString();
		});
		return option && option.name || value;
  }

	async importValue(value) {
		const options = await this.fetchOptions();
		const option = options.find(function(option) {
			return option.name === value;
		});
		if (option) {
			await this.setValue(option.key);
		}
  }

	async getDefault() {
		const options = await this.fetchOptions();
		if (this.resource.default !== undefined && options.some(option => option.key === this.resource.default)) {
			return this.resource.default;
		}
		const value = KarmaFieldsAlpha.Nav.getParam(this.resource.key);
		if (value && options.some(option => option.key === value)) {
			return value;
		}
		if (options.length) {
			return options[0].key;
		}
	}

	async fetchOptions() {
		let options = await super.fetchOptions(this.resource.driver);

		if (options.some(option => option.key === undefined)) {
			console.error("Missing key options", options);
		}

		if (this.resource.empty !== undefined) {
			options = [{
				key: this.resource.empty,
				name: this.resource.empty_option_name || "–"
			}].concat(options);

		}

		// deprecated
		if (this.resource.novalue !== undefined) {
			options = [{
				key: "",
				name: this.resource.novalue === true ? "-" : this.resource.novalue
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

				if (this.resource.disabled || this.resource.hidden || this.resource.dynamic) {
					// this.setEventListener(event => dropdown.render());
					this.splash = request => dropdown.render();
				}
				// if (this.resource.dynamic) {
				// 	// this.setEventListener(event => dropdown.render());
				// }
			},
			update: async dropdown => {


				dropdown.element.classList.add("loading");


				const queryString = await this.getOptionsParamString();

				if (queryString !== dropdown.element.getAttribute("querystring")) {
					const options = await this.fetchOptions();
					const value = await this.getValue();
					// dropdown.children = this.buildOptions(options, value);

					dropdown.element.length = 0;

					options.forEach(option => {
						dropdown.element.add(new Option(option.name, option.key, false, value === option.key));
					});


					dropdown.element.setAttribute("querystring", queryString);
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

					if (this.resource.unfilters) {
						this.resource.unfilters.forEach(filter => {
							KarmaFieldsAlpha.Nav.removeParam(filter);
						});
					}

					await this.setValue(dropdown.element.value);

					dropdown.element.parentNode.classList.toggle("modified", await this.isModified());
					// if (this.resource.autosave) {
					// 	dropdown.element.parentNode.classList.remove("autosaving");
					// }
					dropdown.element.classList.remove("editing");
				}




				if (this.resource.disabled) {
					dropdown.element.disabled = await this.parent.check(this.resource.disabled);
				}
				if (this.resource.hidden) {
					dropdown.element.parentNode.classList.toggle("active", await this.parent.check(this.resource.hidden));
				}

				dropdown.element.parentNode.classList.toggle("modified", await this.isModified());
				dropdown.element.classList.remove("loading");
			}
		};
	}

}
