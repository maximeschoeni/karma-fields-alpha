KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

  getDefault(defaults = {}) {

		const key = this.getKey();
    const options = this.fetchOptions();

		if (key && this.resource.default !== null) {

			defaults[key] = this.parse(this.resource.default || "");

		} else if (options.length > 0) {

      defaults[key] = options[0].id;

    }

		return defaults;
	}

  export(items = []) {

		const values = this.getValue();

    if (values) {

			const options = this.fetchOptions();
			const option = options.find(option => option.id === values[0]);

			if (option) {

				items.push(option.name);

			}

		}
    
    return items;
	}

  import(items) {

    const value = items.shift() || "";

    const options = this.fetchOptions();
		const option = options.find(option => option.name === value);

    if (option) {

      this.setValue(option.id);

    }

  }

	getOptions(driver, params) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);

    }


    const results = KarmaFieldsAlpha.Query.getResults(driver, params) || [{id: "", name: "..."}];

    const options = [];
    const alias = KarmaFieldsAlpha.drivers[driver].alias;
    const idAlias = alias.id || "id";
    const nameAlias = alias.name || "name";

    let name = item[nameAlias];

    if (name === undefined) {

      name = KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Terminal.getValue(driver, item[idAlias], nameAlias) || ["..."])

    }

    for (let item of results) {

      options.push({
        id: item[idAlias],
        name: name
      });

    }
  
    return options;

  }

	fetchOptions() {

		let options = [];

		if (this.resource.options) {

			const results = this.parse(this.resource.options);

      if (results !== KarmaFieldsAlpha.loading) {

        options = results;

      } else {

        options = [{id: "", name: "..."}];
        
      }

		}

		if (this.resource.driver) {

      options = [...options, ...this.getOptions(this.resource.driver, this.resource.params || {})];

		} else if (this.resource.query) { // -> compat

      options = [...options, ...this.getOptions(this.resource.query.driver, this.resource.query.params || {})];

		} else if (this.resource.table) { // -> compat

			const table = this.request("table", {id: this.resource.table});

      options = [...options, ...this.getOptions(table.resource.driver, table.resource.params || {})];

		}

		return options;

	}


	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			update: dropdown => {
				const key = this.getKey();
				
        const values = this.parent.getValue(key);

        dropdown.element.classList.toggle("loading", !values);

        if (values) {

          const options = this.fetchOptions();
          let [value] = values;

          if (dropdown.element.childElementCount !== options.length) {

            dropdown.element.length = 0;

            options.forEach(option => {
              dropdown.element.add(new Option(option.name, option.id, value === option.id, value === option.id));
            });

          } else {

            dropdown.element.value = value || "";

          }

          dropdown.element.onchange = async event => {

            this.setValue(dropdown.element.value);

            KarmaFieldsAlpha.History.save();

            this.parent.render();
            
          }

          if (this.resource.disabled) {

            dropdown.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parent.parse(this.resource.disabled) || []);

          }

          if (this.resource.enabled) {

            dropdown.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parent.parse(this.resource.enabled) || []);
            
          }

          const modified = this.modified();

          dropdown.element.parentNode.classList.toggle("modified", Boolean(modified));

        }

			}

		};
	}

}
