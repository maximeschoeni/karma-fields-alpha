KarmaFieldsAlpha.fields.dropdown = class extends KarmaFieldsAlpha.fields.field {

	constructor(resource, domain) {
		super(resource, domain);

		this.loading = 0;

		if (this.resource.driver) {
			const driver = this.resource.driver;
			this.events.fetch = function(field, params) {
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


	getOptions() {

		let items = super.getOptions();

		if (this.resource.novalue !== undefined) {

			let emptyItem = {
				key: this.parse(""),
				name: this.resource.novalue === true && "-" || this.resource.novalue
			}

			items = [emptyItem].concat(items);

		}

		return items;
	}

	hasOptgroups() {
		return super.getOptions().some(function(item) {
			return item.group;
		});
	}

	getOptgroups() {

		let items = super.getOptions(); // do we need default??

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
			class: "karma-field-dropdown",
			init: function(container) {
				field.events.set = function() {
					container.render();
				}
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}

				if (!field.hasValue()) {
					field.loading++;
					field.fetchValue().then(function(value) {
						field.loading--;
						container.render();
					});
					container.render();
				}

				if (!field.hasOptions()) {
					field.loading++;
					field.fetchOptions({key: field.resource.key, ...field.resource.args}).then(function(value) {
						field.loading--;
						container.render();
					});
					container.render();
				}

				// let promise = field.trigger("init");
				//
				// if (promise) {
				// 	field.loading++;
				// 	promise.then(function(value) {
				//
				// 		field.loading--;
				// 		field.setValue(value, "set");
				// 		container.render();
				// 	});
				// 	container.render();
				// }

				// field.data.fetch().then(function(items) {
				// 	container.render();
				// });
			},
			update: function(container) {
				this.children = [
					{
						tag: "label",
						init: function(label) {
							if (field.resource.label) {
								this.element.htmlFor = field.getId();
								this.element.textContent = field.resource.label;
							}
						}
					},
					{
						tag: "select",
						class: "dropdown",
						init: function(dropdown) {
							if (field.resource.label) {
								this.element.id = field.getId();
							}
							this.element.onchange = function() {
								let promise = field.setValue(this.value, "change");
								if (promise) {
									field.loading++;
									promise.then(function() {
										field.loading--;
										container.render();
									});
									container.render();
								}
							}
							this.render = undefined;
							// console.log("init", field.resource.key);
						},
						update: function(dropdown) {

							this.element.classList.toggle("loading", field.loading > 0);
							this.element.classList.toggle("modified", field.isModified());




							// if (field.data.rendered) {
							// 	this.element.value = field.getValue();
							// 	this.render = null;
							// 	return;
							// }

							const value = field.getValue();

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
														this.element.textContent = option.name;
														this.element.value = option.key;
														this.element.selected = value == option.key;
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
											this.element.textContent = option.name;
											this.element.value = option.key;
											this.element.selected = value == option.key;
										}
									};
								});

								// field.data.rendered = true;

							}

						}
					},
					{
						class: "karma-field-spinner"
					}
				];
			}
		};
	}

}



//
// KarmaFieldsAlpha.fields.dropdown.create = function(resource) {
// 	const field = KarmaFieldsAlpha.Field(resource);
//
// 	if (!resource.value && resource.options && resource.options.length) {
// 		field.value = resource.default_option && resource.default_option.key || resource.options[0].key;
// 	}
//
// 	field.data.parseOptions = function(items) {
//
// 		if (field.resource.novalue !== undefined) {
//
// 			let emptyItem = {}
//
// 			switch (field.resource.datatype) {
//
// 				case "boolean":
// 					emptyItem.key = "false";
// 					break;
//
// 				case "number":
// 					emptyItem.key = 0;
// 					break;
//
// 				default:
// 					emptyItem.key = "";
// 					break;
//
// 			}
//
// 			if (field.resource.novalue === true) {
//
// 				emptyItem.name = "-";
//
// 			} else {
//
// 				emptyItem.name = field.resource.novalue;
//
// 			}
//
// 			items = [emptyItem].concat(items);
//
// 			if (items.some(function(item) {
// 				return item.group;
// 			})) {
//
// 				field.data.optgroups = items.reduce(function(obj, item) {
// 					let group = obj.find(function(group) {
// 						return group.name === (item.group || "default");
// 					});
// 					if (!group) {
// 						group = {
// 							name: item.group || "default",
// 							children: []
// 						};
// 						obj.push(group);
// 					}
// 					group.children.push(item);
// 					return obj;
// 				}, []);
//
// 			} else {
//
// 				field.data.options = items
//
// 			}
//
// 		}
//
// 		if (items.length && !items.some(function(item) {
// 			return item.key == field.value;
// 		})) {
// 			value = items[0].key;
// 			field.setValue(value, "change");
// 		}
//
// 		return items;
// 	}
//
// 	field.data.fetch = function() {
//
// 		if (field.resource.options) {
//
// 			return Promise.resolve(field.data.parseOptions(field.resource.options));
//
// 		} else {
//
// 			field.loading++;
//
// 			return field.fetch().then(function(results) {
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
// 	return field;
// }
//
//
//
// KarmaFieldsAlpha.fields.dropdown.build = function(field) {
// 	return {
// 		class: "",
// 		init: function(container) {
// 			field.events.render = function() {
// 				container.render();
// 			}
// 			if (field.resource.style) {
// 				this.element.style = field.resource.style;
// 			}
//
// 			let promise = field.init();
//
// 			if (promise) {
// 				field.loading++;
// 				promise.then(function() {
// 					field.loading--;
// 					container.render();
// 				});
// 				container.render();
// 			}
//
// 			field.data.fetch().then(function(items) {
// 				container.render();
// 			});
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
// 					tag: "select",
// 					class: "dropdown",
// 					init: function(dropdown) {
// 						if (field.resource.label) {
// 							this.element.id = field.getId();
// 						}
// 						this.element.onchange = function() {
// 							let promise = field.setValue(this.value, "change");
// 							if (promise) {
// 								field.loading++;
// 								promise.then(function() {
// 									field.loading--;
// 									container.render();
// 								});
// 								container.render();
// 							}
// 						}
// 					},
// 					update: function(dropdown) {
//
// 						this.element.classList.toggle("loading", field.loading > 0);
// 						this.element.classList.toggle("modified", field.isModified());
//
// 						if (field.data.optgroups) {
//
// 							dropdown.children = field.data.optgroups.map(function(optgroup) {
// 								return {
// 									tag: "optgroup",
// 									update: function() {
// 										this.element.label = optgroup.name;
// 										this.children = optgroup.children.map(function(option) {
// 											return {
// 												tag: "option",
// 												update: function() {
// 													this.element.textContent = option.name;
// 													this.element.value = option.key;
// 													this.element.selected = field.value == option.key;
// 												}
// 											};
// 										})
// 									}
// 								};
// 							});
//
// 						} else if (field.data.options) {
//
// 							dropdown.children = items.map(function(option) {
// 								return {
// 									tag: "option",
// 									update: function() {
// 										this.element.textContent = option.name;
// 										this.element.value = option.key;
// 										this.element.selected = field.value == option.key;
// 									}
// 								};
// 							});
//
// 						}
// 					}
// 				},
// 				{
// 					class: "karma-field-spinner"
// 				}
// 			];
// 		}
// 	};
// }



// KarmaFieldsAlpha.fields.dropdown = {};
//
// KarmaFieldsAlpha.fields.dropdown.create = function(resource) {
// 	const field = KarmaFieldsAlpha.Field(resource);
//
// 	if (!resource.value && resource.options && resource.options.length) {
// 		field.value = resource.default_option && resource.default_option.key || resource.options[0].key;
// 	}
//
// 	field.data.parseOptions = function(items) {
//
// 		if (field.resource.novalue !== undefined) {
//
// 			let emptyItem = {}
//
// 			switch (field.resource.datatype) {
//
// 				case "boolean":
// 					emptyItem.key = "false";
// 					break;
//
// 				case "number":
// 					emptyItem.key = 0;
// 					break;
//
// 				default:
// 					emptyItem.key = "";
// 					break;
//
// 			}
//
// 			if (field.resource.novalue === true) {
//
// 				emptyItem.name = "-";
//
// 			} else {
//
// 				emptyItem.name = field.resource.novalue;
//
// 			}
//
// 			items = [emptyItem].concat(items);
//
// 			if (items.some(function(item) {
// 				return item.group;
// 			})) {
//
// 				field.data.optgroups = items.reduce(function(obj, item) {
// 					let group = obj.find(function(group) {
// 						return group.name === (item.group || "default");
// 					});
// 					if (!group) {
// 						group = {
// 							name: item.group || "default",
// 							children: []
// 						};
// 						obj.push(group);
// 					}
// 					group.children.push(item);
// 					return obj;
// 				}, []);
//
// 			} else {
//
// 				field.data.options = items
//
// 			}
//
// 		}
//
// 		if (items.length && !items.some(function(item) {
// 			return item.key == field.value;
// 		})) {
// 			value = items[0].key;
// 			field.setValue(value, "change");
// 		}
//
// 		return items;
// 	}
//
// 	field.data.fetch = function() {
//
// 		if (field.resource.options) {
//
// 			return Promise.resolve(field.data.parseOptions(field.resource.options));
//
// 		} else {
//
// 			field.loading++;
//
// 			return field.fetch().then(function(results) {
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
// 	return field;
// }
//
//
//
// KarmaFieldsAlpha.fields.dropdown.build = function(field) {
// 	return {
// 		class: "",
// 		init: function(container) {
// 			field.events.render = function() {
// 				container.render();
// 			}
// 			if (field.resource.style) {
// 				this.element.style = field.resource.style;
// 			}
//
// 			let promise = field.init();
//
// 			if (promise) {
// 				field.loading++;
// 				promise.then(function() {
// 					field.loading--;
// 					container.render();
// 				});
// 				container.render();
// 			}
//
// 			field.data.fetch().then(function(items) {
// 				container.render();
// 			});
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
// 					tag: "select",
// 					class: "dropdown",
// 					init: function(dropdown) {
// 						if (field.resource.label) {
// 							this.element.id = field.getId();
// 						}
// 						this.element.onchange = function() {
// 							let promise = field.setValue(this.value, "change");
// 							if (promise) {
// 								field.loading++;
// 								promise.then(function() {
// 									field.loading--;
// 									container.render();
// 								});
// 								container.render();
// 							}
// 						}
// 					},
// 					update: function(dropdown) {
//
// 						this.element.classList.toggle("loading", field.loading > 0);
// 						this.element.classList.toggle("modified", field.isModified());
//
// 						if (field.data.optgroups) {
//
// 							dropdown.children = field.data.optgroups.map(function(optgroup) {
// 								return {
// 									tag: "optgroup",
// 									update: function() {
// 										this.element.label = optgroup.name;
// 										this.children = optgroup.children.map(function(option) {
// 											return {
// 												tag: "option",
// 												update: function() {
// 													this.element.textContent = option.name;
// 													this.element.value = option.key;
// 													this.element.selected = field.value == option.key;
// 												}
// 											};
// 										})
// 									}
// 								};
// 							});
//
// 						} else if (field.data.options) {
//
// 							dropdown.children = items.map(function(option) {
// 								return {
// 									tag: "option",
// 									update: function() {
// 										this.element.textContent = option.name;
// 										this.element.value = option.key;
// 										this.element.selected = field.value == option.key;
// 									}
// 								};
// 							});
//
// 						}
// 					}
// 				},
// 				{
// 					class: "karma-field-spinner"
// 				}
// 			];
// 		}
// 	};
// }


//
// KarmaFieldsAlpha.fields.dropdown.build = function(field) {
//
//
// 	return {
// 		tag: "select",
// 		class: "dropdown",
// 		init: function(dropdown) {
// 			this.element.id = field.getId();
//
// 			this.element.onchange = function() {
//
// 				let promise = field.setValue(this.value, "change");
//
// 				if (promise) {
// 					dropdown.element.classList.add("loading");
// 					promise.then(function() {
// 						dropdown.element.classList.remove("loading");
// 					});
// 				} else {
// 					dropdown.element.classList.toggle("modified", field.isModified());
// 				}
//
// 			}
// 			field.events.update = function() {
// 				input.element.classList.toggle("loading", field.loading > 0);
// 				input.element.classList.toggle("modified", field.isModified());
// 			}
// 		},
// 		update: function(dropdown) {
//
//
// 			field.data.fetch().then(function(items) {
//
// 				let hasOptgroups = items.some(function(item) {
// 					return item.group;
// 				});
//
// 				if (hasOptgroups) {
//
// 					let optgroups = items.reduce(function(obj, item) {
// 						let group = obj.find(function(group) {
// 							return group.name === (item.group || "default");
// 						});
// 						if (!group) {
// 							group = {
// 								name: item.group || "default",
// 								children: []
// 							};
// 							obj.push(group);
// 						}
// 						group.children.push(item);
// 						return obj;
// 					}, []);
//
// 					dropdown.children = optgroups.map(function(optgroup) {
// 						return {
// 							tag: "optgroup",
// 							update: function() {
// 								this.element.label = optgroup.name;
// 								this.children = optgroup.children.map(function(option) {
// 									return {
// 										tag: "option",
// 										update: function() {
// 											this.element.textContent = option.name;
// 											this.element.value = option.key;
// 											this.element.selected = field.value == option.key;
// 										}
// 									};
// 								})
// 							}
// 						};
// 					});
//
// 				} else {
//
// 					dropdown.children = items.map(function(option) {
// 						return {
// 							tag: "option",
// 							update: function() {
// 								this.element.textContent = option.name;
// 								this.element.value = option.key;
// 								this.element.selected = field.value == option.key;
// 							}
// 						};
// 					});
//
// 				}
//
// 				dropdown.render();
//
// 				field.triggerEvent("update");
//
// 			});
//
// 			field.triggerEvent("update");
//
// 		}
// 	};
// }
