KarmaFieldsAlpha.fields.files = class extends KarmaFieldsAlpha.fields.file {


  createUploader(resource) {
    const field = this;
    const uploader = {
      frame: null,
      open: function () {
        if (!this.frame) {
          let mimeTypes = resource.file && (resource.file.type || resource.file.types)
            || resource.mime_types
            || resource.mime_type
            || resource.mimeTypes
            || resource.mimeType
            || resource.mimetypes
            || resource.mimetype;
          // enable video
          wp.media.controller.GalleryAdd = wp.media.controller.GalleryAdd.extend({
            initialize: function() {
              if ( ! this.get('library') ) {
                this.set( 'library', wp.media.query(mimeTypes ? { type: mimeTypes } : null) );
              }
              wp.media.controller.Library.prototype.initialize.apply( this, arguments );
            }
          });
          wp.media.controller.GalleryEdit = wp.media.controller.GalleryEdit.extend({
            activate: function() {
              var library = this.get('library');
              if (mimeTypes) {
                library.props.set( 'type', mimeTypes );
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
          let ids = field.getValue();
          if (ids.length) {
            this.frame = wp.media.gallery.edit('[gallery ids="'+ids.join(",")+'"]');
          } else {
            this.frame = wp.media({
              frame: "post",
              state: "gallery-edit",
              type: mimeTypes || ["image"],
              editing: true,
              multiple: true  // Set to true to allow multiple files to be selected
            });
          }
          this.frame.on("update",function(items) {
            field.backup();
            field.saveValue(items.map(function(item) {
              return item.attributes.id;
            }), true, false);

            // field.triggerEvent("history");
            // field.setValue(items.map(function(item) {
            //   return item.attributes.id;
            // }));
            // field.triggerEvent("change", true);
            // field.triggerEvent("set");
          });
        }
        this.frame.open();
      }
    };
    return uploader;
  }

  stringify(value) {
    return JSON.stringify(value);
  }
  parse(value) {
    return JSON.parse(value);
  }

  prepare(value) {
    if (!Array.isArray(value)) {
      return [value.toString()];
    }
    return value;
  }


  getEmpty() {
    return [];
  }

  validate(value) {
    const field = this;

    if (!value || !Array.isArray(value)) {
      return Promise.resolve([]);
    } else if (this.hasFiles(value)) {
      return Promise.resolve(value);
    } else {
      return this.fetchIds(value).then(function() {
        return value;
      });
    }
  }


  buildContent(value) {
    const field = this;
    return [
      {
        tag: "a",
        class: "gallery",
        update: function(gallery) {
          this.element.onclick = function(event) {
            event.preventDefault();
            field.uploader.open();
          };
        },
        children: [
          {
            class: "images-container",
            update: function() {
              this.children = value.map(function(image_id) {
                const file = field.getFile(image_id);
                const type = file.type.startsWith("image") ? "image" : "file";
                return {
                  class: "image-container",
                  child: {
                    tag: "img",
                    update: function() {
                      this.element.src = file.src;
                      this.element.width = file.width;
                      this.element.height = file.height;
                    }
                  }
                };
              });
            }
          },
          {
            class: "add-container",
            children: [
              {
                class: "add",
                update: function() {
                  this.element.textContent = value.length ? "Add or edit files..." : "Add files...";
                }
              },
              {
                class: "karma-field-spinner"
              }
            ]
          }
        ]
      },
      {
        class: "field-control",
        update: function() {
          if (value.length) {
            this.children = [{
              tag: "button",
              class: "delete button",
              update: function() {
                this.element.textContent = "Remove";
                this.element.addEventListener("click", function(event) {
                  event.preventDefault();
                  field.backup();
                  field.saveValue([], true);
                });
              }
            }];
          } else {
            this.children = [];
          }
        }
      }
    ];
  }

  build() {
    const field = this;

    return {
			class: "karma-files",
			init: function(container) {
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}
        this.element.setAttribute('tabindex', '-1');
        field.init(this.element);
			},
			update: function(container) {

        // container.child = field.buildContent(0);

        field.onSet = function(value) {
          container.children = field.buildContent(value);
          container.render();
        }
        field.onModified = function(modified) {
					container.element.classList.toggle("modified", modified);
				}
				field.onLoad = function(loading) {
          container.element.classList.toggle("loading", loading);
				}

        field.update();
			}
		};

  }

}




// KarmaFieldsAlpha.fields.files = class extends KarmaFieldsAlpha.fields.file {
//
//   constructor(resource) {
//     super(resource);
//
//     this.datatype = "array";
//
//   }
//
//   createUploader(resource) {
//     const field = this;
//     const uploader = {
//       frame: null,
//       open: function () {
//         if (!this.frame) {
//           let mimeTypes = resource.file && (resource.file.type || resource.file.types)
//             || resource.mime_types
//             || resource.mime_type
//             || resource.mimeTypes
//             || resource.mimeType
//             || resource.mimetypes
//             || resource.mimetype;
//           // enable video
//           wp.media.controller.GalleryAdd = wp.media.controller.GalleryAdd.extend({
//             initialize: function() {
//               if ( ! this.get('library') ) {
//                 this.set( 'library', wp.media.query(mimeTypes ? { type: mimeTypes } : null) );
//               }
//               wp.media.controller.Library.prototype.initialize.apply( this, arguments );
//             }
//           });
//           wp.media.controller.GalleryEdit = wp.media.controller.GalleryEdit.extend({
//             activate: function() {
//               var library = this.get('library');
//               if (mimeTypes) {
//                 library.props.set( 'type', mimeTypes );
//               }
//               this.get('library').observe( wp.Uploader.queue );
//               this.frame.on( 'content:render:browse', this.gallerySettings, this );
//               wp.media.controller.Library.prototype.activate.apply( this, arguments );
//             }
//           });
//           wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
//             render: function() {
//               return this;
//             }
//           });
//           let ids = field.getValue();
//           if (ids.length) {
//             this.frame = wp.media.gallery.edit('[gallery ids="'+ids.join(",")+'"]');
//           } else {
//             this.frame = wp.media({
//               frame: "post",
//               state: "gallery-edit",
//               type: mimeTypes || ["image"],
//               editing: true,
//               multiple: true  // Set to true to allow multiple files to be selected
//             });
//           }
//           this.frame.on("update",function(items) {
//             field.triggerEvent("history");
//             field.setValue(items.map(function(item) {
//               return item.attributes.id;
//             }));
//             field.triggerEvent("change", true);
//             field.triggerEvent("set");
//           });
//         }
//         this.frame.open();
//       }
//     };
//     return uploader;
//   }
//
//   build() {
//     const field = this;
//
//     return {
// 			class: "karma-field-"+field.resource.type,
// 			init: function(container) {
// 				// field.events.set = function() {
// 				// 	container.render(true); // -> when field value is changed by outside
// 				// }
// 				if (field.resource.style) {
// 					this.element.style = field.resource.style;
// 				}
// 			},
// 			update: function(container) {
//         this.child = {
//           class: "field-file gallery",
//           clear: true,
//           init: function(container) {
//             // field.events.render = function() {
//             //   container.parent.render();
//             // };
//           },
//           update: function(fileContainer) {
//
//             if (field.hasValue()) {
//               let ids = field.getValue();
//               if (ids.length) {
//                 if (field.hasFiles(ids)) {
//                   this.children = field.getFiles(ids).map(function(file) {
//                     return {
//                       class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
//                       init: function() {
//                         this.element.addEventListener("click", function(event) {
//                           event.preventDefault();
//                           field.data.uploader.open();
//                         });
//                       },
//                       child: {
//                         tag: "img",
//                         init: function() {
//                           this.element.src = file.src;
//                           this.element.width = file.width;
//                           this.element.height = file.height;
//                         }
//                       } || {
//                         class: "karma-field-spinner"
//                       }
//                     };
//                   });
//                 } else {
//                   this.children = ids.map(function(id) {
//                     return {
//                       class: "image-frame",
//                       child: {
//                         class: "karma-field-spinner"
//                       }
//                     };
//                   });
//                   field.fetchIds(ids).then(function(result) {
//                     if (result) { // -> prevent infinite loop if file is not found
//                       container.render(true);
//                     }
//                   });
//                 }
//               } else {
//                 this.children = [
//                   {
//                     class: "image-frame type-file",
//                     update: function() {
//                       this.element.onclick = function(event) {
//                         event.preventDefault();
//                         field.data.uploader.open();
//                       };
//                     },
//                     child: {
//                       tag: "button",
//                       class: "add",
//                       init: function() {
//                         this.element.onclick = function(event) {
//                           event.preventDefault();
//                           field.data.uploader.open();
//                         };
//                       },
//                       update: function() {
//                         this.element.textContent = "Add files";
//                       }
//                     }
//                   }
//                 ];
//               }
//               this.children.push({
//                 class: "field-control",
//                 update: function() {
//                   this.children = [];
//                   if (field.getValue().length) {
//                     // this.children.push({
//                     //   tag: "button",
//                     //   class: "edit",
//                     //   init: function() {
//                     //     this.element.textContent = "Edit";
//                     //     this.element.id = field.getId();
//                     //     this.element.addEventListener("click", function(event) {
//                     //       event.preventDefault();
//                     //       field.data.uploader.open();
//                     //     });
//                     //   }
//                     // });
//                     this.children.push({
//                       tag: "button",
//                       class: "delete",
//                       init: function() {
//                         this.element.textContent = "Remove";
//                         this.element.addEventListener("click", function(event) {
//                           event.preventDefault();
//                           field.triggerEvent("history");
//                           field.setValue([]);
//                           field.triggerEvent("change", true);
//                           field.triggerEvent("set");
//                           // container.parent.render(true);
//                         });
//                       }
//                     });
//                   } else {
//                     // this.children.push({
//                     //   tag: "button",
//                     //   class: "insert",
//                     //   init: function() {
//                     //     this.element.textContent = "Add";
//                     //     this.element.id = field.getId();
//                     //     this.element.addEventListener("click", function(event) {
//                     //       event.preventDefault();
//                     //       field.data.uploader.open();
//                     //     });
//                     //   }
//                     // });
//                   }
//                 }
//               });
//             } else {
//               this.child = {
//                 class: "image-frame type-file",
//                 child: {
//                   class: "karma-field-spinner"
//                 }
//               };
//     					field.fetchValue().then(function(value) {
//     						container.render(true);
//     					});
//             }
//             field.events.modify = function() {
//               container.element.classList.toggle("modified", field.isModified());
//             }
//             field.events.load = function() {
//               container.element.classList.toggle("loading", field.loading > 0);
//             }
//             field.events.set = function() {
//               container.render(true);
//             }
//
//             field.triggerEvent("load");
//             field.triggerEvent("modify");
//           }
//         };
//       }
//     };
//
//   }
//
// }
