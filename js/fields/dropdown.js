KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

  getDefault(defaults = {}) {

		if (this.resource.default) {

      return this.parse(this.resource.default);

		} else {

      const options = this.getOptions();

      return new KarmaFieldsAlpha.Content.Request(options.toString());

      // if (options && options.length > 0) {
      //
      //   return options[0].id;
      //
      // }

    }

	}

  initValue() {

    // let value = "";
    // const options = this.fetchOptions();
    //
    //
    //
    // if (options !== KarmaFieldsAlpha.loading && options.length) {
    //
    //   value = options[0].id;
    //
    //   this.setValue(value);
    //   this.save();
    //
    // }

    let value = this.getDefault();

    if (value !== KarmaFieldsAlpha.loading) {

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

  export(collection) {

    const content = this.getContent();

    if (!content.loading) {

      const options = this.getOptions();
      const value = content.toString();

      const option = options.toArray().find(option => option.id === value);

      collection.add(new KarmaFieldsAlpha.Content(option.name));

    }

	}

  import(collection) {

    let content = collection.pick();

    const options = this.getOptions();

    if (!options.loading) {

      const value = content.toString();

      const option = options.toArray().find(option => option.name === value);

      if (option) {

        content = new KarmaFieldsAlpha.Content(option.id);

      }

    }

    this.setContent(content);

  }

	// getOptions(driver, params) {
  //
  //   return KarmaFieldsAlpha.Query.getOptions(driver, params);
  //
  //   // if (!KarmaFieldsAlpha.Query.get(driver)) {
  //   //
  //   //   console.error("Driver not found", driver);
  //   //
  //   // }
  //
  //
  //   // const results = KarmaFieldsAlpha.Query.getResults(driver, params);
  //   //
  //   // if (results) {
  //   //
  //   //   const options = [];
  //   //   // const alias = KarmaFieldsAlpha.drivers[driver].alias;
  //   //   // const idAlias = alias.id || "id";
  //   //   // const nameAlias = alias.name || "name";
  //   //   const idAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "id") || "id";
  //   //   const nameAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "name") || "name";
  //   //
  //   //
  //   //
  //   //   for (let item of results) {
  //   //
  //   //     let name = item[nameAlias];
  //   //
  //   //     if (name === undefined) {
  //   //
  //   //       name = KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Query.getValue(driver, item[idAlias], nameAlias) || ["..."])
  //   //
  //   //     }
  //   //
  //   //     options.push({
  //   //       id: item[idAlias],
  //   //       name: name
  //   //     });
  //   //
  //   //   }
  //   //
  //   //   return options;
  //   //
  //   // }
  //
  // }

	// fetchOptions() {
  //
	// 	let options = [];
  //
	// 	if (this.resource.options) {
  //
	// 		const results = this.parse(this.resource.options);
  //
  //     if (results !== KarmaFieldsAlpha.loading) {
  //
  //       options = results;
  //
  //     } else {
  //
  //       return;
  //
  //     }
  //
	// 	}
  //
  //   let moreOptions;
  //
	// 	if (this.resource.driver) {
  //
  //     moreOptions = this.getOptions(this.resource.driver, this.resource.params || {});
  //
	// 	} else if (this.resource.table) {
  //
  //     const grid = this.request("getGrid", this.resource.table);
  //
  //     if (grid && grid.resource.table) {
  //
  //       moreOptions = this.getOptions(grid.resource.driver, grid.resource.params || {});
  //
  //     }
  //
	// 	}
  //
  //   if (moreOptions) {
  //
  //     if (moreOptions === KarmaFieldsAlpha.loading) {
  //
  //       return KarmaFieldsAlpha.loading;
  //
  //     }
  //
  //     options = [...options, ...moreOptions];
  //
  //   }
  //
	// 	return options;
  //
	// }

  isDisabled() {

    if (this.resource.disabled) {

      return this.parent.parse(this.resource.disabled).toBoolean();

    } else if (this.resource.enabled) {

      return !this.parent.parse(this.resource.enabled).toBoolean();

    }

    return false;
  }

  getOptions() {

		let options;

		if (this.resource.options) {

			options = this.parse(this.resource.options);

		} else {

      options = new KarmaFieldsAlpha.Content([]);

    }

		if (this.resource.driver) {

      const moreOptions = KarmaFieldsAlpha.Query.getResult(this.resource.driver, this.resource.params || {});

      options.merge(moreOptions);

		}

		return options;

	}


	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			update: dropdown => {

        let content = this.getContent();
        let options = this.getOptions();

        dropdown.element.classList.toggle("loading", Boolean(content.loading));

        if (!options.loading && !content.loading) {

          if (content.mixed) {

            options.value = [...options.value, {id: content.toString(), name: "[mixed value]"}]

          } else {

            if (content.notFound || !options.toArray().some(option => option.id === content.toString())) {

              content = this.getDefault();

              if (!content.loading) {

                this.setContent(content);

                KarmaFieldsAlpha.Query.init(); // -> add fake task to force rerendering

              }

            }

          }

          const value = content.toString();

          if (dropdown.element.childElementCount !== options.toArray().length) {

            dropdown.element.length = 0;

            for (let option of options.toArray()) {

              let optionElement;

              if (option.id === KarmaFieldsAlpha.mixed) {

                optionElement = new Option(option.name, "", true, true);
                optionElement.disabled = true;

              } else {

                optionElement = new Option(option.name, option.id, value === option.id, value === option.id);

              }

              dropdown.element.add(optionElement);

            }

          } else if (value !== dropdown.element.value && !content.mixed) {

            dropdown.element.value = value || "";

          }


          dropdown.element.onchange = async event => {

            const key = this.getKey();
            const content = new KarmaFieldsAlpha.Content(dropdown.element.value);

            await KarmaFieldsAlpha.History.save("change", "Change");

            await this.parent.setContent(content, key);


            await this.request("render");

          }

          dropdown.element.onmousedown = event => {

            event.stopPropagation();

          }

          dropdown.element.disabled = this.isDisabled();

          dropdown.element.parentNode.classList.toggle("modified", Boolean(content.modified));

        }

			}

		};
	}

}
