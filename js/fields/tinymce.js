// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js


KarmaFields.fields.tinymce = function(field) {
	var manager = {};
	return KarmaFields.build({
		class: "editor",
		children: function() {
			return [
				KarmaFields.build({
					class: "field-controls",
					child: function() {
						return KarmaFields.build({
							class: "field-controls-group",
							children: function() {
								return [
									KarmaFields.includes.icon({
										tag: "button",
										url: KarmaFields.icons_url+"/table-row-before.svg",
										init: function(element, update) {
											element.addEventListener("click", function(event) {
												event.preventDefault();
												if (manager.editor) {
													// manager.editor.execCommand("Bold");
													// manager.editor.execCommand("JustifyRight");
													manager.editor.execCommand("mceLink", true);

													console.log(manager.editor);
													// manager.editor.selection.setContent("yyy");
												}

											});
										}
									}),
									KarmaFields.includes.icon({
										tag: "button",
										url: KarmaFields.icons_url+"/car.svg",
										init: function(element, update) {
											element.addEventListener("click", function(event) {
												event.preventDefault();

												// var s = window.getSelection();
												// var oRange = s.getRangeAt(0); //get the text range
												// oRect = oRange.getBoundingClientRect();

												// console.log(manager.editor.selection.getRng());

												manager.editor.execCommand('mceInsertLink', false, {
							            href: "http://wuegwuueifgwe.com",
							            title: "jhkku"
							          });


												// console.log(manager.editor.selection.getRng().getBoundingClientRect());

											});
										}
									}),
									KarmaFields.includes.icon({
										tag: "button",
										url: KarmaFields.icons_url+"/car.svg",
										init: function(element, update) {
											element.addEventListener("click", function(event) {
												event.preventDefault();

												// var s = window.getSelection();
												// var oRange = s.getRangeAt(0); //get the text range
												// oRect = oRange.getBoundingClientRect();

												// console.log(manager.editor.selection.getRng());



												manager.editor.execCommand('unlink');

												// console.log(manager.editor.selection.getRng().getBoundingClientRect());

											});
										}
									})
								];
							}
						});
					}
				}),
				KarmaFields.build({
					class: "editor-content",
					init: function(element) {
						element.id = field.id;
						element.editable = true;

						tinyMCE.init({
							target: element,
							hidden_input: false,
							inline: true,
							menubar: false,
							contextmenu: false,
							toolbar: false,
							skin: false,
							plugins: "link"

						}).then(function(editors) {
							manager.editor = editors.pop();


							// unactivate history
							manager.editor.on("BeforeAddUndo", function(event) {

								event.preventDefault();

								var content = manager.editor.getContent();
								console.log("BeforeAddUndo", content);
								if (field.isDifferent(content)) {
									field.history.save();
								}

							});



							// console.log(manager.editor);

							field.onUpdate = function(value) {
								manager.editor.setContent(value || "");
							}
							field.onInherit = function(value) {
								//input.placeholder = value || "";
							}
							field.onRemove = function(value) {
								manager.editor.destroy();
							}
							field.fetch().then(field.onUpdate);

							manager.editor.on("input", function(event) {
								var value = manager.editor.getContent();
								field.set(value);
							});

							// field.fetch().then(function(value) {
							// 	manager.editor.setContent(value || "");
							//
							// 	manager.editor.on("input", function(event) {
							// 		var value = manager.editor.getContent();
							// 		field.set(value).then(function() {
							// 			if (field.isModified != field.wasModified) {
							// 				field.history.save();
							// 			}
							// 			field.save();
							// 		});
							// 	});
							//
							// 	// addEventListener("input", function() {
							// 	// 	field.set(input.value).then(function() {
							// 	// 		if (field.isModified != field.wasModified) {
							// 	// 			field.history.save();
							// 	// 		}
							// 	// 		field.save();
							// 	// 	});
							// 	// });
							//
							// });
						});

						// setTimeout(function() {
						// 	// tinyMCE.init(element).then(function(r) {
						// 	// 	console.log(r);
						// 	// });
						//
						// }, 1000);



						// input.addEventListener("input", function() {
						// 	field.set(input.value).then(function() {
						// 		if (field.isModified != field.wasModified) {
						// 			field.history.save();
						// 		}
						// 		field.save();
						// 	});
						// });
						// field.fetch().then(function(value) {
						// 	input.value = value || "";
						// });
						// field.fetchPlaceholder().then(function(value) {
						// 	input.placeholder = value || "";
						// });

						// field.onFocus = function() {
						// 	input.focus();
						// }
						// field.onBlur = function() {
						// 	input.blur();
						// }
						// if (field.resource.width) {
						// 	input.style.width = field.resource.width;
						// }
						// if (field.resource.height) {
						// 	input.style.height = field.resource.height;
						// }
					}
				})
			];
		}
	});
}
