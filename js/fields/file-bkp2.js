KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource) {
    super(resource);

    this.datatype = "number";
    this.data.files = {};
    this.data.uploader = this.createUploader(resource);

    this.events.fetch = function(field, params) {
			return field.queryOptions(this.resource.driver || "attachment", params);
		};
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
              field.triggerEvent("history", true);
              field.setValue(attachments[0].id);
              field.triggerEvent("change", true);
              field.triggerEvent("set");
              // container.parent.render(true);
            }
          });
          this.addFrame.on("open", function() {
            let selection = uploader.addFrame.state().get("selection");
            let value = field.getValue();
            if (value) {
              selection.add(wp.media.attachment(value));
            }
          });
        }
        this.addFrame.open();
      }
    };
    return uploader;
  }

  // getFiles(ids) {
  //
  //   return fetchOptions({
  //     ids: ids
  //   });
  //
  //   let options = get_options();
  //   if (ids.every(function(id) {
  //     return options.find(function(option) {
  //       option.id === id;
  //     });
  //   })) {
  //     return promise
  //   }
  //
  //   if (!this.data.files) {
  //     this.data.files = {};
  //   }
  //
  //   files.forEach(function(file) {
  //     this.data.files[file.id] = file;
  //   });
  //
  // }


  fetchIds(ids) {
    const field = this;
    return this.fetchOptions({ids: ids}).then(function(results) {
      field.setFiles(results);
      return field.hasFiles(ids);
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
      return this.data.files[id];
    }, this);
  }

  getFile(id) {
    return this.data.files[id];
  }

  setFile(id, file) {
    this.data.files[id] = file;
  }

  // updateFiles(files) {
  //
  //   if (!this.data.files) {
  //     this.data.files = {};
  //   }
  //
  //   files.forEach(function(file) {
  //     this.data.files[file.id] = file;
  //   });
  //
  // }
  //
  // fetch(ids) {
  //   const field = this;
  //
  //   if (this.resource.driver) {
  //
  //     return KarmaFieldsAlpha.Form.fetch(this.resource.driver, "queryfiles", {
  //       ids: ids.join(",")
  //     }).then(function(results) {
  //       field.updateFiles(results);
  //     });
  //
  //   } else {
  //
  //     let promise = field.triggerEvent("files", ids);
  //
  //     if (promise) {
  //
  //       return promise.then(function(results) {
  //
  //         field.updateFiles(results);
  //         // container.parent.render(true);
  //
  //       });
  //
  //     }
  //
  //   }
  //
  // }

  build() {
    const field = this;

    return {
			class: "karma-field-"+field.resource.type,
      clear: true,
			init: function(container) {
				field.events.set = function() {
					container.render(true); // -> when field value is changed by outside
				}
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}
			},
			update: function(container) {
				this.children = [
          // {
          //   tag: "label",
          //   init: function(label) {
          //     if (field.resource.label) {
          //       this.element.textContent = field.resource.label;
          //     }
          //   }
          // },
          {
            class: "field-file",
            clear: true,
            update: function(filesContainer) {
              this.children = [];
              if (field.hasValue()) {
                let value = field.getValue();
                if (value) {
                  let file = field.getFile(value);
                  if (file) {
                    this.children.push({
                      class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
                      update: function(frame) {
                        this.element.onclick = function(event) {
                          event.preventDefault();
                          field.data.uploader.open();
                        };
                      },
                      children: [
                        {
                          tag: "img",
                          update: function() {
                            this.element.src = file.src;
                            this.element.width = file.width;
                            this.element.height = file.height;
                          }
                        }
                      ]
                    });
                  } else {
                    field.fetchIds([value]).then(function(result) {
                      if (result) { // -> prevent infinite loop if file is not found
                        container.render(true);
                      } else {
                        // file not found
                      }
                    });
                    this.children.push({
                      class: "image-frame type-file loading",
                      child: {
                        class: "karma-field-spinner"
                      }
                    });
                  }
                } else {
                  this.children.push({
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

                      },
                      update: function() {
                        this.element.onclick = function(event) {
                          event.preventDefault();
                          field.data.uploader.open();
                        };
                        this.element.textContent = "Add file";
                      }
                    }
                    // init: function() {
                    //   this.element.onclick = function() {
                    //     field.data.uploader.open();
                    //   }
                    // }
                  });
                }
                this.children.push({
                  class: "field-control",
                  update: function() {
                    this.children = [];
                    if (field.getValue()) {
                      // this.children.push({
                      //   tag: "button",
                      //   class: "edit",
                      //   init: function() {
                      //     this.element.id = field.getId();
                      //     this.element.addEventListener("click", function(event) {
                      //       event.preventDefault();
                      //       field.data.uploader.open();
                      //     });
                      //   },
                      //   update: function() {
                      //     this.element.textContent = "Edit";
                      //   }
                      // });
                      this.children.push({
                        tag: "button",
                        class: "delete",
                        init: function() {
                          this.element.textContent = "Remove";
                          this.element.addEventListener("click", function(event) {
                            event.preventDefault();
                            field.triggerEvent("history", true);
                            field.setValue(0);
                            field.triggerEvent("change", true);
                            container.render(true);
                          });
                        }
                      });
                    }
                  }
                });
      				} else {
                this.children.push({
                  class: "image-frame loading",
                  child: {
                    class: "karma-field-spinner"
                  }
                });
      					field.fetchValue().then(function(value) {
      						//container.render(true);
      					});
      				}

              field.events.modify = function() {
      					container.element.classList.toggle("modified", field.isModified());
      				}
      				field.events.load = function() {
      					// container.element.classList.toggle("loading", field.loading > 0);
      				}
      				field.events.set = function() {
      					container.render();
      				}

      				field.triggerEvent("load");
      				field.triggerEvent("modify");
            }
          }
        ];
			}
		};

  }

}


// this.element.addEventListener("mousedown", function(event) {
//   let child = this.children[0];
//   let x = event.clientX;
//   let y = event.clientY;
//   let width = this.clientWidth;
//   let height = this.clientHeight;
//   let tooltip = document.createElement("div");
//   tooltip.className = "tooltip";
//   frame.element.appendChild(tooltip);
//   tooltip.textContent = "Remove";
//   tooltip.style.display = "block";
//   tooltip.style.position = "absolute";
//   tooltip.style.zIndex = "23452346523";
//   let offset = 10;
//   let box = child.getBoundingClientRect();
//   frame.element.style.position = "relative";
//   let onMove = function(event) {
//     let dx = event.clientX - x;
//     let dy = event.clientY - y;
//     child.style.transform = "translate("+dx.toFixed()+"px, "+dy.toFixed()+"px)";
//     if (Math.abs(dx) > width || Math.abs(dy) > height) {
//       let tooltipX = 0;
//       let tooltipY = 0;
//       if (dx > width) {
//         tooltipX = width/2 + box.width/2 + offset;
//         tooltipY = height/2 - tooltip.clientHeight/2;
//       } else if (dx < -width) {
//         tooltipX = width/2 - box.width/2 - tooltip.clientWidth - offset;
//         tooltipY = height/2 - tooltip.clientHeight/2;
//       } else if (dy > height) {
//         tooltipX = width/2 - tooltip.clientWidth/2;
//         tooltipY = height/2 + box.height/2 + offset;
//       } else if (dy < -height) {
//         tooltipX = width/2 - tooltip.clientWidth/2;
//         tooltipY = height/2 - box.height/2 - tooltip.clientHeight - offset;
//       }
//       tooltip.style.left = tooltipX.toFixed()+"px";
//       tooltip.style.top = tooltipY.toFixed()+"px";
//     }
//     tooltip.style.transform = "translate("+dx.toFixed()+"px, "+dy.toFixed()+"px)";
//   }
//   let onClose = function() {
//     child.style.transform = "translate(0, 0)";
//     frame.element.removeChild(tooltip);
//     window.removeEventListener("mousemove", onMove);
//     window.removeEventListener("mouseup", onClose);
//   }
//
//   if (child) {
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onClose);
//   }
//   event.preventDefault();
// });


// KarmaFieldsAlpha.fieldsOptions.file = {
//   datatype: "array"
// };

// KarmaFieldsAlpha.fields.file = function(field) {
//   return {
//     class: "field-file",
//     clear: true,
//     init: function(container) {
//       if (!field.data.uploader) {
//         field.data.uploader = {
//           addFrame: null,
//           // imageId: null,
//           open: function () {
//             if (!this.addFrame) {
//               var args = {
//                 title: "Select file",
//                 button: {
//                   text: "Use this file"
//                 },
//                 library: {
//                   type: field.resource.file && (field.resource.file.type || field.resource.file.types)
//                     || field.resource.mime_types
//                     || field.resource.mimeTypes
//                     || field.resource.mimetypes
//                     || field.resource.mimeType
//                     || field.resource.mimetype
//                     || field.resource.mime_type
//                     || "image" //'application/font-woff'
//                 },
//                 multiple: true
//               };
//               this.addFrame = wp.media(args);
//               this.addFrame.on("select", function() {
//                 let attachments = field.data.uploader.addFrame.state().get("selection").toJSON().map(function(attachment) {
//                   return attachment;
//                 });
//                 if (attachments.length) {
//                   field.setValue(attachments[0].id);
//                   container.parent.render(true);
//                 }
//               });
//               this.addFrame.on("open", function() {
//                 let selection = field.data.uploader.addFrame.state().get("selection");
//                 let value = field.getValue();
//                 if (value) {
//                   selection.add(wp.media.attachment(value));
//                 }
//               });
//             }
//             this.addFrame.open();
//           }
//         };
//       }
//     },
//     update: function(container) {
//       this.children = [];
//       let value = field.getValue();
//       if (value) {
//         let file = field.data.files && field.data.files[value];
//         if (!file) {
//           this.element.classList.add("loading");
//           field.trigger("files", [value]).then(function(results) {
//             if (!field.data.files) {
//               field.data.files = {};
//             }
//             results.forEach(function(image) {
//               field.data.files[image.id] = image;
//             });
//             container.parent.render(true);
//           });
//         }
//         this.children.push({
//           class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
//           init: function(frame) {
//             this.element.addEventListener("click", function(event) {
//               event.preventDefault();
//               field.data.uploader.open();
//             });
//             // this.element.addEventListener("mousedown", function(event) {
//             //   let child = this.children[0];
//             //   let x = event.clientX;
//             //   let y = event.clientY;
//             //   let width = this.clientWidth;
//             //   let height = this.clientHeight;
//             //   let tooltip = document.createElement("div");
//             //   tooltip.className = "tooltip";
//             //   frame.element.appendChild(tooltip);
//             //   tooltip.textContent = "Remove";
//             //   tooltip.style.display = "block";
//             //   tooltip.style.position = "absolute";
//             //   tooltip.style.zIndex = "23452346523";
//             //   let offset = 10;
//             //   let box = child.getBoundingClientRect();
//             //   frame.element.style.position = "relative";
//             //   let onMove = function(event) {
//             //     let dx = event.clientX - x;
//             //     let dy = event.clientY - y;
//             //     child.style.transform = "translate("+dx.toFixed()+"px, "+dy.toFixed()+"px)";
//             //     if (Math.abs(dx) > width || Math.abs(dy) > height) {
//             //       let tooltipX = 0;
//             //       let tooltipY = 0;
//             //       if (dx > width) {
//             //         tooltipX = width/2 + box.width/2 + offset;
//             //         tooltipY = height/2 - tooltip.clientHeight/2;
//             //       } else if (dx < -width) {
//             //         tooltipX = width/2 - box.width/2 - tooltip.clientWidth - offset;
//             //         tooltipY = height/2 - tooltip.clientHeight/2;
//             //       } else if (dy > height) {
//             //         tooltipX = width/2 - tooltip.clientWidth/2;
//             //         tooltipY = height/2 + box.height/2 + offset;
//             //       } else if (dy < -height) {
//             //         tooltipX = width/2 - tooltip.clientWidth/2;
//             //         tooltipY = height/2 - box.height/2 - tooltip.clientHeight - offset;
//             //       }
//             //       tooltip.style.left = tooltipX.toFixed()+"px";
//             //       tooltip.style.top = tooltipY.toFixed()+"px";
//             //     }
//             //     tooltip.style.transform = "translate("+dx.toFixed()+"px, "+dy.toFixed()+"px)";
//             //   }
//             //   let onClose = function() {
//             //     child.style.transform = "translate(0, 0)";
//             //     frame.element.removeChild(tooltip);
//             //     window.removeEventListener("mousemove", onMove);
//             //     window.removeEventListener("mouseup", onClose);
//             //   }
//             //
//             //   if (child) {
//             //     window.addEventListener("mousemove", onMove);
//             //     window.addEventListener("mouseup", onClose);
//             //   }
//             //   event.preventDefault();
//             // });
//           },
//           child: file && {
//             tag: "img",
//             update: function() {
//               this.element.src = file.src;
//               this.element.width = file.width;
//               this.element.height = file.height;
//             }
//           } || {
//             class: "karma-field-spinner"
//           }
//         });
//       }
//       this.children.push({
//         class: "field-control",
//         update: function() {
//           this.children = [{
//             tag: "button",
//             class: "edit",
//             init: function() {
//               this.element.id = field.getId();
//               this.element.addEventListener("click", function(event) {
//                 event.preventDefault();
//                 field.data.uploader.open();
//               });
//             },
//             update: function() {
//               this.element.textContent = field.getValue() ? "Edit" : "Add";
//             }
//           }];
//           if (field.getValue()) {
//             this.children.push({
//               tag: "button",
//               class: "delete",
//               init: function() {
//                 this.element.textContent = "Remove";
//                 this.element.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.setValue("");
//                   container.parent.render();
//                 });
//               }
//             });
//           }
//         }
//       });
//
//     }
//   };
// }
//

// KarmaFieldsAlpha.fields.file = function(field) {
//   return {
//     class: "field-file",
//     init: function(container) {
//       if (!field.data.uploader) {
//         field.data.uploader = {
//           addFrame: null,
//           // imageId: null,
//           open: function () {
//             if (!this.addFrame) {
//               var args = {
//                 title: "Select file",
//                 button: {
//                   text: "Use this file"
//                 },
//                 library: {
//                   type: field.resource.file && (field.resource.file.type || field.resource.file.types)
//                     || field.resource.mime_types
//                     || field.resource.mimeTypes
//                     || field.resource.mimetypes
//                     || field.resource.mimeType
//                     || field.resource.mimetype
//                     || field.resource.mime_type
//                     || "image" //'application/font-woff'
//                 },
//                 multiple: true
//               };
//               this.addFrame = wp.media(args);
//               this.addFrame.on("select", function() {
//                 let attachments = field.data.uploader.addFrame.state().get("selection").toJSON().map(function(attachment) {
//                   return attachment;
//                 });
//                 if (attachments.length) {
//                   field.setValue(attachments[0].id);
//                   container.render(true);
//                 }
//               });
//               this.addFrame.on("open", function() {
//                 let selection = field.data.uploader.addFrame.state().get("selection");
//                 let value = field.getValue();
//                 if (value) {
//                   selection.add(wp.media.attachment(value));
//                 }
//               });
//             }
//             this.addFrame.open();
//           }
//         };
//       }
//     },
//     update: function(container) {
//       this.children = [
//         {
//           class: "image-container",
//           update: function(imgContainer) {
//             let value = field.getValue();
//             if (value) {
//               let file = field.data.files && field.data.files[value];
//               if (!file) {
//                 this.element.classList.add("loading");
//                 field.trigger("files", [value]).then(function(results) {
//                   if (!field.data.files) {
//                     field.data.files = {};
//                   }
//                   results.forEach(function(image) {
//                     field.data.files[image.id] = image;
//                   });
//                   container.render(true);
//                 });
//               }
//               this.child = {
//                 class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
//                 init: function() {
//                   this.element.addEventListener("click", function(event) {
//                     event.preventDefault();
//                     field.data.uploader.open();
//                   });
//                 },
//                 child: file && {
//                   tag: "img",
//                   update: function() {
//                     this.element.src = file.src;
//                     this.element.width = file.width;
//                     this.element.height = file.height;
//                   }
//                 } || {
//                   class: "karma-field-spinner"
//                 }
//               };
//             } else {
//               this.child = {};
//             }
//
//           }
//         },
//         {
//           tag: "button",
//           class: "delete",
//           init: function() {
//             this.element.textContent = "Remove";
//             this.element.addEventListener("click", function(event) {
//               event.preventDefault();
//               field.setValue("");
//               container.render(true);
//             });
//           },
//           update: function() {
//             this.element.style.display = field.getValue() ? "block" : "none";
//           }
//         },
//         {
//           tag: "button",
//           class: "insert",
//           init: function() {
//             this.element.textContent = "Add";
//             this.element.id = field.getId();
//             this.element.addEventListener("click", function(event) {
//               event.preventDefault();
//               field.data.uploader.open();
//             });
//           },
//           update: function() {
//             this.element.style.display = field.getValue() ? "none" : "block";
//           }
//         }
//       ]
//     }
//   };
// }
