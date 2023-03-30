KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

  // expect(action, object) {
    
  //   switch(action) {

  //     case "keys": {
  //       const key = this.getKey();
  //       if (key) {
  //         object.add(key);
  //       }
  //     }
        


  //   }

  // }

	getDefault() {

		const defaults = {};

		const key = this.getKey();

		if (key && this.resource.default !== null) {

			defaults[key] = this.parse(this.resource.default || "");

		}

		return defaults;
	}

	exportValue() {
		const key = this.getKey();
    return this.parent.request("get", {}, key);
	}

	importValue(value) {
		const key = this.getKey();
		this.parent.request("set", value, key);
	}

	export(keys = []) {
		const key = this.getKey();
		const defaults = {};
		if (keys.length === 0 || keys.includes(key)) {
			// defaults[key] = await this.get("string");
      const values = this.parent.request("get", {}, key);
      if (values) {
        defaults[key] = KarmaFieldsAlpha.Type.toString(values);
      }
		}
		return defaults;
	}

	import(object) {
		const key = this.getKey();
		if (object[key] !== undefined) {
			this.parent.request("set", object[key], key);
		}
	}

	set(value) {

		if (!this.isBusy()) {
			KarmaFieldsAlpha.History.save();
		}

		const key = this.getKey();

    if (this.resource.autosave) {

      this.parent.request("autosave", value, key);

    } else {

      this.parent.request("set", value, key);

    }

		this.parent.request("edit");

	}

	isBusy(duration = 3000) {
		if (!this.busy) {
			setTimeout(() => {
				this.busy = false;
			}, duration);
			this.busy = true;
			return false;
		}
		return true;
	}

	// async enqueue(callback) {
	// 	this.queueNext = callback;
	// 	if (this.queue) {
	// 		await this.queue;
	// 	}
	// 	if (this.queueNext === callback) {
	// 		this.queue = this.queueNext();
	// 		await this.queue;
	// 		return true;
	// 	}
	// 	return false;
	// }

	throttle(callback, interval = 200) {
		if (this.throttleTimer) {
			clearTimeout(this.throttleTimer);
		}
		this.throttleTimer = setTimeout(callback, interval);
	}

	getPlaceholder() {
		return this.parse(this.resource.placeholder || "");
	}

	buildInput() {
		return {
			tag: "input",
			class: "text-input karma-field",
			init: input => {
				input.element.type = "text";
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
				if (this.resource.options) {
					input.element.setAttribute("list", "list-"+this.getId());
				}


			},
			update: async input => {

				

				const key = this.getKey();

				// const state = await this.parent.request("state", {}, key);

        const values = this.parent.request("get", {}, key);

        input.element.classList.toggle("loading", !values);

        if (values) {

          input.element.classList.toggle("multi", values.length > 1);
          input.element.readOnly = Boolean(this.resource.readonly || values.length > 1);

          const [value = ""] = values;

          if (document.activeElement !== input.element) { // -> prevent changing value while editing (e.g search field)

            if (value !== input.element.value) {

              input.element.value = value;

            }

            const modified = this.parent.request("modified", {}, key);

            input.element.parentNode.classList.toggle("modified", modified);

            input.element.placeholder = this.getPlaceholder();

          }

          input.element.onkeyup = async event => {
            if (event.key === "Enter") {
              this.parent.request("submit");
            }
          }

          input.element.oninput = async event => {

            // if (this.resource.throttle) {

            // 	this.throttle(async () => {
            //     const value = input.element.value.normalize();
            // 		this.set(value);
            // 	}, this.resource.throttle);

            // } else {

            // 	input.element.classList.add("editing");
            // 	await this.set(input.element.value.normalize());
            // 	input.element.classList.remove("editing");

            // }

            this.throttle(async () => {
              const value = input.element.value.normalize();
              this.set(value);
            }, this.resource.throttle);

          }

          input.element.oncopy = event => {
            if (values.length > 1) {
              event.preventDefault();
              const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
              const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              event.clipboardData.setData("text/plain", string.normalize());
            }
          };

          input.element.onpaste = async event => {
            if (values.length > 1) {
              event.preventDefault();
              const string = event.clipboardData.getData("text").normalize()
              const dataArray = KarmaFieldsAlpha.Clipboard.parse(string);
              const jsonData = dataArray.map(value => KarmaFieldsAlpha.Type.toString(value));

              KarmaFieldsAlpha.History.save();

              this.parent.request("set", jsonData, key);
              this.parent.request("render");
            }
          };

          input.element.oncut = async event => {
            if (values.length > 1) {
              event.preventDefault();
              const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
              const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              event.clipboardData.setData("text/plain", string.normalize());

              KarmaFieldsAlpha.History.save();

              this.parent.request("set", "", key);
              this.parent.request("render");
            }
          };

        }

				if (this.resource.disabled) {
					input.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
				}

				if (this.resource.enabled) {
					input.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));
				}

			}
		};
	}

	buildDataListInput() {

		return {
			classs: "karma-datalist-input",
			children: [
				this.buildInput(),
				{
					tag: "datalist",
					init: datalist => {
						datalist.element.id = "list-"+this.getId();
					},
					// update: datalist => {
					// 	this.parse(this.resource.options).then(options => {
					// 		datalist.children = [];
					// 		options.forEach(option => {
					// 			datalist.children
					// 			datalist.element.add(new Option(option.name, option.id));
					// 		});
					// 	});
					// }
					update: async datalist => {
						const options = this.parse(this.resource.options);
						if (options !== KarmaFieldsAlpha.loading) {
              datalist.children = options.map(option => {
                return {
                  tag: "option",
                  init: node => {
                    node.element.value = option.name;
                  }
                };
              });
            }
					}
				}
			]
		};

	}


	build() {

		if (this.resource.options) {

			return this.buildDataListInput();

		} else {

			return this.buildInput();

		}

	}




}
