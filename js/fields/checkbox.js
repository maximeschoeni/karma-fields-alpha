
KarmaFieldsAlpha.field.checkbox = class extends KarmaFieldsAlpha.field.input {

	// static mousedown = false;
	// static state = false;
	// static selected = [];

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	// getDefault(defaults = {}) {
	//
	// 	if (this.resource.key && this.resource.default !== null) {
	//
	// 		defaults[this.resource.key] = this.parse(this.resource.default);
	//
	// 	}
	//
	// 	return defaults;
	// }


	//
  // setValue(value) {
	//
  //   const key = this.getKey();
	//
  //   this.parent.setValue(value, key);
	//
  // }

	// exportValue() {
	// 	const key = this.getKey();
	// 	const values = this.parent.request("get", {}, key);
	// 	return KarmaFieldsAlpha.Type.toString(values);
	// }

	// importValue(value) {
	// 	const key = this.getKey();
	// 	this.parent.request("set", value, key);
	// }


	// export() {
	// 	const key = this.getKey();
	// 	const values = this.parent.request("get", {}, key);
	// 	const value = KarmaFieldsAlpha.Type.toString(values);
  //   return {[key]: value};
	// }

	// import(object) {
	// 	const key = this.getKey();
  //   const value = KarmaFieldsAlpha.Type.toBoolean(object[key]);
	// 	if (object[key] !== undefined) {
	// 		this.parent.request("set", object[key], key);
	// 	}

	// }

  // export(items = []) {
	//
	// 	const values = this.getValue() || [""];
	//
  //   items.push(values[0]);
	//
  //   return items;
	// }
	//
  // import(items) {
	//
  //   const value = items.shift() || "";
	//
  //   this.setValue(value);
	//
  // }



	// setMultipleFields(checked, fields) {
	//
	// 	KarmaFieldsAlpha.History.save();
	//
	// 	for (let field of fields) {
	//
	// 		const value = checked ? field.true() : field.false();
	//
  //     if (this.resource.autosave) {
	//
  //       field.parent.request("autosave", value, field.getKey());
	//
  //     } else {
	//
  //       field.parent.request("set", value, field.getKey());
	//
  //     }
	//
	//
	//
	// 	}
	//
	// 	this.parent.request("edit");
	//
	// }

	// buildX() {
	//
	// 	return {
	// 		tag: this.resource.tag || "div",
	// 		class: "checkbox-container",
	// 		update: container => {
	// 			this.render = container.render;
	//
	// 			container.children = [
	// 				{
	// 					tag: "input",
	// 					init: checkbox => {
	// 						checkbox.element.type = "checkbox";
	// 						checkbox.element.id = this.getId();
	// 					},
	// 					update: async checkbox => {
	//
	// 						this.edit = editing => {
	// 							checkbox.element.blur();
	// 							container.element.parentNode.classList.toggle("editing", editing);
	// 						}
	//
	// 						container.element.onmousemove = event => {
	// 							if (this.constructor.mousedown && !this.constructor.selected.includes(this)) {
	// 								checkbox.element.checked = this.constructor.state;
	// 								this.constructor.selected.push(this);
	// 							}
	// 						}
	//
	// 						container.element.onmouseup = event => {
	// 							event.preventDefault();
	// 						}
	// 						container.element.onclick = event => {
	// 							event.preventDefault();
	// 						}
	//
	// 						container.element.onmousedown = event => {
	//
	// 							checkbox.element.checked = !checkbox.element.checked;
	//
	// 							this.constructor.mousedown = true;
	// 							this.constructor.state = checkbox.element.checked ? true : false;
	// 							this.constructor.selected = [this];
	//
	// 							let mouseup = event => {
	//
	// 								window.removeEventListener("mouseup", mouseup);
	//
	// 								event.preventDefault();
	// 								this.constructor.mousedown = false;
	//
	// 								this.setMultipleFields(this.constructor.state, this.constructor.selected);
	//
	// 								this.constructor.selected = [];
	//
	// 							}
	//
	// 							window.addEventListener("mouseup", mouseup);
	// 						}
	//
	// 						const [value] = this.parent.request("get", {}, this.getKey()) || [];
	// 						checkbox.element.checked = value === this.true();
	//
  //             if (this.resource.disabled) {
  //               checkbox.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
  //             }
	//
  //             if (this.resource.enabled) {
  //               checkbox.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));
  //             }
	//
	// 					}
	// 				},
	// 				{
	// 					tag: "label",
	// 					class: "checkbox-text",
	// 					init: label => {
	// 						label.element.htmlFor = this.getId();
	// 					},
	// 					update: label => {
	// 						label.element.innerHTML = this.resource.text || "";
	// 					}
	// 				}
	// 			];
	// 		}
	//
	// 	};
	// }




  build() {

		return {
			tag: this.resource.tag || "div",
			class: "checkbox-container",
			update: container => {

				container.element.onmousedown = event => {
					event.stopPropagation();
				}

				container.children = [
					{
						tag: "input",
						init: checkbox => {
							checkbox.element.type = "checkbox";
							const id = this.getId();
							checkbox.element.id = id;
						},
						update: async checkbox => {

              let value = this.getValue();

              if (value !== KarmaFieldsAlpha.field.input.loading) {

								if (value === KarmaFieldsAlpha.field.input.multiple) {

									const array = super.getValue();
									const set = new Set(array);

									checkbox.element.checked = set.size === 1 && set.has(this.true());

								} else {

									checkbox.element.checked = value === this.true();

								}

                container.element.onchange = () => {

									value = checkbox.element.checked ? this.true() : this.false();

									if (value === KarmaFieldsAlpha.field.input.multiple) {

										this.setValue([value]);

									} else {

										this.setValue(value);

									}

                }

								if (this.resource.disabled) {

	                checkbox.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));

	              }

	              if (this.resource.enabled) {

	                checkbox.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));

	              }

              }

						}
					},
					{
						tag: "label",
						class: "checkbox-text",
						init: label => {
							label.element.htmlFor = this.getId();
						},
						update: label => {
							label.element.innerHTML = this.resource.text || "";
						}
					}
				];
			}

		};
	}

}
