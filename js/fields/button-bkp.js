KarmaFieldsAlpha.fields.button = class extends KarmaFieldsAlpha.fields.text {



	// async isHidden() {
	// 	if (this.resource.hidden) {
	// 		return await this.fetchState(this.resource.hidden, "hidden");
	// 	}
	// 	return false;
	// }

	build() {
		return {
			tag: "button",
			class: "karma-button karma-field",
			child: {
				tag: "span",
				init: span => {
					if (this.resource.dashicon) {
						span.element.className = "dashicons dashicons-"+this.resource.dashicon;
						span.element.textContent = this.resource.text || "";
					} else {
						span.element.className = "text";
						span.element.textContent = this.resource.text || this.resource.title || "";
					}

				}
			},
			init: async button => {
				this.update = button.render;
				if (this.resource.primary) {
					button.element.classList.add("primary");
				}
				button.element.title = this.resource.title || "";
			},
			update: async button => {

				button.element.onclick = async event => {
					event.preventDefault();
					button.element.classList.add("editing");
					button.element.disabled = true;
					await this.edit(this.resource.value);
					button.element.disabled = !!this.resource.disabled && !await this.fetchState(this.resource.disabled);
					button.element.classList.remove("editing");
				}

				if (this.resource.disabled) {
					// button.element.classList.add("loading");
					button.element.disabled = true;
					// button.element.disabled = await this.fetchState(this.resource.disabled, "disabled");
					// button.element.classList.remove("loading");
					this.fetchState(this.resource.disabled).then(disabled => {
						button.element.disabled = disabled;
						// button.element.classList.remove("loading");
					});
				} else if (this.resource.enabled) {
					button.element.disabled = true;
					this.fetchState(this.resource.enabled).then(enabled => {
						button.element.disabled = !enabled;
					});
				}

				if (this.resource.active) {
					this.fetchState(this.resource.active).then(active => {
						button.element.classList.toggle("active", active);
					});
				}

				// if (this.resource.hidden) {
				// 	button.element.classList.add("hidden");
				// 	// button.element.classList.toggle("hidden", await this.fetchState(this.resource.hidden, "hidden"));
				// 	this.fetchState(this.resource.hidden).then(hidden => {
				// 		button.element.classList.toggle("hidden", hidden);
				// 	});
				// }



			}
		};

	}

	

}
