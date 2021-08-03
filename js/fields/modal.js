KarmaFieldsAlpha.fields.modal = class extends KarmaFieldsAlpha.fields.link {

	// constructor(resource, parent, form) {
	// 	super(resource, parent, form);
	//
	// 	this.handle = new KarmaFieldsAlpha.fields.link({
	// 		param_key: this.resource.modal_key || "id",
	// 		...resource.handle
	// 	}, this, form);
	// 	this.handle = new KarmaFieldsAlpha.fields.link({
	// 		param_key: this.resource.modal_key || "id",
	// 		...resource.handle
	// 	}, this, form);
	//
	// 	this.content = new KarmaFieldsAlpha.fields.group(resource.content, this, form);
	//
	//
	// }

	initField() {
		super.initField();
    this.content = this.createChild(this.resource.content);
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




	// build() {
	// 	const field = this;
	//
	// 	return {
	// 		tag: "a",
	// 		class: "text karma-field",
	// 		init: function(input) {
	// 			this.element.type = field.resource.input_type || "text"; // compat
	//
	// 			this.element.setAttribute('tabindex', '-1');
	// 			if (!field.handle.hasValue()) {
	// 				field.handle.fetchValue().then(function(value) {
	// 					field.handle.triggerEvent("set");
	// 					field.handle.triggerEvent("modify");
	// 				});
	// 			}
	// 			field.handle.init(this.element);
	// 		},
	// 		update: function(input) {
	//
	// 			this.element.onclick = function() {
	// 				field.triggerEvent("openmodal", true);
	// 			}
	// 			field.handle.events.modify = function() {
	// 				input.element.classList.toggle("modified", field.handle.isModified());
	// 			}
	// 			field.handle.events.load = function() {
	// 				input.element.classList.toggle("loading", field.handle.loading > 0);
	// 			}
	// 			field.handle.events.set = function() {
	//
	// 				input.element.textContent = field.handle.getValue();
	// 			}
	//
	// 			field.handle.triggerEvent("load");
	// 			field.handle.triggerEvent("set");
	// 			field.handle.triggerEvent("modify");
	//
	// 			// this.element.classList.toggle("loading", field.loading > 0);
	// 			// this.element.classList.toggle("modified", field.isModified());
	// 		}
	// 	};
	// }
	// initValue(item) {
	// 	this.handle.initValue(item);
	// }

	// initValue(value) {
	// 	this.handle.initValue(value[this.handle.resource.key]);
	// }
	//
	// build() {
	//
	// 	return this.handle.build();
	// }

	buildModal() {

		return {
			class: "karma-modal",
			update: container => {

				container.children = [
					{
						class: "karma-modal-header",
						children: [
							{
								tag: "h2",
								init: h2 => {
									h2.element.textContent = this.resource.title || "Edit";
								}
							},
							{
								tag: "button",
								child: new KarmaFieldsAlpha.fields.icon({
									type: "icon",
									value: "no-alt.svg"
								}).build(),
								init: button => {
									button.element.onclick = () => {
										this.setParam(this.resource.modal_key || "id", null);
										this.editFull();
									}
								}
							}
						]
					},
					{
						class: "karma-modal-body karma-field-frame",
						update: frame => {
							frame.child = this.content.build();
						}
					}
				];
			}
		};

	}



}
