KarmaFieldsAlpha.field.container = class extends KarmaFieldsAlpha.field {

	// getKeys() {

	// 	let keys = new Set();

	// 	if (this.resource.children) {

	// 	  for (let resource of this.resource.children) {

	// 			keys = new Set([...keys, ...this.createChild(resource).getKeys()]);

	// 		}

	// 	}

	// 	return keys;
	// }

  // getSelection() {

  //   const selection = this.parent.getSelection();

  //   if (selection) {

  //     return selection[this.resource.id];

  //   }
    
  // }

  // setSelection(values) {

  //   this.parent.setSelection({[this.resource.id]: values});
    
  // }

  // paste(selection) {

  //   if (selection && this.resource.children) {

  //     for (let i = 0; i < this.resource.children.length; i++) {

  //       const child = this.createChild({
  //         id: i,
  //         ...this.resource.children[i]
  //       });

  //       if (selection[child.id]) {

  //         child.paste(selection[child.id]);

  //         break;

  //       }

  //     }

  //   }

  // }

	

	

  
  // expect(action, object) {

  //   switch (action) {

  //     case "export": {
        
  //       let object = {};

  //       if (this.resource.children) {

  //         for (let resource of this.resource.children) {

  //           const child = this.createChild(resource);

  //           object = {
  //             ...object,
  //             ...child.expect(action)
  //           };

  //         }

  //       }

  //       return object;
  //     }

  //     case "import": {
        
  //       if (this.resource.children) {

  //         for (let resource of this.resource.children) {
    
  //           const child = this.createChild(resource);
    
  //           child.expect(action, object);
    
  //         }
    
  //       }

  //       break;
  //     }

  //     // case "gather": {

  //     //   let set = new Set();

  //     //   if (this.resource.children) {

  //     //     for (let resource of this.resource.children) {
    
  //     //       const child = this.createChild(resource);

  //     //       const values = await child.expect(action, object);

  //     //       if (values) {

  //     //         set = new Set([...set, ...values]);

  //     //       }

  //     //     }
          
  //     //   }

  //     //   return set;
  //     // }

  //     default: {

  //       if (this.resource.children) {

  //         for (let resource of this.resource.children) {
    
  //           const child = this.createChild(resource);

  //           child.expect(action, object);

  //         }
          
  //       }

  //     }

  //   }

  // }

	getChildren() {
		return this.resource.children || [];
	}

	buildChildren(field) {
		const children = [];

		if (field.resource.label) {

			children.push({
				tag: "label",
				update: label => {
					if (field.resource.label) {
						label.element.htmlFor = field.getId();
						label.element.textContent = field.getLabel();
					}
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
			},
			update: async group => {
				// this.render = group.render;
				group.children = this.getChildren().map((resource, index) => {

          if (typeof resource === "string") {

            resource = {type: resource};
      
          }

          const data = resource.data || {};
          const selection = resource.selection || {};

					const field = this.createChild({
            id: index, 
            ...resource, 
            index: index, 
            data: data[index],
            selection: selection[index],
            uid: `${this.resource.uid}-${index}`
          }); // -> id is for retrieving selection (for unkeyed array)

					return {
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
						},
						update: async (container) => {
							container.children = [];

							// const hidden = field.resource.hidden && await this.parse(field.resource.hidden)
							// 	|| field.resource.visible && !await this.parse(field.resource.visible);

              let hidden = false;

              if (field.resource.hidden) {

                hidden = KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.hidden));
                // container.element.classList.toggle("hidden", KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.hidden)));
              }

              if (field.resource.visible) {

                hidden = !KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.visible))
                // container.element.classList.toggle("hidden", !KarmaFieldsAlpha.Type.toBoolean(this.parse(field.resource.visible)));
              }

							container.element.classList.toggle("hidden", hidden);

							if (!hidden) {

								container.children = this.buildChildren(field);

							}

						}
					}
				});

			}

		};
	}

}
