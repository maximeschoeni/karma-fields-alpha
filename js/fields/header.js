KarmaFieldsAlpha.fields.header = {};
KarmaFieldsAlpha.fields.header.build = function(manager) {
	return {
		tag: manager.resource.level || "h3",
		init: function() {
			this.element.textContent = manager.resource.value;
		}
	};
}
