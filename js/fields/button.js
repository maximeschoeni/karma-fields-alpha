KarmaFieldsAlpha.fields.button = class extends KarmaFieldsAlpha.fields.text {

	build() {
		return {
			tag: "button",
			class: "karma-button karma-field",
			child: {
				tag: "span",
				update: async span => {
					if (this.resource.dashicon) {
						span.element.className = "dashicons dashicons-"+this.resource.dashicon;
						span.element.textContent = this.resource.text || "";
					} else {
						span.element.className = "text";
						span.element.textContent = await this.parse(this.resource.text || this.resource.title || "");
					}

				}
			},
			init: async button => {


			},
			update: async button => {

				if (this.resource.primary) {
					button.element.classList.add("primary");
				}
				button.element.title = this.resource.title || "";

				if (this.resource.active || this.resource.disabled) {
					// this.setEventListener(event => button.render());
					this.update = () => button.render();
				}
				// if (this.resource.hidden) {
				// 	button.element.parentNode.classList.add("hidden");
				// }


				// button.element.onmousedown = event => {
				// 	event.preventDefault(); // -> prevent active element losing focus
				// }

				// button.element.onmouseup = event => {
				// 	button.element.blur();
				// }

				button.element.onclick = async event => {
					event.preventDefault(); // -> prevent submitting form in post-edit



					if (!button.element.classList.contains("editing")) {
						button.element.classList.add("editing");

						const action = await this.parse(this.resource.action || this.resource.state || "submit");

						requestIdleCallback(() => {

							this.dispatch({
								action: action, // compat
								data: this.resource.value
							}).then(() => {
								button.element.classList.remove("editing");
								button.element.blur();
							});
						});

					}

				}


				if (this.resource.disabled) {
					// const instance = this;
					// debugger;
					// if (this.resource.action === "delete") debugger;
					button.element.disabled = Boolean(await this.parse(this.resource.disabled));
					// this.check(this.resource.disabled).then(disabled => {
					// 	button.element.disabled = disabled;
					// });
				}
				if (this.resource.active) {
					button.element.classList.toggle("active", Boolean(await this.check(this.resource.active)));
					// this.check(this.resource.active).then(active => {
					// 	button.element.classList.toggle("active", active);
					// });
				}
				// if (this.resource.hidden) {
				// 	button.element.parentNode.classList.toggle("hidden", Boolean(await this.check(this.resource.hidden)));
				// }

			}
		};

	}

	getModal() {
		return this.resource.modal && this.createChild(this.resource.modal);
	}


}
