KarmaFieldsAlpha.fields.group = class extends KarmaFieldsAlpha.fields.container {

	// updateState(state) {
	// 	super.updateState(state);
  //   this.try("onState", state);
	// }

	

	async match(condition) {
		const value = await this.getRelatedValue(condition.key);
		switch (condition.comparison) {
			case "<": return val < condition.value;
			case ">": return val > condition.value;
			case "<=": return val <= condition.value;
			case ">=": return val >= condition.value;
			case "!=": return val != condition.value;
			case "!==": return val !== condition.value;
			case "==": return val == condition.value;
			case "includes": return val.includes(condition.value);
			case "startsWith": return val.startsWith(condition.value);
			case "endsWidth": return val.endsWidth(condition.value);
			case "!": return !val;
			case "between": return val >= condition.value && val <= condition.value2;
			default: return val === condition.value;
		}
	}


	buildFrame(field) {

		return {
			class: "karma-field-frame karma-field-"+field.resource.type,
			init: (container) => {
				if (field.resource.style) {
					container.element.style = field.resource.style;
				}
				if (field.resource.class) {
					container.element.classList.add(field.resource.class);
				}
			},
			update: async (container) => {
				if (field.resource.condition) {
					container.element.classList.toggle("hidden", await this.match(field.resource.condition));
				}

				container.element.classList.toggle("final", !field.resource.children || !field.resource.children.some(child => child.type && child.type === "group"));

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

				// group.children = this.children.map(child => {
				// 	if (child instanceof KarmaFieldsAlpha.fields.separator) {
				// 		return child.build();
				// 	} else {
				// 		return this.buildFrame(child);
				// 	}
				// });

				group.children = this.children.map(child => this.buildFrame(child));
			}
		};
	}

}
