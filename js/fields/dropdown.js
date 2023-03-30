KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

	exportValue() {
		const key = this.getKey();
		const values = this.parent.request("get", {}, key);
    if (values) {
      const options = this.fetchOptions();
		  const option = options.find(option => option.id === values[0]);
      if (option) {
        return option.name;
      }
    }
		return "";
	}

	importValue(value) {
		const key = this.getKey();
		const options = this.fetchOptions();
		const option = options.find(option => option.name === value);
		if (option) {
			this.parent.request("set", option.id, key);
		}
	}

	export() {


		const key = this.getKey();
		const defaults = {};

    const values = this.parent.request("get", {}, key);

		if (values) {

			const options = this.fetchOptions();
			const option = options.find(option => option.id === values[0]);

			if (option) {
				defaults[key] = option.name;
			}

		}

		return defaults;
  }

	import(object) {

		const key = this.getKey();

		if (object[key]) {

			const options = this.fetchOptions();
			const option = options.find(option => option.name === object[key]);

			if (option) {

				this.parent.request("set", option.id, key);

			}

		}

  }


	async getDefault() {

		const options = this.fetchOptions();
		const defaults = {};
		const key = this.getKey();

		if (key) {

			if (this.resource.default !== undefined) {

				defaults[key] = this.parse(this.resource.default);

			} else if (options.length > 0) {

				defaults[key] = options[0].id;

			}

		}

		return defaults;

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

    for (let item of results) {

      options.push({
        id: item[idAlias],
        name: item[nameAlias] || KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Query.getValue(driver, item[idAlias], nameAlias) || ["..."])
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
				
        const values = this.parent.request("get", {}, key);

        dropdown.element.classList.toggle("loading", !values);

        if (values) {

          const options = this.fetchOptions();
          let [value] = values;

         

          // const state = await this.parent.request("state", {}, key);
          // let value = KarmaFieldsAlpha.Type.toString(state.value);

          // if (state.multi && !state.alike) {
          // 	options.splice(1, 0, {id: "[multiple-values]", name: "[Multiple Values]"});
          // 	value = "[multiple-values]";
          // }

          // if (this.resource.lazy) {

          // 	// -> set default
          // 	let currentOption = options.find(option => option.id == value);

          // 	const currentOptions = [...dropdown.element.options];

          // 	if (options.length && !currentOptions.some(option => option.value == value)) {

          // 		let option = options.find(option => option.id == value) || options[0];

          // 		// if (this.resource.map) {
          // 		// 	[option] = await KarmaFieldsAlpha.Expression.map(this, [option], this.resource.map);
          // 		// }

          // 		dropdown.element.length = 0;

          // 		dropdown.element.add(new Option(option.name, option.id, false, value === option.id));

          // 	}

          // 	dropdown.element.value = value;

          // 	dropdown.element.onfocus = async event => {

          // 		if (currentOptions.length !== options.length) {

          // 			// let mappedOptions;
          // 			//
          // 			// if (this.resource.map) {
          // 			// 	mappedOptions = await KarmaFieldsAlpha.Expression.map(this, options, this.resource.map);
          // 			// } else {
          // 			// 	mappedOptions = options;
          // 			// }
          // 			//
          // 			dropdown.element.length = 0;
          // 			//
          // 			// mappedOptions.forEach(option => {
          // 			// 	dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
          // 			// });

          //       // console.log(dropdown.element);

          // 			options.forEach(option => {
          // 				dropdown.element.add(new Option(option.name, option.id, false, value === option.id));
          // 			});

          // 			if (options.some(option => option.options)) {
          // 				// -> groups



          // 			}



          // 		}

          // 	}

          // } else if (document.activeElement !== dropdown.element) {

          if (dropdown.element.childElementCount !== options.length) {

            dropdown.element.length = 0;

            options.forEach(option => {
              dropdown.element.add(new Option(option.name, option.id, value === option.id, value === option.id));
            });

            // if (value !== KarmaFieldsAlpha.loading) {

            //   dropdown.element.value = value || "";
              
            // }

            

          } else {

            dropdown.element.value = value || "";

          }




          dropdown.element.onchange = async event => {
            // dropdown.element.classList.add("editing");

            KarmaFieldsAlpha.History.save();

            // if (state.multi) {
            // 	await this.parent.request("set", {multi: true, values: dropdown.element.value}, key);
            // } else {
            // 	await this.parent.request("set", {data: dropdown.element.value}, key);
            // }

            // if (this.resource.onchange) {
            // 	await this.parse(this.resource.onchange);
            // }

            this.parent.request("set", dropdown.element.value, key);

            this.parent.request("edit");

            // dropdown.element.classList.remove("editing");
          }

          if (this.resource.disabled) {

            dropdown.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parent.parse(this.resource.disabled) || []);

          }

          if (this.resource.enabled) {

            dropdown.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parent.parse(this.resource.enabled) || []);
            
          }

          const modified = this.parent.request("modified", {}, key);

          dropdown.element.parentNode.classList.toggle("modified", modified);

          

          // if (!currentOption && options.length) {
          //
          // 	currentOption = options[0];
          //
          // 	// await this.parent.request("set", {data: currentOption.id});
          // 	// this.parent.request("edit");
          //
          // }



        }




        

			}

		};
	}

}
