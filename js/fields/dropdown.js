KarmaFieldsAlpha.fields.dropdown = {};


KarmaFieldsAlpha.fields.dropdown.create = function(resource) {
	const field = KarmaFieldsAlpha.Field(resource);

	if (!resource.value && resource.options && resource.options.length) {
		field.value = resource.default_option && resource.default_option.key || resource.options[0].key;
	}

	field.data.parseOptions = function(items) {

		if (field.resource.novalue !== undefined) {

			let emptyItem = {}

			switch (field.resource.datatype) {

				case "boolean":
					emptyItem.key = "false";
					break;

				case "number":
					emptyItem.key = 0;
					break;

				default:
					emptyItem.key = "";
					break;

			}

			if (field.resource.novalue === true) {

				emptyItem.name = "-";

			} else {

				emptyItem.name = field.resource.novalue;

			}


			items = [emptyItem].concat(items);
		}






		if (items.length && !items.some(function(item) {
			return item.key == field.value;
		})) {
			value = items[0].key;
			requestAnimationFrame(function() {
				field.setValue(value, "change"); //
			});
		}


		return items;

	}

	field.data.fetch = function() {

		field.data.loading = true;
		field.triggerEvent("update");

		if (field.resource.options) {

			return Promise.resolve(field.data.parseOptions(field.resource.options));

		} else {

			// return field.triggerEvent("fetch", true).then(function(results) {
			// 	return field.data.parseOptions(results.items || results || []);
			// });

			return field.fetch().then(function(results) {

				field.data.loading = false;
				return field.data.parseOptions(results.items || results || []);
			});

		}

	}

	return field;
}


KarmaFieldsAlpha.fields.dropdown.build = function(field) {


	return {
		tag: "select",
		class: "dropdown",
		init: function(container) {
			this.element.id = field.getId();
			this.element.onchange = function() {
				field.setValue(this.value, "change");
			}
		},
		update: function(dropdown) {
			field.data.fetch().then(function(items) {

				let hasOptgroups = items.some(function(item) {
					return item.group;
				});

				if (hasOptgroups) {

					let optgroups = items.reduce(function(obj, item) {
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

					dropdown.children = optgroups.map(function(optgroup) {
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
											this.element.selected = field.value == option.key;
										}
									};
								})
							}
						};
					});

				} else {

					dropdown.children = items.map(function(option) {
						return {
							tag: "option",
							update: function() {
								this.element.textContent = option.name;
								this.element.value = option.key;
								this.element.selected = field.value == option.key;
							}
						};
					});

				}

				dropdown.render();

				field.data.loading = false;

				field.triggerEvent("update");

			});

		}
	};
}



// KarmaFieldsAlpha.fields.dropdown = function(field) {
// 	return {
// 		tag: "select",
// 		class: "dropdown",
// 		init: function(container) {
// 			this.element.id = field.getId();
// 			this.element.onchange = function() {
// 				field.setValue(this.value, "change");
// 			}
// 			// if (field.resource.style) {
// 			// 	this.element.style = field.resource.style;
// 			// }
// 			if (field.resource.script_init) {
// 				(new Function("element", "field", field.resource.script_init))(this.element, field);
// 			}
//
// 			field.data.loading = true;
// 			field.trigger("update");
//
// 			Promise.resolve(field.resource.options || field.trigger("fetch", "querykey", {key: field.resource.key})).then(function(results) {
//
// 				let items = results.items || results || [];
//
// 				if (field.resource.novalue !== undefined) {
// 					let emptyValue;
// 					if (field.resource.datatype === "boolean") {
// 						emptyValue = "false";
// 					} else if (field.resource.datatype === "number") {
// 						emptyValue = "0";
// 					} else {
// 						emptyValue = "";
// 					}
// 					let emptyName = typeof field.resource.novalue === "string" && field.resource.novalue || "-";
// 					items = [{
// 						key: emptyValue,
// 						name: emptyName
// 					}].concat(items);
// 				}
//
// 				if (items.length && !items.some(function(item) {
// 					return item.key == field.value;
// 				})) {
// 					value = items[0].key;
// 					field.setValue(value, "change"); //
// 				}
//
// 				if (items.length && items.some(function(item) {
// 					return item.group;
// 				})) {
// 					// optgroups ->
// 					let groups = items.reduce(function(obj, item) {
// 						if (!obj[item.group || "default"]) {
// 							obj[item.group || "default"] = [];
// 						}
// 						obj[item.group || "default"].push(item);
// 						return obj;
// 					}, {});
//
// 					field.data.optgroups = Object.entries(groups).map(function(entry) {
// 						return {
// 							name: entry[0],
// 							children: entry[1]
// 						}
// 					});
//
// 				} else {
//
// 					field.data.options = items;
// 				}
//
// 				field.data.loading = false;
// 				field.trigger("update");
// 				field.trigger("render");
// 			});
//
// 		},
// 		update: function(dropdown) {
//
//
//
// 			if (field.data.options) {
// 				this.children = field.data.options.map(function(option) {
// 					return {
// 						tag: "option",
// 						update: function() {
// 							this.element.textContent = option.name;
// 							this.element.value = option.key;
// 							this.element.selected = field.value == option.key;
// 						}
// 					};
// 				});
// 			} else if (field.data.optgroups) {
// 				this.children = field.data.optgroups.map(function(option) {
// 					return {
// 						tag: "optgroup",
// 						update: function() {
// 							this.label = option.name;
// 							this.children = option.children.map(function(item, index) {
// 								return {
// 									tag: "option",
// 									update: function() {
// 										this.element.textContent = item.name;
// 										this.element.value = item.key;
// 										this.element.selected = field.value == item.key;
// 									}
// 								};
// 							})
// 						}
// 					};
// 				});
// 			}
// 		}
// 	}
// }
