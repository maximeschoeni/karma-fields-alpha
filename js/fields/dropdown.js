KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

  getDefaultValue(defaults = {}) {

		if (this.resource.default) {

      return this.parse(this.resource.default);

		} else {

      const options = this.fetchOptions();

      if (options && options.length > 0) {

        return options[0].id;

      }

    }

	}


  getDefault(defaults = {}) {
console.error("deprecated");
		const key = this.getKey();
    const options = this.fetchOptions();

		if (key && this.resource.default !== null) {

			defaults[key] = this.parse(this.resource.default || "");

		} else if (options.length > 0) {

      defaults[key] = options[0].id;

    }

		return defaults;
	}


  // getDefault(defaults = {}) {
  //
	// 	const key = this.getKey();
  //   const options = this.fetchOptions();
  //
	// 	if (key && this.resource.default !== null) {
  //
	// 		defaults[key] = this.parse(this.resource.default || "");
  //
	// 	} else if (options.length > 0) {
  //
  //     defaults[key] = options[0].id;
  //
  //   }
  //
	// 	return defaults;
	// }

  export(items = []) {

		const value = this.getValue();

		const options = this.fetchOptions();

    if (options) {

      const option = options.find(option => option.id === value);

      if (option) {

        items.push(option.name);

      }

    }


    return items;
	}

  import(items) {

    const value = items.shift() || "";

    const options = this.fetchOptions();

    if (options) {

      const option = options.find(option => option.name === value);

      if (option) {

        this.setValue(option.id);

      }

    }

  }

	getOptions(driver, params) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);

    }


    const results = KarmaFieldsAlpha.Query.getResults(driver, params);

    if (results) {

      const options = [];
      const alias = KarmaFieldsAlpha.drivers[driver].alias;
      const idAlias = alias.id || "id";
      const nameAlias = alias.name || "name";

      let name = item[nameAlias];

      if (name === undefined) {

        name = KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Query.getValue(driver, item[idAlias], nameAlias) || ["..."])

      }

      for (let item of results) {

        options.push({
          id: item[idAlias],
          name: name
        });

      }

      return options;

    }

  }

	fetchOptions() {

		let options = [];

		if (this.resource.options) {

			const results = this.parse(this.resource.options);

      if (results !== KarmaFieldsAlpha.loading) {

        options = results;

      } else {

        return;

      }

		}

    let moreOptions;

		if (this.resource.driver) {

      moreOptions = this.getOptions(this.resource.driver, this.resource.params || {});

		} else if (this.resource.table) {

      const grid = this.request("getGrid", this.resource.table);

      if (grid && grid.resource.table) {

        moreOptions = this.getOptions(grid.resource.driver, grid.resource.params || {});

      }

		}

    if (moreOptions) {

      options = [...options, ...moreOptions];

    }

		return options;

	}


	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			update: dropdown => {

        let value = this.getValue();
        const options = this.fetchOptions();

        dropdown.element.classList.toggle("loading", value === KarmaFieldsAlpha.field.input.loading);

        if (options && options.length > 0 && value !== KarmaFieldsAlpha.field.input.loading) {

          if (!options.some(option => option.id === value)) {

            value = options[0].id;

          }

          if (dropdown.element.childElementCount !== options.length || dropdown.element.lastElementChild.value !== options[options.length-1].id) {

            dropdown.element.length = 0;

            options.forEach(option => {
              dropdown.element.add(new Option(option.name, option.id, value === option.id, value === option.id));
            });

          } else if (value !== dropdown.element.value) {

            dropdown.element.value = value || "";

          }

          dropdown.element.onchange = async event => {

            this.setValue(dropdown.element.value);

          }

          if (this.resource.disabled) {

            dropdown.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parent.parse(this.resource.disabled));

          }

          if (this.resource.enabled) {

            dropdown.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parent.parse(this.resource.enabled));

          }

          const modified = this.modified();

          dropdown.element.parentNode.classList.toggle("modified", Boolean(modified));

        }

			}

		};
	}

}
