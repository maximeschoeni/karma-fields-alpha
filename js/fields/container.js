KarmaFieldsAlpha.fields.container = class extends KarmaFieldsAlpha.fields.field {

	// setKeyValue(key, value, context) {
	// 	this.children.forEach(function(child) {
	// 		if (child.resource.key === key) {
	// 			child.setValue(value, context);
	// 		} else if (child.setKeyValue) {
	// 			child.setKeyValue(key, value, context);
	// 		}
	// 	});
	// }

	setValue(value, context) {

		// console.warn("Deprecated function setValue");

		// if (value && typeof value === "object") {
		// 	for (let key in value) {
		// 		const child = this.getDescendant(key);
		// 		if (child) {
		// 			child.setValue(value[key], context);
		// 		}
		// 	}
		// }

		if (value && typeof value === "object") {
			this.children.forEach(function(child) {
				if (child.resource.key) {
					child.setValue(value[child.resource.key], context);
				} else {
					child.setValue(value, context);
				}
			});
		}




	}

	initValue(value, updateField) {
		if (value && typeof value === "object") {
			this.children.forEach(function(child) {
				if (child.resource.key) {
					child.initValue(value[child.resource.key], updateField);
				} else {
					child.initValue(value, updateField);
				}
			});
		}
	}

	updateValue(value) {
		this.saveValue(value, true, true);
		// if (value && typeof value === "object") {
		// 	return Promise.all(this.children.map(function(child) {
		// 		if (child.resource.key) {
		// 			return child.updateValue(value[child.resource.key]);
		// 		} else {
		// 			return child.updateValue(value);
		// 		}
		// 	}));
		// }
	}

	saveValue(value, updateSelf, noBubble) {
		if (value && typeof value === "object") {
			return Promise.all(this.children.map(function(child) {
				if (child.resource.key) {
					return child.saveValue(value[child.resource.key], updateSelf, noBubble);
				} else {
					return child.saveValue(value, updateSelf, noBubble);
				}
			}));
		}
	}

	getValue() {
		let value = {};
		this.children.forEach(function(child) {
			if (child.resource.key) {
				value[child.resource.key] = child.getValue();
			} else {
				Object.assign(value, child.getValue());
			}
		});
		return value;
	}

	getValueAsync() {
		const field = this;
		return Promise.all(this.children.map(function(child) {
			return child.getValueAsync();
		})).then(function(values) {
			return values.reduce(function(acc, value, index) {
				const child = field.children[index];
				if (child.resource.key) {
					acc[child.resource.key] = value;
				} else {
					Object.assign(acc, value);
				}
				return acc;
			}, {});
		});
	}

	// getModifiedValue() {
	// 	// let value;
	// 	// this.children.forEach(function(child) {
	// 	// 	let childValue = child.getModifiedValue();
	// 	// 	if (childValue !== undefined) {
	// 	// 		if (!value) {
	// 	// 			value = {};
	// 	// 		}
	// 	// 		if (child.resource.key) {
	// 	// 			value[child.resource.key] = childValue;
	// 	// 		} else {
	// 	// 			Object.assign(value, childValue);
	// 	// 		}
	// 	// 	}
	// 	// });
	// 	// return value;
	//
	// 	return Promise.all(this.children.map(function(child) {
	// 		return child.getModifiedValue();
	// 	})).then(values => {
	// 		return values.reduce((acc, value, index) => {
	// 			if (value !== undefined) {
	// 				if (!acc) {
	// 					acc = {};
	// 				}
	// 				const child = this.children[index];
	// 				if (child.resource.key) {
	// 					acc[child.resource.key] = value;
	// 				} else {
	// 					Object.assign(acc, value);
	// 				}
	// 				return acc;
	// 			}
	// 		}, undefined);
	// 	});
	// }

	updateOriginal() {
		console.error("Deprecated function updateOriginal");
		// this.children.forEach(function(child) {
		// 	child.updateOriginal();
		// });
	};

	getKey(key) {
		let child = this.getDescendant(key);
		child.getValue(value, context);
	}

	setKey(key, value, context) {
		let child = this.getDescendant(key);
		child.setValue(value, context);
	}

	// changeState(state) {
	// 	this.children.forEach(function(child) {
	// 		child.changeState(state);
	// 	});
	// }

	updateState(state) {
		this.children.forEach(function(child) {
			child.updateState(state);
		});
	}

	fill(columns) {
		console.error("Deprecated function fill");

    // this.children.forEach(function(child) {
    //   child.fill();
    // });
  }

	reset() {
		this.children.forEach(function(child) {
			child.reset();
		});
	}

	async update() {

    // await Promise.all(this.children.map(child => child.update()));
  }


	// update() {
	// 	this.children.forEach(function(child) {
	// 		child.update();
	// 	});
	// };

	// not used
	// updateDependency() {
	// 	this.children.forEach(function(child) {
	// 		child.updateDependency();
	// 	});
  // }

	// clearValue() {
	// 	this.children.forEach(function(child) {
  //     child.clearValue();
  //   });
  // }
	// clearOptions() {
	// 	this.children.forEach(function(child) {
  //     child.clearOptions();
  //   });
  // }


}
