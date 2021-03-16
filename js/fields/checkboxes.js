KarmaFields.fields.checkboxes = function(field) {
	return KarmaFields.build({
		class: "checkboxes",
		children: function() {
			var children = (field.resource.options || []).map(function(option) {
				return field.createChild({
					field: "checkbox",
					description: option.name,
					child_key: option.key
				});
			});
			field.onUpdate = function() {
				children.forEach(function(child) {
					child.update();
				});
			}
			field.onRemove = function(value) {
				children.forEach(function(child) {
					child.remove();
				});
			}
			return children.map(function(child) {
				return child.build();
			});
		}
	});
}
