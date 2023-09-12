// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js
// /Applications/MAMP/htdocs/wordpress/wp-admin/js/editor.js


// https://make.wordpress.org/core/2017/05/20/editor-api-changes-in-4-8/

KarmaFieldsAlpha.field.editor = class extends KarmaFieldsAlpha.field {

	// static getUniqueId() {
	//
	// 	if (!this.editorIndex) {
	//
	// 		this.editorIndex = 0;
	//
	// 	}
	//
	// 	this.editorIndex++;
	//
	// 	return `ufo-editor-${this.editorIndex}`;
	//
	// }


	// registerInstance(instance) {
	//
	// 	if (instance.editor && instance.editor !== KarmaFieldsAlpha.loading) {
	//
	// 		instance.onUpdateContent = (content, context) => {
	// 			this.setValue(content);
	// 			this.render();
	// 			this.save("input");
	// 		}
	//
	// 		// instance.onGetContent = () => {
	// 		// 	return instance.editor.getContent();
	// 		// }
	//
	// 	}
	//
	// }


	build() {

		return {
			class: "editor-container",
			update: container => {
				const instance = KarmaFieldsAlpha.wptinymce.getInstance(container.element);

				// this.registerInstance(instance);

				if (instance.editor && instance.editor !== KarmaFieldsAlpha.loading) {

					instance.onUpdateContent = (content, context) => {

						this.setValue(content);
						this.render();
						this.save("input");
					}

					const value = this.getSingleValue() || "";

					if (value !== KarmaFieldsAlpha.loading) {

						const content = instance.editor.getContent();

						if (content !== value) {

							instance.editor.setContent(value);

						}

					}

				}

				container.children = [
					{
						tag: "textarea",
						init: textarea => {
							instance.init(textarea.element, this.resource.mceinit);
						}
					}
				];
			}
			// children: [
			// 	{
			// 		tag: "textarea",
			// 		init: textarea => {
			//
			// 			instance.init(textarea.element, this.resource.mceinit);
			//
			//
			// 			const uid = this.constructor.getUniqueId();
			// 			console.log(uid);
			// 			textarea.element.id = uid;
			// 			// textarea.element.value = ;
			//
			// 			// setTimeout(() => {
			// 			// 	textarea.element.value = "Hlghéhhévé";
			// 			// }, 3000);
			//
			//
			// 			wp.editor.initialize(
			// 	      uid,
			// 				{
			// 					tinymce: {
			// 		        wp_autoresize_on: true
			// 		        // plugins: 'wpautoresize'
			// 					}
			// 				}
			// 	      // {
			// 	      //   tinymce: {
			// 	      //     wpautop: true,
			// 	      //     plugins : 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
			// 	      //     toolbar1: 'bold italic underline strikethrough | bullist numlist | blockquote hr wp_more | alignleft aligncenter alignright | link unlink | fullscreen | wp_adv',
			// 	      //     toolbar2: 'formatselect alignjustify forecolor | pastetext removeformat charmap | outdent indent | undo redo | wp_help'
			// 	      //   },
			// 	      //   quicktags: true,
			// 	      //   mediaButtons: true,
			// 	      // }
			// 	    );
			//
			//
			// 			const editor = tinymce.get(uid);
			//
			// 			tinymce.on('AddEditor', function(e) {
			// 			  console.log('Added editor with id: ' + e.editor.id);
			// 			});
			//
			//
			//
			//
			// 			// editor.setContent("Jghéj");
			// 		}
			// 	}
			// ]


			// init: node => {
			// 	node.element.id = this.getId();
			// 	// this.element.editable = true;
			//
			// 	// tinyMCE.init({
			// 	// 	target: node.element,
			// 	// 	hidden_input: false,
			// 	// 	// inline: true
			// 	// 	menubar: false,
			// 	// 	toolbar: 'styleselect | bold italic | undo redo',
			// 	// 	// content_css: 'wordpress',
			// 	// 	// contextmenu: false,
			// 	// 	// toolbar: true,
			// 	// 	skin: false,
			// 	// 	plugins: ["link"]
			// 	//
			// 	//
			// 	// }).then(editors => {
			// 	//
			// 	//
			// 	// });
			//
			//
			//
			//
			// },
			// complete: node => {
			// 	// setTimeout(() => {
			// 	// 	// wp.editor.getDefaultSettings = () => {
			// 	// 	// 	return {
			//   //   //     tinymce: {
			//   //   //       wpautop: true,
			//   //   //       plugins : 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
			//   //   //       toolbar1: 'bold italic underline strikethrough | bullist numlist | blockquote hr wp_more | alignleft aligncenter alignright | link unlink | fullscreen | wp_adv',
			//   //   //       toolbar2: 'formatselect alignjustify forecolor | pastetext removeformat charmap | outdent indent | undo redo | wp_help'
			//   //   //     },
			//   //   //     quicktags: true,
			//   //   //     mediaButtons: true,
			//   //   //   }
			// 	// 	// };
			// 	// 	// wp.oldEditor.remove("content");
			// 	// 	console.log(window.wp.editor.getDefaultSettings);
			// 	//
			// 	// 	wp.editor.remove("textarea_xxx");
			// 	//
			// 		wp.editor.initialize(
			//       "xxx",
			// 			{
			// 				tinymce: {
			// 	        wp_autoresize_on: true
			// 	        // plugins: 'wpautoresize'
			// 				}
			// 			}
			//       // {
			//       //   tinymce: {
			//       //     wpautop: true,
			//       //     plugins : 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
			//       //     toolbar1: 'bold italic underline strikethrough | bullist numlist | blockquote hr wp_more | alignleft aligncenter alignright | link unlink | fullscreen | wp_adv',
			//       //     toolbar2: 'formatselect alignjustify forecolor | pastetext removeformat charmap | outdent indent | undo redo | wp_help'
			//       //   },
			//       //   quicktags: true,
			//       //   mediaButtons: true,
			//       // }
			//     );
			// 		this.complete = null;
			// 	//
			// 	// }, 2000);
			//
			// }
		};

	}
}



KarmaFieldsAlpha.wptinymce = class {

	static clearInstances() {

		if (this.map) {

			this.map.forEach(instance => void instance.destroy());

			this.map.clear();

		}

	}

	static getInstance(container) {

		if (!this.map) {

			this.map = new Map();

		}

		if (!this.map.has(container)) {

			this.map.set(container, new this(this.map.size));

		}

		return this.map.get(container);

	}

	constructor(index) {
		this.index = index;
		this.id = `ufo-wpeditor-${this.index}`;
	}

	init(textarea, params = {}) {

		textarea.id = this.id;

		const promise = new Promise(resolve => {
			const onAdded = event => {
				if (event.editor.id === this.id) {
					tinymce.off('AddEditor', onAdded);
					resolve();
				}
			}
			tinymce.on('AddEditor', onAdded);
		});

		wp.editor.initialize(
			this.id,
			{
				tinymce: {
					wp_autoresize_on: true,
					...params
				}
			}
		);

		KarmaFieldsAlpha.tasks.push({
			type: "editor",
			id: id,
			resolve: async task => {
				await promise;
				this.create();
			}
		});

	}

	create(element) {

		const editor = tinymce.get(this.id);

		editor.on("input", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "input");
			}
		});
		editor.on("paste", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "paste");
			}
		});
		editor.on("cut", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "paste");
			}
		});

		// -> input event does not seem to capture line break (single or double) or delete line break !
		editor.on("keyup", event => {
			if ((event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") && this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "delete");
			}
		});

		this.editor = editor;

	}

	destroy() {

		if (this.editor) {

			this.editor.destroy();

		}

	}

}
