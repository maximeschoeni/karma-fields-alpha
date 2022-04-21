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
				// button.element.tabIndex = -1; // -> prevent button getting focus

				if (this.resource.primary) {
					button.element.classList.add("primary");
				}
				button.element.title = this.resource.title || "";

				if (this.resource.active || this.resource.disabled || this.resource.hidden) {
					// this.setEventListener(event => button.render());
					this.splash = request => button.render();
				}
				if (this.resource.hidden) {
					button.element.parentNode.classList.add("hidden");
				}


				button.element.onmousedown = event => {
					event.preventDefault(); // -> prevent active element losing focus
				}

				button.element.onclick = async event => {
					event.preventDefault(); // -> prevent submitting form in post-edit


					if (!button.element.classList.contains("editing")) {
						button.element.classList.add("editing");

						const event = this.createEvent({
							action: this.resource.action || this.resource.state || this.resource.value || "submit" // compat
						});

						await this.dispatch(event);

						button.element.classList.remove("editing");

						// document.activeElement.blur();
					}

				}

			},
			update: async button => {


				// button.element.onclick = async event => {
				// 	event.preventDefault();
				//
				// 	if (!button.element.classList.contains("editing")) {
				// 		button.element.classList.add("editing");
				//
				// 		const event = this.createEvent({
				// 			action: this.resource.action || this.resource.state || this.resource.value || "submit" // compat
				// 		});
				//
				// 		await this.dispatch(event);
				//
				// 		await button.render();
				//
				// 		button.element.classList.remove("editing");
				// 	}
				// }

				if (this.resource.disabled) {
					// const instance = this;
					// debugger;
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