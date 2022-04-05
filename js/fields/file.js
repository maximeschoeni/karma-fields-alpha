KarmaFieldsAlpha.fields.file = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, parent, form) {
    super(resource, parent, form);

    // this.datatype = "number";
    this.files = {};
    this.uploader = this.createUploader(resource);

  }

  async getArray() {

    const event = this.createEvent({
      action: "get",
      type: "array",
      // default: await this.getDefault()
    });

    await this.dispatch(event);

    return event.getValue();
  }


  async setArray(value) {

    const event = this.createEvent({
      action: "set",
      type: "array",
      backup: "always",
      autosave: this.resource.autosave
    });

    event.setValue(value);

    await this.dispatch(event);

  }

  createUploader(resource) {
    const uploader = {};
    uploader.addFrame = null;
    uploader.open = (imageId) => {
      uploader.imageId = imageId;
      if (!uploader.addFrame) {
        uploader.addFrame = wp.media({
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
          multiple: resource.multiple === false ? false : true
        });
        uploader.addFrame.on("select", async () => {
          let attachments = uploader.addFrame.state().get("selection").toJSON().map(attachment => attachment);
          if (attachments[0] && attachments[0].id) {
            uploader.imageId = attachments[0].id;
            await this.setArray([attachments[0].id]);
            await this.render();
          }
        });
        uploader.addFrame.on("open", () => {
          let selection = uploader.addFrame.state().get("selection");
          if (uploader.imageId) {
            selection.add(wp.media.attachment(uploader.imageId));
          }
        });
      }
      uploader.addFrame.open();
    }
    return uploader;
  }


  getDefault() {
    return [];
  }


  async validate(value) {

    if (!this.getFile(value[0])) {
      await this.fetchIds(value);
    }
    return value;

  }

  async fetchIds(ids, args) {
    const driver = this.resource.driver || "attachment";
    const argString = args && new URLSearchParams(args).toString();
    const results = await KarmaFieldsAlpha.Gateway.getOptions(driver+"?ids="+ids.join(",")+(argString && "&"+argString || ""));
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
        const file = value && this.getFile(value);



        container.children = file && [this.buildImage(file)] || [];
        container.element.classList.toggle("type-image", file && file.type && file.type.startsWith("image") || false);
      }
    }
  }

  buildAddButton(name) {
    return {
      class: "add",
      update: button => {
        button.element.textContent = name || "Add file";
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
          // await this.backup();
          // await this.editValue(this.resource.empty || "");
          await this.setArray([]);
          await this.render();
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

            let array = await this.getArray();

            array = await this.validate(array);

            // let modified = await this.isModified();

            frame.element.classList.toggle("has-image", array.length > 0);

            frame.children = [
              this.buildImageContainer(array[0]),
              this.buildAddButton()
            ];

            // frame.element.classList.toggle("modified", modified);

            frame.element.onclick = event => {
              event.preventDefault();
              if (!this.resource.readonly) {
                this.uploader.open(array[0]);
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
            let array = await this.getArray();
            array = await this.validate(array);

            if (array.length) {
              container.children = [this.buildDeleteButton()];
            } else {
              container.children = [];
            }
          }
        }
      ]
		};

  }



}
