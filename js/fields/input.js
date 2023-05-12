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

	getDefault(defaults = {}) {

		const key = this.getKey();

		if (key && this.resource.default !== null) {

			defaults[key] = this.parse(this.resource.default || "");

		}

		return defaults;
	}

  getValue() {

    const key = this.getKey();

    return this.parent.getValue(key);

  }

  setValue(value) {

    const key = this.getKey();

    this.parent.setValue(value, key);

  }

  // getDelta() {

  //   const delta = this.parent.getDelta();

  //   return delta && delta[this.getKey()];

  // }

  // isModified() {

  //   const [value] = this.getValue();
  // }

	export(items = []) {

		const grid = new KarmaFieldsAlpha.Grid();
		const values = this.getValue() || ["..."];

		grid.addColumn(values);

    // const value = KarmaFieldsAlpha.Type.toString(values);
		const value = grid.toString();

    items.push(value);

    return items;
	}

  import(items) {

    let value = items.shift() || "";

		const grid = new KarmaFieldsAlpha.Grid(value); // warning -> text with line breaks will split in multiple values !

		value = grid.getColumn(0);

		if (value.length === 1) {

			value = value[0];

		}

    this.setValue(value);

  }

	// importValue(value) {
	// 	const key = this.getKey();
	// 	this.parent.request("set", value, key);
	// }

	// export(object = {}) {

	// 	const key = this.getKey();

  //   const values = this.parent.getValue(key);

  //   if (values) {

  //     object[key] = KarmaFieldsAlpha.Type.toString(values);

  //   }

	// 	return object;
	// }

	// import(object) {

	// 	const key = this.getKey();

	// 	if (object[key] !== undefined) {

	// 		this.parent.setValue(object[key], key);

	// 	}

	// }

	// set(value) {

	// 	if (!this.isBusy()) {
	// 		KarmaFieldsAlpha.History.save();
	// 	}

	// 	const key = this.getKey();

  //   if (this.resource.autosave) {

  //     this.parent.request("autosave", value, key);

  //   } else {

  //     this.parent.setValue(value, key);

  //   }

	// 	this.parent.request("render");

	// }

	// isBusy(duration = 3000) {
	// 	if (!this.busy) {
	// 		setTimeout(() => {
	// 			this.busy = false;
	// 		}, duration);
	// 		this.busy = true;
	// 		return false;
	// 	}
	// 	return true;
	// }

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

	// throttle(callback, interval = 200) {
	// 	if (this.throttleTimer) {
	// 		clearTimeout(this.throttleTimer);
	// 	}
	// 	this.throttleTimer = setTimeout(callback, interval);
	// }



  // throttle(duration) {
  //   const data = this.getData() || {};
  //   const now = Date.now()

  //   if (!data.throttle || data.throttle < now - duration) {

  //     data.throttle = now;

  //     this.setData(data);

  //     return true;

  //   }

  //   return false;

  // }

  // unthrottle() {
  //   const data = this.getData() || {};

  //   if (data.throttle) {

  //     delete data.throttle;

  //     this.setData(data);

  //   }

  // }

  // hasDebounce() {

  //   const data = this.getData() || {};

  //   return Boolean(data.debounce);
  // }

  // debounce(callback, interval = 500) {

  //   const data = this.getData() || {};

  //   if (data.debounce) {

  //     clearTimeout(data.debounce);

  //   }

  //   if (callback) {

  //     data.debounce = setTimeout(() => {
  //       data.debounce = null;
  //       this.setData(data);
  //       callback();
  //     }, interval);

  //   }

  //   this.setData(data);

  // }



  isLocked() {

    const data = this.getData();

    return Boolean(data && data.lock);

  }

  lock() {

    const data = this.getData();

    this.setData({...data, lock: true});

  }

  unlock() {

    const data = this.getData();

    this.setData({...data, lock: false});

  }

	getPlaceholder() {
		return this.parse(this.resource.placeholder || "");
	}


	getDiff(string1, string2) {

		if (string2.includes(string1) || string1.includes(string2)) {

			return Math.abs(string1.length - string2.length);

		}

		return string1.length;

	}

	build() {
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
				// if (this.resource.options) {
				// 	input.element.setAttribute("list", "list-"+this.getId());
				// }



        // input.element.onmousedown = event => {
        //   //event.stopPropagation(); // -> prevent selectors to steal focus

        //   console.log("onmousedown");
        // }
        // input.element.onmouseup = event => {
        //   console.log("onmouseup");
        // }
        // input.element.onblur = event => {
        //   console.log("onfocus");
        // }


			},
			update: async input => {



				// const key = this.getKey();

				// const state = await this.parent.request("state", {}, key);



        const values = this.getValue();

        input.element.classList.toggle("loading", !values);

        if (values) {

          let value = values[0] || "";

          if (values.length > 1 && (new Set(values)).size > 1) {

            input.element.value = "[multiple values]";
            input.element.classList.add("multi");
            input.element.readOnly = true;

          } else {

            input.element.classList.remove("multi");
            input.element.readOnly = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.readonly));

            const modified = this.modified();

            input.element.parentNode.classList.toggle("modified", Boolean(modified));




            if (value !== input.element.value && !this.isLocked()) {



              input.element.value = value;

            }

          }

          // const value = values[0] || "";

          // if (!this.isLocked()) { // -> prevent changing value while editing (e.g search field)

          //   if (value !== input.element.value) {

          //     input.element.value = value;

          //   }

          //   const modified = this.modified();

          //   input.element.parentNode.classList.toggle("modified", Boolean(modified));

          //   const multi = values.length > 1 && (new Set(values)).size > 1;

          //   input.element.classList.toggle("multi", multi);
          //   input.element.readOnly = ;
          //   input.element.placeholder = multi && "[multiple values]" || this.getPlaceholder() || "";

          // }

          input.element.onkeyup = async event => {

            if (event.key === "Enter") {

              this.parent.request("submit");

            }

          }

          input.element.oninput = async event => {

            // this.throttle(async () => {
            //   const value = input.element.value.normalize();
            //   this.set(value);
            // }, this.resource.throttle);

            this.debounce("typing", () => {

              // if (this.throttle(this.resource.throttle || 5000)) {

              //   KarmaFieldsAlpha.History.save();

              // }

              const newValue = input.element.value.normalize();

              if (newValue !== value) {

								// const diff = this.getDiff(newValue, value);
								//
								// console.log(diff);

                value = newValue;

                this.setValue(value);

                // this.debounce("saving", () => {



                //   KarmaFieldsAlpha.History.save();

                // }, 1000);

                this.request("save");

                this.render();

              }



            //   this.unlock();
            //
					}, this.resource.debounce || 750);
            //
            // this.lock();

          }

          // input.element.onblur = event => {

          //   console.log("blur", input.element.value === values[0]);

          // };

					input.element.onmousedown = event => {

						// console.log("input mousedown");

						// event.stopPropagation();
						// event.preventDefault();
						// this.parent.request("mousedown", event);
						// this.setSelection(new KarmaFieldsAlpha.Selection());

					}

					input.element.onfocusin = event => {

						console.log("input onfocusin");

						// debugger;

						this.setSelection(new KarmaFieldsAlpha.Selection());

						// console.log("input focusin");

						// event.preventDefault();
						// event.stopPropagation();


					}

					input.element.onfocusout = event => {

						// console.log("input focus");

						// debugger;

						this.setSelection();

						// this.parent.render();

					}

          input.element.oncopy = event => {

            const grid = new KarmaFieldsAlpha.Grid();
            grid.addColumn(...values);
            event.clipboardData.setData("text/plain", grid.toString().normalize());

            // if (values.length > 1) {
            //   event.preventDefault();
            //   const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
            //   const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
            //   event.clipboardData.setData("text/plain", string.normalize());
            // }
          };

          input.element.onpaste = async event => {
            const string = event.clipboardData.getData("text").normalize();
            const grid = new KarmaFieldsAlpha.Grid(string);
            const column = grid.getColumn(0);
            this.setValue(column);
            this.parent.render();

            // if (values.length > 1) {
            //   event.preventDefault();
            //   const string = event.clipboardData.getData("text").normalize();
            //   // KarmaFieldsAlpha.Format.convertTo(string, this.resource.exportFormat)
            //   const dataArray = KarmaFieldsAlpha.Clipboard.parse(string);
            //   const jsonData = dataArray.map(value => KarmaFieldsAlpha.Type.toString(value));

            //   KarmaFieldsAlpha.History.save();

            //   this.parent.setValue(jsonData, key);
            //   this.parent.request("render");
            // }
          };

          input.element.oncut = async event => {
            const grid = new KarmaFieldsAlpha.Grid();
            grid.addColumn(...values);
            event.clipboardData.setData("text/plain", grid.toString().normalize());
            this.setValue("");
            this.parent.render();
            // if (values.length > 1) {
            //   event.preventDefault();
            //   const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
            //   const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
            //   event.clipboardData.setData("text/plain", string.normalize());

            //   KarmaFieldsAlpha.History.save();

            //   this.parent.setValue("", key);
            //   this.parent.request("render");
            // }
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

	// buildDataListInput() {

	// 	return {
	// 		classs: "karma-datalist-input",
	// 		children: [
	// 			this.buildInput(),
	// 			{
	// 				tag: "datalist",
	// 				init: datalist => {
	// 					datalist.element.id = "list-"+this.getId();
	// 				},
	// 				// update: datalist => {
	// 				// 	this.parse(this.resource.options).then(options => {
	// 				// 		datalist.children = [];
	// 				// 		options.forEach(option => {
	// 				// 			datalist.children
	// 				// 			datalist.element.add(new Option(option.name, option.id));
	// 				// 		});
	// 				// 	});
	// 				// }
	// 				update: async datalist => {
	// 					const options = this.parse(this.resource.options);
	// 					if (options !== KarmaFieldsAlpha.loading) {
  //             datalist.children = options.map(option => {
  //               return {
  //                 tag: "option",
  //                 init: node => {
  //                   node.element.value = option.name;
  //                 }
  //               };
  //             });
  //           }
	// 				}
	// 			}
	// 		]
	// 	};

	// }


	// build() {

	// 	if (this.resource.options) {

	// 		return this.buildDataListInput();

	// 	} else {

	// 		return this.buildInput();

	// 	}

	// }




}
