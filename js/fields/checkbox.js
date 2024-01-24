
KarmaFieldsAlpha.field.checkbox = class extends KarmaFieldsAlpha.field.input {

	// static mousedown = false;
	// static state = false;
	// static selected = [];


	// getContent() {
	//
	// 	const key = this.getKey();
	//
	// 	return this.parent.getContent(key);
	//
	// }
	//
	// setContent(content) {
	//
	// 	const key = this.getKey();
	//
	// 	this.parent.setContent(content, key);
	//
	// }

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	getDefault() {

		return this.parse(this.resource.default || this.false());

	}

	// initValue() {
	//
	// 	const value = this.getDefault();
	//
	// 	if (value !== undefined && value !== null) {
	//
	// 		this.setValue(value);
	// 		this.save();
	//
	// 	}
	//
	// 	return value || "";
	// }

	// export(collection) {
	//
	//   const content = this.getContent();
	//
	// 	if (!content.loading) {
	//
	// 	}
	//
	//   collection.add(content);
	//
	// }
	//
	// import(collection) {
	//
	// 	const content = collection.pick();
	//
	// 	this.setContent(content);
	//
  // }

	// export() { // -> return array of string
	//
  //   const content = this.getContent();
	//
	// 	content.value = content.toArray().slice(0, 1);
	//
	// 	return content;
	//
  // }

	// export() { // -> return array of string
	//
	// 	const output = new KarmaFieldsAlpha.Content();
	//
	// 	if (this.resource.export !== false) {
	//
	// 		const content = this.getContent();
	//
	// 		if (content.loading) {
	//
	// 			output.loading = true;
	//
	// 		} else {
	//
	// 			output.value = content.toString() || "";
	//
	// 		}
	//
	// 	}
	//
	// 	return output;
	//
  // }
	//
	// import(collection) {
	//
  //   const string = collection.value.shift();
	//
	// 	const content = new KarmaFieldsAlpha.Content(string);
	//
	// 	this.setContent(content);
  // }
	//

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




//   build() {
//
// 		return {
// 			tag: this.resource.tag || "div",
// 			class: "checkbox-container",
// 			update: container => {
//
// 				container.element.onmousedown = event => {
// 					event.stopPropagation();
// 				}
//
// 				container.children = [
// 					{
// 						tag: "input",
// 						init: checkbox => {
// 							checkbox.element.type = "checkbox";
// 							// const id = this.getId();
// 							// checkbox.element.id = id;
// 						},
// 						update: async checkbox => {
//
// 							debugger;
//               let values = this.getValue();
//
//
//
//               if (values) {
// 								//
// 								// const isMixed = values.length > 1 && (new Set(values)).size > 1;
// 								// const isChecked = values.every(value === this.false());
// 								// const isUnchecked = values.every(value === this.true());
// 								let mixe = false;
// 								let checked = false;
//
// 								if (values.every(value => value === this.false())) {
//
// 									checkbox.element.checked = false;
// 									// checkbox.element.classList.remove("mixed");
//
// 								} else if (values.every(value => value === this.true())) {
//
// 									checkbox.element.checked = true;
// 									checked = true;
// 									// checkbox.element.classList.remove("mixed");
//
// 								} else {
//
// 									checkbox.element.classList.add("mixed");
// 									mixe = true;
//
// 								}
//
// 								checkbox.element.classList.toggle("mixed", mixe);
//
// 								// const multiple = this.request("multiple");
//
// 								//
//
// 								// if (multiple) {
// 								//
// 								// 	const array = super.getValue();
// 								// 	const set = new Set(array);
// 								//
// 								// 	checkbox.element.checked = set.size === 1 && set.has(this.true());
// 								//
// 								// } else {
// 								//
// 								// 	checkbox.element.checked = value === this.true();
// 								//
// 								// }
//
//                 checkbox.element.onchange = () => {
//
// 									if (mixe || checked) {
//
// 										this.setValue(this.false());
// 										this.save("uncheck");
//
// 									} else {
//
// 										this.setValue(this.true());
// 										this.save("check");
//
// 									}
//
//                 }
//
// 								if (this.resource.disabled) {
//
// 	                checkbox.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
//
// 	              }
//
// 	              if (this.resource.enabled) {
//
// 	                checkbox.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled));
//
// 	              }
//
//               }
//
// 						}
// 					},
// 					{
// 						// tag: "label",
// 						class: "checkbox-text",
// 						// init: label => {
// 						// 	label.element.htmlFor = this.getId();
// 						// },
// 						update: label => {
// 							label.element.innerHTML = this.resource.text || "";
// 						}
// 					}
// 				];
// 			}
//
// 		};
// 	}
//
// }

	// isDisabled() {
	//
	// 	if (this.resource.disabled) {
	//
	// 		return this.parent.parse(this.resource.disabled).toBoolean();
	//
	// 	} else if (this.resource.enabled) {
	//
	// 		return !this.parent.parse(this.resource.enabled).toBoolean();
	//
	// 	}
	//
	// 	return false;
	// }

	build() {

		return {
			tag: this.resource.tag || "label",
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
							// const id = this.getId();
							checkbox.element.id = this.uid;
						},
						update: async checkbox => {

							let content = this.getContent();


							if (!content.loading) {

								// -> set default
								// if (content.notFound) {
								//
								// 	// const defaultValue = this.getDefault();
								// 	//
								// 	// if (defaultValue !== undefined && defaultValue !== null) {
								// 	//
								// 	// 	this.setValue(defaultValue);
								// 	//
								// 	// }
								//
								// 	// content = this.getDefault();
								// 	//
								// 	// if (!content.loading) {
								// 	//
								// 	// 	this.setContent(content);
								// 	//
								// 	// 	KarmaFieldsAlpha.Query.init(); // -> add fake task to force rerendering
								// 	//
								// 	// }
								//
								// 	if (this.resource.createWhenNotFound) {
								//
								// 		this.createTask("create");
								//
								// 	}
								//
								// }

								checkbox.element.classList.toggle("mixed", Boolean(content.mixed));
								checkbox.element.checked = content.toString() === this.true();

								checkbox.element.onchange = () => {

									let value;

									if (content.mixed || content.toString() === this.true()) {

										value = this.false();

										// const content = new KarmaFieldsAlpha.Content(this.false());
										//
										// this.save("uncheck", "Uncheck");
										// this.setContent(content);
										// this.request("render");

									} else {

										value = this.true();

										// const content = new KarmaFieldsAlpha.Content(this.true());
										//
										// this.save("check", "Check");
										// this.setContent(content);
										// this.request("render");


									}

									const newContent = new KarmaFieldsAlpha.Content(value);

									this.save("check", "Check");
									this.setContent(newContent);
									this.request("render");

								}

								checkbox.element.disabled = this.isDisabled();

							}

						}
					},
					{
						class: "checkbox-text",
						update: label => {
							label.element.innerHTML = this.resource.text || "";
						}
					}
				];
			}

		};
	}

}
