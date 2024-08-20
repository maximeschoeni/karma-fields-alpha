KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field {

  // getConstructor(type) {
  //
  //   if (this.constructor[type] && typeof this.constructor[type] === "function") {
  //     return this.constructor[type];
  //   }
  //
  //   if (this.parent) {
  //     return this.parent.getConstructor(type);
  //   }
  //
  // }

  newChild(index) {

    const children = this.resource.children || [];

    let resource = this.resource.children[index];

    if (resource) {

      if (typeof resource === "string") {

        resource = {type: resource};

      }

      const constructor = this.getConstructor(resource.type || "group"); // compat

      return new constructor(resource, index, this);

    }

  }

  getContent(subkey) {

    const key = this.getKey();

    if (key) {

      const content = this.parent.getContent(key);

      const response = new KarmaFieldsAlpha.Content();

      if (content.loading) {

        response.loading = true;

      }

      response.value = KarmaFieldsAlpha.DeepObject.get(content.toObject(), subkey);

      // return new KarmaFieldsAlpha.Content(value);

      // return new KarmaFieldsAlpha.Content.Node(content, subkey);

      return response;

    } else if (this.parent) {

      return this.parent.getContent(subkey);

    }

  }

  async setValue(value, ...path) {

    const key = this.getKey();

    if (key) {

      let groupContent = this.parent.getContent(key);

      if (!groupContent.loading) {

        const newValue = {...groupContent.toObject()};

        KarmaFieldsAlpha.DeepObject.set(newValue, value, ...path);

        await this.parent.setValue(newValue, key);

      }

    } else {

      return this.parent.setValue(value, ...path);

    }

  }

	export() {

		const key = this.getKey();

		if (key) {

      return this.parent.getContent(key);

		} else {

      return super.export();

		}

	}

	async import(collection) {

		const key = this.getKey();

		if (key) {

      const value = collection.value.shift();

      await this.parent.setValue(value, key);

		} else {

      await super.import(collection);

		}

	}

  isHidden(field) {

    if (field.resource.hidden) {

      const hidden = field.parse(field.resource.hidden);

      return !hidden.loading && hidden.toBoolean();

    } else if (field.resource.visible) {

      const visible = field.parse(field.resource.visible);
      return visible.loading || !visible.toBoolean();

    }

    return false;
  }

  inline() {

    return this.resource.display === "flex";

  }

  // buildLabel() {
  //
	// 	return [{
	// 		tag: "label",
	// 		class: "label",
	// 		update: async label => {
	// 			label.element.htmlFor = field.getId();
  //       const label = await
	// 			label.element.textContent = field.getLabel();
	// 		}
	// 	}];
  //
	// }

	// buildPseudoLabel() {
  //
	// 	return [{
	// 		class: "label",
	// 		update: label => {
	// 			label.element.textContent = field.getLabel();
	// 		}
	// 	}];
  //
	// }

	buildChildren(field, labelable) {
		const children = [];

		if (field.resource.label) {

			children.push({
				class: "label",
				update: async node => {
          const label = await field.getLabel();
					node.element.textContent = label.toString();
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
        if (this.resource.align) {
          group.element.style.alignItems = this.resource.align;
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
						class: `karma-field-frame karma-field-${field.resource.type} field-container`,
						init: (container) => {
							if (field.resource.style) {
								container.element.style = field.resource.style;
							}
							if (field.resource.class) {
								field.resource.class.split(" ").forEach(name => container.element.classList.add(name));
							}
              if (field.resource.classes) {
								container.element.classList.add(...field.resource.classes);
							}
							if (field.resource.flex) { // deprecated
								container.element.style.flex = field.resource.flex;
							}
							if (field.resource.width) {
                if (this.inline()) { // -> flex-direction: row
                  const fr = field.resource.width.match(/(.*)fr/);
                  if (fr) {
                    // container.element.style.flexGrow = fr[1];
                    container.element.style.flex = `1 ${fr[1]} 0`;
                  } else {
                    container.element.style.width = field.resource.width;
                  }
                } else { // -> flex-direction: column
                  if (field.resource.width === "auto") {
                    container.element.style.alignSelf = "flex-start";
                  } else if (!field.resource.width.match(/(.*)fr/)) {
                    container.element.style.width = field.resource.width;
                  }
                }
							}

              // if (field.resource.width) {
              //   if (this.inline()) { // -> flex-direction: row
              //     if (field.resource.width) {
              //       const fr = field.resource.width.match(/(.*)fr/);
              //       if (fr) {
              //         container.element.style.flexGrow = fr[1];
              //       } else {
              //         container.element.style.width = field.resource.width;
              //       }
              //     } else {
              //       container.element.style.flexGrow = fr[1];
              //
              //     }
              //
              //   } else { // -> flex-direction: column
              //     if (field.resource.width === "auto") {
              //       container.element.style.alignSelf = "flex-start";
              //     } else if (!field.resource.width.match(/(.*)fr/)) {
              //       container.element.style.width = field.resource.width;
              //     }
              //   }
							// }
              // if (field.resource.align) {
							// 	container.element.style.alignItems = field.resource.align;
							// }
						},
						update: (container) => {
							container.children = [];

              let hidden = this.isHidden(field);

							container.element.classList.toggle("hidden", hidden);

							if (!hidden) {

								container.children = this.buildChildren(field, labelable);

							}

						}
					}
				});

			}

		};
	}

}


KarmaFieldsAlpha.field.tabs = class extends KarmaFieldsAlpha.field {

  build() {

    return {
      class: "tabs",
      update: tabs => {
        // const selection = this.getSelection();

        // const data = this.getData();
        // const currentIndex = data && data.index || 0;
        const currentIndex = this.getState("index") || 0;

        tabs.children = [
          {
            class: "tabs-header",
            children: this.getChildren().map((child, index) => {
              return {
                tag: "a",
                class: "tab-handler",
                update: node => {
                  node.element.innerHTML = child.label;
                  const isActive = index === currentIndex;
                  node.element.classList.toggle("active", Boolean(isActive));
                  node.element.onclick = async event => {
                    // this.setSelection({child: {}, childId: index});
                    // data.index = index;
                    await this.setState(index, "index");
                    await this.render();
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
