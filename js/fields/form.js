KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.group {

	// constructor(resource, domain, parent) {
	// 	super(resource, domain || new KarmaFieldsAlpha.Domain(), parent);
	//
	// }

	initField() {
		const field = this;
		this.events.change = function(currentField, value) {
			return field.bubble("submit", currentField, value); // this.submit();
		};

		this.events.submit = async function() {
			let values = field.getModifiedValue();

			if (values) {
				KarmaFieldsAlpha.Form.cache = {};
				return this.save(values);
				// return KarmaFieldsAlpha.Form.update(resource.driver, values).then(function(results) {
				// 	// field.updateOriginal();
				// 	field.setValue(values, "set"); // -> unmodify fields
				// 	// field.setValue(results, "set"); // -> update value (false or true -> no effect)
				// 	// field.triggerEvent("modify");
				// 	// field.triggerEvent("set");
				// 	return results;
				// });
			}
		};
	}



	fetch(queryString) {
		return KarmaFieldsAlpha.Form.fetch2(this.resource.driver, queryString);
  }

	getDriver() {
		console.warn("Deprecated function getDriver");
		return this.resource.driver;
	}

	// getPath() {
	// 	return [];
	// }

	readPath(keys) {
		return this.domain.readPath(keys.join("/"));
	}

	writePath(keys, rawValue) {
		this.domain.writePath(keys.join("/"), rawValue);
	}

	getFromPath(keys) {
		const field = this;
		return KarmaFieldsAlpha.Form.get(this.resource.driver, keys.join("/"));
	}

	save(values) {
		const field = this;

		return KarmaFieldsAlpha.Form.update(this.resource.driver, values).then(function(results) {
			// field.setValue(values, "set"); // -> unmodify fields
			field.initValue(values, true);
			field.initValue(results, true);
			return results;
		});
	}

};
