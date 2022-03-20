KarmaFieldsAlpha.fields.files = class extends KarmaFieldsAlpha.fields.file {

  // initField() {
  //   // this.registerType("json");
	// }
  //
  // fetchArray(...path) {
  //   return this.fetchValue("array", ...path);
  // }
  //
  // setDefault() {
  //   console.error("deprecated");
  //   // noop override setDefault
  // }
  // getDefault() {
  //   return [];
  // }




  createUploader(resource) {
    const field = this;
    const uploader = {
      frame: null,
      open: function (ids) {
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

          // let ids = field.getArray();
          // debugger;
          ids = ids.filter(id => Number(id));

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
          this.frame.on("update", async function(items) {
            // await field.backup();
            // field.setValue(items.map(item => item.attributes.id.toString()));
            // field.edit();
            await field.input(items.map(item => item.attributes.id.toString()));
            field.render();
          });

        }
        this.frame.open();
      }
    };
    return uploader;
  }



  async validate(values) {

    const validValues = values.filter(id => Number(id));

    if (validValues.length !== values.length) {
      await this.setValue(validValues);
    }

    const missingIds = validValues.filter(id => !this.getFile([id]));

    if (missingIds.length) {
      await this.fetchIds(missingIds);
    }

    return validValues;
  }


  buildDeleteButton() {
    return {
      tag: "button",
      class: "delete button",
      update: button => {
        button.element.textContent = "Remove";
        button.element.onclick = async (event) => {
          event.preventDefault();
          // this.backup();
          // this.setValue([]);
          // this.edit();
          await this.input([]);
          this.render();
        };
      }
    };
  }

  build() {
    return {
			class: "karma-files karma-file karma-field",
			init: container => {
        container.element.setAttribute('tabindex', '-1');
			},
      update: container => {
        this.render = container.render;
      },
      children: [
        {
          class: "gallery",
          update: async gallery => {
            gallery.element.classList.add("loading");

            let values = await this.get() || [];
            values = await this.validate(values);

            let modified = await this.isModified();

            gallery.children = [
              {
                class: "images-container",
                update: container => {
                  container.children = values.map(image_id => this.buildImageContainer(image_id));
                }
              },
              this.buildAddButton("add Files")
            ];

            gallery.element.classList.toggle("modified", modified);

            gallery.element.onclick = event => {
              event.preventDefault();
              this.uploader.open(values);
            };
          },
          complete: container => {
            container.element.classList.remove("loading");
          }
        },
        // {
        //   class: "field-control",
        //   update: function() {
        //     if (value.length) {
        //       this.children = [{
        //         tag: "button",
        //         class: "delete button",
        //         update: function() {
        //           this.element.textContent = "Remove";
        //           this.element.addEventListener("click", function(event) {
        //             event.preventDefault();
        //             field.backup();
        //             field.setArray([]);
        //             field.edit();
        //             field.render();
        //           });
        //         }
        //       }];
        //     } else {
        //       this.children = [];
        //     }
        //   }
        // },
        {
          class: "field-control",
          update: async container => {
            let values = await this.get() || [];
            values = await this.validate(values);
            container.children = values.length && [this.buildDeleteButton()] || [];
          }
        }
      ]
		};

  }

}
