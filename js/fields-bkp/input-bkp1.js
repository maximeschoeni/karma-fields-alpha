KarmaFieldsAlpha.field.input = class extends KarmaFieldsAlpha.field {

	getDefault() {

		return this.parseString(this.resource.default || "");

	}

	getDefaults() {

		const key = this.getKey();
		const value = this.parseString(this.resource.default || "");

		if (value !== undefined) {

			return { [key]: value };

		}

	}

	// exportDefaults() {

	// 	let defaults = new KarmaFieldsAlpha.Content();

	// 	if (this.resource.default !== null) { // -> for search field

	// 		const response = this.getDefault();

	// 		if (response.loading) {

	// 			defaults.loading = true;

	// 		} else {

	// 			defaults.value = {[this.getKey()]: response.toString()};

	// 		}

	// 	}

	// 	return defaults;

	// }

	isDisabled() {

		if (this.resource.disabled) {

			return this.parseBoolean(this.resource.disabled) || false;

		} else if (this.resource.enabled) {

			return !this.parseBoolean(this.resource.enabled);

		}

		return false;
	}

	// debounce(callback, duration = 500) {

	// 	if (KarmaFieldsAlpha.timer) {

	// 		clearTimeout(KarmaFieldsAlpha.timer);

	// 	}

	// 	KarmaFieldsAlpha.timer = setTimeout(() => void callback(), duration);

	// }

	copy() {

		let value = this.getValue();
		const mixed = this.isMixed();

		if (mixed) {

			const key = this.getKey();
			value = this.getSelectedValues(key);

			return KarmaFieldsAlpha.CSV.stringify(value);

		}

		return value[0] || "";

	}

	paste(string) {

		this.save("paste", "Paste");
		this.setValue([string]);
		this.render();

	}

	delete() { // -> for mixed values

		this.setValue([""]);

	}

	getValue(key) {

		if (!key) {

			key = this.getKey();

		}

		return this.parent.getValue(key);

	}

	setValue(value, key) {

		if (!key) {

			key = this.getKey();

		}

		return this.parent.setValue(value, key);

	}


	export() {

		if (this.resource.export !== false) {

			return this.getValue();

		}

		return [];

	}

	import(collection) {

		if (this.resource.import !== false) {

			const string = collection.shift();

			this.setValue([string]);

		}

  }

	getPlaceholder() {

		if (this.resource.placeholder) {

			return this.parseString(this.resource.placeholder);

		}

		return "";

	}

	isReadonly() {

		if (this.resource.readonly) {

			return this.parseBoolean(this.resource.readonly);

		}

		return false;
	}

	// *buildBlock() {

	// 	yield {
	// 		tag: "label",
	// 		class: "field-block",
	// 		children: this.buildBlockItems(),
	// 		update: element => {
	// 			element.classList.toggle("hidden", this.isHidden());
	// 			if (this.resource.width) {
	// 				if (this.resource.width === "1fr") {
	// 					element.style.flexGrow = 1;
	// 				} else {
	// 					element.style.width = this.resource.width;
	// 				}
	// 			}
	// 		}
	// 	};

	// }

	*buildLabel() {

		if (this.resource.label) {

			yield {
				tag: "label",
				class: "label",
				init: element => {
					element.htmlFor = this.uid;
					element.innerHTML = this.getLabel() || "";
				}
			};

		}

	}

	*build() {

		yield {
			tag: "input", // tag: this.resource.type   ! -> Fail when extending class!
			class: "text-input karma-field",
			init: element => {
				element.type = "text";
				element.id = this.uid;
				if (this.resource.input) {
					Object.assign(element, this.resource.input);
				}
			},
			update: element => {

				const values = this.getValue();
				const hasFocus = this.hasFocus();

				if (hasFocus && document.activeElement !== element) {

					element.onfocus = undefined;
					element.focus({ preventScroll: true });

				}

				// element.classList.toggle("loading", Boolean(content.loading));

				if (values !== undefined) {

					const mixed = this.isMixed();

					element.placeholder = this.getPlaceholder();
					element.classList.toggle("mixed", mixed);
					element.classList.toggle("selected", mixed && hasFocus);

					if (mixed) {

						element.value = "[mixed values]";
						element.readOnly = true;

					} else {

						if (this.resource.readonly) {

							element.readOnly = this.parseBoolean(this.resource.readonly);

						} else {

							element.readOnly = false;

						}

						element.parentNode.classList.toggle("modified", Boolean(values.modified));

						// const value = content.toString();

						if (element.value.normalize() !== values[0]) { // -> replacing same value still reset caret position

							element.value = values[0] || "";

						}

					}

					element.oninput = event => {

						const normalizedValue = element.value.normalize();

						const value = values[0] || "";

						if (normalizedValue.length < value.length) {

							this.save("delete", "Delete");

						} else {

							this.save("insert", "Insert");

						}

						this.setValue([normalizedValue]);
						this.render();

					}

					element.onfocus = event => {

						this.setFocus(mixed);

						this.render(); // update clipboard textarea, unselect other stuffs

					}

					element.onmousedown = event => {

						event.stopPropagation(); // -> prevent selecting parent stuffs

					}

					element.onkeydown = event => {

						if (event.key === "Enter") {

							event.preventDefault(); // -> prevent sending form if embeded in a post page

							this.request("submit"); // -> Save
							this.render();

						}

					}

					if (this.resource.disabled) {

						element.disabled = this.parseBoolean(this.resource.disabled) || false;

					} else if (this.resource.enabled) {

						element.disabled = !this.parseBoolean(this.resource.enabled);

					}

				}



			}
		};


	}

}
