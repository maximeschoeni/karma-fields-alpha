KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field.container {

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

  getValue(subkey) {
    // return this.parent.getValue();

    // const key = this.getKey();
    //
    // if (key) {
    //
    //   const values = this.parent.getValue(key);
    //
    //   const [subkey] = path;
    //
    //   if (values && subkey) {
    //
    //     const object = values[0];
    //
    //     if (object) {
    //
    //       return KarmaFieldsAlpha.Type.toArray(object[subkey]);
    //
    //     }
    //
    //     return [];
    //
    //   }
    //
    //   return values;
    //
    // } else {
    //
    //   return this.parent.getValue(...path);
    //
    // }

    const key = this.getKey();

    if (key) {

      const object = this.parent.getSingleValue(key);

      if (object === KarmaFieldsAlpha.loading) {

        return KarmaFieldsAlpha.loading;

      }

      if (object && object[subkey]) {

        return KarmaFieldsAlpha.Type.toArray(object[subkey]);

      }

      return [];

    } else {

      return this.parent.getValue(subkey);

    }

  }

  setValue(value, subkey) {
    // return this.parent.getValue();

    const key = this.getKey();

    if (key) {

      const object = this.parent.getSingleValue(key);

      if (object && object !== KarmaFieldsAlpha.loading) {

        const object = {...object, [subkey]: value};

        Object.freeze(object);

        this.parent.setValue(object, key);

      }

    } else {

      this.parent.setValue(value, subkey);

    }

  }



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

	getDefault(defaults = {}) {

		const key = this.getKey();

		if (key) {

      defaults[key] = super.getDefault();

		} else {

      super.getDefault(defaults);

    }

		return defaults;
	}

	export(object = {}) {

		const key = this.getKey();

		if (key) {

			object[key] = this.parent.request("get", {}, key);

		} else {

			super.export(object);

		}

    return object;
	}

	import(object = {}) {

		const key = this.getKey();

		if (key) {

			if (object[key] !== undefined) {

				this.parent.request("set", object[key], key);

			}

		} else {

			super.import(object);

		}

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
