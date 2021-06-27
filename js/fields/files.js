KarmaFieldsAlpha.fields.files = class extends KarmaFieldsAlpha.fields.file {

  constructor(resource) {
    super(resource);

    this.datatype = "array";

  }

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
            field.triggerEvent("history");
            field.setValue(items.map(function(item) {
              return item.attributes.id;
            }));
            field.triggerEvent("change", true);
            field.triggerEvent("set");
          });
        }
        this.frame.open();
      }
    };
    return uploader;
  }

  build() {
    const field = this;

    return {
			class: "karma-field-"+field.resource.type,
			init: function(container) {
				// field.events.set = function() {
				// 	container.render(true); // -> when field value is changed by outside
				// }
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}
			},
			update: function(container) {
        this.child = {
          class: "field-file gallery",
          clear: true,
          init: function(container) {
            // field.events.render = function() {
            //   container.parent.render();
            // };
          },
          update: function(fileContainer) {

            if (field.hasValue()) {
              let ids = field.getValue();
              if (ids.length) {
                if (field.hasFiles(ids)) {
                  this.children = field.getFiles(ids).map(function(file) {
                    return {
                      class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
                      init: function() {
                        this.element.addEventListener("click", function(event) {
                          event.preventDefault();
                          field.data.uploader.open();
                        });
                      },
                      child: {
                        tag: "img",
                        init: function() {
                          this.element.src = file.src;
                          this.element.width = file.width;
                          this.element.height = file.height;
                        }
                      } || {
                        class: "karma-field-spinner"
                      }
                    };
                  });
                } else {
                  this.children = ids.map(function(id) {
                    return {
                      class: "image-frame",
                      child: {
                        class: "karma-field-spinner"
                      }
                    };
                  });
                  field.fetchIds(ids).then(function(result) {
                    if (result) { // -> prevent infinite loop if file is not found
                      container.render(true);
                    }
                  });
                }
              } else {
                this.children = [
                  {
                    class: "image-frame type-file",
                    update: function() {
                      this.element.onclick = function(event) {
                        event.preventDefault();
                        field.data.uploader.open();
                      };
                    },
                    child: {
                      tag: "button",
                      class: "add",
                      init: function() {
                        this.element.onclick = function(event) {
                          event.preventDefault();
                          field.data.uploader.open();
                        };
                      },
                      update: function() {
                        this.element.textContent = "Add files";
                      }
                    }
                  }
                ];
              }
              this.children.push({
                class: "field-control",
                update: function() {
                  this.children = [];
                  if (field.getValue().length) {
                    // this.children.push({
                    //   tag: "button",
                    //   class: "edit",
                    //   init: function() {
                    //     this.element.textContent = "Edit";
                    //     this.element.id = field.getId();
                    //     this.element.addEventListener("click", function(event) {
                    //       event.preventDefault();
                    //       field.data.uploader.open();
                    //     });
                    //   }
                    // });
                    this.children.push({
                      tag: "button",
                      class: "delete",
                      init: function() {
                        this.element.textContent = "Remove";
                        this.element.addEventListener("click", function(event) {
                          event.preventDefault();
                          field.triggerEvent("history");
                          field.setValue([]);
                          field.triggerEvent("change", true);
                          field.triggerEvent("set");
                          // container.parent.render(true);
                        });
                      }
                    });
                  } else {
                    // this.children.push({
                    //   tag: "button",
                    //   class: "insert",
                    //   init: function() {
                    //     this.element.textContent = "Add";
                    //     this.element.id = field.getId();
                    //     this.element.addEventListener("click", function(event) {
                    //       event.preventDefault();
                    //       field.data.uploader.open();
                    //     });
                    //   }
                    // });
                  }
                }
              });
            } else {
              this.child = {
                class: "image-frame type-file",
                child: {
                  class: "karma-field-spinner"
                }
              };
    					field.fetchValue().then(function(value) {
    						container.render(true);
    					});
            }
            field.events.modify = function() {
              container.element.classList.toggle("modified", field.isModified());
            }
            field.events.load = function() {
              container.element.classList.toggle("loading", field.loading > 0);
            }
            field.events.set = function() {
              container.render(true);
            }

            field.triggerEvent("load");
            field.triggerEvent("modify");
          }
        };
      }
    };

  }

}



//
// // KarmaFieldsAlpha.fieldsOptions.files = {
// //   datatype: "array"
// // };
//
// KarmaFieldsAlpha.fields.files = {};
//
// KarmaFieldsAlpha.fields.files.create = function(resource) {
//   let field = KarmaFieldsAlpha.Field(resource);
//   field.datatype = "array";
//   field.data.uploader = {
//     frame: null,
//     open: function () {
//       if (!this.frame) {
//         let mimeTypes = field.resource.file && (field.resource.file.type || field.resource.file.types)
//           || field.resource.mime_types
//           || field.resource.mime_type
//           || field.resource.mimeTypes
//           || field.resource.mimeType
//           || field.resource.mimetypes
//           || field.resource.mimetype;
//         // enable video
//         wp.media.controller.GalleryAdd = wp.media.controller.GalleryAdd.extend({
//           initialize: function() {
//             if ( ! this.get('library') ) {
//               this.set( 'library', wp.media.query(mimeTypes ? { type: mimeTypes } : null) );
//             }
//             wp.media.controller.Library.prototype.initialize.apply( this, arguments );
//           }
//         });
//         wp.media.controller.GalleryEdit = wp.media.controller.GalleryEdit.extend({
//           activate: function() {
//             var library = this.get('library');
//             if (mimeTypes) {
//               library.props.set( 'type', mimeTypes );
//             }
//             this.get('library').observe( wp.Uploader.queue );
//             this.frame.on( 'content:render:browse', this.gallerySettings, this );
//             wp.media.controller.Library.prototype.activate.apply( this, arguments );
//           }
//         });
//         wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
//           render: function() {
//             return this;
//           }
//         });
//         let ids = field.getValue();
//         if (ids.length) {
//           this.frame = wp.media.gallery.edit('[gallery ids="'+ids.join(",")+'"]');
//         } else {
//           this.frame = wp.media({
//             frame: "post",
//             state: "gallery-edit",
//             type: mimeTypes || ["image"],
//             editing: true,
//             multiple: true  // Set to true to allow multiple files to be selected
//           });
//         }
//         this.frame.on("update",function(items) {
//           field.setValue(items.map(function(item) {
//             return item.attributes.id;
//           }));
//           field.trigger("render");
//         });
//       }
//       this.frame.open();
//     }
//   };
//   return field;
// };
//
// KarmaFieldsAlpha.fields.files.build = function(field) {
//   return {
//     class: "field-file gallery",
//     clear: true,
//     init: function(container) {
//       field.events.render = function() {
//         container.parent.render();
//       };
//     },
//     update: function(container) {
//       let unloadedIds = [];
//
//       this.children = field.getValue().map(function(id) {
//         let file = field.data.files && field.data.files[id];
//         if (!file) {
//           unloadedIds.push(id);
//         }
//         return {
//           class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
//           init: function() {
//             this.element.addEventListener("click", function(event) {
//               event.preventDefault();
//               field.data.uploader.open();
//             });
//           },
//           child: file && {
//             tag: "img",
//             init: function() {
//               this.element.src = file.src;
//               this.element.width = file.width;
//               this.element.height = file.height;
//             }
//           } || {
//             class: "karma-field-spinner"
//           }
//         };
//       });
//       if (unloadedIds.length) {
//         this.element.classList.add("loading");
//         field.trigger("files", unloadedIds).then(function(results) {
//           if (!field.data.files) {
//             field.data.files = {};
//           }
//           results.forEach(function(image) {
//             field.data.files[image.id] = image;
//           });
//           container.parent.render(true);
//         });
//       };
//       this.children.push({
//         class: "field-control",
//         update: function() {
//           this.children = [];
//           if (field.getValue().length) {
//             this.children.push({
//               tag: "button",
//               class: "edit",
//               init: function() {
//                 this.element.textContent = "Edit";
//                 this.element.id = field.getId();
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.data.uploader.open();
//                 });
//               }
//             });
//             this.children.push({
//               tag: "button",
//               class: "delete",
//               init: function() {
//                 this.element.textContent = "Remove";
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.setValue("");
//                   container.parent.render(true);
//                 });
//               }
//             });
//           } else {
//             this.children.push({
//               tag: "button",
//               class: "insert",
//               init: function() {
//                 this.element.textContent = "Add";
//                 this.element.id = field.getId();
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.data.uploader.open();
//                 });
//               }
//             });
//           }
//         }
//       });
//     }
//   };
// };

//
//
// KarmaFieldsAlpha.fields.files = function(field) {
//   return {
//     class: "field-file gallery",
//     clear: true,
//     init: function(container) {
//       if (!field.data.uploader) {
//         field.data.uploader = {
//       		frame: null,
//       		open: function () {
//       			if (!this.frame) {
//               let mimeTypes = field.resource.file && (field.resource.file.type || field.resource.file.types)
//                 || field.resource.mime_types
//                 || field.resource.mime_type
//                 || field.resource.mimeTypes
//                 || field.resource.mimeType
//                 || field.resource.mimetypes
//                 || field.resource.mimetype;
//       				// enable video
//       				wp.media.controller.GalleryAdd = wp.media.controller.GalleryAdd.extend({
//       					initialize: function() {
//       						if ( ! this.get('library') ) {
//       							this.set( 'library', wp.media.query(mimeTypes ? { type: mimeTypes } : null) );
//       						}
//       						wp.media.controller.Library.prototype.initialize.apply( this, arguments );
//       					}
//       				});
//       				wp.media.controller.GalleryEdit = wp.media.controller.GalleryEdit.extend({
//       					activate: function() {
//       						var library = this.get('library');
//       						if (mimeTypes) {
//       							library.props.set( 'type', mimeTypes );
//       						}
//       						this.get('library').observe( wp.Uploader.queue );
//       						this.frame.on( 'content:render:browse', this.gallerySettings, this );
//       						wp.media.controller.Library.prototype.activate.apply( this, arguments );
//       					}
//       				});
//       				wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
//       					render: function() {
//       						return this;
//       					}
//       				});
//               let ids = field.getValue();
//       				if (ids.length) {
//       					this.frame = wp.media.gallery.edit('[gallery ids="'+ids.join(",")+'"]');
//       				} else {
//       					this.frame = wp.media({
//       						frame: "post",
//       						state: "gallery-edit",
//       						type: mimeTypes || ["image"],
//       						editing: true,
//       						multiple: true  // Set to true to allow multiple files to be selected
//       					});
//       				}
//       				this.frame.on("update",function(items) {
//                 field.setValue(items.map(function(item) {
//       						return item.attributes.id;
//       					}));
//                 container.parent.render(true);
//       				});
//       			}
//       			this.frame.open();
//       		}
//       	};
//       }
//     },
//     update: function(container) {
//       let unloadedIds = [];
//
//       this.children = field.getValue().map(function(id) {
//         let file = field.data.files && field.data.files[id];
//         if (!file) {
//           unloadedIds.push(id);
//         }
//         return {
//           class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
//           init: function() {
//             this.element.addEventListener("click", function(event) {
//               event.preventDefault();
//               field.data.uploader.open();
//             });
//           },
//           child: file && {
//             tag: "img",
//             init: function() {
//               this.element.src = file.src;
//               this.element.width = file.width;
//               this.element.height = file.height;
//             }
//           } || {
//             class: "karma-field-spinner"
//           }
//         };
//       });
//       if (unloadedIds.length) {
//         this.element.classList.add("loading");
//         field.trigger("files", unloadedIds).then(function(results) {
//           if (!field.data.files) {
//             field.data.files = {};
//           }
//           results.forEach(function(image) {
//             field.data.files[image.id] = image;
//           });
//           container.parent.render(true);
//         });
//       };
//       this.children.push({
//         class: "field-control",
//         update: function() {
//           this.children = [];
//           if (field.getValue().length) {
//             this.children.push({
//               tag: "button",
//               class: "edit",
//               init: function() {
//                 this.element.textContent = "Edit";
//                 this.element.id = field.getId();
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.data.uploader.open();
//                 });
//               }
//             });
//             this.children.push({
//               tag: "button",
//               class: "delete",
//               init: function() {
//                 this.element.textContent = "Remove";
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.setValue("");
//                   container.parent.render(true);
//                 });
//               }
//             });
//           } else {
//             this.children.push({
//               tag: "button",
//               class: "insert",
//               init: function() {
//                 this.element.textContent = "Add";
//                 this.element.id = field.getId();
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.data.uploader.open();
//                 });
//               }
//             });
//           }
//         }
//       });
//
//
//
//       // this.children = [
//       //   {
//       //     class: "image-container",
//       //     update: function(imgContainer) {
//       //       let unloadedIds = [];
//       //       this.children = field.getValue().map(function(id) {
//       //         let file = field.data.files && field.data.files[id];
//       //         if (!file) {
//       //           unloadedIds.push(id);
//       //         }
//       //         return {
//       //           class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
//       //           init: function() {
//       //             this.element.addEventListener("click", function(event) {
//       //               event.preventDefault();
//       //               field.data.uploader.open();
//       //             });
//       //           },
//       //           child: file && {
//       //             tag: "img",
//       //             init: function() {
//       //               this.element.src = file.src;
//       //               this.element.width = file.width;
//       //               this.element.height = file.height;
//       //             }
//       //           } || {
//       //             class: "karma-field-spinner"
//       //           }
//       //         };
//       //       });
//       //       if (unloadedIds.length) {
//       //         this.element.classList.add("loading");
//       //         field.trigger("files", unloadedIds).then(function(results) {
//       //           if (!field.data.files) {
//       //             field.data.files = {};
//       //           }
//       //           results.forEach(function(image) {
//       //             field.data.files[image.id] = image;
//       //           });
//       //           container.render(true);
//       //         });
//       //       }
//       //
//       //     }
//       //   },
//       //   {
//       //     tag: "button",
//       //     class: "delete",
//       //     init: function() {
//       //       this.element.textContent = "Remove";
//       //       this.element.addEventListener("click", function(event) {
//       //         event.preventDefault();
//       //         field.setValue("");
//       //         container.render(true);
//       //       });
//       //     },
//       //     update: function() {
//       //       this.element.style.display = field.getValue().length ? "block" : "none";
//       //     }
//       //   },
//       //   {
//       //     tag: "button",
//       //     class: "insert",
//       //     init: function() {
//       //       this.element.textContent = "Add";
//       //       this.element.id = field.getId();
//       //       this.element.addEventListener("click", function(event) {
//       //         event.preventDefault();
//       //         field.data.uploader.open();
//       //       });
//       //     },
//       //     update: function() {
//       //       this.element.style.display = field.getValue().length ? "none" : "block";
//       //     }
//       //   }
//       // ]
//     }
//   };
// }


// KarmaFieldsAlpha.fields.files = function(field) {
//
//
//   return {
//     className: "karma-field-files",
//     init: function(gallery) {
//       var galleryManager = {};
//       var galleryUploader = KarmaFieldsAlpha.createGalleryUploader();
//       if (field.resource.mimeTypes !== undefined) {
//         galleryUploader.mimeTypes = field.resource.mimeTypes;
//       }
//       galleryUploader.onChange = function(attachments) {
//         var value = attachments.map(function(attachment) {
//           return {
//             id: attachment.id,
//             width: attachment.width,
//             height: attachment.height,
//             description: attachment.description,
//             alt: attachment.alt,
//             title: attachment.title,
//             name: attachment.name,
//             url: attachment.url,
//             thumb: attachment.sizes && attachment.sizes.thumbnail.url || attachment.icon,
//             thumb_width: attachment.sizes && attachment.sizes.thumbnail.width || attachment.thumb && attachment.thumb.width,
//             thumb_height: attachment.sizes && attachment.sizes.thumbnail.height || attachment.thumb && attachment.thumb.height,
//             filename: attachment.filename
//           }
//         });
//         field.setValue(value);
//         gallery.render();
//         // galleryManager.renderThumbs && galleryManager.renderThumbs();
//         // galleryManager.renderControls && galleryManager.renderControls();
//       };
//
//       this.kids = [];
//       if (field.resource.controls !== false) {
//         this.kids.push({
//           className: "field-controlsxx",
//           child: {
//             className: "field-controls-group",
//             kids: [
//               {
//                 tag: "button",
//                 // kids: [KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/insert.svg")],
//                 kid: KarmaFieldsAlpha.includes.icon({
//                   file: KarmaFieldsAlpha.icons_url+"/insert.svg"
//                 }),
//                 init: function() {
//                   this.disabled = (field.getValue() || []).length;
//                   this.addEventListener("click", function(event) {
//                     event.preventDefault();
//                     // if (!galleryUploader.imageIds) {
//                     //   galleryUploader.imageIds = [];
//                     // }
//                     var values = field.getValue();
//                     values = Array.isArray(values) && values || [];
//                     galleryUploader.imageIds = values.map(function(attachment) {
//                       return attachment.id;
//                     });
//                     galleryUploader.open();
//                   });
//                 },
//                 update: function() {
//                   // var values = field.getValue();
//                   // values = Array.isArray(values) && values || [];
//                   // this.disabled = values.length > 0;
//                 }
//               },
//               {
//                 tag: "button",
//                 // kids: [KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/edit.svg")],
//                 kid: KarmaFieldsAlpha.includes.icon({
//                   file: KarmaFieldsAlpha.icons_url+"/edit.svg"
//                 }),
//                 init: function() {
//                   this.addEventListener("click", function(event) {
//                     event.preventDefault();
//                     var values = field.getValue();
//                     values = Array.isArray(values) && values || [];
//                     galleryUploader.imageIds = values.map(function(attachment) {
//                       return attachment.id;
//                     });
//                     galleryUploader.open();
//                   });
//                 },
//                 update: function() {
//                   var values = field.getValue();
//
//                   values = Array.isArray(values) && values || [];
//                   this.disabled = values.length === 0;
//                 }
//               },
//               {
//                 tag: "button",
//                 // kids: [KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/trash.svg")],
//                 kid: KarmaFieldsAlpha.includes.icon({
//                   file: KarmaFieldsAlpha.icons_url+"/trash.svg"
//                 }),
//                 init: function() {
//                   this.addEventListener("click", function(event) {
//                     event.preventDefault();
//                     field.setValue([]);
//                     gallery.render();
//                   });
//                 },
//                 update: function() {
//                   var values = field.getValue();
//                   values = Array.isArray(values) && values || [];
//                   this.disabled = values.length === 0;
//                 }
//               }
//             ]
//           }
//         });
//       }
//       this.kids.push({
//         className: "file-input-thumbs",
//         init: function() {
//           this.addEventListener("click", function(event) {
//             event.preventDefault();
//             var values = field.getValue();
//             values = Array.isArray(values) && values || [];
//             galleryUploader.imageIds = values.map(function(attachment) {
//               return attachment.id;
//             });
//             galleryUploader.open();
//           });
//           field.fetchValue().then(function() {
//             gallery.render();
//           });
//         },
//         update: function(thumbsContainer) {
//           var values = field.getValue();
//           this.kids = [];
//           if (values && Array.isArray(values) && values.length) {
//             this.kids = values.map(function(attachment) {
//               return {
//                 tag: "img",
//                 update: function() {
//                   this.src = attachment.thumb;
//                   this.width = attachment.thumb_width;
//                   this.height = attachment.thumb_height;
//                 }
//               };
//             });
//           }
//         }
//       });
//       this.kids.push({
//         className: "field-buttons",
//         kid: {
//           tag: "button",
//           kid: KarmaFieldsAlpha.includes.icon({
//             file: KarmaFieldsAlpha.icons_url+"/insert.svg"
//           }),
//           init: function() {
//             this.addEventListener("click", function(event) {
//               event.preventDefault();
//               var values = field.getValue();
//               values = Array.isArray(values) && values || [];
//               galleryUploader.imageIds = values.map(function(attachment) {
//                 return attachment.id;
//               });
//               galleryUploader.open();
//             });
//           }
//         }
//       });
//     }
//   };
// }
