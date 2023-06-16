KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

	getDefaultValue() {

		if (this.resource.default !== null) {

			return this.parse(this.resource.default || "");

		}

	}

	// getDefault(defaults = {}) {
	//
	// 	const key = this.getKey();
	//
	// 	if (key && this.resource.default !== null) {
	//
	// 		defaults[key] = this.parse(this.resource.default || "");
	//
	// 	}
	//
	// 	return defaults;
	// }

  getValue() {

    // const key = this.getKey();

    let array = super.getValue();

		if (array) {

			if (array.length === 0) {

				let value = this.getDefaultValue();

				if (value !== undefined) {

					this.setValue(value);

					// this.save();

					return value;

				}

				return "";

			}
			// else if (array.length > 1) {
			//
			// 	return KarmaFieldsAlpha.field.input.multiple;
			//
			// }

			return array[0] || "";

		}

		return KarmaFieldsAlpha.field.input.loading;

  }

  // setValue(value) {
	//
	// 	new KarmaFieldsAlpha.Type.String(value)
	//
  //   const currentValue = this.getValue();
	//
	//
	// 	super.setValue(newValue);
	//
	//
	// 	if (newValue.length < value.length) {
	//
	// 		KarmaFieldsAlpha.History.save("delete");
	//
	// 	} else {
	//
	// 		KarmaFieldsAlpha.History.save("input");
	//
	// 	}
	//
  // }

	export(items = []) {

		// const value = this.getValue();
		//
		// if (value === KarmaFieldsAlpha.field.input.multiple) { // -> do we really need that ?
		//
		// 	const grid = new KarmaFieldsAlpha.Grid();
		// 	const key = this.getKey();
		// 	const array = this.parent.getValue(key);
		//
		// 	grid.addColumn(array);
		//
		// 	const csv = grid.toString();
		//
		// 	items.push(csv);
		//
		// } else if (value !== KarmaFieldsAlpha.field.input.loading) {
		//
		// 	items.push(value);
		//
		// }

		const value = this.getValue();

		if (value !== KarmaFieldsAlpha.field.input.loading) {

			items.push(value);

		}


    return items;
	}

  import(items) {

		// const value = items.shift() || "";
		// const currentValue = this.getValue();
		//
		// if (currentValue === KarmaFieldsAlpha.field.input.multiple) {
		//
		// 	const grid = new KarmaFieldsAlpha.Grid(value); // warning -> text with line breaks will split in multiple values !
		//
		// 	const array = grid.getColumn(0);
		//
		// 	this.setValue(array);
		//
		// } else if (currentValue !== KarmaFieldsAlpha.field.input.loading) {
		//
		// 	this.setValue(value);
		//
		// }


		const value = items.shift() || "";
		this.setValue(value);

  }

	getPlaceholder() {

		return this.parse(this.resource.placeholder || "");

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
			},
			update: async input => {

				const data = this.getData();

        let value = this.getValue();

        input.element.classList.toggle("loading", value === KarmaFieldsAlpha.field.input.loading);

        if (value !== KarmaFieldsAlpha.field.input.loading) {

					const multiple = this.request("multiple");

					input.element.placeholder = this.getPlaceholder();
					input.element.classList.toggle("multi", Boolean(multiple));

					input.element.classList.toggle("selected", Boolean(multiple && (this.getSelection() || {}).final));


          if (multiple) {

            input.element.value = "[multiple values]";
            input.element.readOnly = true;

          } else {

            input.element.readOnly = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.readonly));

            const modified = this.modified();

            input.element.parentNode.classList.toggle("modified", Boolean(modified));

            if (value !== input.element.value) { // -> replacing same value will eject focus !

              input.element.value = value;

            }

          }

          input.element.onkeyup = async event => {

            if (event.key === "Enter" && value !== KarmaFieldsAlpha.field.input.multiple) {

              this.parent.request("submit");

            }

          }

          input.element.oninput = event => {

						const newValue = input.element.value.normalize();

						this.setValue(newValue);

						this.save(`${this.resource.uid}-${newValue.length < value.length ? "delete" : "input"}`);

						value = newValue;

          }

					input.element.onblur = event => {


						// if (data.diff) {
						//
						// 	KarmaFieldsAlpha.History.save();
						//
						// };
						//
						// data.diff = undefined;

						// KarmaFieldsAlpha.History.save();
					}

					input.element.onfocus = event => {

						if (multiple) {

							this.setSelection({final: true});
							KarmaFieldsAlpha.Clipboard.focus();
							this.render();

						}

					}

					input.element.onfocusin = event => { // /!\ -> focusin trigger before focus NOT ON READONLY

						this.setSelection({final: true}); // -> prevent field from losing focus on render

					}

          // input.element.oncopy = event => {
					// 	if (value === KarmaFieldsAlpha.field.input.multiple) {
					// 		event.preventDefault();
					// 		const values = super.getValue();
					// 		const grid = new KarmaFieldsAlpha.Grid();
	        //     grid.addColumn(...values);
	        //     event.clipboardData.setData("text/plain", grid.toString().normalize());
					// 	}
          // };
					//
          // input.element.onpaste = async event => {
					// 	if (value === KarmaFieldsAlpha.field.input.multiple) {
					// 		event.preventDefault();
	        //     const string = event.clipboardData.getData("text").normalize();
	        //     const grid = new KarmaFieldsAlpha.Grid(string);
	        //     const column = grid.getColumn(0);
					// 		this.setValue(column);
					// 	}
          // };
					//
          // input.element.oncut = async event => {
					// 	if (value === KarmaFieldsAlpha.field.input.multiple) {
					// 		event.preventDefault();
					// 		const values = super.getValue();
	        //     const grid = new KarmaFieldsAlpha.Grid();
	        //     grid.addColumn(...values);
	        //     event.clipboardData.setData("text/plain", grid.toString().normalize());
	        //     this.setValue("");
					// 	}
          // };

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

}

KarmaFieldsAlpha.field.input.loading = Symbol("loading");
KarmaFieldsAlpha.field.input.multiple = Symbol("multiple");
