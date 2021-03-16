KarmaFields.fields.index = function(field) {
	return KarmaFields.build({
		class: "index",
		text: function(input) {
			return (field.rowIndex || 0) + 1;
		}
	});
}
