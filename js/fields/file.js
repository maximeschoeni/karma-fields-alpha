KarmaFields.fields.file = function(field) {
  return {
    class: "field-file",
    init: function(container) {
      field.data.uploader = KarmaFields.createImageUploader();
    	field.data.uploader.mimeType = field.resource.mimeType || field.resource.mimeTypes || null;

      field.data.uploader.onSelect = function(attachments) {
        if (attachments.length) {
          // var attachment = attachments[0];
          // var sources = [];
          // if (attachment.sizes) {
          //   for (var key in attachment.sizes) {
          //     if (key !== "thumbnail") {
          //       sources.push({
          //         size: key,
          //         width: attachment.sizes[key].width,
          //         height: attachment.sizes[key].height,
          //         url: attachment.sizes[key].url
          //       });
          //     }
          //   }
          // }
          // value = {
          //   id: attachment.id,
          //   width: attachment.width,
          //   height: attachment.height,
          //   description: attachment.description,
          //   alt: attachment.alt,
          //   title: attachment.title,
          //   name: attachment.name,
          //   url: attachment.url,
          //   thumb: attachment.sizes && attachment.sizes.thumbnail.url || attachment.icon,
          //   thumb_width: attachment.sizes && attachment.sizes.thumbnail.width || attachment.thumb && attachment.thumb.width,
          //   thumb_height: attachment.sizes && attachment.sizes.thumbnail.height || attachment.thumb && attachment.thumb.height,
          //   sources: sources,
          //   filename: attachment.filename
          // };

          field.setValue(attachments[0].id);
          container.render();
        }
      };
    },
    update: function(container) {
      if (field.value) {
        if (field.data.files && field.data.files[field.value]) {
          this.children = {
            class: "file-thumb",
            children: [
              {
                tag: "img",
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    field.data.uploader.imageId = field.value;
                    field.data.uploader.open();
                  });
                },
                update: function() {
                  this.element.src = field.data.files[field.value].thumb;
                  this.element.width = field.data.files[field.value].thumb_width;
                  this.element.height = field.data.files[field.value].thumb_height;
                }
              },
              {
                tag: "button",
                class: "delete",
                init: function() {
                  this.element.textContent = "Remove";
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    field.setValue(null);
                    field.data.uploader.imageId = null;
                    container.render();
                  });
                }
              }
            ]
          };
        } else {
          field.data.loading = true;
          field.trigger("update");
          field.trigger("fetch", "queryfiles", {
            ids: [field.value],
            key: field.resource.key
          }).then(function(results) {
            field.data.loading = false;
            field.data.files = results;
            container.render();
          });
        }
      } else {
        this.child = {
          tag: "button",
          class: "insert",
          init: function() {
            this.element.textContent = "Add";
            this.element.addEventListener("click", function(event) {
              event.preventDefault();
              field.data.uploader.imageId = null;
              field.data.uploader.open();
            });
          }
        };
      }
    }
  };
}

// KarmaFields.fields.file = function(field) {
//   let imageUploader;
//   return {
//     className: "field-file",
//     init: function(container) {
//       imageUploader = KarmaFields.createImageUploader();
//     	imageUploader.mimeType = field.resource.mimeType || field.resource.mimeTypes || null;
//       imageUploader.onSelect = function(attachments) {
//         console.log(attachments);
//         var value;
//         if (attachments.length) {
//           var attachment = attachments[0];
//           var sources = [];
//           if (attachment.sizes) {
//             for (var key in attachment.sizes) {
//               if (key !== "thumbnail") {
//                 sources.push({
//                   size: key,
//                   width: attachment.sizes[key].width,
//                   height: attachment.sizes[key].height,
//                   url: attachment.sizes[key].url
//                 });
//               }
//             }
//           }
//           value = {
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
//             sources: sources,
//             filename: attachment.filename
//           };
//
//           field.setValue(value);
//           container.render();
//         }
//       };
//
//       this.classList.add("loading");
//       field.fetchValue().then(function() {
//         container.classList.remove("loading");
//         console.log(field.getValue());
//         container.render();
//       });
//       this.kid = {
//         className: "file-thumb",
//         clear: true,
//         update: function() {
//           var value = field.getValue();
//           this.kids = [];
//           if (value && value.id) {
//             this.kids.push({
//               tag: "img",
//               init: function() {
//                 this.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   var value = field.getValue();
//                   imageUploader.imageId = value.id;
//                   imageUploader.open();
//                 });
//               },
//               update: function() {
//                 this.src = value.thumb;
//                 this.width = value.thumb_width;
//                 this.height = value.thumb_height;
//               }
//             });
//             this.kids.push({
//               tag: "button",
//               className: "delete",
//               textContent: "Remove",
//               // kid: KarmaFields.includes.icon({
//               //   file: KarmaFields.icons_url+"/trash.svg"
//               // }),
//               init: function() {
//                 this.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   field.setValue(null);
//                   imageUploader.imageId = null;
//                   container.render();
//                 });
//               }
//             });
//           } else if (!container.classList.contains("loading")) {
//             this.kids.push({
//               tag: "button",
//               className: "insert",
//               textContent: "Add",
//               // kid: KarmaFields.includes.icon({
//               //   file: KarmaFields.icons_url+"/insert.svg"
//               // }),
//               init: function() {
//                 this.addEventListener("click", function(event) {
//                   event.preventDefault();
//                   imageUploader.imageId = null;
//                   imageUploader.open();
//                 });
//               }
//             });
//           } else {
//             this.kids.push({
//               className: "wait",
//               textContent: "..."
//             });
//           }
//         }
//       }
//     }
//   };
// }
