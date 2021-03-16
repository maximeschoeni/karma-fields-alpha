if (!window.KarmaFields) {
	KarmaFields = {};
}
KarmaFields.customfields = {};

KarmaFields.fields = {};
KarmaFields.filters = {};
KarmaFields.tables = {};
KarmaFields.managers = {};
KarmaFields.selectors = {};
KarmaFields.utils = {};
KarmaFields.includes = {};
KarmaFields.events = {};
KarmaFields.assets = {};
KarmaFields.fetchCache = {};
KarmaFields.Loading = function(){}; // create loading instance
KarmaFields.wm = {};

KarmaFields.storage = { //Window.sessionStorage || {
	values: {},
	getItem: function(key) {
		return this.values[key];
	},
	setItem: function(key, value) {
		this.values[key] = value;
	},
	removeItem: function(key) {
		this.values[key] = undefined;
	}
};

KarmaFields.getAsset = function(url) {
	if (!KarmaFields.assets[url]) {
		KarmaFields.assets[url] = fetch(url).then(function(response) {
			return response.text();
		});
	}
	return KarmaFields.assets[url];
}
// KarmaFields.getIcon = function(url) {
// 	KarmaFields.getAsset(url).then(function(result) {
// 		requestAnimationFrame(function() {
// 			element.innerHTML = result;
// 		});
// 	})
// };
window.addEventListener("keydown", function(event) {
	if (event.metaKey && event.key === "c" && KarmaFields.events.onCopy) {
		KarmaFields.events.onCopy(event);
	}
	if (event.metaKey && event.key === "v" && KarmaFields.events.onPast) {
		KarmaFields.events.onPast(event);
	}
	if (event.metaKey && event.key === "a" && KarmaFields.events.onSelectAll) {
		KarmaFields.events.onSelectAll(event);
	}
	if (event.metaKey && event.key === "s" && KarmaFields.events.onSave) {
		KarmaFields.events.onSave(event);
	}
	if (event.metaKey && !event.shiftKey && event.key === "z" && KarmaFields.events.onUndo) {
		KarmaFields.events.onUndo(event);
	}
	if (event.metaKey && event.shiftKey && event.key === "z" && KarmaFields.events.onRedo) {
		KarmaFields.events.onRedo(event);
	}
	if (event.key === "Backspace" && KarmaFields.events.onDelete) {
		KarmaFields.events.onDelete(event);
	}
	if (event.key === "+" && KarmaFields.events.onAdd) {
		KarmaFields.events.onAdd(event);
	}

	if (event.key === "ArrowUp" && KarmaFields.events.onArrowUp) {
		KarmaFields.events.onArrowUp(event);
	}
	if (event.key === "ArrowDown" && KarmaFields.events.onArrowDown) {
		KarmaFields.events.onArrowDown(event);
	}
	if (event.key === "ArrowLeft" && KarmaFields.events.onArrowLeft) {
		KarmaFields.events.onArrowLeft(event);
	}
	if (event.key === "ArrowRight" && KarmaFields.events.onArrowRight) {
		KarmaFields.events.onArrowRight(event);
	}

	KarmaFields.events.unload
	if (event.key === "Backspace" && KarmaFields.events.onUnload) {
		KarmaFields.events.onDelete(event);
	}


	// console.log(event.key);
});

document.addEventListener("mouseup", function() {
  if (KarmaFields.events.onClick) {
    KarmaFields.events.onClick();
  }
});

window.addEventListener("beforeunload", function() {
	if (KarmaFields.events.onUnload) {
		KarmaFields.events.onUnload();
	}
});




//
// KarmaFields.attachmentPromises = {};
// KarmaFields.getImageSrc = function(id, callback) {
// 	if (!KarmaFields.attachmentPromises[id]) {
// 		KarmaFields.attachmentPromises[id] = new Promise(function(resolve, reject) {
// 			Ajax.get(KarmaFields.ajax_url, {
// 				action: "karma_multimedia_get_image_src",
// 				id: id
// 			}, function(results) {
// 				resolve(results);
// 			});
// 		});
// 	}
// 	if (callback) {
// 		KarmaFields.attachmentPromises[id].then(callback);
// 	}
// 	return KarmaFields.attachmentPromises[id];
// }


// KarmaFields.save = function(post, data) {
// 	return fetch(KarmaFields.rest+"/update/post/"+post.id, {
// 		method: "post",
// 		headers: {"Content-Type": "application/json"},
// 		body: JSON.stringify(data),
// 		mode: 'same-origin'
// 	}).then(function(result) {
// 		return result.json();
// 	});
// };
// KarmaFields.get = function(key, postURI) {
// 	return fetch(KarmaFields.cache+"/"+postURI+"/"+key);
// };




//
// KarmaFields.terms = {
// 	promises: {},
// 	getPromise: function(taxonomy) {
// 		if (!this.promises[taxonomy]) {
// 			this.promises[taxonomy] = new Promise(function(resolve, reject) {
// 				Ajax.get(KarmaFields.ajax_url, {
// 					action: "karma_field_get_terms",
// 					taxonomy: taxonomy
// 				}, function(results) {
// 					if (results.terms) {
// 						resolve(results.terms);
// 					} else {
// 						reject(results.error);
// 					}
// 				});
// 			});
// 		}
// 		return this.promises[taxonomy];
// 	}
// };


KarmaFields.createImageUploader = function() {
	var manager = {
		addFrame: null,
		imageId: null,
		open: function () {
			if (!this.addFrame) {
				var args = {
					title: "Select file",
					button: {
						text: "Use this file"
					},
					library: {
            type: manager.mimeType || null //'application/font-woff'
        	},
					multiple: false
				};
				// if (manager.mimeType) {
				// 	args["library"] = {
        //     type: manager.mimeType
        // 	}
				// }
				this.addFrame = wp.media(args);
				this.addFrame.on("select", function() {
					if (manager.onSelect) {
						manager.onSelect(manager.addFrame.state().get("selection").toJSON().map(function(attachment) {
							return attachment;
						}));
					}
				});
				this.addFrame.on("open", function() {
					var selection = manager.addFrame.state().get("selection");
					if (manager.imageId) {
						selection.add(wp.media.attachment(manager.imageId));
					}
				});
			}
			this.addFrame.open();
		}
	}
	return manager;
}
KarmaFields.createGalleryUploader = function() {
	var manager = {
		frame: null,
		imageIds: null,
		mimeTypes: ["image"],
		open: function () {
			if (!this.frame) {
				// enable video
				wp.media.controller.GalleryAdd = wp.media.controller.GalleryAdd.extend({
					initialize: function() {
						if ( ! this.get('library') ) {
							this.set( 'library', wp.media.query(manager.mimeTypes ? { type: manager.mimeTypes } : null) );
						}
						wp.media.controller.Library.prototype.initialize.apply( this, arguments );
					}
				});
				wp.media.controller.GalleryEdit = wp.media.controller.GalleryEdit.extend({
					activate: function() {
						var library = this.get('library');
						if (manager.mimeTypes) {
							library.props.set( 'type', manager.mimeTypes );
						}
						this.get('library').observe( wp.Uploader.queue );
						this.frame.on( 'content:render:browse', this.gallerySettings, this );
						wp.media.controller.Library.prototype.activate.apply( this, arguments );
					}
				});
				wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
					render: function() {
						return this;
					}
				});
				if (this.imageIds && this.imageIds.length) {
					this.frame = wp.media.gallery.edit('[gallery ids="'+this.imageIds.join(",")+'"]');
				} else {
					this.frame = wp.media({
						frame: "post",
						state: "gallery-edit",
						type: this.mimeTypes,
						editing: true,
						multiple: true  // Set to true to allow multiple files to be selected
					});
				}
				this.frame.on("update",function(items) {
					var attachments = items.map(function(item){
						return item.attributes;
					});
					manager.imageIds = attachments.map(function(attachment) {
						return attachment.id;
					});
					if (manager.onChange) {
						manager.onChange(attachments);
					}
				});
			}
			this.frame.open();
		}
	}
	return manager;
}
