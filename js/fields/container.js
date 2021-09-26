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

	render() {
    this.children.forEach(child => {
      child.render();

      // console.log(child);
    });
  }

	fill(value) {
    return Promise.all(this.children.map(async child => child.fill(value)));
  }


	setValue(value, keys, type) {
		if (keys && keys.length) {
			return super.setValue(value, keys, type);
		} else if (value && typeof value === "object") {
			return Promise.all(this.children.map(child => {
				return child.setValue(child.resource.key ? value[child.resource.key] : value);
			}));
		}
	}

	write(keys) {
		if (keys && keys.length) {
			return super.write(keys);
		} else {
			return this.children.map(child => child.write());
		}
	}

	removeValue(keys) {
		if (keys && keys.length) {
			super.removeValue(keys);
		} else {
			this.children.forEach(child => {
				child.removeValue();
			});
		}
  }

	getValue(keys, type) {
		if (keys && keys.length) {
			return super.getValue(keys, type);
		} else {
			// const values = await Promise.all(this.children.map(child => child.getValue()));
			const values = this.children.map(child => child.getValue());
			return values.reduce((acc, value, index) => {
				const child = this.children[index];
				if (child.resource.key) {
					acc[child.resource.key] = value;
				} else {
					Object.assign(acc, value);
				}
				return acc;
			}, {});
		}
	}

	updateChildren() {
		this.children.forEach(child => {
			child.updateChildren();
		});
	}

	// async getChildrenValue() {
	// 	console.error("deprecated getChildrenValue");
	// 	return this.getValue();
	// 	// const values = await Promise.all(this.children.map(child => child.getChildrenValue()));
	// 	// return values.reduce((acc, value, index) => {
	// 	// 	const child = this.children[index];
	// 	// 	if (child.resource.key) {
	// 	// 		acc[child.resource.key] = value;
	// 	// 	} else {
	// 	// 		Object.assign(acc, value);
	// 	// 	}
	// 	// 	return acc;
	// 	// }, {});
	// }
	//
	// setChildrenValue(value) {
	// 	console.error("deprecated setChildrenValue");
	// 	// return Promise.all(this.children.map(child => child.setChildrenValue(child.resource.key ? value[child.resource.key] : value)));
	// 	// this.children.forEach(child => {
	// 	// 	child.setChildrenValue(child.resource.key ? value[child.resource.key] : value);
	// 	// });
	// 	this.setValue();
	// }

	// removeChildrenValue() {
	// 	// await Promise.all(this.children.map(child => child.removeChildrenValue()));
	// 	// console.error("deprecated removeChildrenValue");
	// 	// this.removeValue();
	//
	// 	this.children.map(child => child.removeChildrenValue())
	// }

	// initValue(value, updateField) {
	// 	console.error("deprecated initValue");
	// 	if (value && typeof value === "object") {
	// 		this.children.forEach(function(child) {
	// 			if (child.resource.key) {
	// 				child.initValue(value[child.resource.key], updateField);
	// 			} else {
	// 				child.initValue(value, updateField);
	// 			}
	// 		});
	// 	}
	// }
	//
	// updateValue(value) {
	// 	console.error("deprecated updateValue");
	// 	this.saveValue(value, true, true);
	// 	// if (value && typeof value === "object") {
	// 	// 	return Promise.all(this.children.map(function(child) {
	// 	// 		if (child.resource.key) {
	// 	// 			return child.updateValue(value[child.resource.key]);
	// 	// 		} else {
	// 	// 			return child.updateValue(value);
	// 	// 		}
	// 	// 	}));
	// 	// }
	// }
	//
	// saveValue(value, updateSelf, noBubble) {
	// 	console.error("deprecated saveValue");
	// 	if (value && typeof value === "object") {
	// 		return Promise.all(this.children.map(function(child) {
	// 			if (child.resource.key) {
	// 				return child.saveValue(value[child.resource.key], updateSelf, noBubble);
	// 			} else {
	// 				return child.saveValue(value, updateSelf, noBubble);
	// 			}
	// 		}));
	// 	}
	// }

	// getValue() {
	// 	let value = {};
	// 	this.children.forEach(function(child) {
	// 		if (child.resource.key) {
	// 			value[child.resource.key] = child.getValue();
	// 		} else {
	// 			Object.assign(value, child.getValue());
	// 		}
	// 	});
	// 	return value;
	// }

	// getValueAsync() {
	// 	const field = this;
	// 	return Promise.all(this.children.map(function(child) {
	// 		return child.getValueAsync();
	// 	})).then(function(values) {
	// 		return values.reduce(function(acc, value, index) {
	// 			const child = field.children[index];
	// 			if (child.resource.key) {
	// 				acc[child.resource.key] = value;
	// 			} else {
	// 				Object.assign(acc, value);
	// 			}
	// 			return acc;
	// 		}, {});
	// 	});
	// }



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

	// updateOriginal() {
	// 	console.error("Deprecated function updateOriginal");
	// 	// this.children.forEach(function(child) {
	// 	// 	child.updateOriginal();
	// 	// });
	// };
	//
	// getKey(key) {
	// 	console.error("Deprecated function getKey");
	// 	let child = this.getDescendant(key);
	// 	child.getValue(value, context);
	// }
	//
	// setKey(key, value, context) {
	// 	console.error("Deprecated function setKey");
	// 	let child = this.getDescendant(key);
	// 	child.setValue(value, context);
	// }
	//
	// // changeState(state) {
	// // 	this.children.forEach(function(child) {
	// // 		child.changeState(state);
	// // 	});
	// // }
	//
	// updateState(state) {
	// 	console.error("Deprecated function updateState");
	// 	this.children.forEach(function(child) {
	// 		child.updateState(state);
	// 	});
	// }
	//
	// // fill(columns) {
	// // 	console.error("Deprecated function fill");
	// //
  // //   // this.children.forEach(function(child) {
  // //   //   child.fill();
  // //   // });
  // // }
	//
	// reset() {
	// 	console.error("Deprecated function reset");
	// 	this.children.forEach(function(child) {
	// 		child.reset();
	// 	});
	// }

	// async update() {
	//
  //   // await Promise.all(this.children.map(child => child.update()));
  // }


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


	find(path) {
		if (this.resource.key) {
			if (this.resource.key === path) {
				return this;
			} else if (this.children.length && path.startsWith(this.resource.key+"/")) {
				path = path.slice(this.resource.key.length+1);
				return this.children.find(child => child.find(path));
			}
		} else {
			return this.children.find(child => child.find(path));
		}
	}

}
