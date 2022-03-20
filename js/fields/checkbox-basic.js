
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
		return this.resource.default || this.false();
	}

	// async saveFields(fields) {
	//
	// 	let delta = {};
	//
	// 	for (let field of fields) {
	// 		const path = field.getPath();
	// 		const value = this.buffer.get(...path);
	// 		KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
	// 		this.buffer.remove(...path);
	// 	}
	//
	// 	this.save(delta);
	//
	// }

	// getEmpty() {
	// 	return this.false();
	// }

	async setMultipleFields(checked, fields) {

		for (let field of fields) {
			await field.write();
		}

		this.nextup();

		// for (let field of fields) {
		// 	const value = checked ? field.true() : field.false();
		// 	await field.setValue(null, [value]);
		// }
		//
		// if (this.resource.autosave) {
		// 	// await this.saveField(...fields);
		// 	const delta = {};
		//
		// 	for (let field of fields) {
		// 		KarmaFieldsAlpha.DeepObject.assign(delta, field.getValue(), ...field.getPath());
		// 		field.removeValue();
		// 	}
		//
		// 	this.save(delta);
		// }

		// if (this.resource.autosave || this.resource.context === "submit") {
		// 	// await this.saveField(...fields);
		// 	const delta = {};
		//
		// 	for (let field of fields) {
		// 		KarmaFieldsAlpha.DeepObject.assign(delta, await field.getValue(), ...field.getPath());
		// 	}
		//
		// 	this.getForm().set(delta, "submit");
		//
		// } else {
		//
		// 	for (let field of fields) {
		// 		const value = checked ? field.true() : field.false();
		// 		await field.setValue([value]);
		// 	}
		//
		// }

		// const form = this.resource.autosave && this.getGateway() || this.getRelativeParent();
		const form = this.getForm();

		if (form) {

			if (this.resource.autosave) {

				const delta = {};

				for (let field of fields) {

					KarmaFieldsAlpha.DeepObject.assign(delta, checked ? field.true() : field.false(), ...field.getPath(), 0);

				}

				form.setState(delta, "submit");

			} else {

				for (let field of fields) {

					form.set(checked ? field.true() : field.false(), ...field.getPath(), 0);

				}

			}

		}
		// else {
		//
		// 	for (let field of fields) {
		// 		const value = checked ? field.true() : field.false();
		// 		await field.setValue([value]);
		// 	}
		//
		// }






		// await this.edit();

		// if (this.resource.submit === "auto" || this.resource.autosubmit) {
		// 	await this.submit();
		// }

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

							let value = await this.get(0);

							if (value !== this.true() && value !== this.false()) {
								value = this.false();
								if (!this.resource.readonly) {
									await this.set(value, 0);
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

									// debugger;

									window.removeEventListener("mouseup", mouseup);

									event.preventDefault();
									this.constructor.mousedown = false;

									this.setMultipleFields(this.constructor.state, this.constructor.selected);

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
