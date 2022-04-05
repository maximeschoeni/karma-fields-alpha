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

				// this.disable = disabled => {
				// 	button.element.disabled = disabled;
				// }
				//
				// this.activate = active => {
				// 	button.element.classList.toggle("active", active);
				// }
				if (this.resource.active || this.resource.disabled || this.resource.hidden) {
					this.setEventListener(event => button.render());
				}
				if (this.resource.hidden) {
					button.element.parentNode.classList.add("hidden");
				}
			},
			update: async button => {

				button.element.onmousedown = event => {
					event.preventDefault(); // -> prevent losing selection
				}
				button.element.onclick = async event => {
					event.preventDefault();

					if (!button.element.classList.contains("editing")) {
						button.element.classList.add("editing");

						// await this.set(null, this.resource.action || this.resource.context || "action");
						// if (this.resource.state) {
						// 	await this.setState(null, this.resource.state);
						// } else if (this.resource.value) {
						// 	await this.set(null, this.resource.value);
						// }

						const event = this.createEvent({
							action: this.resource.action || this.resource.state || this.resource.value || "submit" // compat
						});

						await this.dispatch(event);

						// await this.update();
						// await this.updateState();

						await button.render();

						// await this.set("edit", this.resource.value);
						button.element.classList.remove("editing");


					}
				}

				if (this.resource.disabled) {
					// if (this.resource.action === "delete") debugger;
					button.element.disabled = await this.check(this.resource.disabled);
					// this.check(this.resource.disabled).then(disabled => {
					// 	button.element.disabled = disabled;
					// });
				}
				if (this.resource.active) {
					button.element.classList.toggle("active", await this.check(this.resource.active));
					// this.check(this.resource.active).then(active => {
					// 	button.element.classList.toggle("active", active);
					// });
				}
				if (this.resource.hidden) {
					// if (this.resource.action === "firstpage") debugger;
					button.element.parentNode.classList.toggle("hidden", await this.check(this.resource.hidden));
					// this.check(this.resource.hidden).then(hidden => {
					// 	button.element.parentNode.classList.toggle("hidden", hidden);
					// });
				}

			}
		};

	}

	getModal() {
		return this.resource.modal && this.createChild(this.resource.modal);
	}


}
