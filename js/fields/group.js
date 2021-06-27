KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.container {

	buildFrame(field) {

		return {
			class: "karma-field-frame karma-field-"+field.resource.type,
			init: function(container) {
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}
			},
			update: function(container) {
				this.children = [];
				if (field.resource.label) {
					this.children.push({
						tag: "label",
						init: function(label) {
							if (field.resource.label) {
								this.element.htmlFor = field.getId();
								this.element.textContent = field.resource.label;
							}
						}
					});
				}
				this.children.push({
					class: "karma-field-item",
					children: [
						field.build(),
						{
							class: "karma-field-spinner"
						}
					]
				});
			}
		};
	}

	build() {
		const field = this;

		return {
			class: "karma-field-container display-"+(field.resource.display || "block"),
			init: function() {
				// if (field.resource.style) {
				// 	this.element.style = field.resource.style;
				// }
			},
			update: function(group) {
				this.element.classList.toggle("disabled", field.bubble("disabled") || false);

				this.children = field.children.map(function(child) {

					// child.disabled = field.disabled;

					if (child instanceof KarmaFieldsAlpha.fields.separator) {

						return child.build();

					// if (child instanceof KarmaFieldsAlpha.fields.group) {
					//
					// 	return field.buildFrame(child);

						// return child.build();

					} else {

						return field.buildFrame(child);

					}

				});

			}
		};
	}

}




// KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.field {
//
// 	constructor(resource) {
// 		super(resource);
//
// 		this.defaultChildType = "group";
// 	}
//
// 	setValue(value, context) {
// 		if (value && typeof value === "object") {
// 			for (let key in value) {
// 				const child = this.getDescendant(key);
// 				if (child) {
// 					child.setValue(value[key], context);
// 				}
// 			}
// 		}
// 	}
//
// 	getValue() {
// 		value = {};
// 		this.children.forEach(function(child) {
// 			if (child.resource.key) {
// 				value[child.resource.key] = child.getValue();
// 			} else {
// 				Object.assign(value, child.getValue());
// 			}
// 		});
// 		return value;
// 	}
//
// 	getModifiedValue() {
// 		let value;
// 		this.children.forEach(function(child) {
// 			let childValue = child.getModifiedValue();
// 			if (childValue !== undefined) {
// 				if (!value) {
// 					value = {};
// 				}
// 				if (child.resource.key) {
// 					value[child.resource.key] = childValue;
// 				} else {
// 					Object.assign(value, childValue);
// 				}
// 			}
// 		});
// 		return value;
// 	}
//
// 	updateOriginal() {
// 		this.children.forEach(function(child) {
// 			child.updateOriginal();
// 		});
// 	};
//
// 	build() {
// 		const field = this;
//
// 		return {
// 			class: "karma-field-group display-"+(field.resource.display || "block"),
// 			init: function() {
// 				if (field.resource.style) {
// 					this.element.style = field.resource.style;
// 				}
// 			},
// 			update: function(group) {
// 				this.element.classList.toggle("disabled", field.disabled || false);
//
// 				this.children = field.children.map(function(child) {
//
// 					child.disabled = field.disabled;
//
// 					return child.build();
//
// 				});
//
// 			}
// 		};
// 	}
//
// }

//
// KarmaFieldsAlpha.fields.group = {};
//
// KarmaFieldsAlpha.fields.group.create = function(resource) {
// 	let field = KarmaFieldsAlpha.Field(resource);
// 	field.setValue = function(value, context) {
// 		if (value && typeof value === "object") {
// 			for (let key in value) {
// 				const child = this.getDescendant(key);
// 				if (child) {
// 					child.setValue(value[key], context);
// 				}
// 			}
// 		}
// 	};
// 	field.getValue = function() {
// 		value = {};
// 		this.children.forEach(function(child) {
// 			if (child.resource.key) {
// 				value[child.resource.key] = child.getValue();
// 			} else {
// 				Object.assign(value, child.getValue());
// 			}
// 		});
// 		return value;
// 	};
// 	field.getModifiedValue = function() {
// 		let value;
// 		this.children.forEach(function(child) {
// 			let childValue = child.getModifiedValue();
// 			if (childValue !== undefined) {
// 				if (!value) {
// 					value = {};
// 				}
// 				if (child.resource.key) {
// 					value[child.resource.key] = childValue;
// 				} else {
// 					Object.assign(value, childValue);
// 				}
// 			}
// 		});
// 		return value;
// 	};
// 	field.updateOriginal = function() {
// 		this.children.forEach(function(child) {
// 			child.updateOriginal();
// 		});
// 	};
// 	// if (resource.children) {
// 	// 	resource.children.forEach(function(childResource) {
// 	// 		field.createChild(childResource);
// 	// 	});
// 	// }
// 	return field;
// }
//
// KarmaFieldsAlpha.fields.group.build = function(field) {
//
// 	return {
// 		class: "karma-field-group display-"+(field.resource.display || "block"),
// 		init: function() {
// 			if (field.resource.style) {
// 				this.element.style = field.resource.style;
// 			}
// 		},
// 		update: function(group) {
// 			this.element.classList.toggle("disabled", field.disabled || false);
//
// 			// if (field.resource.children && field.resource.children.length) {
// 				// this.children = field.resource.children.map(function(resource, index) {
// 				// 	let child = field.children[index] || field.createChild(resource);
//
// 				this.children = field.children.map(function(child) {
//
// 					child.disabled = field.disabled;
//
// 					if (child.resource.type && child.resource.type !== "group") {
//
// 						return child.build();
//
// 						// return {
// 						// 	class: "karma-field-"+child.resource.type,
// 						// 	init: function(item) {
// 						// 		child.triggerEvent("init", true);
// 						// 		if (child.resource.style) {
// 						// 			this.element.style = child.resource.style;
// 						// 		}
// 						// 		child.events.update = function() {
// 						// 			item.element.classList.toggle("loading", child.data.loading ? true : false);
// 						// 			item.element.classList.toggle("modified", child.value !== child.originalValue);
// 						// 		};
// 						// 		child.events.render = function(target) {
// 						//
// 						// 			item.render();
// 						// 		};
// 						// 	},
// 						// 	update: function(node) {
// 						// 		this.children = [];
// 						//
// 						// 		if (child.resource.label) {
// 						// 			this.children.push({
// 						// 				tag: "label",
// 						// 				init: function(label) {
// 						// 					this.element.htmlFor = child.getId();
// 						// 					this.element.textContent = child.resource.label;
// 						// 				}
// 						// 			});
// 						// 		}
// 						//
// 						// 		// this.children.push(KarmaFieldsAlpha.fields[child.resource.type](child));
// 						// 		this.children.push(child.build());
// 						//
// 						// 		if (child.resource.spinner !== false) {
// 						// 			this.children.push({
// 						// 				class: "karma-field-spinner"
// 						// 			});
// 						// 		}
// 						//
// 						// 	}
// 						// };
// 					} else {
// 						// return KarmaFieldsAlpha.fields.group(child);
// 						return child.build();
// 					}
//
// 				});
// 			// }
// 		}
// 	};
// }
//
//
//


//
// KarmaFieldsAlpha.fields.group = function(field) {
// 	let nodes = [];
//
//
//
// 	// if (KarmaFieldsAlpha.fields[child.resource.type]) {
// 	// 	nodes = nodes.concat(builder(KarmaFieldsAlpha.fields[child.resource.type]));
// 	// 	nodes.push({
// 	// 		class: "karma-field-spinner"
// 	// 	});
// 	// }
//
// 	if (field.resource.children.length) {
// 		field.resource.children.forEach(function(resource, index) {
// 			// let child = resource.key && (field.getDescendant(resource.key) || !resource.key && field.children[index] || KarmaFieldsAlpha.Field(resource, field);
// 			let child = field.children[index] || field.createChild(resource);
//
//
//
// 			nodes.push({
// 				class: "karma-field-"+(child.resource.type || "group")+" display-"+(child.resource.display || "block"),
// 				init: function(item) {
// 					child.trigger("init", child);
// 					if (child.resource.style) {
// 						this.element.style = child.resource.style;
// 					}
//
// 					child.events.update = function() {
// 						item.element.classList.toggle("loading", child.data.loading ? true : false);
// 						item.element.classList.toggle("modified", child.value !== child.originalValue);
//
//
// 					};
// 					child.events.render = function() {
//
// 						item.render();
// 					};
// 				},
// 				update: function(node) {
//
// 					child.trigger("update");
//
// 					this.children = [];
//
// 					if (child.resource.label) {
// 						this.children.push({
// 							tag: "label",
// 							init: function(label) {
// 								this.element.htmlFor = child.getId();
// 								this.element.textContent = child.resource.label;
// 							}
// 						});
// 					}
//
// 					if (child.resource.title) {
// 						this.children.push({
// 							tag: child.resource.level || "h3",
// 							init: function(label) {
// 								this.element.textContent = child.resource.title;
// 							}
// 						});
// 					}
//
// 					let childNode = KarmaFieldsAlpha.fields[child.resource.type || "group"](child);
//
// 					if (Array.isArray(childNode)) {
// 						this.children = this.children.concat(childNode);
// 					} else {
// 						this.children.push(childNode);
// 					}
//
// 					// maybe all field builders should return an array?
// 					// KarmaFieldsAlpha.fields[child.resource.type || "group"](child).forEach(function(childNode) {
// 					// 	node.children.push(childNode);
// 					// });
//
// 					if (child.resource.spinner !== false) {
// 						this.children.push({
// 							class: "karma-field-spinner"
// 						});
// 					}
//
// 				}
// 			});
// 		});
// 	}
//
//
//
// 	return nodes;
// }
