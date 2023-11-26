KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

	getDefault() {

		if (this.resource.default === null) {

			return null;

		} else if (this.resource.default) {

			return this.parse(this.resource.default);

		}

		return new KarmaFieldsAlpha.Content("");

	}

	// isDisabled() {
	//
	// 	if (this.resource.disabled) {
	//
	// 		return KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
	//
	// 	}
	//
	// 	if (this.resource.enabled) {
	//
	// 		return !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));
	//
	// 	}
	//
	// 	return false;
	// }

	isDisabled() {

    if (this.resource.disabled) {

      return this.parent.parse(this.resource.disabled).toBoolean();

    } else if (this.resource.enabled) {

      return !this.parent.parse(this.resource.enabled).toBoolean();

    }

    return false;
  }

	/** MOVED IN FIELD
	 * Get single value.
	 *
	 * @return string | Symbol("loading") | Symbol("mixed")
	 */
	// getSingleValue() {
	//
	// 	// let [value] = this.getValue() || [KarmaFieldsAlpha.loading];
	// 	//
	// 	// if (value === undefined) {
	// 	//
	// 	// 	value = this.initValue();
	// 	//
	// 	// }
	// 	//
	// 	// return value;
	//
	//
	// 	let values = this.getValue();
	//
	// 	if (!values || values === KarmaFieldsAlpha.loading) {
	//
	// 		return KarmaFieldsAlpha.loading;
	//
	// 	}
	//
	// 	if (values === KarmaFieldsAlpha.mixed) {
	//
	// 		return KarmaFieldsAlpha.mixed;
	//
	// 	}
	//
	// 	let value = values[0];
	//
	// 	if (value === undefined) {
	//
	// 		value = this.initValue();
	//
	// 	}
	//
	// 	return value;
	//
	// 	// return
	// 	// -> symbol(loading) = not loaded
	// 	// -> symbol(mixed) = mixed
	// 	// -> string
	//
	// }

	initValue() {

		let value = this.getDefault();

		if (value !== undefined && value !== KarmaFieldsAlpha.loading) {

			this.setValue(value);
			this.save();

		}

  }



	debounce(callback, duration = 500) {

		if (this.debounceTimer) {

			clearTimeout(this.debounceTimer);

		}

		this.debounceTimer = setTimeout(() => void callback(), duration);
	}

	// saveChange(newValue, currentValue) {
	//
	// 	const label = this.getLabel() || this.resource.type;
	//
	// 	if (newValue.length < currentValue.length) {
	//
	// 		this.save(`${this.resource.uid}-delete`, `Delete into ${label}`);
	//
	// 	} else {
	//
	// 		this.save(`${this.resource.uid}-input`, `Insert into ${label}`);
	//
	// 	}
	//
	// }


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

	copy() {

		let content = this.getContent();

		// if (content.loading) {
		//
		// 	return "[loading]";
		//
		// }

		if (content.mixed) {

			content = new KarmaFieldsAlpha.Content.Grid(content);

			// values = this.getMixedValues();
			//
			// const grid = new KarmaFieldsAlpha.Grid();
			//
			// grid.addColumn(values);
			//
			// return grid.toString();

		}

		// else {
		//
		// 	return KarmaFieldsAlpha.Type.toString(response.value);
		//
		// }

		return content.toString();



		// let values = this.getValue();
		//
		// if (!values || values === KarmaFieldsAlpha.loading) {
		//
		// 	return "[loading]";
		//
		// }
		//
		// if (values === KarmaFieldsAlpha.mixed || values[0] === KarmaFieldsAlpha.mixed) { // compat
		//
		// 	values = this.getMixedValues();
		//
		// }
		//
		// const grid = new KarmaFieldsAlpha.Grid();
		//
		// grid.addColumn(values);
		//
		// return grid.toString();
	}

	async paste(string) {

		// if (!string || typeof string !== "string") {
		//
		// 	console.error("paste value must be a string");
		//
		// }
		//
		// const grid = new KarmaFieldsAlpha.Grid(string);
		//
		// const [value] = grid.getRow(0);

		const content = new KarmaFieldsAlpha.Content(string);
		await KarmaFieldsAlpha.History.save("paste", "Paste");
		await this.setContent(content);
		await this.request("render");

	}

	async delete() {

		// if (!string || typeof string !== "string") {
		//
		// 	console.error("paste value must be a string");
		//
		// }
		//
		// const grid = new KarmaFieldsAlpha.Grid(string);
		//
		// const [value] = grid.getRow(0);

		const content = new KarmaFieldsAlpha.Content("");
		await KarmaFieldsAlpha.History.save("delete", "Delete");
		await this.setContent(content);
		await this.request("render");

	}

	getContent() {

		const key = this.getKey();

		return this.parent.getContent(key);

	}

	async setContent(content) {

		const key = this.getKey();

		await this.parent.setContent(content, key);

	}


	export() { // -> return array of string

    const content = this.getContent();

		content.value = content.toArray().slice(0, 1);

		return content;

  }

	async import(collection) {

    const string = collection.value.shift();

		const content = new KarmaFieldsAlpha.Content(string);

		await this.setContent(content);
  }



	// export(collection) {
	//
  //   const content = this.getContent();
	//
	// 	// if (content.loading) {
	// 	//
	// 	// 	return "[loading]";
	// 	//
	// 	// }
	// 	//
	// 	// const value = KarmaFieldsAlpha.Type.toString(response.value);
	//
  //   collection.add(content);
	//
	// }

  // import(collection) {
	//
	// 	// const value = items.shift() || "";
	// 	// const currentValue = this.getValue();
	// 	//
	// 	// if (currentValue === KarmaFieldsAlpha.field.input.multiple) {
	// 	//
	// 	// 	const grid = new KarmaFieldsAlpha.Grid(value); // warning -> text with line breaks will split in multiple values !
	// 	//
	// 	// 	const array = grid.getColumn(0);
	// 	//
	// 	// 	this.setValue(array);
	// 	//
	// 	// } else if (currentValue !== KarmaFieldsAlpha.field.input.loading) {
	// 	//
	// 	// 	this.setValue(value);
	// 	//
	// 	// }
	//
	//
	// 	const content = collection.pick();
	//
	// 	this.setContent(content);
	//
  // }

	getPlaceholder() {

		if (this.resource.placeholder) {

			return this.parse(this.resource.placeholder).toString();

			// const placeholder = this.parse(this.resource.placeholder);
			//
			// if (placeholder === KarmaFieldsAlpha.loading) {
			//
			// 	return "...";
			//
			// }
			//
			// if (placeholder === KarmaFieldsAlpha.mixed) {
			//
			// 	return "[mixed]";
			//
			// }
			//
			// return placeholder;

		}

		return "";

	}

	/**
	 * Remove value (-> mixed)
	 */
	// remove() {
	//
	// 	this.setValue("");
	// 	this.render();
	// 	this.save("delete");
	//
	// }
	//
	// delete() {
	//
	// 	this.remove();
	//
	// }

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

	isReadonly() {

		if (this.resource.readonly) {

			return KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.readonly));

		}

		return false;
	}

	async save(deleting = false) {

		if (deleting) {

			await KarmaFieldsAlpha.History.save(`${this.uid}-delete`, "Delete");

		} else {

			await KarmaFieldsAlpha.History.save(`${this.uid}-insert`, "Insert");

		}
	}

	async write(newValue, currentValue) {

		console.error("deprecated");

		if (newValue.length < currentValue.length) {

			await KarmaFieldsAlpha.History.save(`${this.uid}-delete`, "Delete");

		} else {

			await KarmaFieldsAlpha.History.save(`${this.uid}-insert`, "Insert");

		}

		const content = new KarmaFieldsAlpha.Content(newValue);

		await this.setContent(content);

		await this.request("render");

	}



	build() {
		return {
			tag: "input", // tag: this.resource.type   ! -> Fail when extending class!
			class: "text-input karma-field",
			init: input => {
				// if (this.resource.type === "input") {
				// 	input.element.type = "text"; // ! -> Fail when extending class!
				// }
				input.element.type = "text";
				// input.element.id = this.getUid();
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
			},
			update: async input => {

        const content = this.getContent();

        input.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

					if (content.notFound) {

						const defaultContent = this.getDefault();

						input.element.value = defaultContent.toString();

						if (defaultContent.value !== null) {

							// this.updateValue(defaultValue);

							// const inputRequest = new KaramFieldsAlpha.Input(defaultValue);
							// inputRequest.needRecord = false;
							// inputRequest.needRender = false;

							// debugger;


							await this.setContent(defaultContent);
							// this.request("render");

							KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering

						}

					} else {

						input.element.placeholder = this.getPlaceholder();
						input.element.classList.toggle("mixed", Boolean(content.mixed));
						// input.element.classList.toggle("selected", Boolean(content.mixed && this.selection));
						input.element.classList.toggle("selected", Boolean(content.mixed && this.hasFocus()));


						//
						// this.unfocus = () => {
						// 	input.element.classList.remove("selected");
						// }

						// if (content.mixed && KarmaFieldsAlpha.Store.Focus.has(this.path)) {
						//
						// 	input.element.classList.add("selected");
						//
						// 	this.unfocus = () => void input.element.classList.remove("selected");
						//
						// } else {
						//
						// 	input.element.classList.remove("selected");
						//
						// }



	          if (content.mixed) {

	            input.element.value = "[mixed values]";
	            input.element.readOnly = true;

	          } else {

	            input.element.readOnly = this.isReadonly();
	            input.element.parentNode.classList.toggle("modified", Boolean(content.modified));

							const value = content.toString();


	            if (input.element.value.normalize() !== value) { // -> replacing same value will ruin selection !

	              input.element.value = value || "";

	            }

	          }

					}

					// -> NOT TEXTAREA
					input.element.onkeyup = async event => {

						if (event.key === "Enter" && !content.mixed) {

							this.request("submit");

						}

					}

					let value = content.toString();

          input.element.oninput = async event => {


						// console.time();

						const newValue = input.element.value.normalize();

						await this.save(newValue.length < value.length);

						const content = new KarmaFieldsAlpha.Content(newValue);

						await this.setContent(content);

						if (event.inputType === "insertText" || event.inputType === "deleteContentBackward") {

							this.debounce(() => void this.request("render"), this.resource.debounce || 300);

						} else {

							await this.request("render");

						}

						// console.timeEnd();

						// const debounceTimeout = (event.inputType === "insertText" || event.inputType === "deleteContentBackward") && (this.resource.debounce || 400) || 0;
						//
						// this.debounce(() => {
						//
						// 	this.request("render");
						//
						// }, debounceTimeout);

          }

					input.element.onfocus = async event => {

						// this.request("focus", false, this.path);

						// this.setSelection({});

						// const useClipboard = Boolean(content.mixed);

						await this.setFocus(content.mixed);

						// this.useClipboard(content.mixed);

						await this.request("render"); // update clipboard textarea, unselect other stuffs

					}

					input.element.onmousedown = event => {

						event.stopPropagation(); // -> prevent selecting parent stuffs

					}

					input.element.onkeydown = event => {

						if (event.key === "Enter") {

							event.preventDefault(); // -> prevent sending form if embeded in a post page

              this.request("submit"); // -> Save

            }

					}



        } else {

					input.element.value = ""; // set blank while loading

				}

				// if (this.getSelection() && input.element !== document.activeElement && value !== KarmaFieldsAlpha.mixed) {
				//
				// 	input.element.focus();
				//
				// }

				input.element.disabled = this.isDisabled();

			}
		};
	}

}

// KarmaFieldsAlpha.field.input.loading = Symbol("loading");
// KarmaFieldsAlpha.field.input.multiple = Symbol("multiple");
