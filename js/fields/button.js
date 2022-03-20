KarmaFieldsAlpha.fields.button = class extends KarmaFieldsAlpha.fields.text {

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
				// this.update = button.render;
				if (this.resource.primary) {
					button.element.classList.add("primary");
				}
				button.element.title = this.resource.title || "";
			},
			update: async button => {
				button.element.onclick = async event => {
					event.preventDefault();
					if (!button.element.classList.contains("editing")) {
						button.element.classList.add("editing");

						// await this.set(null, this.resource.action || this.resource.context || "action");
						if (this.resource.state) {
							await this.setState(null, this.resource.state);
						} else if (this.resource.value) {
							await this.set(null, this.resource.value);
						}

						// await this.set("edit", this.resource.value);
						button.element.classList.remove("editing");

						await button.render();
					}
				}

				if (this.resource.disabled) {
					// button.element.classList.add("loading");
					button.element.disabled = true;
					// if (this.resource.type === "submit") debugger;
					this.check(this.resource.disabled).then(disabled => {
					// this.fetchState(this.resource.disabled).then(disabled => {
						button.element.disabled = disabled;
						// button.element.classList.remove("loading");
					});
				}

				if (this.resource.active) {
					this.check(this.resource.active).then(active => {

					// this.fetchState(this.resource.active).then(active => {
						button.element.classList.toggle("active", active);
					});
				}

			}
		};

	}

	getModal() {
		return this.resource.modal && this.createChild(this.resource.modal);
	}


}
