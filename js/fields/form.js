KarmaFields.fields.form = function(field) {
	return {
		class: "karma-field-form",
		init: function(group) {

			field.events.init = function(field) {
				field.data.loading = true;
				field.trigger("update");
				this.get(field).then(function() {
					field.data.loading = false;
					field.setValue(value, "set");
				});
			};

			field.events.change = function(field) {
				field.history.save();
				KarmaFields.Form.update(field.resource.driver, field.getModifiedValue());
				// input.value = JSON.stringify(form.getModifiedValue() || {});
			};

			field.events.querykey = function(handle, params) {
				return KarmaFields.Form.fetch(field.resource.driver, handle, params);
			};

			field.events.get = function(field) {
				let path = field.getPath();
				return KarmaFields.Form.get(field.resource.driver, path);
			}


		},
		update: function() {
			this.child = KarmaFields.fields["group"](field);
		}
	};
}
