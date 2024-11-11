KarmaFieldsAlpha.field.datalist = class extends KarmaFieldsAlpha.field.input {

  async abduct() {

		await KarmaFieldsAlpha.build({
      class: "datalist-content karma-field",
      children: [...this.buildContent()]
    }, this.element, this.element.firstElementChild);

	}

	async render() {

		if (this.element) {

			await KarmaFieldsAlpha.server.init();

			await this.abduct();

			while (KarmaFieldsAlpha.server.hasOrder()) {

				await KarmaFieldsAlpha.server.process();

				await this.abduct();

			}

		} else {

			await this.parent.render();

		}

	}


  getContent() {

    const content = super.getContent();

    if (content.loading || content.mixed) {

      return content;

    } else if (content.toString()) {

      const driver = this.getDriver();

      return this.getWild(driver, content.toString(), "name");

    } else {

      return new KarmaFieldsAlpha.Content("");

    }


  }

  getOptions() {

    const paramstring = this.queryParamstring();
    const driver = this.getDriver();

    if (paramstring.loading) {

      return new KarmaFieldsAlpha.Loading();

    } else if (paramstring.toString()) {

      return this.getOptionsList(driver, paramstring.toString());

    } else {

      return new KarmaFieldsAlpha.Content([]);

    }

	}

  queryParamstring() {

    const response = new KarmaFieldsAlpha.Content();
    const params = this.parse(this.resource.params);

    if (params.loading) {

      response.loading = true;

    } else {

      response.value = KarmaFieldsAlpha.Params.stringify({
        ppp: this.resource.ppp || 20,
        ...params.toObject(),
        search: this.search
      });

    }

    return response;
  }

  *buildContent() {

    // const driver = this.getDriver();
    let content = this.getContent();
    let hasFocus = this.hasFocus();

    if (content.mixed) {

      yield {
        tag: "input",
        init: node => {
          node.element.type = "text";
          node.element.setAttribute("list", `${this.uid}-datalist`);
        },
        update: node => {
          hasFocus = this.hasFocus();
          node.element.classList.toggle("selected", Boolean(content.mixed && hasFocus));
          node.element.readOnly = true;
          node.element.value = "[mixed content]";
          node.element.onfocus = async event => {
  					await this.setFocus(true);
  					await this.render(); // update clipboard textarea, unselect other stuffs
  				}
        }
      };


    } else if (!content.loading) {

      if (this.search === undefined) {

        this.search = content.toString();

        // const item = options.toArray().find(item => item.id === content.toString());
        //
        // if (item) {
        //
        //   this.search = item.name;
        //
        // } else {
        //
        //   this.search = "";
        //
        // }

      }

      let options = this.getOptions();

      const isCanon = !options.loading && this.search !== "" && options.toArray().some(item => item.name === this.search);

      yield {
        tag: "input",
        init: node => {
          node.element.type = "text";
          node.element.setAttribute("list", `${this.uid}-datalist`);
        },
        update: node => {
          node.element.classList.remove("selected"); // only when mixed
          node.element.readOnly = false;
          node.element.classList.toggle("canon", isCanon);
          if (node.element.value.normalize() !== this.search) { // -> replacing same value still reset caret position
            node.element.value = this.search;
          }
          node.element.oninput = async event => {
            this.search = node.element.value.normalize();
            options = this.getOptions();
            while (options.loading) {
              await this.render();
              this.search = node.element.value.normalize();
              options = this.getOptions();
            }
            const item = options.toArray().find(item => item.name === this.search);
            if (item && item.id !== content.toString()) {
              await this.save("change", "Change");
              await this.setValue(item.id);
              await this.parent.render();
            } else if (this.search === "") {
              await this.save("delete", "Delete");
              await this.setValue("");
              await this.parent.render();
            } else {
              await this.render();
            }
          }
  				node.element.onfocus = async event => {
  					await this.setFocus();
  					await this.render(); // update clipboard textarea, unselect other stuffs
  				}
  				node.element.onmousedown = event => {
  					event.stopPropagation(); // -> prevent selecting parent stuffs
  				}
        }
      };


      // if (!options.loading || options.toArray().length > 1 || options.toArray().length === 1 && options.toArray()[0].name === this.search) {

      if (!options.loading && hasFocus) {

        // yield {
        //   tag: "ul",
        //   init: node => {
        //     // prevent input loosing focus
        //     node.element.onmousedown = event => {
        //       event.stopPropagation(); // -> prevent reseting modal selection
        //       event.preventDefault(); // -> prevent input blur event
        //     };
        //   },
        //   children: options.toArray().map(item => {
        //     return {
        //       tag: "li",
        //       update: node => {
        //         node.element.innerHTML = item.name;
        //         node.element.onclick = async event => {
        //
        //           await this.save("change", "Change");
        //           await this.setValue(item.id);
        //           await this.removeFocus();
        //           await this.parent.render();
        //         }
        //       }
        //     };
        //   })
        // };

        yield {
          tag: "datalist",
          init: node => {
            node.element.id = `${this.uid}-datalist`;
            // prevent input loosing focus
            node.element.onmousedown = event => {
              event.stopPropagation(); // -> prevent reseting modal selection
              event.preventDefault(); // -> prevent input blur event
            };
          },
          children: options.toArray().filter(item => item.name !== this.search).map(item => {
            return {
              tag: "option",
              update: node => {
                node.element.value = item.name;
                // node.element.onclick = async event => {
                //
                //   await this.save("change", "Change");
                //   await this.setValue(item.id);
                //   await this.removeFocus();
                //   await this.parent.render();
                // }
              }
            };
          })
        };

      }

    }

  }


	build() {

		return {
			class: "datalist karma-field",
      update: node => {
        this.element = node.element;
      },
      child: {
        class: "datalist-content karma-field",
        children: [...this.buildContent()]
      }
		};

	}


}
