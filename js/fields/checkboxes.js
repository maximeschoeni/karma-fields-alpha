
KarmaFieldsAlpha.fields.checkboxes = class extends KarmaFieldsAlpha.fields.field {


	validate(value) {
    return Promise.resolve(value);
  }

	prepare(value) {
		if (!Array.isArray(value)) {
			return [value]
		} else {
			return value;
		}
	}

	stringify(value) {

		return JSON.stringify(value);
	}

	parse(value) {
		return JSON.parse(value);
	}

	fetch(queryString) {
		if (this.resource.driver) {
			return KarmaFieldsAlpha.Form.fetch2(this.resource.driver, queryString);
		} else {
			return super.fetch(queryString);
		}
  }

	update() {
		const field = this;
		return super.update().then(function(value) {
			if (field.resource.options) {
				let options = field.prepareOptions(field.resource.options);
				field.try("onOptions", options, value, "resource");
				return value;
      } else {
				field.startLoad();
				return field.fetchOptions().then(function(options) {
					options = field.prepareOptions(options);
					let queryString = field.getOptionsParamString();
					field.try("onOptions", options, value, queryString);
					field.endLoad();
					return value;
				});
			}
		});
  }

	add(item, context) {
		const field = this;
		this.getValueAsync().then(function(values) {
			values.push(item);
	    return field.changeValue(values);
		});
  }

  remove(item) {
		const field = this;
		this.getValueAsync().then(function(values) {
			values = values.filter(function(value) {
	      return item !== value;
	    });
	    return field.changeValue(values);
		});
  }

	contains(item) {
		this.getValueAsync().then(function(values) {
			return values.indexOf(item) > -1;
		});
  }

	toggle(item) {
		const field = this;
		this.contains(item).then(function(contain) {
			if (contain) {
				field.remove(item, context);
			} else {
				field.add(item, context);
			}
		});
  }

	buildCheckboxList(options) {
		const field = this;
		return {
			tag: "ul",
			update: function(ul) {
				this.children = options.map(function(option, index) {
					return {
						tag: "li",
						children: [
							{
								tag: "input",
								init: function() {
									this.element.type = "checkbox";
									this.element.id = field.getId()+"-"+index;
								},
								update: function(input) {
									let values = field.getValue();
									this.element.checked = values.indexOf(option.key) > -1;
									this.element.onchange = function() {
										if (this.checked) {
											field.add(option.key);
										} else {
											field.remove(option.key);
										}
									}
								}
							},
							{
								tag: "label",
								init: function() {
									this.element.htmlFor = field.getId()+"-"+index;
								},
								update: function() {
									this.element.innerHTML = option.name;
								}
							}
						]
					}
				});
			}
		};
	}

	build() {
		const field = this;
		return {
			class: "karma-field checkboxes",
			init: function(dropdown) {
				field.init(this.element);
			},
			update: function(dropdown) {
				field.onOptions = function(options, value, queryString) {
					dropdown.child = field.buildCheckboxList(options);
					dropdown.render();
				}
				field.onSet = function(value) {
					dropdown.render();
				}
				field.onLoad = function(loading) {
					dropdown.element.classList.toggle("loading", loading);
				}
				field.onModified = function(modified) {
					dropdown.element.classList.toggle("modified", modified);
				}
				field.update();
			}
		};
	}
}




//
// KarmaFieldsAlpha.fields.checkboxes = class extends KarmaFieldsAlpha.fields.field {
//
// 	constructor(resource, domain) {
// 		super(resource, domain);
//
// 		this.datatype = "array"
//
// 		if (this.resource.driver) {
// 			const driver = this.resource.driver;
// 			this.events.fetch = function(field, params) {
// 				return field.queryOptions(driver, params);
// 			};
// 		}
//
// 	}
//
// 	add(item, context) {
//     let values = this.getValue();
//     values.push(item);
//     this.setValue(values, context);
//   }
//
//   remove(item, context) {
//     let values = this.getValue();
//     values = values.filter(function(value) {
//       return item !== value;
//     });
//     this.setValue(values, context);
//   }
//
// 	contains(item) {
//     let values = this.getValue();
// 		return values.indexOf(item) > -1;
//   }
//
// 	toggle(item, context) {
//     if (this.contains(item)) {
// 			this.remove(item, context);
// 		} else {
// 			this.add(item, context);
// 		}
//   }
//
// 	build() {
// 		const field = this;
//
// 		return {
// 			class: "karma-field checkboxes",
// 			init: function(dropdown) {
// 				let promise;
// 				if (!field.hasValue()) {
// 					field.startLoad();
// 					promise = field.fetchValue().then(function(value) {
// 						field.endLoad();
// 						field.triggerEvent("set");
// 						field.triggerEvent("modify");
// 					});
// 				}
// 				field.init(this.element);
// 			},
// 			child: {
// 				tag: "ul",
// 				update: function(ul) {
// 					field.startLoad();
// 					field.fetchOptions({key: field.resource.key, ...field.resource.args}).then(function(options) {
// 						field.endLoad();
// 						let value = field.getValue();
// 						ul.children = [];
// 						options.forEach(function(option, index) {
//
//
// 							ul.children.push({
// 								tag: "li",
// 								children: [
// 									{
// 										tag: "input",
// 										init: function() {
// 											this.element.type = "checkbox";
// 											this.element.id = field.getId()+"-"+index;
// 										},
// 										update: function() {
// 											this.element.checked = field.contains(option.key);
// 											this.element.onchange = function() {
// 												if (this.checked) {
// 													field.add(option.key);
// 												} else {
// 													field.remove(option.key);
// 												}
// 												field.triggerEvent("modified");
// 												field.triggerEvent("change", true);
// 											}
// 										}
// 									},
// 									{
// 										tag: "label",
// 										init: function() {
// 											this.element.htmlFor = field.getId()+"-"+index;
// 										},
// 										update: function() {
// 											this.element.innerHTML = option.name;
// 										}
// 									}
// 								]
// 							});
// 						});
// 						ul.render();
// 					});
// 					this.skipRender = true;
// 				}
// 			},
// 			update: function(dropdown) {
//
// 				field.events.modify = function() {
// 					dropdown.element.classList.toggle("modified", field.isModified());
// 				}
// 				field.events.load = function() {
// 					dropdown.element.classList.toggle("loading", field.loading > 0);
// 				}
// 				field.events.set = function() {
// 					dropdown.render();
// 				}
//
// 				field.triggerEvent("load");
// 				// field.triggerEvent("set");
// 				field.triggerEvent("modify");
// 			}
// 		};
// 	}
//
// }
