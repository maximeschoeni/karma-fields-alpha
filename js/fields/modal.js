KarmaFieldsAlpha.fields.modal = class extends KarmaFieldsAlpha.fields.container {

	constructor(resource, parent, form) {
		super(resource, parent, form);

		this.handle = new KarmaFieldsAlpha.fields.field(resource.handle, this, this);
		this.content = new KarmaFieldsAlpha.fields.group(resource.content, this, this);

    // this.filters.events.change = function(target) {
    //   return field.query().then(function() {
    //     field.filters.triggerEvent("render");
    //   });
    // }
		// this.addChild(this.handle);
		// this.addChild(this.content);


		// update handle when edited in modal
		this.events.change = function(origin, ...params) {
			if (origin.resource.key === this.handle.resource.key) {
				this.handle.setValue(origin.getValue(), "set");
			}
			this.triggerUp("change", ...params);
		}


	}

	// setValue(value, context) {
	//
	//
	//
	// 	super.setValue(value, context);
	// 	//
	// 	// if (value && typeof value === "object") {
	// 	// 	for (let key in value) {
	// 	// 		const child = this.getDescendant(key);
	// 	// 		if (child) {
	// 	//
	// 	// 			child.setValue(value[key], context);
	// 	// 		}
	// 	// 	}
	// 	// }
	// }


	buildModal() {
		const field = this;

		return {
			class: "karma-modal",
			update: function(container) {

				this.children = [
					{
						class: "karma-modal-header",
						children: [
							{
								tag: "h2",
								init: function() {
									this.element.textContent = "Edit Instrument";
								}
							},
							{
								tag: "button",
								child: new KarmaFieldsAlpha.fields.icon({
								  type: "icon",
								  value: "no-alt.svg"
								}).build(),
								init: function() {
									this.element.onclick = function() {
										field.open = false;
										field.triggerEvent("closemodal", true);
									}
								}
							}
						]
					},
					{
						class: "karma-modal-body karma-field-frame",
						update: function() {
							this.child = field.content.build();
						}
						// child: field.content.build()
					}
				];
			}
		};

	}

	build() {
		const field = this;

		return {
			tag: "a",
			class: "text karma-field",
			init: function(input) {
				this.element.type = field.resource.input_type || "text"; // compat

				this.element.setAttribute('tabindex', '-1');
				if (!field.handle.hasValue()) {
					field.handle.fetchValue().then(function(value) {
						field.handle.triggerEvent("set");
						field.handle.triggerEvent("modify");
					});
				}
				field.handle.init(this.element);
			},
			update: function(input) {

				this.element.onclick = function() {
					field.triggerEvent("openmodal", true);
				}
				field.handle.events.modify = function() {
					input.element.classList.toggle("modified", field.handle.isModified());
				}
				field.handle.events.load = function() {
					input.element.classList.toggle("loading", field.handle.loading > 0);
				}
				field.handle.events.set = function() {

					input.element.textContent = field.handle.getValue();
				}

				field.handle.triggerEvent("load");
				field.handle.triggerEvent("set");
				field.handle.triggerEvent("modify");

				// this.element.classList.toggle("loading", field.loading > 0);
				// this.element.classList.toggle("modified", field.isModified());
			}
		};
	}




}
