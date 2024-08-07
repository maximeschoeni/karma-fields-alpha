KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

  async getDefault() {

    const content = new KarmaFieldsAlpha.Content();

    const options = await this.getOptions();

    if (options.loading) {

      content.loading = true;

    } else {

      if (this.resource.default) {

        const defaultValue = await this.parse(this.resource.default)

        content.value = defaultValue.toString();

  		}

      if (content.value === undefined || !options.toArray().some(item => item.id === content.value)) {

        content.value = options.toArray()[0].id; // -> allowing default value not in options may lead in infinite loop !

      }

    }

    return content;

	}

  async export() {

    if (this.resource.export === "name") {

      const output = new KarmaFieldsAlpha.Content();
      const content = await this.getContent();
      const options = await this.getOptions();

      if (content.loading || options.loading) {

        output.loading = true;

      } else {

        const value = content.toString();
        const option = options.toArray().find(option => option.id === value);

        output.value = option && option.name || "";

      }

      return output;

    } else {

      return super.export();

    }

	}
  //
  // import(collection) {
  //
  //   let content = collection.pick();
  //
  //   const options = this.getOptions();
  //
  //   if (!options.loading) {
  //
  //     const value = content.toString();
  //
  //     const option = options.toArray().find(option => option.name === value);
  //
  //     if (option) {
  //
  //       content = new KarmaFieldsAlpha.Content(option.id);
  //
  //     }
  //
  //   }
  //
  //   this.setContent(content);
  //
  // }

  isDisabled() {

    if (this.resource.disabled) {

      return this.parent.parse(this.resource.disabled);

    } else if (this.resource.enabled) {

      return !this.parent.parse(this.resource.enabled);

    }

    return new KarmaFieldsAlpha.Content(false);
  }

  async getOptions() {

		let options;

		if (this.resource.options) {

			options = await this.parse(this.resource.options);

		} else {

      options = new KarmaFieldsAlpha.Content([]);

    }

		if (this.resource.driver) {

      // const params = await this.parse(this.resource.params);
      //
      // if (params.loading) {
      //
      //   options.loading = true;
      //
      // } else {



        // const query = new KarmaFieldsAlpha.Content.Query(this.resource.driver, params.toObject() || {});

        // const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
        // const shuttle = KarmaFieldsAlpha.Shuttle.get(this.resource.driver, paramstring);
        // const query = shuttle.getOptions();

        // const table = new KarmaFieldsAlpha.field.table({
        //   driver: this.resource.driver,
        //   params: this.resource.params
        // }, "options", this);

        // const table = new KarmaFieldsAlpha.field.table({
        //   driver: this.resource.driver,
        //   params: this.resource.params
        // }, "options", this);

      const server = new KarmaFieldsAlpha.Server(this.resource.driver);

      const params = await this.parse(this.resource.params || {});

      if (params.loading) {

        options.loading = true;

      } else {

        await server.query(params.toObject());

        const set = await server.getOptionsList();

        if (set.loading) {

          options.loading = true;

        } else {

          options.value = [...options.toArray(), ...set.toArray()];

        }

      }

		}

		return options;

	}


	build() {

		return {
			tag: "select",
			class: "dropdown karma-field",
			update: async dropdown => {


        let options = await this.getOptions();
        let content = await this.getContent();

        dropdown.element.classList.toggle("loading", Boolean(content.loading));

        if (!options.loading && !content.loading) {

          if (content.mixed) {

            options.value = [...options.value, {id: content.toString(), name: "[mixed value]"}]

          } else {

            // if (content.notFound) { // || !options.toArray().some(option => option.id === content.toString())) {
            //
            //   if (this.resource.createWhenNotFound) {
            //
  					// 		this.createTask("create");
            //
  					// 	}
            //
            //   // content = this.getDefault();
            //   //
            //   // if (!content.loading) {
            //   //
            //   //   this.setContent(content);
            //   //
            //   //   KarmaFieldsAlpha.Query.init(); // -> add fake task to force rerendering
            //   //
            //   // }
            //
            // }

          }

          const value = content.toString();


          // if (true || dropdown.element.childElementCount !== options.toArray().length) {

          const optionsArray = options.toArray();
          const elementOptions = [...dropdown.element.options];

          if (elementOptions.length !== optionsArray.length || elementOptions.some((option, index) => option.value !== optionsArray[index].id)) {

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
            // const content = new KarmaFieldsAlpha.Content(dropdown.element.value);

            await this.save("change", "Change");

            await this.parent.setValue(dropdown.element.value, key);


            await this.request("render");

          }

          dropdown.element.onfocus = async event => {

						await this.setFocus(content.mixed);

					}

          dropdown.element.onmousedown = event => {

            event.stopPropagation();

          }

          const disabled = await this.isDisabled();

          dropdown.element.disabled = disabled.toBoolean();

          dropdown.element.parentNode.classList.toggle("modified", Boolean(content.modified));

        }

			}

		};
	}


  // build() {
  //
	// 	return {
	// 		tag: "select",
	// 		class: "dropdown karma-field",
	// 		init: dropdown => {
  //
  //       // let content = this.getContent();
  //       // let options = this.getOptions();
  //
  //       let value = "x";
  //       let options = {
  //         value: [
  //           {id: "x", name: "X"},
  //           {id: "y", name: "Y"},
  //           {id: "z", name: "Z"},
  //         ],
  //         toArray: () => options.value
  //       };
  //
  //       for (let option of options.toArray()) {
  //
  //         let optionElement = new Option(option.name, option.id, value === option.id, value === option.id);
  //
  //         dropdown.element.add(optionElement);
  //
  //       }
  //
	// 		}
  //
	// 	};
	// }

}
