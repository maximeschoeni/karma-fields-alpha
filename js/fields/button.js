KarmaFieldsAlpha.field.button = class extends KarmaFieldsAlpha.field.text {

	build() {
		return {
			tag: "button",
			class: "karma-button karma-field",
			init: button => {
				button.element.tabIndex = -1;
			},
			child: {
				tag: "span",
				update: span => {
					if (this.resource.dashicon) {
						span.element.className = "dashicons dashicons-"+this.parse(this.resource.dashicon);
						span.element.textContent = this.resource.text || "";
					} else {
						span.element.className = "text";
						span.element.textContent = this.parse(this.resource.text || this.resource.title || "");
					}

				}
			},
			update: async button => {

				if (this.resource.primary) {
					button.element.classList.add("primary");
				}

				button.element.onmousedown = event => {
					event.preventDefault(); // -> keep focus to current active element
					event.stopPropagation(); // -> prevent selecting parent stuffs
				}

				button.element.onclick = event => {

					event.preventDefault(); // -> prevent submitting form in post-edit
					if (this.resource.command) {
						this.parent.execute(this.resource.command, this.resource.value);
					} else if (this.resource.values) {
            this.parent.request(this.resource.action, ...this.resource.values);
          } else if (this.resource.value) {
            this.parent.request(this.resource.action, this.resource.value);
          } else {
            this.parent.request(this.resource.action);
          }
          // button.element.blur();
        }

				if (this.resource.disabled) {
					button.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
				}

        if (this.resource.enabled) {

					const enabled = this.parse(this.resource.enabled);

													// console.log(this.resource, this.resource.enabled, enabled);

					button.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(enabled);
				}

				if (this.resource.active) {
					const active = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.active));
					button.element.classList.toggle("active", active);
				}

        if (this.resource.loading) {
					const loading = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.loading));
					button.element.classList.toggle("editing", loading);
          button.element.classList.toggle("loading", loading);
				}

				if (this.resource.test) {
					console.log(this.parse(this.resource.test));
				}

			}
		};

	}

}


KarmaFieldsAlpha.field.submit = class extends KarmaFieldsAlpha.field.button {

	constructor(resource) {
		super({
			primary: true,
			title: "Submit",
			action: "submit",
			disabled: ["!", ["modified"]],
			...resource
		});

	}

}
