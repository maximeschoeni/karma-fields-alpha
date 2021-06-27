KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain, parent) {
    super(resource, domain, parent);

    // this.datatype = "number";
    this.files = {};
    this.uploader = this.createUploader(resource);

  }

  exportValue() {
    const field = this;
    this.getValueAsync().then(function(value) {
      if (value) {
        return field.getFile(value).original_url;
      }
      return "";
    });

    // this.getValueAsync().then(function(value) {
    //   const file = field.getFile(value);
    //   return fetch(file.original_url);
    // }).then(function(response) {
    //   return response.blob();
    // }).then(function(blob) {
    //   let data = [new ClipboardItem({ [blob.type]: blob })];
    //
    //   return navigator.clipboard.write(data);
    // });
  }



  createUploader(resource) {
    const field = this;
    const uploader = {
      addFrame: null,
      // imageId: null,
      open: function () {
        if (!this.addFrame) {
          var args = {
            title: "Select file",
            button: {
              text: "Use this file"
            },
            library: {
              type: resource.file && (resource.file.type || resource.file.types)
                || resource.mime_types
                || resource.mimeTypes
                || resource.mimetypes
                || resource.mimeType
                || resource.mimetype
                || resource.mime_type
                || "image" //'application/font-woff'
            },
            multiple: true
          };
          this.addFrame = wp.media(args);
          this.addFrame.on("select", function() {
            let attachments = uploader.addFrame.state().get("selection").toJSON().map(function(attachment) {
              return attachment;
            });
            if (attachments.length) {
              field.backup();
              field.updateChangeValue(attachments[0].id);
              // .then(function() {
              //   field.try("onSet", attachments[0].id);
              // });
            }
          });
          this.addFrame.on("open", function() {
            let selection = uploader.addFrame.state().get("selection");
            field.getValueAsync().then(function(value) {
              if (value) {
                selection.add(wp.media.attachment(value));
              }
            });
          });
        }
        this.addFrame.open();
      }
    };
    return uploader;
  }

  fetch(queryString) {
		return KarmaFieldsAlpha.Form.fetch2(this.resource.driver || "attachment", queryString);
  }

  getEmpty() {
    return 0;
  }

  validate(value) {
    const field = this;
    value = parseInt(value);

    if (!value || isNaN(value)) {
      return Promise.resolve(0);
    } else if (this.hasFiles([value])) {
      return Promise.resolve(value);
    } else {
      return this.fetchIds([value]).then(function() {
        return value;
      });
    }
  }

  fetchIds(ids) {
    const field = this;
    let queryString = this.getOptionsParamString({ids: ids});
    return this.fetch(queryString).then(function(results) {
      field.setFiles(results);
      return results; // -> not sure if order matches!
    }).catch(function() {
      return 0;
    });
  }

  hasFiles(ids) {
    return ids.every(function(id) {
      return this.getFile(id);
    }, this);
  }

  setFiles(files) {
    files.forEach(function(file) {
      this.setFile(file.id, file);
    }, this);
  }

  getFiles(ids) {
    return ids.map(function(id) {
      return this.files[id];
    }, this);
  }

  getFile(id) {
    return this.files[id];
  }

  setFile(id, file) {
    this.files[id] = file;
  }

  buildContent(value) {
    const field = this;
    return {
      class: "field-file",
      children: [
        {
          tag: "a",
          class: "image-frame",
          update: function(frame) {
            this.element.onclick = function(event) {
              event.preventDefault();
              field.uploader.open();
            };
          },
          children: [
            {
              class: "image-container",
              update: function() {
                if (value) {
                  const file = field.getFile(value);
                  this.children = [{
                    tag: "img",
                    update: function() {
                      this.element.src = file.src;
                      this.element.width = file.width;
                      this.element.height = file.height;
                    }
                  }];
                  this.element.classList.toggle("type-image", file.type.startsWith("image"));
                } else {
                  this.children = [];
                }
              }
            },
            {
              class: "button-container",
              update: function() {
                if (value) {
                  this.children = [];
                } else {
                  this.children = [{
                    class: "add",
                    update: function() {
                      this.element.textContent = "Add file";
                    }
                  }];
                }
              }
            },
            {
              class: "karma-field-spinner"
            }
          ]
        },
        {
          class: "field-control",
          update: function() {
            if (value) {
              this.children = [{
                tag: "button",
                class: "delete",
                update: function() {
                  this.element.textContent = "Remove";
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    field.backup();
                    field.updateChangeValue(0);
                  });
                }
              }];
            } else {
              this.children = [];
            }
          }
        }
      ]
    };
  }

  build() {
    const field = this;

    return {
			class: "load-inside karma-field-"+field.resource.type,
      clear: true,
			init: function(container) {
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}
        this.element.setAttribute('tabindex', '-1');
        field.init(this.element);
			},
			update: function(container) {

        container.child = field.buildContent(0);

        field.onSet = function(value) {
          container.child = field.buildContent(value);
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




// KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.field {
//
//   constructor(resource, domain, parent) {
//     super(resource, domain, parent);
//
//     // this.datatype = "number";
//     this.files = {};
//     this.uploader = this.createUploader(resource);
//
//   }
//
//
//
//   createUploader(resource) {
//     const field = this;
//     const uploader = {
//       addFrame: null,
//       // imageId: null,
//       open: function () {
//         if (!this.addFrame) {
//           var args = {
//             title: "Select file",
//             button: {
//               text: "Use this file"
//             },
//             library: {
//               type: resource.file && (resource.file.type || resource.file.types)
//                 || resource.mime_types
//                 || resource.mimeTypes
//                 || resource.mimetypes
//                 || resource.mimeType
//                 || resource.mimetype
//                 || resource.mime_type
//                 || "image" //'application/font-woff'
//             },
//             multiple: true
//           };
//           this.addFrame = wp.media(args);
//           this.addFrame.on("select", function() {
//             let attachments = uploader.addFrame.state().get("selection").toJSON().map(function(attachment) {
//               return attachment;
//             });
//             if (attachments.length) {
//               field.backup();
//               field.updateChangeValue(attachments[0].id);
//               // .then(function() {
//               //   field.try("onSet", attachments[0].id);
//               // });
//             }
//           });
//           this.addFrame.on("open", function() {
//             let selection = uploader.addFrame.state().get("selection");
//             field.getValueAsync().then(function(value) {
//               if (value) {
//                 selection.add(wp.media.attachment(value));
//               }
//             });
//           });
//         }
//         this.addFrame.open();
//       }
//     };
//     return uploader;
//   }
//
//   fetch(queryString) {
// 		return KarmaFieldsAlpha.Form.fetch2(this.resource.driver || "attachment", queryString);
//   }
//
//   getEmpty() {
//     return 0;
//   }
//
//   validate(value) {
//     const field = this;
//     value = parseInt(value);
//
//     if (!value || isNaN(value)) {
//       return Promise.resolve(0);
//     } else if (this.hasFiles([value])) {
//       return Promise.resolve(value);
//     } else {
//       return this.fetchIds([value]).then(function() {
//         return value;
//       });
//     }
//   }
//
//   fetchIds(ids) {
//     const field = this;
//     let queryString = this.getOptionsParamString({ids: ids});
//     return this.fetch(queryString).then(function(results) {
//       field.setFiles(results);
//       return results; // -> not sure if order matches!
//     }).catch(function() {
//       return 0;
//     });
//   }
//
//   hasFiles(ids) {
//     return ids.every(function(id) {
//       return this.getFile(id);
//     }, this);
//   }
//
//   setFiles(files) {
//     files.forEach(function(file) {
//       this.setFile(file.id, file);
//     }, this);
//   }
//
//   getFiles(ids) {
//     return ids.map(function(id) {
//       return this.files[id];
//     }, this);
//   }
//
//   getFile(id) {
//     return this.files[id];
//   }
//
//   setFile(id, file) {
//     this.files[id] = file;
//   }
//
//   build() {
//     const field = this;
//
//     return {
// 			class: "karma-field-"+field.resource.type,
//       clear: true,
// 			init: function(container) {
// 				// field.events.set = function() {
// 				// 	container.render(true); // -> when field value is changed by outside
// 				// }
// 				if (field.resource.style) {
// 					this.element.style = field.resource.style;
// 				}
// 			},
// 			update: function(container) {
// 				this.children = [
//
//           {
//             class: "field-file",
//             // clear: true,
//             update: function(filesContainer) {
//
//               field.onSet = function(value) {
//
//                 if (value) {
//                   let file = field.getFile(value);
//
//                   let type = file.type.startsWith("image") && "image" || "file";
//                   filesContainer.children = [
//                     {
//                       tag: "a",
//                       class: "image-frame",
//                       update: function(frame) {
//                         this.element.onclick = function(event) {
//                           event.preventDefault();
//                           field.uploader.open();
//                         };
//                       },
//                       children: [
//                         {
//                           class: "image-container type-"+type,
//                           child: {
//                             tag: "img",
//                             update: function() {
//                               this.element.src = file.src;
//                               this.element.width = file.width;
//                               this.element.height = file.height;
//                             }
//                           }
//                         },
//                         {
//                           class: "button-container",
//                           children: []
//                         },
//                         {
//                           class: "karma-field-spinner"
//                         }
//                       ]
//                     },
//                     {
//                       class: "field-control",
//                       child: {
//                         tag: "button",
//                         class: "delete",
//                         update: function() {
//                           this.element.textContent = "Remove";
//                           this.element.addEventListener("click", function(event) {
//                             event.preventDefault();
//                             field.backup();
//                             field.updateChangeValue(0);
//                           });
//                         }
//                       }
//                     }
//                   ];
//                 } else {
//                   filesContainer.children = [
//                     {
//                       tag: "a",
//                       class: "image-frame",
//                       update: function(frame) {
//                         this.element.onclick = function(event) {
//                           event.preventDefault();
//                           field.uploader.open();
//                         };
//                       },
//                       children: [
//                         {
//                           class: "image-container",
//                           children: []
//                         },
//                         {
//                           class: "button-container",
//                           child: {
//                             // tag: "button",
//                             class: "add",
//                             update: function() {
//                               // this.element.onclick = function(event) {
//                               //   event.preventDefault();
//                               //   field.data.uploader.open();
//                               // };
//                               this.element.textContent = "Add file";
//                             }
//                           }
//                         },
//                         {
//                           class: "karma-field-spinner",
//                         }
//                       ]
//                     },
//                     {
//                       class: "field-control",
//                       children: []
//                     }
//                   ];
//                 }
//
//                 filesContainer.render();
//               };
//
//               this.children = [
//                 {
//                   tag: "a",
//                   class: "image-frame",
//                   update: function(frame) {
//                     this.element.onclick = null;
//                   },
//                   children: [
//                     {
//                       class: "image-container",
//                       children: []
//                     },
//                     {
//                       class: "button-container",
//                       children: []
//                     },
//                     {
//                       class: "karma-field-spinner",
//                     }
//                   ]
//                 },
//                 {
//                   class: "field-control",
//                   children: []
//                 }
//               ];
//
//               field.onModified = function(modified) {
//       					filesContainer.element.classList.toggle("modified", modified);
//       				}
//       				field.onLoad = function(loading) {
//                 filesContainer.element.classList.toggle("loading", loading);
//       					// container.element.classList.toggle("loading", field.loading > 0);
//       				}
//
//
//               field.update();
//             }
//           }
//         ];
// 			}
// 		};
//
//   }
//
// }
//
