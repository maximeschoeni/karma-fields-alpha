KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain, parent) {
    super(resource, domain, parent);

    this.datatype = "number";
    this.data.files = {};
    this.data.uploader = this.createUploader(resource);

    // this.events.fetch = function(field, params) {
		// 	return field.queryOptions(this.resource.driver || "attachment", params);
		// };
  }

  getDriver() {
		return this.resource.driver || "attachment";
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

  build() {
    const field = this;

    return {
			class: "karma-field-"+field.resource.type,
      clear: true,
			init: function(container) {
				// field.events.set = function() {
				// 	container.render(true); // -> when field value is changed by outside
				// }
				if (field.resource.style) {
					this.element.style = field.resource.style;
				}
			},
			update: function(container) {
				this.children = [

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
                    field.clearOptions();
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

              field.fetchValue().then(function(value) {
                //container.render(true);
              });

      				// field.triggerEvent("load");
      				// field.triggerEvent("modify");
            }
          }
        ];
			}
		};

  }

}
