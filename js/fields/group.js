KarmaFields.fields.group = function(field) {

	return {
		class: "karma-field-group display-"+(field.resource.display || "block"),
		init: function() {
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
		},
		update: function(group) {
			this.element.classList.toggle("disabled", field.resource.disabled || false);

			if (field.resource.children && field.resource.children.length) {
				this.children = field.resource.children.map(function(resource, index) {
					let child = field.children[index] || field.createChild(resource);

					if (resource.type && resource.type !== "group") {
						return {
							class: "karma-field-"+child.resource.type,
							init: function(item) {
								child.trigger("init", child);
								if (child.resource.style) {
									this.element.style = child.resource.style;
								}
								child.events.update = function() {
									item.element.classList.toggle("loading", child.data.loading ? true : false);
									item.element.classList.toggle("modified", child.value !== child.originalValue);
								};
								child.events.render = function() {
									item.render();
								};
							},
							update: function(node) {
								this.children = [];

								if (child.resource.label) {
									this.children.push({
										tag: "label",
										init: function(label) {
											this.element.htmlFor = child.getId();
											this.element.textContent = child.resource.label;
										}
									});
								}

								// if (child.resource.title) {
								// 	this.children.push({
								// 		tag: child.resource.level || "h3",
								// 		init: function(label) {
								// 			this.element.textContent = child.resource.title;
								// 		}
								// 	});
								// }


								this.children.push(KarmaFields.fields[child.resource.type](child));

								if (child.resource.spinner !== false) {
									this.children.push({
										class: "karma-field-spinner"
									});
								}

							}
						};
					} else {
						return KarmaFields.fields.group(child);
					}

				});
			}
		}
	};
}





//
// KarmaFields.fields.group = function(field) {
// 	let nodes = [];
//
//
//
// 	// if (KarmaFields.fields[child.resource.type]) {
// 	// 	nodes = nodes.concat(builder(KarmaFields.fields[child.resource.type]));
// 	// 	nodes.push({
// 	// 		class: "karma-field-spinner"
// 	// 	});
// 	// }
//
// 	if (field.resource.children.length) {
// 		field.resource.children.forEach(function(resource, index) {
// 			// let child = resource.key && (field.getChild(resource.key) || !resource.key && field.children[index] || KarmaFields.Field(resource, field);
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
// 					let childNode = KarmaFields.fields[child.resource.type || "group"](child);
//
// 					if (Array.isArray(childNode)) {
// 						this.children = this.children.concat(childNode);
// 					} else {
// 						this.children.push(childNode);
// 					}
//
// 					// maybe all field builders should return an array?
// 					// KarmaFields.fields[child.resource.type || "group"](child).forEach(function(childNode) {
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
