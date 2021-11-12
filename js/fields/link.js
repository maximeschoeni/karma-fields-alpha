// KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.container {
//
// 	initField() {
//     this.link = this.createChild({
// 			type: "field",
//       ...this.resource.link
//     });
// 		this.text = this.createChild({
// 			type: "text",
//       ...this.resource.text
//     });
//
// 		if (this.resource.key) {
// 			console.warn("Links should not have a key");
// 		}
//   }
//
// 	exportValue(singleCol) {
// 		return this.text.exportValue(singleCol);
// 	}
//
//
//
// 	build() {
// 		return {
// 			tag: "a",
// 			class: "link karma-field",
// 			init: a => {
// 				a.element.setAttribute('tabindex', '-1');
// 				if (this.resource.a) {
// 					Object.assign(a.element, this.resource.a);
// 				}
//
// 				a.element.draggable = false;
// 			},
// 			update: async a => {
// 				a.element.classList.add("loading");
//
// 				// const link = await this.link.fetchValue();
// 				//
// 				// const key = this.resource.link && this.resource.link.key || this.resource.key;
//
//
// 				let value = this.link.resource.value || await this.link.fetchValue();
//
// 				if (this.link.resource.href) {
// 					a.element.href = this.link.resource.href.replace("%value%", value);
// 					if (this.link.resource.target) {
// 						a.element.target = this.link.resource.target;
// 					}
// 				} else {
//
//
//
// 					// a.element.href = "#"+params.toString();
//
//
// 					a.element.onclick = async event => {
// 						event.preventDefault();
//
// 						// let params = KarmaFieldsAlpha.History.getParamsObject();
// 						// params.set(this.resource.link.key, link);
// 						//
// 						// if (this.resource.params) {
// 						// 	for (key in this.resource.params) {
// 						// 		params.set(key, this.resource.params[key]);
// 						// 	}
// 						// }
// 						//
// 						// a.element.classList.add("editing");
// 						//
// 						// KarmaFieldsAlpha.History.backup();
// 						// KarmaFieldsAlpha.History.setParamsObject(params);
//
// 						KarmaFieldsAlpha.History.backup();
// 						if (this.link.resource.key) {
// 							KarmaFieldsAlpha.History.setParam(this.link.resource.key, value);
// 						}
// 						if (this.link.resource.params) {
// 							KarmaFieldsAlpha.History.setParams(this.link.resource.params);
// 						}
//
// 						a.element.classList.add("editing");
//
// 						await this.editParam(true);
//
// 						a.element.classList.remove("editing");
// 					}
// 				}
//
// 				a.child = this.text.build();
//
//
// 			},
// 			complete: a => {
// 				a.element.classList.remove("loading");
// 			}
// 		};
// 	}
//
// }
//



KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.text {

	initField() {

		// -> compat
		if (this.resource.link) {
			console.warn("DEPRECATED link attribute!");

			const params = this.resource.link.params || {};
			if (this.resource.link.key) {
				params[this.resource.link.key] = "%"+this.resource.link.key+"%";
			}
			if (this.resource.link.href) {
				this.resource.href = this.resource.link.href.replace("%value%", "%"+this.resource.link.key+"%");
			} else {
				this.resource.href = "#";
				for (let key in params) {
					this.resource.href += key+"="+params[key];
				}
			}
			if (this.resource.link.target) {
				this.resource.a = this.resource.a || {};
				this.resource.a.target = this.resource.link.target;
			}
		}
		if (this.resource.text) {
			console.warn("DEPRECATED text attribute!");

			if (this.resource.text.key && this.resource.text.driver) {
				this.resource.value = "%"+this.resource.text.key+":"+this.resource.text.driver+"%";
			} else if (this.resource.text.key) {
				this.resource.value = "%"+this.resource.text.key+"%";
			}
		}


		if (!this.resource.href) {
			console.error("Resource missing href attribute");
		}

		super.initField();

	}

	// buildLink(text, link) {
	// 	return {
	// 		tag: "a",
	// 		init: a => {
	// 			if (this.resource.a) {
	// 				Object.assign(a.element, this.resource.a);
	// 			}
	// 		},
	// 		update: async a => {
	// 			a.element.innerHTML = text;
	// 			a.element.href = link;
	// 		}
	// 	};
	// }

	build() {
		return {
			class: "text karma-field",
			init: span => {
				span.element.setAttribute('tabindex', '-1');
			},
			update: async node => {
				this.render = node.render;
				node.element.classList.add("loading");

				const texts = await this.getTexts(this.resource.value);
				const links = await this.getTexts(this.resource.href);

				node.children = texts.map((text, index) => {
					return {
						tag: "a",
						init: a => {
							if (this.resource.a) {
								Object.assign(a.element, this.resource.a);
							}
						},
						update: async a => {
							a.element.innerHTML = text;
							a.element.href = links[index];
						}
					};
				});

				// if (this.resource.key && this.resource.multiple) {
				//
				// 	const values = await this.fetchValue();
				// 	const texts = await Promise.all(values.map(value => this.parseText(this.resource.value, "value", value)));
				// 	const links = await Promise.all(values.map(value => this.parseText(this.resource.href, "value", value)));
				// 	node.children = texts.map((text, index) => this.buildLink(text, links[index]));
				//
				// } else {
				//
				// 	const text = await this.parseText(this.resource.value, this.resource.key);
				// 	const link = await this.parseText(this.resource.href, this.resource.key);
				// 	node.children = [this.buildText(text, link)];
				//
				// }

				node.element.classList.remove("loading");
			}
		};
	}


}
