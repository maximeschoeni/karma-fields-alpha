KarmaFieldsAlpha.fields.files = class extends KarmaFieldsAlpha.fields.file {

  initField() {
    // this.registerType("json");
	}

  fetchArray(...path) {
    return this.fetchValue("array", ...path);
  }

  setDefault() {
    console.error("deprecated");
    // noop override setDefault
  }
  getDefault() {
    return [];
  }




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
            field.input(items.map(item => item.attributes.id.toString()));
            field.render();
          });

        }
        this.frame.open();
      }
    };
    return uploader;
  }

  // getValue() {
  //   let value = this.getDeltaValue();
  //   if (value !== undefined) {
  //     value = JSON.parse(value);
  //   } else {
  //     value = this.getOriginal();
  //   }
  //   return value;
  // }
  //
  // setValue(values) {
  //   if (values !== undefined) {
  //     super.setValue(JSON.stringify(values));
  //   }
  // }
  //
  // getOriginal() {
  //   let value = super.getOriginal();
  //   if (value !== undefined) {
  //     value = JSON.parse(value);
  //   }
  //   return value;
  // }
  //
  // setOriginal(values) {
  //   if (values !== undefined) {
  //     super.setOriginal(JSON.stringify(values));
  //   }
  // }

  // prepare(value) {
  //   return value;
  // }
  //
  // convert(value) {
  //   if (!Array.isArray(value)) {
  //     if (Number(value)) {
  //       return [value.toString()];
  //     }
  //     return [];
  //   }
  //   return value.map(item => item.toString());
  // }

  getEmpty() {
    return [];
  }

  // async validate(values) {
  //   values = values.filter(id => Number(id));
  //   const missingIds = values.filter(id => !this.getFile([id]));
  //   if (missingIds.length) {
  //     await this.fetchIds(missingIds);
  //   }
  //   return values;
  // }

  // async downloadValue() {
  //   return this.getRemoteValue(null, null, "array");
  // }

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

  // async update() {
  //
  //   let values = await this.getArray();
  //
  //   value = await this.validate(values);
  //
  //   return values;
  // }

  // validate(value) {
  //   const field = this;
  //
  //   if (!value || !Array.isArray(value)) {
  //     return Promise.resolve([]);
  //   } else if (this.hasFiles(value)) {
  //     return Promise.resolve(value);
  //   } else {
  //     return this.fetchIds(value).then(function() {
  //       return value;
  //     });
  //   }
  // }


  // buildContent(value) {
  //   const field = this;
  //   return [
  //     {
  //       tag: "a",
  //       class: "gallery",
  //       update: function(gallery) {
  //         this.element.onclick = function(event) {
  //           event.preventDefault();
  //           field.uploader.open(value);
  //         };
  //       },
  //       children: [
  //         {
  //           class: "images-container",
  //           update: function() {
  //             this.children = value.map(function(image_id) {
  //               const file = field.getFile(image_id);
  //               const type = file.type.startsWith("image") ? "image" : "file";
  //               return {
  //                 class: "image-container",
  //                 child: {
  //                   tag: "img",
  //                   update: function() {
  //                     this.element.src = file.src;
  //                     this.element.width = file.width;
  //                     this.element.height = file.height;
  //                   }
  //                 }
  //               };
  //             });
  //           }
  //         },
  //         {
  //           class: "add-container",
  //           children: [
  //             {
  //               class: "add",
  //               update: function() {
  //                 this.element.textContent = value.length ? "Add or edit files..." : "Add files...";
  //               }
  //             }
  //             // {
  //             //   class: "karma-field-spinner"
  //             // }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       class: "field-control",
  //       update: function() {
  //         if (value.length) {
  //           this.children = [{
  //             tag: "button",
  //             class: "delete button",
  //             update: function() {
  //               this.element.textContent = "Remove";
  //               this.element.addEventListener("click", function(event) {
  //                 event.preventDefault();
  //                 field.backup();
  //                 field.setArray([]);
  //                 field.edit();
  //                 field.render();
  //               });
  //             }
  //           }];
  //         } else {
  //           this.children = [];
  //         }
  //       }
  //     }
  //   ];
  // }

  // build() {
  //   return {
	// 		class: "karma-files karma-file karma-field",
	// 		init: container => {
  //       container.element.setAttribute('tabindex', '-1');
  //       this.init(container.element);
  //       this.render = container.render;
	// 		},
	// 		update: async container => {
  //       container.element.classList.add("loading");
  //       let values = await this.fetchArray();
  //
  //       values = await this.validate(values);
  //       let modified = this.isModified();
  //       container.children = this.buildContent(values);
  //       container.element.classList.toggle("modified", modified);
	// 		},
  //     complete: container => {
  //       container.element.classList.remove("loading");
  //     }
	// 	};
  // }



  // build() {
  //   return {
  //     class: "karma-files karma-file karma-field",
  //     init: container => {
  //       container.element.setAttribute('tabindex', '-1');
  //       this.init(container.element);
  //       this.render = container.render;
  //     },
  //     update: async container => {
  //       container.element.classList.add("loading");
  //       let values = await this.fetchArray();
  //
  //       values = await this.validate(values);
  //       let modified = this.isModified();
  //       container.children = this.buildContent(values);
  //       container.element.classList.toggle("modified", modified);
  //     },
  //     complete: container => {
  //       container.element.classList.remove("loading");
  //     }
  //   };
  // }

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
          await this.input(null, []);
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

            let values = await this.fetchArray() || [];
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
            let values = await this.fetchArray() || [];
            values = await this.validate(values);
            // container.children = Number(value) ? [this.buildDeleteButton()] : [];
            container.child = values.length && this.buildDeleteButton();
          }
        }
      ]
		};

  }

}
