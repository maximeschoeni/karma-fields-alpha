KarmaFields.fields.header = function(manager) {
	return {
		tag: manager.resource.level || "h1",
		init: function() {
			this.element.textContent = manager.resource.title;
		}
	};
}
