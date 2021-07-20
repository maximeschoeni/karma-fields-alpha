KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.numberField {

  constructor(resource, parent, form) {
    super(resource, parent, form);

    // this.datatype = "number";
    this.files = {};
    this.uploader = this.createUploader(resource);

  }

  exportValue() {
    const value = this.getValue()
    if (value) {
      return this.getFile(value).original_url;
    }
    return "";

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
            let attachments = uploader.addFrame.state().get("selection").toJSON().map(attachment => attachment);
            if (attachments.length) {
              field.backup();
              field.setValue(attachments[0].id);
              field.render();
              // field.updateValue(attachments[0].id).then(function() {
              //   debugger;
              //   field.render();
              // });
            }
          });
          this.addFrame.on("open", function() {
            let selection = uploader.addFrame.state().get("selection");
            const value = field.getValue();
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

  // fetch(queryString) {
  getRemoteOptions(queryString) {
		return KarmaFieldsAlpha.Form.fetch2(this.resource.driver || "attachment", queryString);
  }


  // convert(value) {
  //   return value && parseInt(value) || 0;
  // }

  async validate(value) {
    value = parseInt(value);
    if (value && !isNaN(value) && !this.getFile(value)) {
      await this.fetchIds([value]);
    }
    return value;
  }

  async fetchIds(ids) {
    let queryString = this.getOptionsParamString({ids: ids});
    const results = await this.getRemoteOptions(queryString);
    // if (results[0] && results[0].src) {
    //   await fetch(results[0].src);
    // }
    this.setFiles(results);
    return results;
  }

  hasFiles(ids) {
    return ids.every(id => this.getFile(id));
  }

  setFiles(files) {
    files.forEach(file => {
      this.setFile(file.id, file);
    });
  }

  getFiles(ids) {
    return ids.map(id => this.files[id]);
  }

  getFile(id) {
    return this.files[id];
  }

  setFile(id, file) {
    this.files[id] = file;
  }

  buildContent(value) {
    const field = this;
    return [
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
          }
          // ,
          // {
          //   class: "karma-field-spinner"
          // }
        ]
      },
      {
        class: "field-control",
        update: function() {
          if (value) {
            this.children = [{
              tag: "button",
              class: "delete button",
              update: function() {
                this.element.textContent = "Remove";
                this.element.onclick = async (event) => {
                  event.preventDefault();
                  field.backup();
                  await field.updateValue(0);
                  field.render();
                };
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
    return {
			class: "karma-file karma-field",
			init: container => {
				// if (field.resource.style) {
				// 	container.element.style = field.resource.style;
				// }
        container.element.setAttribute('tabindex', '-1');
        this.init(container.element);

        this.render = container.render;
			},
			update: async container => {

        // this.render = async () => {

        container.element.classList.add("loading");

        const value = await this.update();

        container.children = this.buildContent(value);

        // await container.render();

        container.element.classList.toggle("modified", this.modified);


        // }

        // this.render();

        // field.onSet = function(value) {
        //
        //   container.render();
        // }
        // field.onModified = function(modified) {
				// 	container.element.classList.toggle("modified", modified);
				// }
				// field.onLoad = function(loading) {
        //   container.element.classList.toggle("loading", loading);
				// }




        // container.render();

			},
      complete: container => {
        container.element.classList.remove("loading");
      }
		};

  }

}
