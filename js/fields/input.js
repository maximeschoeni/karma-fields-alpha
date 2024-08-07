KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

	// async *create() {
	//
	// 	// let value = await this.getDefault();
	// 	//
	// 	// if (value) {
	// 	//
	// 	// 	while (value.loading) {
	// 	//
	// 	// 		yield;
	// 	// 		value = await this.getDefault();
	// 	//
	// 	// 	}
	// 	//
	// 	// 	await this.setValue(value.toString());
	// 	//
	// 	// }
	//
	// 	if (this.resource.default !== null) {
	//
	// 		let value = await this.getDefault();
	//
	// 		while (value.loading) {
	//
	// 			yield;
	// 			value = await this.getDefault();
	//
	// 		}
	//
	// 		await this.setValue(value.toString());
	//
	// 	}
	//
	// }

	async getDefault() {

		return this.parse(this.resource.default || "");

	}

	async exportDefaults() {

		let defaults = new KarmaFieldsAlpha.Content();

		const response = await this.getDefault();

		if (response.loading) {

			defaults.loading = true;

		} else {

			defaults.value = {[this.getKey()]: response.toString()};

		}

		return defaults;

	}

	isDisabled() {

    if (this.resource.disabled) {

      return this.parse(this.resource.disabled).toBoolean();

    } else if (this.resource.enabled) {

      return !this.parse(this.resource.enabled).toBoolean();

    }

    return false;
  }

	debounce(callback, duration = 500) {

		if (KarmaFieldsAlpha.timer) {

			clearTimeout(KarmaFieldsAlpha.timer);

		}

		KarmaFieldsAlpha.timer = setTimeout(() => void callback(), duration);

	}

	async copy() {

		let content = await this.getContent();

		if (content.mixed) {

			content = new KarmaFieldsAlpha.Content.Grid(content.value);

		}

		return content.toString();

	}

	async paste(string) {

		await KarmaFieldsAlpha.History.save("paste", "Paste");
		await this.setValue(string);
		await this.request("render");

	}

	async delete() { // -> for mixed values

		// const content = new KarmaFieldsAlpha.Content("");
		// KarmaFieldsAlpha.History.save("delete", "Delete");
		// this.setContent(content);
		// this.request("render");

		await this.setValue("");

	}

	async getContent(key) {

		if (!key) {

			key = this.getKey();

		}


		// if (this.resource.value) {
		//
		// 	const content = await this.parent.getContent(key);
		//
		// 	if (!content.mixed) {
		//
		// 		const value = await this.parse(this.resource.value);
		//
		// 		if (!value.loading && !value.equals(content)) {
		//
		// 			await this.parent.setValue(value.toString(), key);
		//
		// 			return value;
		//
		// 		}
		//
		// 	}
		//
		// 	return content;
		//
		// } else {

			return this.parent.getContent(key);

		// }

		// return content;
	}

	setValue(value, key) {

		if (!key) {

			key = this.getKey();

		}

		return this.parent.setValue(value, key);

	}


	async export() {

		// const output = new KarmaFieldsAlpha.Content();
		//
		// if (this.resource.export !== false) {
		//
		// 	const content = await this.getContent();
		//
		// 	if (content.loading) {
		//
		// 		output.loading = true;
		//
		// 	} else {
		//
		// 		output.value = content.toString() || "";
		//
		// 	}
		//
		// }
		//
		// return output;


		if (this.resource.export !== false) {

			return this.getContent();

		}

		return new KarmaFieldsAlpha.Content();

  }

	async import(collection) {

    const string = collection.value.shift();

		await this.setValue(string);
  }

	async getPlaceholder() {

		if (this.resource.placeholder) {

			return this.parse(this.resource.placeholder);

		}

		return new KarmaFieldsAlpha.Content("");

	}

	isReadonly() {

		if (this.resource.readonly) {

			return this.parse(this.resource.readonly);

		}

		return new KarmaFieldsAlpha.Content(false);
	}

	// save(deleting = false) {
	//
	// 	if (deleting) {
	//
	// 		KarmaFieldsAlpha.History.save(`${this.uid}-delete`, "Delete");
	//
	// 	} else {
	//
	// 		KarmaFieldsAlpha.History.save(`${this.uid}-insert`, "Insert");
	//
	// 	}
	//
	// }



	// write(value) {
	//
	// 	// if (!content) {
	// 	//
	// 	//
	// 	//
	// 	// }
	//
	// 	const current = this.getContent();
	//
	// 	// const content = this.getContent();
	//
	// 	// if (content.loading) {
	// 	//
	// 	// 	// return; // does not work because getContent() continuely return a query made when row field is set as loading
	// 	//
	// 	// 	// let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "writing" && task.id === this.uid);
	// 	// 	//
	// 	// 	// if (task) {
	// 	// 	//
	// 	// 	// 	task.value = value;
	// 	// 	//
	// 	// 	// } else {
	// 	// 	//
	// 	// 	// 	task = {
	//   //   //     type: "writing",
	// 	// 	// 		id: this.uid,
	// 	// 	// 		value: value,
	// 	// 	// 		proority: -1,
	//   //   //     resolve: () => this.write(task.value)
	//   //   //   };
	// 	// 	//
	// 	// 	// 	KarmaFieldsAlpha.Store.Tasks.add(task);
	// 	// 	//
	// 	// 	// }
	// 	//
	// 	// 	this.setOption(value, "writing");
	// 	//
	// 	// } else {
	//
	// 		const normalizedValue = value.normalize();
	//
	// 		this.debounce(() => {
	//
	// 			if (normalizedValue.length < current.toString().length) {
	//
	// 				this.save(`${this.uid}-delete`, "Delete");
	//
	// 			} else {
	//
	// 				this.save(`${this.uid}-insert`, "Insert");
	//
	// 			}
	//
	// 			// const newContent = new KarmaFieldsAlpha.Content(normalizedValue);
	//
	// 			this.setValue(normalizedValue);
	//
	// 			this.setData(false, "embargo");
	//
	// 			this.request("render");
	//
	// 		}, this.resource.debounce || 300);
	//
	// 		this.setData(true, "embargo");
	//
	// 	// }
	//
	// }




	build() {
		return {
			tag: "input", // tag: this.resource.type   ! -> Fail when extending class!
			class: "text-input karma-field",
			init: input => {
				input.element.type = "text";
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
			},
			update: async input => {


        const content = await this.getContent();
				const hasFocus = await this.hasFocus();

        input.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

					const placeholder = await this.getPlaceholder();

					input.element.placeholder = placeholder.toString();
					input.element.classList.toggle("mixed", Boolean(content.mixed));

					// if (content.notFound) {
					//
					// } else {


						input.element.classList.toggle("selected", Boolean(content.mixed && hasFocus));

	          if (content.mixed) {

	            input.element.value = "[mixed values]";
	            input.element.readOnly = true;

	          } else {

							if (this.resource.readonly) {

								const readonly = await this.parse(this.resource.readonly);
								input.element.readOnly = readonly.toBoolean();

							} else {

								input.element.readOnly = false;

							}

	            input.element.parentNode.classList.toggle("modified", Boolean(content.modified));

							const value = content.toString();

							if (input.element.value.normalize() !== value) { // -> replacing same value still reset caret position

	              input.element.value = value || "";

	            }

	          }

					// }

				} else {

					input.element.value = ""; // set blank while loading

				}

				// -> NOT TEXTAREA
				input.element.onkeyup = event => {

					if (event.key === "Enter" && !content.mixed) {

						this.request("submit");

					}

				}

        input.element.oninput = async event => {

					const normalizedValue = input.element.value.normalize();

					if (normalizedValue.length < content.toString().length) {

						await this.save(`${this.uid}-delete`, "Delete");

					} else {

						await this.save(`${this.uid}-insert`, "Insert");

					}

					await this.setValue(normalizedValue);

					this.debounce(() => {
						this.request("render");
					}, 400);

        }

				input.element.onfocus = async event => {

					await this.setFocus(content.mixed);

					await this.request("render"); // update clipboard textarea, unselect other stuffs

				}

				input.element.onmousedown = event => {

					event.stopPropagation(); // -> prevent selecting parent stuffs

				}

				input.element.onkeydown = async event => {

					if (event.key === "Enter") {

						event.preventDefault(); // -> prevent sending form if embeded in a post page

            await this.request("submit"); // -> Save

						await this.render();

          }

				}

				if (this.resource.disabled) {

					const disabled = await this.parse(this.resource.disabled);
					input.element.disabled = disabled.toBoolean();

		    } else if (this.resource.enabled) {

					const enabled = await this.parse(this.resource.enabled);
					input.element.disabled = !enabled.toBoolean();

		    }

			}
		};
	}

}
