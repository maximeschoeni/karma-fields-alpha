
KarmaFieldsAlpha.fields.checkbox_basic = KarmaFieldsAlpha.fields.checkbox = class extends KarmaFieldsAlpha.fields.field {

	true() {
		return this.resource.true || "1";
	}

	false() {
		return this.resource.false || "";
	}

	// setDefault() {
	// 	this.initValue(this.resource.default === this.true() ? this.true() : this.false());
	// }

	getDefault() {
		return [this.resource.default || this.false()];
	}

	// getEmpty() {
	// 	return this.false();
	// }

	async setMultipleFields(checked, fields) {

		for (let field of fields) {
			await field.write();
		}

		if (KarmaFieldsAlpha.History.lastField !== this) {
			KarmaFieldsAlpha.History.backup();
			KarmaFieldsAlpha.History.lastField = this;
		}

		// if (this.resource.autosave) {
		// 	const delta = {};
		// 	const form = this.getForm();
		// 	const driver = form.resource.driver || form.resource.key;
		//
		// 	for (let field of fields) {
		// 		const path = field.getPath();
		// 		const value = checked ? field.true() : field.false();
		// 		KarmaFieldsAlpha.DeepObject.assign(delta, [value], ...path);
		// 		form.buffer.set([value], ...path);
		// 		form.writeHistory([value], ...path);
		// 	}
		//
		// 	await KarmaFieldsAlpha.Gateway.update(driver, delta);
		//
		// } else {
		// 	for (let field of fields) {
		// 		const value = checked ? field.true() : field.false();
		// 		await field.setValue(null, [value]);
		// 	}
		// }

		for (let field of fields) {
			const value = checked ? field.true() : field.false();
			await field.setValue(null, [value]);
		}

		if (this.resource.autosave) {
			await this.saveField(...fields);
		}



		await this.edit();

		if (this.resource.submit === "auto" || this.resource.autosubmit) {
			await this.submit();
		}

	}


	// async fetchValue() {
	// 	let value = await super.fetchValue();
	//
	// 	return value;
	// }




	// async input(fields) {
	//
	// 	for (let field of fields) {
	// 		await field.write();
	// 	}
	//
	// 	if (KarmaFieldsAlpha.History.lastField !== this) {
	// 		KarmaFieldsAlpha.History.backup();
	// 		KarmaFieldsAlpha.History.lastField = this;
	// 		KarmaFieldsAlpha.History.lastType = null;
	// 	}
	//
	// 	for (let field of fields) {
	// 		await field.setValue(null, this.constructor.state ? field.true() : field.false());
	// 	}
	//
	// 	await this.edit();
	//
	// 	if (this.resource.submit === "auto") {
	// 		await this.submit();
	// 	}
	//
	// }


	// build() {
	//
	// 	return {
	// 		tag: this.resource.tag || "div",
	// 		class: "checkbox-container",
	// 		children: [
	// 			{
	// 				tag: "input",
	// 				init: checkbox => {
	// 					checkbox.element.type = "checkbox";
	// 					checkbox.element.id = this.getId();
	// 				},
	// 				update: async checkbox => {
	// 					this.render = checkbox.render;
	// 					checkbox.element.classList.add("loading");
	// 					const value = await this.fetchValue();
	//
	//
	// 					checkbox.element.onmousemove = async event => {
	// 						if (this.constructor.mousedown && !this.constructor.selected.includes(this)) {
	// 							checkbox.element.checked = this.constructor.state;
	// 							this.constructor.selected.push(this);
	// 						}
	// 					}
	//
	// 					checkbox.element.onmouseup = async event => {
	// 						event.preventDefault();
	// 					}
	// 					checkbox.element.onclick = async event => {
	// 						event.preventDefault();
	// 					}
	//
	// 					checkbox.element.onmousedown = async event => {
	//
	// 						checkbox.element.checked = !checkbox.element.checked;
	//
	// 						this.constructor.mousedown = true;
	// 						this.constructor.state = checkbox.element.checked ? true : false;
	// 						this.constructor.selected = [this];
	//
	//
	//
	// 						let mouseup = async event => {
	//
	// 							window.removeEventListener("mouseup", mouseup);
	//
	// 							event.preventDefault();
	// 							this.constructor.mousedown = false;
	//
	// 							for (let field of this.constructor.selected) {
	// 								field.write();
	// 							}
	//
	// 							KarmaFieldsAlpha.History.backup();
	//
	// 							for (let field of this.constructor.selected) {
	// 								await field.setValue(this.constructor.state ? this.true() : this.false());
	// 							}
	//
	// 							this.constructor.selected = [];
	//
	// 							this.edit();
	//
	// 							if (this.resource.submit === "auto") {
	// 								this.submit();
	// 							}
	//
	// 						}
	//
	// 						window.addEventListener("mouseup", mouseup);
	// 					}
	//
	// 					checkbox.element.checked = value === this.true();
	// 					checkbox.element.classList.remove("loading");
	// 				}
	// 			},
	// 			{
	// 				tag: "label",
	// 				class: "checkbox-text",
	// 				init: label => {
	// 					label.element.innerHTML = this.resource.text || "";
	// 					label.element.htmlFor = this.getId();
	// 				}
	// 			}
	// 		]
	// 	};
	// }



	build() {

		return {
			tag: this.resource.tag || "div",
			class: "checkbox-container",
			update: async container => {
				this.render = container.render;

				container.children = [
					{
						tag: "input",
						init: checkbox => {
							checkbox.element.type = "checkbox";
							checkbox.element.id = this.getId();
						},
						update: async checkbox => {

							const array = await this.fetchValue() || [];
							let value = array.toString();

							if (value !== this.true() && value !== this.false()) {
								value = this.false();
								if (!this.resource.readonly) {
									await this.setValue(null, [value]);
								}
							}


							container.element.onmousemove = async event => {
								if (this.constructor.mousedown && !this.constructor.selected.includes(this)) {
									checkbox.element.checked = this.constructor.state;
									this.constructor.selected.push(this);
								}
							}

							container.element.onmouseup = async event => {
								event.preventDefault();
							}
							container.element.onclick = async event => {
								event.preventDefault();
							}

							container.element.onmousedown = async event => {

								checkbox.element.checked = !checkbox.element.checked;

								this.constructor.mousedown = true;
								this.constructor.state = checkbox.element.checked ? true : false;
								this.constructor.selected = [this];

								let mouseup = async event => {

									window.removeEventListener("mouseup", mouseup);

									event.preventDefault();
									this.constructor.mousedown = false;

									// await this.input(this.constructor.selected);

									this.setMultipleFields(this.constructor.state, this.constructor.selected);


									// for (let field of this.constructor.selected) {
									// 	await field.write();
									// }
									//
									// if (KarmaFieldsAlpha.History.lastField !== this) {
									// 	KarmaFieldsAlpha.History.backup();
									// 	KarmaFieldsAlpha.History.lastField = this;
									// }
									//
									// if (this.resource.autosave) {
									// 	const delta = {};
									// 	const form = this.getForm();
									// 	const driver = form.resource.driver || form.resource.key;
									//
									// 	for (let field of this.constructor.selected) {
									// 		const value = this.constructor.state ? [field.true()] : [field.false()];
									// 		const path = field.getPath();
									// 		KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
									// 		form.buffer.set(value, ...path);
									// 		form.writeHistory(value, ...path);
									// 	}
									//
									// 	await KarmaFieldsAlpha.Gateway.update(driver, delta);
									//
									// } else {
									// 	for (let field of this.constructor.selected) {
									// 		await field.setValue(null, this.constructor.state ? [field.true()] : [field.false()]);
									// 	}
									// }



									// await this.edit();
									//
									// if (this.resource.submit === "auto" || this.resource.autosubmit) {
									// 	await this.submit();
									// }

									this.constructor.selected = [];

								}

								window.addEventListener("mouseup", mouseup);
							}

							checkbox.element.checked = value === this.true();
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
