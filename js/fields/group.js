KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field {

  // getSelection(subKey) {

  //   const key = this.getKey();

	// 	if (key) {

  //     const selection = this.parent.getSelection(key);

  //     if (selection) {

  //       return selection[subKey];

  //     }

  //   } else {

  //     return this.parent.getSelection(subKey);

  //   }

  // }

  // setSelection(values, subKey) {

  //   const key = this.getKey();

	// 	if (key) {

  //     this.parent.setSelection({[subKey]: values}, key);

  //   } else {

  //     this.parent.setSelection(values, subKey);

  //   }

  // }


  getContent(...path) {

    const key = this.getKey();

    if (key) {

      const content = this.parent.getContent(key);

      if (content.loading) {

        return new KarmaFieldsAlpha.Content.Request();

      }

      const value = KarmaFieldsAlpha.DeepObject.get(content.toObject(), ...path);

      return new KarmaFieldsAlpha.Content(value);

    } else if (this.parent) {

      return this.parent.getContent(...path);

    }

  }

  setContent(content, ...path) {

    const key = this.getKey();

    if (key) {

      let groupContent = this.parent.getContent(key);

      if (!groupContent.loading) {

        const object = groupContent.toObject();

        KarmaFieldsAlpha.DeepObject.set(object, content.value, ...path);

        content = new KarmaFieldsAlpha.Content(object);

        this.parent.setContent(content, key);

      }

    } else {

      this.parent.setContent(content, ...path);

    }

  }



  // getValue(subkey) {
  //   // return this.parent.getValue();
  //
  //   // const key = this.getKey();
  //   //
  //   // if (key) {
  //   //
  //   //   const values = this.parent.getValue(key);
  //   //
  //   //   const [subkey] = path;
  //   //
  //   //   if (values && subkey) {
  //   //
  //   //     const object = values[0];
  //   //
  //   //     if (object) {
  //   //
  //   //       return KarmaFieldsAlpha.Type.toArray(object[subkey]);
  //   //
  //   //     }
  //   //
  //   //     return [];
  //   //
  //   //   }
  //   //
  //   //   return values;
  //   //
  //   // } else {
  //   //
  //   //   return this.parent.getValue(...path);
  //   //
  //   // }
  //
  //   const key = this.getKey();
  //
  //   if (key) {
  //
  //     const object = this.parent.getSingleValue(key);
  //
  //     if (object === KarmaFieldsAlpha.loading) {
  //
  //       return KarmaFieldsAlpha.loading;
  //
  //     }
  //
  //     if (object && object[subkey]) {
  //
  //       return KarmaFieldsAlpha.Type.toArray(object[subkey]);
  //
  //     }
  //
  //     return [];
  //
  //   } else {
  //
  //     return this.parent.getValue(subkey);
  //
  //   }
  //
  // }
  //
  // setValue(value, subkey) {
  //   // return this.parent.getValue();
  //
  //   const key = this.getKey();
  //
  //   if (key) {
  //
  //     const object = this.parent.getSingleValue(key);
  //
  //     if (object && object !== KarmaFieldsAlpha.loading) {
  //
  //       const object = {...object, [subkey]: value};
  //
  //       Object.freeze(object);
  //
  //       this.parent.setValue(object, key);
  //
  //     }
  //
  //   } else {
  //
  //     this.parent.setValue(value, subkey);
  //
  //   }
  //
  // }



	// request(subject, content, ...path) {

	// 	const key = this.getKey();

	// 	if (key) {

	// 		// path = [key, ...path];

	// 		switch (subject) {

	// 			case "get": {
	// 				// const response = await this.parent.request("get", {}, key);
	// 				// const value = KarmaFieldsAlpha.Type.toObject(response);
	// 				// return KarmaFieldsAlpha.DeepObject.get(value, ...path);

  //         const values = this.parent.request("get", {}, key);

  //         if (values) {

	// 				  return KarmaFieldsAlpha.Type.toArray(KarmaFieldsAlpha.DeepObject.get(values[0], ...path));

  //         }

	// 			}

	// 			// case "state": {
	// 			// 	const state = await this.parent.request("state", {}, key);
	// 			// 	const value = KarmaFieldsAlpha.Type.toObject(state.value);
	// 			// 	return {
	// 			// 		...state,
	// 			// 		value: KarmaFieldsAlpha.DeepObject.get(value, ...path)
	// 			// 	};
	// 			// }

	// 			case "set": {
	// 				const values = this.parent.request("get", {}, key);

  //         if (values) {

  //           const value = KarmaFieldsAlpha.Type.toObject(values[0]);
  //           const clone = KarmaFieldsAlpha.DeepObject.clone(value);
  //           KarmaFieldsAlpha.DeepObject.set(clone, content, ...path);
  //           this.parent.request("set", clone, key);

  //         }
	// 				// const value = KarmaFieldsAlpha.Type.toObject(response);
	// 				// const clone = KarmaFieldsAlpha.DeepObject.clone(value);
	// 				// KarmaFieldsAlpha.DeepObject.set(clone, content.data, ...path);
	// 				// await this.parent.request("set", {data: clone}, key);
	// 				break;
	// 			}

	// 			// case "fetch": {
	// 			// 	return this.parent.request(subject, content, key, ...path); // for transfer record value
	// 			// }


	// 			default:
	// 				return this.parent.request(subject, content, key);

	// 		}

	// 	} else {

	// 		return this.parent.request(subject, content, ...path);

	// 	}

	// }

	// getKeys() {

	// 	const key = this.getKey();

	// 	if (key) {

	// 		return new Set([key]);

	// 	} else {

	// 		return super.getKeys();

	// 	}

	// }

	// getDefault(defaults = {}) {
  //
	// 	const key = this.getKey();
  //
	// 	if (key) {
  //
  //     defaults[key] = super.getDefault();
  //
	// 	} else {
  //
  //     super.getDefault(defaults);
  //
  //   }
  //
	// 	return defaults;
	// }



  // export(items = []) {
  //
  //   if (this.resource.children) {
  //
	// 		for (let resource of this.resource.children) {
  //
	// 			const child = this.createChild(resource);
  //
  //       child.export(items);
  //
	// 		}
  //
	// 	}
  //
	// 	return items;
  // }
  //
  // import(items) {
  //
  //   if (this.resource.children) {
  //
	// 		for (let resource of this.resource.children) {
  //
	// 			const child = this.createChild(resource);
  //
  //       child.import(items);
  //
	// 		}
  //
	// 	}
  //
  // }



	export(collection) {

		const key = this.getKey();

		if (key) {

      let content = this.parent.getContent(key);
      // const object = content.toObject();
      // const string = JSON.stringify(object);
      // content = new KarmaFieldsAlpha.Content(string);

      collection.add(content);

      // items.push(content);
      //
      // if (content.loading) {
      //
      //   items.push("");
      //
      // } else {
      //
      //   const object = content.toObject();
      //   const string = JSON.stringify(object);
      //
      //   items.push(string);
      //
      // }

		} else {

      // for (let i = 0; i < this.resource.children.length; i++) {
      //
      //   const resource = this.resource.children[i];
			// 	const child = this.createChild(resource, i);
      //
      //   items = child.export(items);
      //
			// }

      super.export(items);

		}

    return items;
	}

	import(collection) {

		const key = this.getKey();

		if (key) {

      const content = collection.pick();
      // const content = new KarmaFieldsAlpha.Content(value);

      this.parent.setContent(content, key);

		} else {

      super.import(collection);
			// for (let i = 0; i < this.resource.children.length; i++) {
      //
      //   const resource = this.resource.children[i];
			// 	const child = this.createChild(resource, i);
      //
      //   child.import(items);
      //
			// }

		}

	}

  isHidden(field) {

    if (field.resource.hidden) {

      return this.parse(field.resource.hidden).toBoolean();

    } else if (field.resource.visible) {

      return !this.parse(field.resource.visible).toBoolean();

    }

    return false;
  }

  buildLabel() {

		return [{
			tag: "label",
			class: "label",
			update: label => {
				label.element.htmlFor = field.getId();
				label.element.textContent = field.getLabel();
			}
		}];

	}

	buildPseudoLabel() {

		return [{
			class: "label",
			update: label => {
				label.element.textContent = field.getLabel();
			}
		}];

	}

	buildChildren(field, labelable) {
		const children = [];

		if (field.resource.label) {

			children.push({
				class: "label",
				update: label => {
					label.element.textContent = field.getLabel();
				}
			});

		}

		if (field.build) { // -> not separators

			children.push(field.build());

		}

		return children;
	}

	build() {
		return {
			class: "karma-field karma-field-container display-"+(this.resource.display || "block"),
			init: group => {
				if (this.resource.container && this.resource.container.style) {
					group.element.style = this.resource.container.style;
				}
				if (this.resource.class) {
					group.element.classList.add(this.resource.class);
				}
				if (this.resource.classes) {
					group.element.classList.add(...this.resource.classes);
				}
				if (this.resource.wrap === false) {
					group.element.style.flexWrap = "nowrap";
				}
			},
			update: group => {

				group.children = this.getChildren().map((resource, index) => {

          if (typeof resource === "string") {

            resource = {type: resource};

          }

					// const field = this.createChild({
          //   id: index,
          //   ...resource,
          //   index: index,
          //   uid: `${this.resource.uid}-${index}`
          // }, index);

          const field = this.createChild(resource, index);

					const labelable = resource.type === "input"
						|| resource.type === "textarea"
						|| resource.type === "checkbox"
						|| resource.type === "dropdown";

					return {
						tag: labelable ? "label" : "div",
						class: "karma-field-frame karma-field-"+field.resource.type,
						init: (container) => {
							if (field.resource.style) {
								container.element.style = field.resource.style;
							}
							if (field.resource.class) {
								field.resource.class.split(" ").forEach(name => container.element.classList.add(name));
							}
							if (field.resource.flex) {
								container.element.style.flex = field.resource.flex;
							}
							if (field.resource.width) {
								container.element.style.maxWidth = field.resource.width;
							}
						},
						update: (container) => {
							container.children = [];

              let hidden = this.isHidden(field);

              // if (field.resource.hidden) {
              //
              //   hidden = KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.hidden));
              //   // container.element.classList.toggle("hidden", KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.hidden)));
              // }
              //
              // if (field.resource.visible) {
              //
              //   hidden = !KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.visible))
              //   // container.element.classList.toggle("hidden", !KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.visible)));
              // }

							container.element.classList.toggle("hidden", hidden);

							if (!hidden) {

								container.children = this.buildChildren(field, labelable);

							}


							// container.children = [];
							//
							// if (!hidden) {
							//
							// 	if (resource.label) {
							//
							// 		if (labelable) {
							//
							// 			container.children = this.buildLabel(resource.label);
							//
							// 		} else {
							//
							// 			container.children = this.buildPseudoLabel(resource.label);
							//
							// 		}
							//
							// 	}
							//
							// 	container.children = [...container.children, field];
							//
							// }


						}
					}
				});

			}

		};
	}

}


KarmaFieldsAlpha.field.tabs = class extends KarmaFieldsAlpha.field {

  // setSelection(selection) {
  //
  //   if (selection) {
  //
  //     const currentSelection = this.getSelection();
  //
  //     selection = {index: 0, length: 1, ...currentSelection, ...selection};
  //
  //   }
  //
  //   super.setSelection(selection);
  //
  // }



  build() {

    return {
      class: "tabs",
      update: tabs => {
        // const selection = this.getSelection();

        const data = this.getData();
        const currentIndex = data && data.index || 0;

        tabs.children = [
          {
            class: "tabs-header",
            children: this.getChildren().map((child, index) => {
              return {
                tag: "a",
                class: "tab-handler",
                update: node => {
                  node.element.innerHTML = child.label;
                  // const isActive = selection && index === selection.childId || !selection && index === 0;
                  const isActive = index === currentIndex;
                  node.element.classList.toggle("active", Boolean(isActive));
                  node.element.onclick = event => {
                    // this.setSelection({child: {}, childId: index});
                    data.index = index;
                    this.render();
                  }
                }
              };
            })
          },
          {
            class: "tabs-body",

            children: this.getChildren().map((resource, index) => {
              return {
                class: "tab-content",
                update: node => {

                  // node.element.onmousedown = event => {
                  //
                  //   // debugger;
                  //   event.stopPropagation();
                  //   this.setSelection({child: {}, childId: index});
                  //   tabs.render();
                  // }

                  // const isActive = selection && index === selection.childId || !selection && index === 0;
                  const isActive = index === currentIndex;

                  node.element.classList.toggle("hidden", !isActive);

                  if (isActive) {

                    const child = this.getChild(index);

                    node.children = [child.build()];

                  } else {

                    node.children = [];

                  }

                }
              };
            })
          }
        ]
      }
    };

  }


}






KarmaFieldsAlpha.field.foldableGroup = class extends KarmaFieldsAlpha.field.group {

	buildChildren() {

		return [
			{
				class: "foldable",
				init: foldable => {
					let open = false;
					foldable.children = [
						{
							tag: "label",
							children: [
								{
									tag: "span",
									update: span => {
										if (open) {
											span.element.className = "dashicons dashicons-arrow-down";
										} else {
											span.element.className = "dashicons dashicons-arrow-right";
										}
									}
								},
								{
									tag: "span",
									init: span => {
										span.element.htmlFor = field.getId();
										span.element.textContent = field.resource.label || "";
									}
								}
							],
							init: label => {
								label.element.style.display = "flex";
								label.element.style.alignItems = "center";
								label.element.onclick = event => {
									const content = label.element.nextElementSibling;
									content.style.height = content.children[0].clientHeight.toFixed()+"px";
									if (open) {
										requestAnimationFrame(() => {
											content.style.height = "0";
										});
										open = false;
									} else {
										open = true;
									}
									label.render();
								};
							}
						},
						{
							class: "group-fold-content",
							init: content => {
								content.element.style.overflow = "hidden";
								content.element.style.height = "0";
								content.element.style.transition = "height 200ms";
								content.element.style.display = "flex";
								content.element.style.alignItems = "flex-end";
								content.element.ontransitionend = () => {
									content.element.style.height = open ? "auto" : "0";
								};
							},
							child: field.build()
						}
					];
				}
			}
		];

	}

}
