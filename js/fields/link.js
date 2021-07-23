KarmaFieldsAlpha.fields.link = class extends KarmaFieldsAlpha.fields.field {

	// constructor(resource, domain) {
	// 	super(resource, domain);
	//
	// 	if (this.resource.driver) {
	// 		const driver = this.resource.driver;
	// 		this.events.fetch = function(field, params) {
	// 			return field.queryOptions(driver, params);
	// 		};
	// 	}
	//
	// }

	getRemoteOptions(paramString) {
		if (this.resource.driver) {
			return super.getRemoteOptions(paramString, this.resource.driver);
		}
	}

	// getParamString(sep) {
	// 	const params = {
	// 		key: this.resource.key,
	// 		[this.resource.key]: this.getValue(),
	// 		...this.resource.params
	// 	};
	//
	// 	return KarmaFieldsAlpha.Form.encodeParams(params, sep || "");
	// }

	// async update() {
	// 	const value = await super.update();
	// 	const queryString = KarmaFieldsAlpha.Form.encodeParams({
	// 		key: this.resource.key
	// 	}, "?"); //this.getParamString("?"); // "?"+key+"="+field.resource.key
	// 	const results = await this.getRemoteOptions(queryString);
	// 	const options = results.items || results || [];
	// 	const option = options.find(option => option.key === value);
	// 	return option && option.name || value;
	// }

	async updateOptions() {
		const value = this.getValue();
		const queryString = KarmaFieldsAlpha.Form.encodeParams({
			key: this.resource.key
		}, "?"); //this.getParamString("?"); // "?"+key+"="+field.resource.key
		const results = await this.getRemoteOptions(queryString);
		const options = results.items || results || [];
		const option = options.find(option => option.key === value);
		return option && option[this.resource.option_property || "name"] || value;
	}


	// difference with KarmaFieldsAlpha.Form.encodeParams: params values can be empty
	// encodeParams(params) {
	// 	const array = [];
	// 	for (var key in params) {
	// 		if (params[key] !== undefined && params[key] !== null) {
	// 			array.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key].toString()));
	// 		}
	// 	}
	// 	array.sort();
	// 	return array.join("&");
	// }

	build() {
		return {
			tag: "a",
			class: "text karma-field",
			init: a => {
				a.element.setAttribute('tabindex', '-1');
				this.init(a.element);
			},
			update: async a => {
				a.element.classList.add("loading");
				const value = await this.update();
				if (this.resource.href) {
					a.element.href = this.resource.href.replace("%value%", value);
					// +"#"+this.encodeParams({
					// 	[this.resource.target_key || this.resource.key]: value,
					// 	...this.resource.target_params
					// }); //this.getParamString("#");

				}
				// a.element.onclick = async (event) => {
				// 	a.element.classList.add("loading");
				// 	// await this.bubble("nav", {
				// 	// 	[this.resource.target_key || this.resource.key]: value,
				// 	// 	...this.resource.target_params
				// 	// });
				// 	const form = this.resource.target_driver && KarmaFieldsAlpha.fields.form.getForm(this.resource.target_driver) || this.form;
				// 	form.setDeltaValue(value, [this.resource.target_key || this.resource.key]);
				// 	for (let path in this.resource.target_params) {
				// 		form.setDeltaValue(this.resource.target_params[path], [path]);
				// 	}
				// 	if (!this.resource.href) {
				// 		this.form.render();
				// 	}
				// 	a.element.classList.remove("loading");
				// }
				const optionValue = await this.updateOptions();
				a.element.innerHTML = optionValue;
				a.element.classList.remove("loading");
			}
		};
	}

}
