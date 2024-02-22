KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

	create() {

		const value = this.getDefault();

		if (value.loading) {

			this.createTask("create");

		} else {

			this.setContent(value);

		}

	}

	getDefault() {

		if (this.resource.default === null) {

			return null;

		} else if (this.resource.default) {

			return this.parse(this.resource.default);

		}

		return new KarmaFieldsAlpha.Content("");

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

		if (this.debounceTimer) {

			clearTimeout(this.debounceTimer);

		}

		this.debounceTimer = setTimeout(() => void callback(), duration);
	}

	copy() {

		let content = this.getContent();

		if (content.mixed) {

			content = new KarmaFieldsAlpha.Content.Grid(content);

		}

		return content.toString();

	}

	paste(string) {

		const content = new KarmaFieldsAlpha.Content(string);
		KarmaFieldsAlpha.History.save("paste", "Paste");
		this.setContent(content);
		this.request("render");

	}

	delete() {

		const content = new KarmaFieldsAlpha.Content("");
		KarmaFieldsAlpha.History.save("delete", "Delete");
		this.setContent(content);
		this.request("render");

	}

	getContent() {

		const key = this.getKey();

		let content = this.parent.getContent(key);

		if (this.resource.value && !content.mixed) {

			const value = this.parse(this.resource.value);

			if (!value.loading && !value.equals(content)) {

				this.parent.setContent(value, key);

				content = value;

			}

		}

		// if (content.notFound) {
		//
		// 	const value = this.getDefault();
		//
		// 	if (!value.loading) {
		//
		// 		this.setContent(value);
		//
		// 	}
		//
		// 	content = value;
		//
		// }

		return content;
	}

	setContent(content) {

		const key = this.getKey();

		this.parent.setContent(content, key);

	}


	export() { // -> return array of string

		const output = new KarmaFieldsAlpha.Content();

		if (this.resource.export !== false) {

			const content = this.getContent();

			if (content.loading) {

				output.loading = true;

			} else {

				output.value = content.toString() || "";

			}

		}

		return output;

  }

	import(collection) {

    const string = collection.value.shift();

		const content = new KarmaFieldsAlpha.Content(string);

		this.setContent(content);
  }

	getPlaceholder() {

		if (this.resource.placeholder) {

			return this.parse(this.resource.placeholder).toString();

		}

		return "";

	}

	isReadonly() {

		if (this.resource.readonly) {

			return KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.readonly));

		}

		return false;
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



	write(value) {

		// if (!content) {
		//
		//
		//
		// }

		const current = this.getContent();

		// const content = this.getContent();

		// if (content.loading) {
		//
		// 	// return; // does not work because getContent() continuely return a query made when row field is set as loading
		//
		// 	// let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "writing" && task.id === this.uid);
		// 	//
		// 	// if (task) {
		// 	//
		// 	// 	task.value = value;
		// 	//
		// 	// } else {
		// 	//
		// 	// 	task = {
	  //   //     type: "writing",
		// 	// 		id: this.uid,
		// 	// 		value: value,
		// 	// 		proority: -1,
	  //   //     resolve: () => this.write(task.value)
	  //   //   };
		// 	//
		// 	// 	KarmaFieldsAlpha.Store.Tasks.add(task);
		// 	//
		// 	// }
		//
		// 	this.setOption(value, "writing");
		//
		// } else {

			const normalizedValue = value.normalize();

			this.debounce(() => {

				if (normalizedValue.length < current.toString().length) {

					this.save(`${this.uid}-delete`, "Delete");

				} else {

					this.save(`${this.uid}-insert`, "Insert");

				}

				const newContent = new KarmaFieldsAlpha.Content(normalizedValue);

				this.setContent(newContent);

				this.setData(false, "embargo");

				this.request("render");

			}, this.resource.debounce || 300);

			this.setData(true, "embargo");

		// }

	}


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
			// complete: input => {
			// 	const value = this.getOption("writing");
			// 	if (value) {
			// 		this.write(value);
			// 	}
			// },
			update: input => {

				// const writing = this.getOption("writing");
				//
				// if (writing) {
				//
				// 	this.removeOption("writing");
				//
				// 	this.write(writing);
				//
				// }

        const content = this.getContent();

        input.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

					if (content.notFound) {

						// if (this.resource.createWhenNotFound) {
						//
						// 	this.createTask("create");
						//
						// }


						// const defaultContent = this.getDefault();
						//
						// input.element.value = defaultContent.toString();
						//
						// if (defaultContent.value !== null) {
						//
						// 	this.setContent(defaultContent);
						//
						// 	KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering
						//
						// }

					} else {

						input.element.placeholder = this.getPlaceholder();
						input.element.classList.toggle("mixed", Boolean(content.mixed));
						input.element.classList.toggle("selected", Boolean(content.mixed && this.hasFocus()));

	          if (content.mixed) {

	            input.element.value = "[mixed values]";
	            input.element.readOnly = true;

	          } else {

	            input.element.readOnly = this.isReadonly();
	            input.element.parentNode.classList.toggle("modified", Boolean(content.modified));

							const value = content.toString();

	            if (input.element.value.normalize() !== value && !this.getData("embargo")) { // -> replacing same value still reset caret position

	              input.element.value = value || "";

	            }

	          }

					}

				} else {

					input.element.value = ""; // set blank while loading

				}

				// -> NOT TEXTAREA
				input.element.onkeyup = event => {

					if (event.key === "Enter" && !content.mixed) {

						this.request("submit");

					}

				}

        input.element.oninput = event => {

					this.write(input.element.value, content);

					// const content = this.getContent();
					//
					// let value = content.toString();
					//
					// const newValue = input.element.value.normalize();
					//
					// this.save(newValue.length < value.length);
					//
					// const content = new KarmaFieldsAlpha.Content(newValue);
					//
					// this.setContent(content);
					//
					// if (event.inputType === "insertText" || event.inputType === "deleteContentBackward") {
					//
					// 	this.debounce(() => void this.request("render"), this.resource.debounce || 300);
					//
					// } else {
					//
					// 	this.request("render");
					//
					// }

        }

				input.element.onfocus = event => {

					this.setFocus(content.mixed);

					this.request("render"); // update clipboard textarea, unselect other stuffs

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





				input.element.disabled = this.isDisabled();

			}
		};
	}

}
