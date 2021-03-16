KarmaFields.fields.files = function(field) {


  return {
    className: "karma-field-files",
    init: function(gallery) {
      var galleryManager = {};
      var galleryUploader = KarmaFields.createGalleryUploader();
      if (field.resource.mimeTypes !== undefined) {
        galleryUploader.mimeTypes = field.resource.mimeTypes;
      }
      galleryUploader.onChange = function(attachments) {
        var value = attachments.map(function(attachment) {
          return {
            id: attachment.id,
            width: attachment.width,
            height: attachment.height,
            description: attachment.description,
            alt: attachment.alt,
            title: attachment.title,
            name: attachment.name,
            url: attachment.url,
            thumb: attachment.sizes && attachment.sizes.thumbnail.url || attachment.icon,
            thumb_width: attachment.sizes && attachment.sizes.thumbnail.width || attachment.thumb && attachment.thumb.width,
            thumb_height: attachment.sizes && attachment.sizes.thumbnail.height || attachment.thumb && attachment.thumb.height,
            filename: attachment.filename
          }
        });
        field.setValue(value);
        gallery.render();
        // galleryManager.renderThumbs && galleryManager.renderThumbs();
        // galleryManager.renderControls && galleryManager.renderControls();
      };

      this.kids = [];
      if (field.resource.controls !== false) {
        this.kids.push({
          className: "field-controlsxx",
          child: {
            className: "field-controls-group",
            kids: [
              {
                tag: "button",
                // kids: [KarmaFields.includes.icon(KarmaFields.icons_url+"/insert.svg")],
                kid: KarmaFields.includes.icon({
                  file: KarmaFields.icons_url+"/insert.svg"
                }),
                init: function() {
                  this.disabled = (field.getValue() || []).length;
                  this.addEventListener("click", function(event) {
                    event.preventDefault();
                    // if (!galleryUploader.imageIds) {
                    //   galleryUploader.imageIds = [];
                    // }
                    var values = field.getValue();
                    values = Array.isArray(values) && values || [];
                    galleryUploader.imageIds = values.map(function(attachment) {
                      return attachment.id;
                    });
                    galleryUploader.open();
                  });
                },
                update: function() {
                  // var values = field.getValue();
                  // values = Array.isArray(values) && values || [];
                  // this.disabled = values.length > 0;
                }
              },
              {
                tag: "button",
                // kids: [KarmaFields.includes.icon(KarmaFields.icons_url+"/edit.svg")],
                kid: KarmaFields.includes.icon({
                  file: KarmaFields.icons_url+"/edit.svg"
                }),
                init: function() {
                  this.addEventListener("click", function(event) {
                    event.preventDefault();
                    var values = field.getValue();
                    values = Array.isArray(values) && values || [];
                    galleryUploader.imageIds = values.map(function(attachment) {
                      return attachment.id;
                    });
                    galleryUploader.open();
                  });
                },
                update: function() {
                  var values = field.getValue();

                  values = Array.isArray(values) && values || [];
                  this.disabled = values.length === 0;
                }
              },
              {
                tag: "button",
                // kids: [KarmaFields.includes.icon(KarmaFields.icons_url+"/trash.svg")],
                kid: KarmaFields.includes.icon({
                  file: KarmaFields.icons_url+"/trash.svg"
                }),
                init: function() {
                  this.addEventListener("click", function(event) {
                    event.preventDefault();
                    field.setValue([]);
                    gallery.render();
                  });
                },
                update: function() {
                  var values = field.getValue();
                  values = Array.isArray(values) && values || [];
                  this.disabled = values.length === 0;
                }
              }
            ]
          }
        });
      }
      this.kids.push({
        className: "file-input-thumbs",
        init: function() {
          this.addEventListener("click", function(event) {
            event.preventDefault();
            var values = field.getValue();
            values = Array.isArray(values) && values || [];
            galleryUploader.imageIds = values.map(function(attachment) {
              return attachment.id;
            });
            galleryUploader.open();
          });
          field.fetchValue().then(function() {
            gallery.render();
          });
        },
        update: function(thumbsContainer) {
          var values = field.getValue();
          this.kids = [];
          if (values && Array.isArray(values) && values.length) {
            this.kids = values.map(function(attachment) {
              return {
                tag: "img",
                update: function() {
                  this.src = attachment.thumb;
                  this.width = attachment.thumb_width;
                  this.height = attachment.thumb_height;
                }
              };
            });
          }
        }
      });
      this.kids.push({
        className: "field-buttons",
        kid: {
          tag: "button",
          kid: KarmaFields.includes.icon({
            file: KarmaFields.icons_url+"/insert.svg"
          }),
          init: function() {
            this.addEventListener("click", function(event) {
              event.preventDefault();
              var values = field.getValue();
              values = Array.isArray(values) && values || [];
              galleryUploader.imageIds = values.map(function(attachment) {
                return attachment.id;
              });
              galleryUploader.open();
            });
          }
        }
      });
    }
  };
}
