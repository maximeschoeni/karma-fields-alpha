KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, parent, form) {
    super(resource, parent, form);

    // this.datatype = "number";
    this.files = {};
    this.uploader = this.createUploader(resource);

  }

  async exportValue(singleCol) {

    const value = await this.fetchValue();

    // if (singleCol) {
    //   if (Number(value)) {
    //     const file = this.getFile(value);
    //     if (file) {
    //       const response = await fetch(file.original_src);
    //       const blob = await response.blob();
    //       return blob;
    //     }
    //   }
    // } else
    if (Number(value)) {
      return this.getFile(value).original_src;
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
    const uploader = {
      addFrame: null,
      // imageId: null,
      open: (imageId) => {
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
          this.addFrame.on("select", async () => {
            let attachments = this.addFrame.state().get("selection").toJSON().map(attachment => attachment);
            if (attachments[0] && attachments[0].id) {
              this.backup();
              imageId = attachments[0].id.toString();
              await this.editValue(imageId);
              // await this.edit();
              await this.render();
              // console.log(attachments[0].id.toString());
            }
          });
          this.addFrame.on("open", () => {
            let selection = this.addFrame.state().get("selection");
            // const value = await this.getValue();
            // if (value) {
            //   selection.add(wp.media.attachment(value));
            // }
            if (imageId) {
              selection.add(wp.media.attachment(imageId));
            }
          });
        }
        this.addFrame.open();
      }
    };
    return uploader;
  }

  // fetch(queryString) {
  // getRemoteOptions(queryString) {
  //   return super.getRemoteOptions(queryString, this.resource.driver || "attachment");
	// 	// return KarmaFieldsAlpha.Form.fetch2(this.resource.driver || "attachment", queryString);
  // }

  // convert(value) {
  //   return value.toString();
  // }



  setDefault() {
    if (this.resource.default) {
      this.initValue(this.resource.default.toString());
    }
  }


  isEmpty(value) {
    return !value || value === this.resource.empty;
  }

  async validate(value) {
    if (this.isEmpty(value)) {
      const defaultValue = this.resource.default || this.resource.empty || "";
      if (value !== defaultValue) {
        value = defaultValue;
        if (!this.resource.readonly) {
          await this.setValue(value);
        }
      }
    }
    if (!this.isEmpty(value) && !this.getFile(value)) {
      await this.fetchIds([value]);
    }
    return value;


    // if (!Number(value)) {
    //   const defaultValue = this.resource.default || "";
    //   if (value !== defaultValue && !this.resource.readonly) {
    //     await this.setValue(defaultValue);
    //   }
    // } else if (!this.getFile(value)) {
    //   await this.fetchIds([value]);
    // }
    // return value;
  }

  async fetchIds(ids) {
    // let queryString = this.getOptionsParamString({ids: ids});
    // const results = await this.getRemoteOptions(queryString, this.resource.driver || "attachment"); // "ids="+ids.join(",")
    const driver = this.resource.driver || "attachment";
    const results = await KarmaFieldsAlpha.Gateway.getOptions(driver+"?ids="+ids.join(","));
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

  // buildContent(value) {
  //   return [
  //     {
  //       // tag: "a",
  //       class: "image-frame",
  //       update: frame => {
  //         frame.element.onclick = event => {
  //           event.preventDefault();
  //           if (!this.resource.readonly) {
  //             this.uploader.open(value);
  //           }
  //         };
  //       },
  //       children: [
  //         {
  //           class: "image-container",
  //           update: container => {
  //             if (!this.isEmpty(value)) {
  //               const file = this.getFile(value);
  //               container.children = file && [{
  //                 tag: "img",
  //                 update: src => {
  //                   src.element.src = file.src;
  //                   src.element.width = file.width;
  //                   src.element.height = file.height;
  //                 }
  //               }] || [];
  //               container.element.classList.toggle("type-image", file && file.type && file.type.startsWith("image") || false);
  //             } else {
  //               container.children = [];
  //             }
  //           }
  //         },
  //         {
  //           class: "button-container",
  //           update: container => {
  //             if (!this.isEmpty(value)) {
  //               container.children = [];
  //             } else if (!this.resource.readonly) {
  //               container.children = [{
  //                 class: "add",
  //                 update: button => {
  //                   button.element.textContent = "Add file";
  //                 }
  //               }];
  //             }
  //           }
  //         },
  //         {
  //           class: "field-control",
  //           update: container => {
  //             if (!this.isEmpty(value)) {
  //               container.children = [{
  //                 tag: "button",
  //                 class: "delete button",
  //                 update: button => {
  //                   button.element.textContent = "Remove";
  //                   button.element.onclick = async (event) => {
  //                     event.preventDefault();
  //                     this.backup();
  //                     await this.editValue("");
  //                     this.render();
  //                   };
  //                 }
  //               }];
  //             } else {
  //               container.children = [];
  //             }
  //           }
  //         }
  //       ]
  //     }
  //
  //   ];
  // }

  // build() {
  //   return {
	// 		class: "karma-file karma-field",
	// 		init: container => {
  //       container.element.setAttribute('tabindex', '-1');
  //       this.init(container.element);
  //       this.render = container.render;
	// 		},
	// 		update: async container => {
  //
  //       container.element.classList.add("loading");
  //
  //       let value = await this.fetchValue();
  //       value = await this.validate(value);
  //
  //       let modified = this.isModified();
  //       container.children = this.buildContent(value);
  //       container.element.classList.toggle("modified", modified);
	// 		},
  //     complete: container => {
  //       container.element.classList.remove("loading");
  //     }
	// 	};
  //
  // }



  // buildImageContainer(value) {
  //   return {
  //     class: "image-container",
  //     update: container => {
  //       if (Number(value)) {
  //         const file = this.getFile(value);
  //         container.children = file && [{
  //           tag: "img",
  //           update: src => {
  //             src.element.src = file.src;
  //             src.element.width = file.width;
  //             src.element.height = file.height;
  //           }
  //         }] || [];
  //         container.element.classList.toggle("type-image", file && file.type && file.type.startsWith("image") || false);
  //       } else {
  //         container.children = [];
  //       }
  //     }
  //   };
  // }

  buildImage(file) {
    return {
      tag: "img",
      update: src => {
        src.element.src = file.src;
        src.element.width = file.width;
        src.element.height = file.height;
      }
    };
  }

  buildImageContainer(value) {
    return {
      class: "image-container",
      update: container => {
        const file = !this.isEmpty(value) && this.getFile(value);
        container.child = file && this.buildImage(file);
        container.element.classList.toggle("type-image", file && file.type && file.type.startsWith("image") || false);
      }
    }
  }

  // buildAddButtonContainer(value) {
  //   return {
  //     class: "button-container",
  //     update: container => {
  //       if (Number(value)) {
  //         container.children = [];
  //       } else if (!this.resource.readonly) {
  //         container.children = [{
  //           class: "add",
  //           update: button => {
  //             button.element.textContent = "Add file";
  //           }
  //         }];
  //       }
  //     }
  //   };
  // }
  buildAddButton() {
    return {
      class: "add",
      update: button => {
        button.element.textContent = "Add file";
      }
    };
  }

  buildDeleteButton() {
    return {
      tag: "button",
      class: "delete button",
      update: button => {
        button.element.textContent = "Remove";
        button.element.onclick = async (event) => {
          event.preventDefault();
          this.backup();
          await this.editValue(this.resource.empty || "");
          this.render();
        };
      }
    };
  }

  build() {
    return {
			class: "karma-file karma-field",
			init: container => {
        container.element.setAttribute('tabindex', '-1');
        // this.init(container.element);
			},
      update: container => {
        this.render = container.render;
      },
      children: [
        {
          class: "image-frame",
          update: async frame => {
            frame.element.classList.add("loading");

            let value = await this.fetchValue();
            value = await this.validate(value);

            let modified = this.isModified();

            frame.element.classList.toggle("has-image", !this.isEmpty(value));

            frame.children = [
              this.buildImageContainer(value),
              this.buildAddButton()
            ];

            frame.element.classList.toggle("modified", modified);

            frame.element.onclick = event => {
              event.preventDefault();
              if (!this.resource.readonly) {
                this.uploader.open(value);
              }
            };
          },
          complete: container => {
            container.element.classList.remove("loading");
          }
        },
        {
          class: "field-control",
          update: async container => {
            let value = await this.fetchValue();
            value = await this.validate(value);
            // container.children = Number(value) ? [this.buildDeleteButton()] : [];
            container.child = !this.isEmpty(value) && this.buildDeleteButton();
          }
        }
      ]
		};

  }

  //
  // buildImageFrame() {
  //
  // }
  //
  // build() {
  //   return {
	// 		class: "karma-file karma-field",
	// 		init: container => {
  //       container.element.setAttribute('tabindex', '-1');
  //       this.init(container.element);
  //       this.render = container.render;
	// 		},
  //     children: [
  //       {
  //         // tag: "a",
  //         class: "image-frame",
  //         update: frame => {
  //           container.element.classList.add("loading");
  //
  //           let value = await this.fetchValue();
  //           value = await this.validate(value);
  //
  //           let modified = this.isModified();
  //           container.children = this.buildImageFrame(value);
  //           container.element.classList.toggle("modified", modified);
  //         }
  //       }
  //     ],
	// 		update: async container => {
  //
  //
	// 		},
  //     complete: container => {
  //       container.element.classList.remove("loading");
  //     }
	// 	};
  //
  // }



  //
  // buildImageContainer(value) {
  //   return {
  //     class: "image-container",
  //     update: container => {
  //       if (Number(value)) {
  //         const file = this.getFile(value);
  //         container.children = file && [{
  //           tag: "img",
  //           update: src => {
  //             src.element.src = file.src;
  //             src.element.width = file.width;
  //             src.element.height = file.height;
  //           }
  //         }] || [];
  //         container.element.classList.toggle("type-image", file && file.type && file.type.startsWith("image") || false);
  //       } else {
  //         container.children = [];
  //       }
  //     }
  //   };
  // }
  // buildButtonContainer(value) {
  //   return {
  //     class: "button-container",
  //     update: container => {
  //       if (Number(value)) {
  //         container.children = [];
  //       } else if (!this.resource.readonly) {
  //         container.children = [{
  //           class: "add",
  //           update: button => {
  //             button.element.textContent = "Add file";
  //           }
  //         }];
  //       }
  //     }
  //   };
  // }
  //
  // buildDeleteButton(value) {
  //   return {
  //     tag: "button",
  //     class: "delete button",
  //     update: button => {
  //       button.element.textContent = "Remove";
  //       button.element.onclick = async (event) => {
  //         event.preventDefault();
  //         this.backup();
  //         await this.editValue("");
  //         this.render();
  //       };
  //     }
  //   };
  // }
  //
  // build() {
  //   return {
	// 		class: "karma-file karma-field",
	// 		init: container => {
  //       container.element.setAttribute('tabindex', '-1');
  //       this.init(container.element);
  //       this.render = container.render;
  //
	// 		},
  //     children: [
  //       {
  //         // tag: "a",
  //         class: "image-frame",
  //         update: frame => {
  //           frame.element.onclick = event => {
  //             event.preventDefault();
  //             if (!this.resource.readonly) {
  //               this.uploader.open(value);
  //             }
  //           };
  //
  //         }
  //       },
  //       {
  //         class: "field-control",
  //         update: container => {
  //           if (Number(value)) {
  //             container.children = [{
  //               tag: "button",
  //               class: "delete button",
  //               update: button => {
  //                 button.element.textContent = "Remove";
  //                 button.element.onclick = async (event) => {
  //                   event.preventDefault();
  //                   this.backup();
  //                   await this.editValue("");
  //                   this.render();
  //                 };
  //               }
  //             }];
  //           } else {
  //             container.children = [];
  //           }
  //         }
  //       }
  //     ],
	// 		update: async container => {
  //
  //       container.element.classList.add("loading");
  //
  //       let value = await this.fetchValue();
  //       value = await this.validate(value);
  //
  //       let modified = this.isModified();
  //       container.children = this.buildContent(value);
  //       container.element.classList.toggle("modified", modified);
	// 		},
  //     complete: container => {
  //       container.element.classList.remove("loading");
  //     }
	// 	};
  //
  // }


}
