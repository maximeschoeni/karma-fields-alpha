KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

  getDefault(defaults = {}) {

		if (this.resource.default) {

      return this.parse(this.resource.default);

		} else {

      const options = this.fetchOptions();

      if (options && options.length > 0) {

        return options[0].id;

      }

    }

	}

  initValue() {

    let value = "";
    const options = this.fetchOptions();



    if (options !== KarmaFieldsAlpha.loading && options.length) {

      value = options[0].id;

      this.setValue(value);
      this.save();

    }

    return value;
  }


//   getDefault(defaults = {}) {
// console.error("deprecated");
// 		const key = this.getKey();
//     const options = this.fetchOptions();
//
// 		if (key && this.resource.default !== null) {
//
// 			defaults[key] = this.parse(this.resource.default || "");
//
// 		} else if (options.length > 0) {
//
//       defaults[key] = options[0].id;
//
//     }
//
// 		return defaults;
// 	}


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

  // export(items = []) {
  //
  //   const [value] = this.getValue() || [KarmaFieldsAlpha.loading];
  //
  //   items.push(value.toString());
  //
	// }

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

    return KarmaFieldsAlpha.Query.getOptions(driver, params);

    // if (!KarmaFieldsAlpha.Query.get(driver)) {
    //
    //   console.error("Driver not found", driver);
    //
    // }


    // const results = KarmaFieldsAlpha.Query.getResults(driver, params);
    //
    // if (results) {
    //
    //   const options = [];
    //   // const alias = KarmaFieldsAlpha.drivers[driver].alias;
    //   // const idAlias = alias.id || "id";
    //   // const nameAlias = alias.name || "name";
    //   const idAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "id") || "id";
    //   const nameAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "name") || "name";
    //
    //
    //
    //   for (let item of results) {
    //
    //     let name = item[nameAlias];
    //
    //     if (name === undefined) {
    //
    //       name = KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Query.getValue(driver, item[idAlias], nameAlias) || ["..."])
    //
    //     }
    //
    //     options.push({
    //       id: item[idAlias],
    //       name: name
    //     });
    //
    //   }
    //
    //   return options;
    //
    // }

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

      if (moreOptions === KarmaFieldsAlpha.loading) {

        return KarmaFieldsAlpha.loading;

      }

      options = [...options, ...moreOptions];

    }

		return options;

	}


	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			update: dropdown => {

        let value = this.getSingleValue();
        let options = this.fetchOptions();

        dropdown.element.classList.toggle("loading", value === KarmaFieldsAlpha.loading);

        if (options && options.length > 0 && value !== KarmaFieldsAlpha.loading) {

          if (value === KarmaFieldsAlpha.mixed) {

            // const mixedOption = new Option("[mixed value]", "xxx", true, true);
            // mixedOption.disabled = true;

            options = [...options, {id: value, name: "[mixed value]"}];

            // dropdown.element.length = 0;
            // dropdown.element.add(new Option("–", "", false, false));
            // dropdown.element.add(mixedOption);

          } else {

            if (!options.some(option => option.id === value)) {

              // value = options[0].id;
              //
              // this.setValue(value);
              // this.save();

              value = this.initValue();

            }

          }

          if (dropdown.element.childElementCount !== options.length) {

            dropdown.element.length = 0;

            for (let option of options) {

              let optionElement;

              if (option.id === KarmaFieldsAlpha.mixed) {

                optionElement = new Option(option.name, "", true, true);
                optionElement.disabled = true;

              } else {

                optionElement = new Option(option.name, option.id, value === option.id, value === option.id);

              }

              dropdown.element.add(optionElement);

            }

          } else if (value !== dropdown.element.value && value !== KarmaFieldsAlpha.mixed) {

            dropdown.element.value = value || "";

          }





          dropdown.element.onchange = event => {

            this.setValue(dropdown.element.value);
            this.save("change");

          }

          dropdown.element.onmousedown = event => {

            event.stopPropagation();

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
