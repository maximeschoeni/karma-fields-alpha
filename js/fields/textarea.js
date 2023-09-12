KarmaFieldsAlpha.field.textarea = class extends KarmaFieldsAlpha.field.input {


	// write(value, lastValue = "") {
	//
	// 	this.setValue(value);
	//
	// 	if (value.length < lastValue.length) {
	//
	// 		this.save(`${this.resource.uid}-delete`);
	//
	// 	} else {
	//
	// 		this.save(`${this.resource.uid}-input`);
	//
	// 	}
	//
	// }
	//
	// inputText(value, inputType) {
	//
	// 	value = value.normalize();
	//
	// 	const current = this.lastValue || "";
	//
	// 	if (inputType === "insertText") {
	//
	// 		this.debounce(() => {
	//
	// 			this.write(value)
	//
	// 		}, 300);
	//
	// 	} else {
	//
	// 		this.write(value)
	//
	// 	}
	//
	//
	//
	//
	// }


	build() {
		return {
			tag: "textarea",
			class: "textarea karma-field",
			init: input => {
				input.element.id = this.getUid();
				if (this.resource.height) {
					input.element.style.height = this.resource.height;
				}
				if (this.resource.textarea || this.resource.input) {
					Object.assign(input.element, this.resource.textarea || this.resource.input);
				}
			},
			update: input => {

        let value = this.getSingleValue();

        input.element.classList.toggle("loading", value === KarmaFieldsAlpha.loading);

        if (value !== KarmaFieldsAlpha.loading) {

					if (value === undefined) {

						this.initValue();
						value = "";

					}

					input.element.placeholder = this.getPlaceholder();

					input.element.classList.toggle("mixed", value === KarmaFieldsAlpha.mixed);
					input.element.classList.toggle("selected", Boolean(value === KarmaFieldsAlpha.mixed && (this.getSelection() || {}).final));

          if (value === KarmaFieldsAlpha.mixed) {

            input.element.value = "[mixed values]";
            input.element.readOnly = true;

          } else {

            input.element.readOnly = Boolean(this.resource.readonly && this.parse(this.resource.readonly));

            const modified = this.modified();

            input.element.parentNode.classList.toggle("modified", Boolean(modified));

            if (value !== input.element.value) { // -> replacing same value will reset caret index !

              input.element.value = value;

							input.element.style.height = "1px";
						  input.element.style.height = (25+input.element.scrollHeight)+"px";

            }

          }

					// input.element.onpaste = event => {
					// 	event.preventDefault();
					//
					// 	console.log("onpaste", event);
					// }

          input.element.oninput = event => {

						const newValue = input.element.value.normalize();

						this.setValue(newValue);

						// this.save(`${this.resource.uid}-${newValue.length < value.length ? "delete" : "input"}`);
						this.saveChange(newValue, value);

						value = newValue;

						if (event.inputType === "insertText") {

							this.debounce(() => void this.render(), 300);

						} else {

							this.render()

						}

						input.element.style.height = "1px";
					  input.element.style.height = (25+input.element.scrollHeight)+"px";

          }


					input.element.onblur = event => {

					}

					input.element.onfocus = event => {

						this.setSelection({final: true});

						if (value === KarmaFieldsAlpha.mixed) {

							this.deferFocus();

							// KarmaFieldsAlpha.Clipboard.focus();

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

	// build() {
	// 	return {
	// 		tag: "textarea",
	// 		class: "textarea karma-field",
	// 		init: input => {
	// 			if (this.resource.label) {
	// 				input.element.id = this.getId();
	// 			}
	// 			if (this.resource.input) {
	// 				Object.assign(input.element, this.resource.input, this.resource.textarea);
	// 			}
  //       if (this.resource.readonly) {
	// 				input.element.readOnly = true;
	// 			}
	// 			if (this.resource.height) {
	// 				input.element.style.height = this.resource.height;
	// 			}
	// 		},
	// 		update: input => {
	//
	// 			let value = this.getValue();
	//
  //       input.element.classList.toggle("loading", value === KarmaFieldsAlpha.field.input.loading);
	//
  //       if (value !== KarmaFieldsAlpha.field.input.loading) {
	//
	// 				const multiple = this.request("multiple");
	//
	// 				input.element.placeholder = this.getPlaceholder();
	// 				input.element.classList.toggle("multi", Boolean(multiple));
	//
	// 				input.element.classList.toggle("selected", Boolean(multiple && (this.getSelection() || {}).final));
	//
	//
  //         if (multiple) {
	//
  //           input.element.value = "[multiple values]";
  //           input.element.readOnly = true;
	//
  //         } else {
	//
  //           input.element.readOnly = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.readonly));
	//
  //           const modified = this.modified();
	//
  //           input.element.parentNode.classList.toggle("modified", Boolean(modified));
	//
  //           if (value !== input.element.value) { // -> replacing same value will eject focus !
	//
  //             input.element.value = value;
	//
  //           }
	//
  //         }
	//
  //         input.element.oninput = event => {
	//
	// 					value = input.element.value.normalize();
	//
	// 					this.debounce("typing", () => this.setValue(value), 750);
	//
  //         }
	//
	// 				// input.element.onfocusin = event => { // /!\ -> focusin trigger before focus
	// 				//
	// 				// 	this.setSelection({final: true}); // -> prevent field from losing focus on render
	// 				//
	// 				// }
	//
	//
	// 				// --> why?
	// 				input.element.onfocusin = event => { // /!\ -> focusin trigger before focus
	//
	// 					this.setSelection({final: true}); // -> prevent field from losing focus on render
	//
	// 				}
	//
	// 				input.element.onfocus = event => {
	//
	// 					this.setSelection({final: true});
	//
	// 					if (multiple) {
	//
	// 						KarmaFieldsAlpha.Clipboard.focus();
	//
	// 					}
	//
	// 					this.render();
	//
	// 				}
	//
	// 				input.element.onmousedown = event => {
	// 					event.stopPropagation();
	// 				}
	//
	//
  //         input.element.oncopy = event => {
	// 					if (value === KarmaFieldsAlpha.field.input.multiple) {
	// 						event.preventDefault();
	// 						const key = this.getKey();
	// 						const values = this.parent.getValue(key);
	// 						const grid = new KarmaFieldsAlpha.Grid();
	//             grid.addColumn(...values);
	//             event.clipboardData.setData("text/plain", grid.toString().normalize());
	// 					}
  //         };
	//
  //         input.element.onpaste = async event => {
	// 					if (value === KarmaFieldsAlpha.field.input.multiple) {
	// 						event.preventDefault();
	//             const string = event.clipboardData.getData("text").normalize();
	//             const grid = new KarmaFieldsAlpha.Grid(string);
	//             const column = grid.getColumn(0);
	// 						this.setValue(column);
	// 					}
  //         };
	//
  //         input.element.oncut = async event => {
	// 					if (value === KarmaFieldsAlpha.field.input.multiple) {
	// 						event.preventDefault();
	// 						const key = this.getKey();
	// 						const values = this.parent.getValue(key);
	//             const grid = new KarmaFieldsAlpha.Grid();
	//             grid.addColumn(...values);
	//             event.clipboardData.setData("text/plain", grid.toString().normalize());
	//             this.setValue("");
	// 					}
  //         };
	//
  //       }
	//
	// 			if (this.resource.disabled) {
	// 				input.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
	// 			}
	//
	// 			if (this.resource.enabled) {
	// 				input.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));
	// 			}
	//
	// 		}
	// 	};
	// }

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



// KarmaFieldsAlpha.field.textarea = class extends KarmaFieldsAlpha.field.input {

// 	build() {
// 		return {
// 			tag: "textarea",
// 			class: "karma-field",
// 			init: input => {
// 				if (this.resource.label) {
// 					input.element.id = this.getId();
// 				}
// 				if (this.resource.readonly) {
// 					input.element.readOnly = true;
// 				}
// 				if (this.resource.input) {
// 					Object.assign(input.element, this.resource.input);
// 				}
// 				if (this.resource.height) {
// 					input.element.style.height = this.resource.height;
// 				}
// 			},
// 			update: input => {


// 				const key = this.getKey();

// 				const values = this.parent.getValue(key);

//         input.element.classList.toggle("loading", !values);

//         if (values) {

//           input.element.classList.toggle("multi", values.length > 1);
//           input.element.readOnly = Boolean(this.resource.readonly || values.length > 1);

//           const [value = ""] = values;

//           input.element.oninput = async event => {
//             this.throttle(async () => {
//               this.set(input.element.value.normalize());
//             });
//           };

//           if (document.activeElement !== input.element) { // -> prevent changing value while editing (e.g search field)
//             // const value = KarmaFieldsAlpha.Type.toString(state.value);
//             if (value !== input.element.value) {
//               input.element.value = value;
//             }
//             const modified = this.modified();
//             input.element.parentNode.classList.toggle("modified", Boolean(modified));
//             input.element.placeholder = this.getPlaceholder();
//           }

//           input.element.oncopy = event => {
//             if (values.length > 1) {
//               event.preventDefault();
//               const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
//               const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
//               event.clipboardData.setData("text/plain", string.normalize());
//             }
//           };

//           input.element.onpaste = async event => {
//             if (values.length > 1) {
//               event.preventDefault();
//               const string = event.clipboardData.getData("text").normalize()
//               const dataArray = KarmaFieldsAlpha.Clipboard.parse(string);
//               const jsonData = dataArray.map(value => KarmaFieldsAlpha.Type.toString(value));

//               KarmaFieldsAlpha.History.save();

//               this.parent.setValue(jsonData, key);
//               this.parent.request("render");
//             }
//           };

//           input.element.oncut = async event => {
//             if (values.length > 1) {
//               event.preventDefault();
//               const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
//               const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
//               event.clipboardData.setData("text/plain", string.normalize());

//               KarmaFieldsAlpha.History.save();

//               this.parent.setValue( "", key);
//               this.parent.request("render");
//             }
//           };

//         }

// 			}
// 		};
// 	}

// }
