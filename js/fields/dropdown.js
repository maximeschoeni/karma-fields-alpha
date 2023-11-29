KarmaFieldsAlpha.field.dropdown = class extends KarmaFieldsAlpha.field.input {

  getDefault(defaults = {}) {

		if (this.resource.default) {

      return this.parse(this.resource.default);

		} else {

      const options = this.getOptions();

      return new KarmaFieldsAlpha.Content.Request(options.toString());

    }

	}

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


          dropdown.element.onchange = event => {

            const key = this.getKey();
            const content = new KarmaFieldsAlpha.Content(dropdown.element.value);

            KarmaFieldsAlpha.History.save("change", "Change");

            this.parent.setContent(content, key);


            this.request("render");

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
