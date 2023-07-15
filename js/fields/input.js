KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

	getDefault() {

		if (this.resource.default !== null) {

			if (this.resource.default) {

				return this.parse(this.resource.default);

			}

			return "";

		}

	}

	/**
	 * Get single value.
	 *
	 * @return string | Symbol("loading") | Symbol("mixed")
	 */
	getSingleValue() {

		let [value] = this.getValue() || [KarmaFieldsAlpha.loading];

		if (value === undefined) {

			// value = this.getDefault();
			//
			// if (value !== undefined) {
			//
			// 	this.setValue(value);
			// 	this.save();
			//
			// } else {
			//
			// 	value = "";
			//
			// }

			value = this.initValue();

		}

		return value;

		// return
		// -> symbol(loading) = not loaded
		// -> symbol(mixed) = mixed
		// -> string

	}

	initValue() {

		let value = this.getDefault();

		if (value !== undefined) {

			this.setValue(value);
			this.save();

		} else {

			value = "";

		}

		return value;
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

  // getValue() {
	//
  //   // const key = this.getKey();
	//
  //   let array = super.getValue();
	//
	// 	if (array) {
	//
	// 		if (array.length === 0) {
	//
	// 			let value = this.getDefaultValue();
	//
	// 			if (value !== undefined) { // -> not loaded or default null
	//
	// 				this.setValue(value);
	//
	// 				// this.save();
	//
	// 				return value;
	//
	// 			}
	//
	// 			return "";
	//
	// 		}
	// 		// else if (array.length > 1) {
	// 		//
	// 		// 	return KarmaFieldsAlpha.field.input.multiple;
	// 		//
	// 		// }
	//
	// 		return array[0] || "";
	//
	// 	}
	//
	// 	return KarmaFieldsAlpha.field.input.loading;
	//
  // }

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
		// if (value !== KarmaFieldsAlpha.field.input.loading) {
		//
		// 	items.push(value);
		//
		// }
		//
    // return items;

		// const [value] = this.getValue() || [KarmaFieldsAlpha.loading];
		//
		// if (value === KarmaFieldsAlpha.mixed) {
		//
		// 	const values = this.getMixedValues();
		//
		// 	const grid = new KarmaFieldsAlpha.Grid();
		//
		// 	grid.addRow(values.map(value => [value]));
		//
		// 	items.push(grid.toString());
		//
		// } else if (value !== KarmaFieldsAlpha.loading) {
		//
		// 	items.push(value);
		//
		// }
		//
    // return items;


    const [value] = this.getValue() || [KarmaFieldsAlpha.loading];

    items.push(value.toString());

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

	/**
	 * Remove value (-> mixed)
	 */
	remove() {

		this.setValue("");
		this.save("delete");

	}

// 	build() {
// 		return {
// 			tag: "input",
// 			class: "text-input karma-field",
// 			init: input => {
// 				input.element.type = "text";
// 				if (this.resource.label) {
// 					input.element.id = this.getId();
// 				}
// 				if (this.resource.input) {
// 					Object.assign(input.element, this.resource.input);
// 				}
// 			},
// 			update: async input => {
//
// 				const data = this.getData();
//
//         let value = this.getValue();
//
//         input.element.classList.toggle("loading", value === KarmaFieldsAlpha.field.input.loading);
//
//         if (value !== KarmaFieldsAlpha.field.input.loading) {
//
// 					const multiple = this.request("multiple");
//
// 					input.element.placeholder = this.getPlaceholder();
// 					input.element.classList.toggle("multi", Boolean(multiple));
//
// 					input.element.classList.toggle("selected", Boolean(multiple && (this.getSelection() || {}).final));
//
//
//           if (multiple) {
//
//             input.element.value = "[multiple values]";
//             input.element.readOnly = true;
//
//           } else {
//
//             input.element.readOnly = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.readonly));
//
//             const modified = this.modified();
//
//             input.element.parentNode.classList.toggle("modified", Boolean(modified));
//
//             if (value !== input.element.value) { // -> replacing same value will eject focus !
//
//               input.element.value = value;
//
//             }
//
//           }
//
//           input.element.onkeyup = async event => {
//
//             if (event.key === "Enter" && value !== KarmaFieldsAlpha.field.input.multiple) {
//
//               this.parent.request("submit");
//
//             }
//
//           }
//
//           input.element.oninput = event => {
//
// 						const newValue = input.element.value.normalize();
//
// 						this.setValue(newValue);
//
// 						this.save(`${this.resource.uid}-${newValue.length < value.length ? "delete" : "input"}`);
//
// 						value = newValue;
//
//           }
//
// 					input.element.onblur = event => {
//
//
// 						// if (data.diff) {
// 						//
// 						// 	KarmaFieldsAlpha.History.save();
// 						//
// 						// };
// 						//
// 						// data.diff = undefined;
//
// 						// KarmaFieldsAlpha.History.save();
// 					}
//
// 					input.element.onfocus = event => {
// // console.log("input focus");
// 						if (multiple) {
//
// 							this.setSelection({final: true});
// 							KarmaFieldsAlpha.Clipboard.focus();
// 							this.render();
//
// 						} else {
// // debugger;
// 							this.setSelection({final: true});
// 							this.render();
//
// 						}
//
// 					}
//
// // 					input.element.onfocusin = event => { // /!\ -> focusin trigger before focus NOT ON READONLY
// // debugger;
// // 						this.setSelection({final: true}); // -> prevent field from losing focus on render
// //
// // 					}
//
// 					input.element.onmousedown = event => {
// 						event.stopPropagation();
// 					}
//
//           // input.element.oncopy = event => {
// 					// 	if (value === KarmaFieldsAlpha.field.input.multiple) {
// 					// 		event.preventDefault();
// 					// 		const values = super.getValue();
// 					// 		const grid = new KarmaFieldsAlpha.Grid();
// 	        //     grid.addColumn(...values);
// 	        //     event.clipboardData.setData("text/plain", grid.toString().normalize());
// 					// 	}
//           // };
// 					//
//           // input.element.onpaste = async event => {
// 					// 	if (value === KarmaFieldsAlpha.field.input.multiple) {
// 					// 		event.preventDefault();
// 	        //     const string = event.clipboardData.getData("text").normalize();
// 	        //     const grid = new KarmaFieldsAlpha.Grid(string);
// 	        //     const column = grid.getColumn(0);
// 					// 		this.setValue(column);
// 					// 	}
//           // };
// 					//
//           // input.element.oncut = async event => {
// 					// 	if (value === KarmaFieldsAlpha.field.input.multiple) {
// 					// 		event.preventDefault();
// 					// 		const values = super.getValue();
// 	        //     const grid = new KarmaFieldsAlpha.Grid();
// 	        //     grid.addColumn(...values);
// 	        //     event.clipboardData.setData("text/plain", grid.toString().normalize());
// 	        //     this.setValue("");
// 					// 	}
//           // };
//
//         }
//
// 				if (this.resource.disabled) {
// 					input.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
// 				}
//
// 				if (this.resource.enabled) {
// 					input.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));
// 				}
//
// 			}
// 		};
// 	}

	build() {
		return {
			tag: this.resource.type,
			class: "text-input karma-field",
			init: input => {
				if (this.resource.type === "input") {
					input.element.type = "text";
				}
				input.element.id = this.getId();
				if (this.resource[this.resource.type]) {
					Object.assign(input.element, this.resource[this.resource.type]);
				}
			},
			update: input => {

        let value = this.getSingleValue();


        input.element.classList.toggle("loading", value === KarmaFieldsAlpha.loading);

        if (value !== KarmaFieldsAlpha.loading) {

					const multiple = value === KarmaFieldsAlpha.mixed;

					input.element.placeholder = this.getPlaceholder();

					input.element.classList.toggle("mixed", value === KarmaFieldsAlpha.mixed);
					input.element.classList.toggle("selected", Boolean(value === KarmaFieldsAlpha.mixed && (this.getSelection() || {}).final));


          if (multiple) {

            input.element.value = "[mixed values]";
            input.element.readOnly = true;

          } else {

            input.element.readOnly = Boolean(this.resource.readonly && this.parse(this.resource.readonly));

            const modified = this.modified();

            input.element.parentNode.classList.toggle("modified", Boolean(modified));

						// if (value === undefined) {
						//
						// 	value = this.getDefault();
						//
						// 	if (value !== undefined) {
						//
						// 		this.setValue(value);
						//
						// 	} else {
						//
						// 		value = "";
						//
						// 	}
						//
						// }

            if (value !== input.element.value) { // -> replacing same value will reset caret index !

              input.element.value = value;

            }

          }

					if (this.resource.type === "input") {

						input.element.onkeyup = async event => {

	            if (event.key === "Enter" && value !== KarmaFieldsAlpha.mixed) {

	              this.parent.request("submit");

	            }

	          }

					}

          input.element.oninput = event => {

						const newValue = input.element.value.normalize();

						this.setValue(newValue);

						this.save(`${this.resource.uid}-${newValue.length < value.length ? "delete" : "input"}`);

						value = newValue;

          }

					input.element.onblur = event => {

					}

					input.element.onfocus = event => {

						this.setSelection({final: true});

						if (value === KarmaFieldsAlpha.mixed) {

							KarmaFieldsAlpha.Clipboard.focus();

						}

						this.render();

					}

					input.element.onmousedown = event => {
						event.stopPropagation();
					}

        } else {

					input.element.value = "";

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

}

// KarmaFieldsAlpha.field.input.loading = Symbol("loading");
// KarmaFieldsAlpha.field.input.multiple = Symbol("multiple");
