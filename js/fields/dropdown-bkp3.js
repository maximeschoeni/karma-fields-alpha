KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.field {

	constructor(resource, domain) {
		super(resource, domain);

		// this.loading = 0;

		if (this.resource.driver) {
			const driver = this.resource.driver;
			this.events.fetch = function(field, params) {

				// params = this.triggerUp("optionparams", params) || params;
				Object.assign(params, this.triggerUp("optionparams"));
				return field.queryOptions(driver, params);
			};
		}

	}

	// getModifiedValue() {
	// 	let value = super.getModifiedValue();
	// 	const options = this.getOptions();
	// 	if (value === undefined && options.length) {
	// 		value = this.parse(options[0].key);
	// 	}
	// 	return value;
  // }
	//
	// getValue() {
	// 	let value = super.getValue();
	// 	const options = this.getOptions();
	// 	if (value === undefined && options.length) {
	// 		value = this.parse(options[0].key);
	// 	}
  //   return value;
  // }

	// fetch() {
	// 	const field = this;
	//
	// 	if (this.resource.options) {
	//
	// 		this.data.parseOptions(this.resource.options);
	//
	// 		// return Promise.resolve();
	//
	// 	// } else if (this.resource.driver) {
	// 	//
	// 	// 	// this.findAncestor(function(ancestor) {
	// 	// 	// 	return ancestor.resource.driver;
	// 	// 	// });
	// 	//
	// 	//
	// 	//
	// 	// 	let params = {
	// 	// 		key: this.resource.key,
	// 	// 		...this.resource.params
	// 	// 	}
	// 	//
	// 	// 	this.loading++;
	// 	//
	// 	// 	return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", params).then(function(results) {
	// 	//
	// 	// 		field.loading--;
	// 	//
	// 	// 		return field.data.parseOptions(results.items || results || []);
	// 	// 	});
	//
	// 	} else {
	//
	// 		const promise = this.triggerEvent("fetch");
	//
	// 		if (promise) {
	//
	// 			this.loading++;
	//
	// 			return promise.then(function(results) {
	//
	// 				field.loading--;
	//
	// 				return field.data.parseOptions(results.items || results || []);
	//
	// 			});
	//
	// 		}
	//
	// 	}
	//
	// }
	//

	exportValue() {
		const options = this.getOptions();
		const value = this.getValue().toString();
		const option = options.find(function(option) {
			return option.key === value;
		});
		if (option) {
			return option.name;
		}
  }

  importValue(value, context) {
		const options = this.getOptions();
		const option = options.find(function(option) {
			return option.name === value;
		});
		if (option) {
			this.setValue(option.key, context);
		}
  }



	getDefault() {
		const options = this.getOptions();

		return this.resource.default || (options.length && options[0].key) || this.getEmpty();
	}

	findOption(value) {
		return super.getOptions().find(function(item) {
			return item.key === value;
		});
	}



	getOptions() {

		let items = super.getOptions();

		items.forEach(function(option) {
      option.key = this.convert(option.key, "string", this.resource.datatype || this.datatype);
    }, this);

		if (this.resource.novalue !== undefined) {

			let emptyItem = {
				key: this.getEmpty(this.resource.datatype),
				name: this.resource.novalue === true && "-" || this.resource.novalue
			}

			items = [emptyItem].concat(items);

		}

		return items;
	}

	hasOptgroups() {
		return this.getOptions().some(function(item) {
			return item.group;
		});
	}

	getOptgroups() {

		let items = this.getOptions();

		return items.reduce(function(obj, item) {
			let group = obj.find(function(group) {
				return group.name === (item.group || "default");
			});
			if (!group) {
				group = {
					name: item.group || "default",
					children: []
				};
				obj.push(group);
			}
			group.children.push(item);
			return obj;
		}, []);
	}

	build() {
		const field = this;

		return {
			tag: "select",
			class: "dropdown karma-field",
			init: function(dropdown) {
				if (field.resource.label) {
					this.element.id = field.getId();
				}


				let promise;
				if (!field.hasValue()) {
					// field.startLoad();
					promise = field.fetchValue().then(function(value) {
						// field.endLoad();


						field.triggerEvent("set");
						// field.triggerEvent("modify");
					});
				}

				field.init(this.element);

				// this.render = undefined;
				// console.log("init", field.resource.key);
			},
			update: function(dropdown) {



				dropdown.children = null;

				// console.log(dropdown.element, field.hasOptions());

				if (!field.hasOptions() || !dropdown.element.firstChild) {
					field.fetchOptions({key: field.resource.key, ...field.resource.args}).then(function(options) {



						if (field.hasOptgroups()) {

							dropdown.children = field.getOptgroups().map(function(optgroup) {
								return {
									tag: "optgroup",
									update: function() {
										this.element.label = optgroup.name;
										this.children = optgroup.children.map(function(option) {
											return {
												tag: "option",
												update: function() {
													if (option.count && field.resource.count) {
														this.element.textContent = option.name + " ("+option.count+")";
													} else {
														this.element.textContent = option.name;
													}
													// this.element.innerHTML = option.name;
													this.element.value = option.key;
													// this.element.selected = value == option.key;
												}
											};
										})
									}
								};
							});

						} else if (field.hasOptions()) {

							dropdown.children = field.getOptions().map(function(option) {
								return {
									tag: "option",
									update: function() {
										if (option.count && field.resource.count) {
											this.element.textContent = option.name + " ("+option.count+")";
										} else {
											this.element.textContent = option.name;
										}
										this.element.value = option.key;
										// this.element.selected = value == option.key;
									}
								};
							});

						}

						dropdown.render(true); // -> use true if there is change optGroups/no more optGroups

						field.triggerEvent("set");
						// dropdown.element.value = field.getValue();
					});

				}

				this.element.onchange = function() {
					field.triggerEvent("history", true);
					field.setValue(this.value);


					// dropdown.element.classList.toggle("loading", field.loading > 0);


					let promise = field.triggerEvent("change", true);
					if (promise) {
						field.startLoad();
						promise.then(function() {
							field.endLoad();
							// field.triggerEvent("modify");
						});
					}
				}

				field.events.modify = function() {
					dropdown.element.classList.toggle("modified", field.isModified());
				}
				field.events.load = function() {

					dropdown.element.classList.toggle("loading", field.loading > 0);
				}
				field.events.set = function() {
					const value = field.getValue();
					// if (field.findOption(value)) {
					// 	dropdown.element.value = field.getValue();
					// }
				}

				field.triggerEvent("load");



				field.triggerEvent("set");
				field.triggerEvent("modify");

			}
		};
	}

	// build() {
	// 	const field = this;
	//
	// 	return {
	// 		class: "karma-field-dropdown",
	// 		init: function(container) {
	// 			field.events.set = function() {
	// 				container.render();
	// 			}
	// 			if (field.resource.style) {
	// 				this.element.style = field.resource.style;
	// 			}
	//
	// 			// if (!field.hasValue()) {
	// 			// 	field.loading++;
	// 			// 	field.fetchValue().then(function(value) {
	// 			// 		field.loading--;
	// 			// 		container.render();
	// 			// 	});
	// 			// 	container.render();
	// 			// }
	//
	// 		},
	// 		update: function(container) {
	// 			this.children = [
	// 				{
	// 					tag: "label",
	// 					init: function(label) {
	// 						if (field.resource.label) {
	// 							this.element.htmlFor = field.getId();
	// 							this.element.textContent = field.resource.label;
	// 						}
	// 					}
	// 				},
	// 				{
	// 					class: "karma-field-item",
	// 					children: [
	// 						{
	// 							tag: "select",
	// 							class: "dropdown",
	// 							init: function(dropdown) {
	// 								if (field.resource.label) {
	// 									this.element.id = field.getId();
	// 								}
	//
	// 								let promise;
	// 								if (!field.hasValue()) {
	// 									field.startLoad();
	// 									promise = field.fetchValue().then(function(value) {
	// 										field.endLoad();
	// 										// dropdown.element.value = value;
	// 										field.triggerEvent("set");
	// 										field.triggerEvent("modify");
	// 										// container.render();
	// 									});
	// 									// container.render();
	// 								}
	//
	// 								if (!field.hasOptions()) {
	// 									field.startLoad();
	// 									Promise.resolve(promise).then(function() {
	// 										return field.fetchOptions({key: field.resource.key, ...field.resource.args});
	// 									}).then(function(options) {
	// 									// field.fetchOptions({key: field.resource.key, ...field.resource.args}).then(function(options) {
	// 										field.endLoad();
	//
	// 										const value = field.getValue();
	//
	// 										if (field.hasOptgroups()) {
	//
	// 											dropdown.children = field.getOptgroups().map(function(optgroup) {
	// 												return {
	// 													tag: "optgroup",
	// 													update: function() {
	// 														this.element.label = optgroup.name;
	// 														this.children = optgroup.children.map(function(option) {
	// 															return {
	// 																tag: "option",
	// 																update: function() {
	// 																	this.element.innerHTML = option.name;
	// 																	this.element.value = option.key;
	// 																	this.element.selected = value == option.key;
	// 																}
	// 															};
	// 														})
	// 													}
	// 												};
	// 											});
	//
	// 										} else if (field.hasOptions()) {
	//
	// 											dropdown.children = field.getOptions().map(function(option) {
	// 												return {
	// 													tag: "option",
	// 													update: function() {
	// 														this.element.innerHTML = option.name;
	// 														this.element.value = option.key;
	// 														this.element.selected = value == option.key;
	// 													}
	// 												};
	// 											});
	//
	// 											// field.data.rendered = true;
	//
	// 										}
	//
	// 										// dropdown.render();
	// 										dropdown.render();
	//
	//
	// 									});
	// 									// container.render();
	// 								}
	//
	//
	// 								// this.render = undefined;
	// 								// console.log("init", field.resource.key);
	// 							},
	// 							update: function(dropdown) {
	//
	// 								// this.element.classList.toggle("loading", field.loading > 0);
	// 								// this.element.classList.toggle("modified", field.isModified());
	//
	// 								this.element.onchange = function() {
	// 									field.triggerEvent("history");
	// 									field.setValue(this.value);
	// 									let promise = field.triggerEvent("change", true);
	// 									if (promise) {
	// 										field.startLoad();
	// 										promise.then(function() {
	// 											field.endLoad();
	// 											field.triggerEvent("modify");
	// 										});
	// 									}
	// 								}
	//
	// 								field.events.modify = function() {
	// 									dropdown.element.classList.toggle("modified", field.isModified());
	// 								}
	// 								field.events.load = function() {
	// 									dropdown.element.classList.toggle("loading", field.loading > 0);
	// 								}
	// 								field.events.set = function() {
	// 									dropdown.element.value = field.getValue();
	// 								}
	//
	// 								// if (field.hasValue()) {
	// 								// 	this.element.value = field.getValue();
	// 								// }
	// 								field.triggerEvent("load");
	// 								field.triggerEvent("set");
	// 								field.triggerEvent("modify");
	//
	//
	// 								dropdown.skipRender = true;
	//
	//
	//
	//
	// 								// if (field.data.rendered) {
	// 								// 	this.element.value = field.getValue();
	// 								// 	this.render = null;
	// 								// 	return;
	// 								// }
	//
	// 								// const value = field.getValue();
	// 								//
	// 								// if (field.hasOptgroups()) {
	// 								//
	// 								// 	dropdown.children = field.getOptgroups().map(function(optgroup) {
	// 								// 		return {
	// 								// 			tag: "optgroup",
	// 								// 			update: function() {
	// 								// 				this.element.label = optgroup.name;
	// 								// 				this.children = optgroup.children.map(function(option) {
	// 								// 					return {
	// 								// 						tag: "option",
	// 								// 						update: function() {
	// 								// 							this.element.textContent = option.name;
	// 								// 							this.element.value = option.key;
	// 								// 							this.element.selected = value == option.key;
	// 								// 						}
	// 								// 					};
	// 								// 				})
	// 								// 			}
	// 								// 		};
	// 								// 	});
	// 								//
	// 								// } else if (field.hasOptions()) {
	// 								//
	// 								// 	dropdown.children = field.getOptions().map(function(option) {
	// 								// 		return {
	// 								// 			tag: "option",
	// 								// 			update: function() {
	// 								// 				this.element.textContent = option.name;
	// 								// 				this.element.value = option.key;
	// 								// 				this.element.selected = value == option.key;
	// 								// 			}
	// 								// 		};
	// 								// 	});
	// 								//
	// 								// 	// field.data.rendered = true;
	// 								//
	// 								// }
	//
	// 							}
	// 						},
	// 						{
	// 							class: "karma-field-spinner"
	// 						}
	// 					]
	// 				}
	// 			];
	// 		}
	// 	};
	// }

}
