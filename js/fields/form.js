KarmaFieldsAlpha.fields.form = {};
KarmaFieldsAlpha.fields.form.create = function(resource) {
	let field = KarmaFieldsAlpha.fields.group.create(resource);

	// overrided in post-field.php
	// field.events.output = function(value) {
	// 	return this.submit(value);
	// };
	//


	field.events.submit = function() {
		let values = {};
		values[field.resource.driver] = {};
		values[field.resource.driver][field.resource.key] = field.getModifiedValue() || {};

		return KarmaFieldsAlpha.Form.update(field.resource.driver, values).then(function(results) {
			return results;
		});
	};

	field.events.change = function(currentField) {
		currentField.history.save(); // -> should move on field level


		// console.log();
		// let values = {};
		// values[field.resource.driver] = {};
		// values[field.resource.driver][field.resource.key] = field.getModifiedValue() || {};
		return field.triggerEvent("submit");
	};
	field.events.init = function(currentField) {
		if (currentField.resource.key) {
			KarmaFieldsAlpha.Form.get(field.resource.driver, field.resource.key+"/"+currentField.resource.key).then(function(results) {
				currentField.setValue(results, "set");
			});
		}
	};
	field.events.fetch = function(currentField) {
		if (currentField.resource.key) {
			return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", {
				key: currentField.resource.key
			}).then(function(results) {
				return results;
			});
		}
	};
	field.events.files = function(ids) {
		return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "queryfiles", {
			ids: ids.join(",")
		}).then(function(results) {
			return results;
		});
	};

	return field;
}

KarmaFieldsAlpha.fields.form.build = function(field) {
	return KarmaFieldsAlpha.fields.group.build(field);
}
