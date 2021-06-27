// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js

KarmaFieldsAlpha.fields.editor = {};

KarmaFieldsAlpha.fields.editor.create = function(resource) {
	let field = KarmaFieldsAlpha.Field(resource);

	return field;
}

KarmaFieldsAlpha.fields.editor.build = function(field) {
	return {
		class: "editor-content",
		init: function(node) {
			this.element.id = field.getId();
			// this.element.editable = true;

			tinyMCE.init({
				target: this.element,
				hidden_input: false,
				inline: true,
				menubar: false,
				contextmenu: false,
				toolbar: true,
				skin: false
				// plugins: "link"


			}).then(function(editors) {
				// field.data.editor = editors.pop();
				//
				// field.events.update = function() {
				// 	field.data.editor.setContent(field.getValue() || "");
				// }
				// field.events.update();
				//
				// field.data.editor.on("input", function(event) {
				// 	var value = field.data.editor.getContent();
				// 	field.setValue(value);
				// });

			});
		}
	};
}
