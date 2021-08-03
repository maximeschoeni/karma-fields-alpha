KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.container {

	// updateState(state) {
	// 	super.updateState(state);
  //   this.try("onState", state);
	// }


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
				this.children.push(field.build());
				this.children.push({
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
