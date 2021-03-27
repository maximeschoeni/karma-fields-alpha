// KarmaFieldsAlpha.fieldsOptions.file = {
//   datatype: "array"
// };

KarmaFieldsAlpha.fields.file = function(field) {
  return {
    class: "field-file",
    clear: true,
    init: function(container) {
      if (!field.data.uploader) {
        field.data.uploader = {
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
                  type: field.resource.file && (field.resource.file.type || field.resource.file.types)
                    || field.resource.mime_types
                    || field.resource.mimeTypes
                    || field.resource.mimetypes
                    || field.resource.mimeType
                    || field.resource.mimetype
                    || field.resource.mime_type
                    || "image" //'application/font-woff'
                },
                multiple: true
              };
              this.addFrame = wp.media(args);
              this.addFrame.on("select", function() {
                let attachments = field.data.uploader.addFrame.state().get("selection").toJSON().map(function(attachment) {
                  return attachment;
                });
                if (attachments.length) {
                  field.setValue(attachments[0].id);
                  container.parent.render(true);
                }
              });
              this.addFrame.on("open", function() {
                let selection = field.data.uploader.addFrame.state().get("selection");
                let value = field.getValue();
                if (value) {
                  selection.add(wp.media.attachment(value));
                }
              });
            }
            this.addFrame.open();
          }
        };
      }
    },
    update: function(container) {
      this.children = [];
      let value = field.getValue();
      if (value) {
        let file = field.data.files && field.data.files[value];
        if (!file) {
          this.element.classList.add("loading");
          field.trigger("files", [value]).then(function(results) {
            if (!field.data.files) {
              field.data.files = {};
            }
            results.forEach(function(image) {
              field.data.files[image.id] = image;
            });
            container.parent.render(true);
          });
        }
        this.children.push({
          class: "image-frame type-"+(file && file.type.startsWith("image") && "image" || "file"),
          init: function(frame) {
            this.element.addEventListener("click", function(event) {
              event.preventDefault();
              field.data.uploader.open();
            });
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
          },
          child: file && {
            tag: "img",
            update: function() {
              this.element.src = file.src;
              this.element.width = file.width;
              this.element.height = file.height;
            }
          } || {
            class: "karma-field-spinner"
          }
        });
      }
      this.children.push({
        class: "field-control",
        update: function() {
          this.children = [{
            tag: "button",
            class: "edit",
            init: function() {
              this.element.id = field.getId();
              this.element.addEventListener("click", function(event) {
                event.preventDefault();
                field.data.uploader.open();
              });
            },
            update: function() {
              this.element.textContent = field.getValue() ? "Edit" : "Add";
            }
          }];
          if (field.getValue()) {
            this.children.push({
              tag: "button",
              class: "delete",
              init: function() {
                this.element.textContent = "Remove";
                this.element.addEventListener("click", function(event) {
                  event.preventDefault();
                  field.setValue("");
                  container.parent.render();
                });
              }
            });
          }
        }
      });

    }
  };
}


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
