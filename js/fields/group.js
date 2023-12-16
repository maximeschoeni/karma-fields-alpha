KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field {

  getContent(subkey) {

    const key = this.getKey();

    if (key) {

      const content = this.parent.getContent(key);

      // if (content.loading) {
      //
      //   return new KarmaFieldsAlpha.Content.Request();
      //
      // }
      //
      // const value = KarmaFieldsAlpha.DeepObject.get(content.toObject(), subkey);
      //
      // return new KarmaFieldsAlpha.Content(value);

      return new KarmaFieldsAlpha.Content.Node(content, subkey);

    } else if (this.parent) {

      return this.parent.getContent(subkey);

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

	export() {

		const key = this.getKey();

		if (key) {

      let content = this.parent.getContent(key);

      return new KarmaFieldsAlpha.Content.Collection([content.toSingle()]);

		} else {

      return super.export();

		}

	}

	import(collection) {

		const key = this.getKey();

		if (key) {

      const content = collection.pick();

      this.parent.setContent(content, key);

		} else {

      super.import(collection);

		}

	}

  isHidden(field) {



    if (field.resource.hidden) {

      return field.parse(field.resource.hidden).toBoolean();

    } else if (field.resource.visible) {

      return !field.parse(field.resource.visible).toBoolean();

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
        const currentIndex = this.getOption("index") || 0;

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
                    // data.index = index;
                    this.setOption(index, "index");
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
