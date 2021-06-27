KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.field {

	constructor(resource, domain) {
		super(resource, domain);

		if (this.resource.driver) {
			const driver = this.resource.driver;
			this.events.fetch = function(field, params) {
				return field.queryOptions(driver, params);
			};
		}

	}

	build() {
		const field = this;

		return {
			tag: "a",
			class: "text karma-field",
			init: function(input) {
				this.element.setAttribute('tabindex', '-1');
				if (!field.hasValue()) {
					field.fetchValue().then(function(value) {
						field.triggerEvent("set");
						field.triggerEvent("modify");
					});
				}
				field.init(this.element);
			},
			update: function(input) {

				this.element.onclick = function() {
					field.triggerEvent("nav", true);
				}
				field.events.modify = function() {
					input.element.classList.toggle("modified", field.isModified());
				}
				field.events.load = function() {
					input.element.classList.toggle("loading", field.loading > 0);
				}
				field.events.set = function() {
					let value = field.getValue();
					if (field.resource.fetchName) {
						field.maybeFetchOptions({key: field.resource.key}).then(function(options) {
							let option = field.getOptions().find(function(option) {
								return option.key === value;
							});
							input.element.innerHTML = option && option.name || "";
						});
					} else {
						input.element.innerHTML = value || "";
					}
				}

				field.triggerEvent("load");
				field.triggerEvent("set");
				field.triggerEvent("modify");
			}
		};
	}

}
