
KarmaFieldsAlpha.fields.checkboxes = class extends KarmaFieldsAlpha.fields.field {

	async getDefault() {
		// const options = await this.fetchOptions(this.resource.driver);
		// if (this.resource.default && options.some(option => option.key === this.resource.default)) {
		// 	return this.resource.default.split(",");
		// }
		// const value = KarmaFieldsAlpha.Nav.getParam(this.resource.key);
		// if (value && options.some(option => option.key === value)) {
		// 	return [value];
		// }
		// return [];

		// return {};
	}

	// async getArray() {
	//
	// 	const event = this.createEvent({
	// 		action: "get",
	// 		type: "array",
	// 		// default: await this.getDefault() // -> dropdown default is async
	// 	});
	//
	// 	await super.dispatch(event);
	//
	// 	return event.getArray();
	// }
	//
	// async setArray(value) {
	//
	// 	const event = this.createEvent({
	// 		action: "set",
	// 		type: "array",
	// 		backup: "once",
	// 		autosave: this.resource.autosave
	// 	});
	//
	// 	event.setValue(value);
	//
	// 	await super.dispatch(event);
	//
	// }

	async dispatch(event) {

		switch (event.action) {

			case "get": {

				const [key] = event.path;

				const set = await super.dispatch({
					action: "get",
					type: "array"
				}).then(request => new Set(KarmaFieldsAlpha.Type.toArray(request.data)));

				event.data = set.has(key);
				break;
			}

			case "set": {
				// const key = event.path[0];
				// if (event.getValue()) {
				// 	await this.add(key);
				// } else {
				// 	await this.remove(key);
				// }
				// break;
				// const key = event.path[0];
				// const array = await this.getArray();
				// if (event.getValue()) {
				// 	array.push(key);
				// } else {
				// 	const index = array.indexOf(key);
				// 	if (index > -1) {
				// 		array.splice(index, 1);
				// 	}
				// }
				// const options = await this.fetchOptions(this.resource.driver);
				// await this.setArray(options.map(option => option.key).filter(key => array.indexOf(key) > -1));
				// break;

				const [key] = event.path;
				// const options = await this.parse(this.resource.options);
				const set = await super.dispatch({
					action: "get",
					type: "array"
				}).then(request => new Set(KarmaFieldsAlpha.Type.toArray(request.data)));

				if (event.data && !set.has(key)) {
					set.add(key);
				} else if (!event.data && set.has(key)) {
					set.delete(key);
				}

				await super.dispatch({
					action: "set",
					data: [...set]
				})

			}

		}

		return event;
	}


	async export() {

		const key = this.getKey();

		const request = await this.dispatch({action: "get"});
    const array = KarmaFieldsAlpha.Type.toArray(request.data);
		const value = array.join(",");
    return {[key]: value};
	}

	async import(object) {

    // -> todo: import from url

		const key = this.getKey();
    const string = KarmaFieldsAlpha.Type.toString(object[key]);
    const array = string.split(",").map(item => item.trim());

		await this.dispatch({
			action: "set",
			data: value
		});
	}

	// async get(key, context) {
	//
	// 	switch (context) {
	//
	// 		case "value":
	// 			if (key) {
	// 				const array = await super.get(this.resource.context || "value") || [];
	// 				return [array.indexOf(key) > -1 ? "1" : ""];
	// 			}
	// 			return super.get(this.resource.context || "value");
	//
	// 		// case "modified":
	// 		// 	return super.get(context);
	//
	// 	}
	//
	// }
	//
	//
	//
	// // async setValue(type, value, key) {
	// // 	if (key) {
	// // 		if (value.toString()) {
	// // 			await this.add(key);
	// // 		} else {
	// // 			await this.remove(key);
	// // 		}
	// // 	} else {
	// // 		await super.setValue(null, value);
	// // 	}
	// // }
	//
	// async set(value, key, context) {
	//
	// 	switch (context) {
	//
	// 		default:
	// 			if (key) {
	// 				if (value[0]) {
	// 					await this.add(key);
	// 				} else {
	// 					await this.remove(key);
	// 				}
	// 			} else {
	// 				await super.set(value, context);
	// 			}
	// 			break;
	//
	// 	}
	//
	// }

	// async add(key) {
	// 	let array = await this.getArray();
	// 	const index = array.indexOf(key);
	// 	if (index === -1) {
	// 		// array.push(key);
	// 		// this.setValue(array);
	// 		// super.setValue(key, array.length.toString()); // -> specific value only
	// 		// this.setValue([...array, key]);
	// 		// array = [...array, key];
	// 		// array.sort();
	// 		// this.setValue(array);
	//
	// 		await this.setArray([...array, key]);
	// 	}
  // }
	//
  // async remove(key) {
	// 	const array = await this.getArray();
	// 	const index = array.indexOf(key);
	// 	if (index > -1) {
	// 		// array.splice(index, 1);
	// 		// this.setValue(array);
	// 		// super.removeValue(index.toString());
	// 		// this.setValue(array.filter(item => item !== key));
	// 		await this.setArray(array.filter(item => item !== key));
	// 	}
  // }
	//
	// async has(key) {
	// 	const array = await this.getArray();
	// 	const index = array.indexOf(key);
	// 	return index > -1;
  // }

	// buildCheckboxList(options) {
	// 	return {
	// 		tag: "ul",
	// 		update: ul => {
	// 			ul.children = options.map((option, index) => {
	// 				return {
	// 					tag: "li",
	// 					children: [
	// 						{
	// 							tag: "input",
	// 							init: input => {
	// 								input.element.type = "checkbox";
	// 								input.element.id = this.getId()+"-"+index;
	// 							},
	// 							update: async input => {
	// 								input.element.checked = await this.has(option.key);
	// 								input.element.onchange = async () => {
	// 									if (input.element.checked) {
	// 										await this.add(option.key);
	// 									} else {
	// 										await this.remove(option.key);
	// 									}
	// 									await this.edit();
	// 								}
	// 							}
	// 						},
	// 						{
	// 							tag: "label",
	// 							init: label => {
	// 								label.element.htmlFor = this.getId()+"-"+index;
	// 							},
	// 							update: label => {
	// 								label.element.innerHTML = option.name;
	// 							}
	// 						}
	// 					]
	// 				}
	// 			});
	// 		}
	// 	};
	// }

	// buildCheckboxList(options) {
	// 	return {
	// 		tag: "ul",
	// 		update: ul => {
	// 			ul.children = options.map((option, index) => {
	// 				let checkboxField = this.getChild(option.key) || this.createChild({
	// 					type: "checkbox",
	// 					key: option.key,
	// 					text: option.name,
	// 					tag: "li"
	// 				});
	// 				return checkboxField.build();
	// 			});
	// 		}
	// 	};
	// }

	build() {
		return {
			class: "karma-field checkboxes",
			update: async dropdown => {
				dropdown.element.classList.add("loading");
				// const options = await this.fetchOptions(this.resource.driver);
				const options = await this.parse(this.resource.options);

				if (!Array.isArray(options)) {
					console.error("options is not an array");
				}

				dropdown.child = {
					tag: "ul",
					update: ul => {
						ul.children = options.map((option, index) => {

							const checkboxField = this.createChild({
								type: "checkbox",
								key: option.id,
								text: option.name,
								tag: "li",
								id: option.id
							});
							return checkboxField.build();
						});
					}
				};
				dropdown.element.classList.remove("loading");
			}
		};
	}
}
