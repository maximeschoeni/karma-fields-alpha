KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.container {

	// updateState(state) {
	// 	super.updateState(state);
  //   this.try("onState", state);
	// }


	buildFrame(field) {

		return {
			class: "karma-field-frame karma-field-"+field.resource.type,
			init: (container) => {
				if (field.resource.style) {
					console.log(field.resource.style, container.element);
					container.element.style = field.resource.style;
				}
			},

			update: async (container) => {
				if (field.resource.condition) {
					const condition = await this.getRelatedValue(field.resource.condition.key);
					container.element.classList.toggle("hidden", condition !== field.resource.condition.value);
				}

				container.children = [];
				if (field.resource.label) {
					container.children.push({
						tag: "label",
						init: (label) => {
							if (field.resource.label) {
								label.element.htmlFor = field.getId();
								label.element.textContent = field.resource.label;
							}
						}
					});
				}
				container.children.push(field.build());
				container.children.push({
					class: "karma-field-spinner"
				});
			}
		};
	}

	build() {
		return {
			class: "karma-field karma-field-container display-"+(this.resource.display || "block"),
			init: group => {
				this.render = group.render;
			},
			update: group => {
				group.element.classList.toggle("disabled", this.getState() === "disabled");

				group.children = this.children.map(child => {
					if (child instanceof KarmaFieldsAlpha.fields.separator) {
						return child.build();
					} else {
						return this.buildFrame(child);
					}
				});
			}
		};
	}

}
