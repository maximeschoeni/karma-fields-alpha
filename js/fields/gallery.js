KarmaFieldsAlpha.fields.gallery = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, parent, form) {
    super(resource, parent, form);

    this.files = {};
    this.uploader = this.createUploader(resource);

  }

  async openLibrary(ids) {
    if ((this.resource.uploader || this.resource.library)  === "wp") {
      this.uploader.open(ids);
    } else {
      await this.dispatch(this.createEvent({
        action: "media-library"
      }));
    }

  }

  async dispatch(event) {

    switch(event.action) {

      case "add":
        // this.uploader.open([]);
        await this.openLibrary([]);
        break;

      case "edit": {
        // const ids = await this.getSelection();
        const ids = await this.slice(event.selection.index, event.selection.length);
        // console.log(ids, event.selection);
        this.editSelection = event.selection;
        // this.uploader.open(ids);
        await this.openLibrary(ids);
        break;
      }

      case "delete": {
        const ids = await this.getSelection();
        // let array = await this.getArray();
        // array = array.filter(id => !ids.includes(id));
        // await this.setArray(array);
        await this.delete(ids);
        await this.render();
        break;
      }

      case "selection": {
        event.data = await this.getSelection();
        break;
      }

      // case "get": {
      //   const value = await this.getValue(...event.path);
      //   event.setValue(value);
      //   break;
      // }

      default:
        await super.dispatch(event);
        break;

    }

    return event;
  }

  async getSelection() {
    // return this.selection && this.slice(this.selection.index, this.selection.length) || await this.getArray();
    return this.selection && this.slice(this.selection.index, this.selection.length);
  }

  // async getValue(key) {
  //
  //   switch(key) {
  //
  //     case "selection":
  //       return await this.getSelection().length > 0;
  //
  //     case "empty": {
  //       const array = await this.getArray();
  //       return array.length === 0;
  //     }
  //
  //   }
  //
  // }

  async add(ids) {
    let array = await this.getArray();
    await this.setArray([...array, ...ids].slice(0, this.getMax()));
  }

  async delete(ids) {
    let array = await this.getArray();
    await this.setArray(array.filter(id => !ids.includes(id)));
  }

  async swapRange(index1, index2, length) {
    let values = await this.getArray();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(index2, 0, ...values.splice(index1, length));
		await this.setArray(values);
    // await this.edit();
  }

  async insert(data, index, length) {
    let values = await this.getArray();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(index, length, ...data);
    await this.setArray(values.slice(0, this.getMax()));
  }

  async slice(index, length) {
    let values = await this.getArray() || [];
    return values.slice(index, index + length);
  }

  async getArray() {

    // const event = this.createEvent({
    //   action: "get",
    //   type: "array",
    //   join: ["files"]
    // });
    //
    // await super.dispatch(event);
    //
    // return event.getValue();


    const request = await super.dispatch({
      action: "get",
      type: "array"
    });

    // return request.getValue();
    return KarmaFieldsAlpha.Type.toArray(request.data);
  }


  async setArray(value) {

    // const event = this.createEvent({
    //   action: "set",
    //   type: "array",
    //   backup: "always",
    //   autosave: this.resource.autosave
    // });
    //
    // event.setValue(value);
    //
    // await super.dispatch(event);

    await super.dispatch({
      action: "set",
      type: "array",
      backup: true,
      autosave: this.resource.autosave,
      data: KarmaFieldsAlpha.Type.toArray(value)
    });


  }

  createUploader(resource) {
    const uploader = {};
    uploader.addFrame = null;
    uploader.open = (imageIds) => {
      uploader.imageIds = imageIds || [];
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
          multiple: this.getMax() > 1 ? true : false
        });
        uploader.addFrame.on("select", async () => {
          const attachments = uploader.addFrame.state().get("selection").toJSON();
          const attachmentIds = attachments.map(attachment => attachment.id.toString());
          uploader.imageIds = attachmentIds; //.map(id => id.toString());
          // await this.setArray(attachmentIds);
          if (this.editSelection) {


            await this.insert(attachmentIds, this.editSelection.index, this.editSelection.length);
            this.editSelection = null;
          } else {
            await this.add(attachmentIds);
          }
          await this.render();
        });
        uploader.addFrame.on("open", () => {
          let selection = uploader.addFrame.state().get("selection");
          for (let id of uploader.imageIds) {
            selection.add(wp.media.attachment(id));
          }
        });
      }
      uploader.addFrame.open();
    }
    return uploader;
  }


  // getDefault() {
  //   return [];
  // }


  // async validate(value) {
  //
  //   if (!this.getFile(value[0])) {
  //     await this.fetchIds(value);
  //   }
  //   return value;
  //
  // }

  // async fetchFiles(array) {
  //   if (!this.hasFiles(array)) {
  //     await this.fetchIds(array);
  //   }
  // }
  //
  // async fetchIds(ids, args) {
  //   // const driver = this.resource.driver || "attachment";
  //   const driver = this.resource.driver || "medias";
  //   const argString = args && new URLSearchParams(args).toString();
  //   const results = await KarmaFieldsAlpha.Gateway.getOptions(driver+"?ids="+ids.join(",")+(argString && "&"+argString || ""));
  //   this.setFiles(results);
  //   return results;
  // }
  //
  // hasFiles(ids) {
  //   return ids.every(id => this.getFile(id));
  // }
  //
  // setFiles(files) {
  //   files.forEach(file => {
  //     this.setFile(file.id, file);
  //   });
  // }
  //
  // getFiles(ids) {
  //   return ids.map(id => this.files[id]);
  // }
  //
  // getFile(id) {
  //   return this.files[id];
  // }
  //
  // setFile(id, file) {
  //   this.files[id] = file;
  // }

  getMax() {
    return this.resource.max || this.resource.multiple === false && 1 || 999999;
  }

  // buildImage(file) {
  //   return {
  //     tag: "img",
  //     update: src => {
  //       src.element.src = file.src;
  //       src.element.width = file.width;
  //       src.element.height = file.height;
  //     }
  //   };
  // }
  //
  // buildImageContainer(value) {
  //   return {
  //     class: "image-container",
  //     update: container => {
  //       const file = value && this.getFile(value);
  //
  //
  //
  //       container.children = file && [this.buildImage(file)] || [];
  //       container.element.classList.toggle("type-image", file && file.type && file.type.startsWith("image") || false);
  //     }
  //   }
  // }
  //
  // buildAddButton(name) {
  //   return {
  //     class: "add",
  //     update: button => {
  //       button.element.textContent = name || "Add file";
  //     }
  //   };
  // }
  //
  // buildDeleteButton() {
  //   return {
  //     tag: "button",
  //     class: "delete button",
  //     update: button => {
  //       button.element.textContent = "Remove";
  //       button.element.onclick = async (event) => {
  //         event.preventDefault();
  //         // await this.backup();
  //         // await this.editValue(this.resource.empty || "");
  //         await this.setArray([]);
  //         await this.render();
  //       };
  //     }
  //   };
  // }

  build() {
    return {
			class: "karma-gallery karma-field",
			init: container => {
        this.render = container.render;
			},
      update: async container => {


        // const request = await this.dispatch({
        //   action: "get",
        //   type: "array"
        // });
        //
        // let ids = KarmaFieldsAlpha.Type.toArray(request.data);

        const ids = await this.dispatch({
          action: "get",
        }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

        const store = new KarmaFieldsAlpha.Store("posts", ["files"]);

        if (ids.length) {
          await store.query("post_type=attachment&post_status=inherit&ids="+ids.join(","));
        }



        // KarmaFieldsAlpha.Driver.join(paramString, "files");

        container.children = [
          {
            class: "gallery",
            update: async gallery => {
              gallery.element.classList.toggle("has-image", ids.length > 0);
              gallery.element.classList.toggle("empty", ids.length === 0);

              this.register(gallery.element);

              gallery.children = ids.map((id, index) => {
                return {
                  class: "frame",
                  update: async frame => {
                    this.registerCell(frame.element, index);
                    frame.element.classList.add("loading");

                    const src = await store.getValue(id, "thumb_src");
                    const width = await store.getValue(id, "thumb_width");
                    const height = await store.getValue(id, "thumb_height");
                    const type = await store.getValue(id, "type");

                    frame.element.classList.remove("loading");

                    frame.children = [
                      {
                        // class: "image-container",
                        tag: "figure",
                        update: wrapper => {
                          // const file = id && this.getFile(id);
                          if (src[0] && width[0] && height[0] && type[0]) {
                            wrapper.children = [{
                              tag: "img",
                              update: image => {
                                image.element.src = src[0];
                                image.element.width = width[0];
                                image.element.height = height[0];
                              }
                            }];
                            wrapper.element.classList.toggle("type-image", type[0].startsWith("image") || false);
                          } else {
                            wrapper.children = [];
                          }
                        }
                      }
                    ];
                  }
                };
              });
              if (ids.length < this.getMax()) {
                gallery.children = [...gallery.children, {
                  class: "frame",
                  update: frame => {
                    this.registerCell(frame.element, ids.length, true);
                    frame.element.style.order = "99999";
                  },
                  children: [
                    {
                      tag: "figure",
                      children: []
                    },
                    this.createChild({
                      type: "button",
                      title: "Add image",
                      // dashicon: "plus",
                      action: "add"
                    }).build()
                  ]
                }];
              }

            }
          },
          {
            class: "controls",
            init: controls => {
              controls.element.onmousedown = event => {
                event.preventDefault(); // -> prevent losing focus on selected items
              }
            },
            update: controls => {
              if (this.resource.controls !== false) {
                controls.child = this.createChild(this.resource.controls || "controls").build();
              }
            }
          }
        ]
      }
		};

  }



  register(container) {

    window.selector = this;

    this.container = container;
    this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;

    this.map = new Map();
    this.length = 0;


  }

  // registerPlus(element, index) {
  //   this.length = index;
  //   this.map.set(element, index);
  //   element.onclick = event => {
  //     this.growSelection({index: this.map.get(element), length: 1});
  //     this.endSelection();
  //   }
  //   element.ondblclick = event => {
  //     this.dispatch({action: "edit"});
  //   }
  // }

  registerCell(element, index, plus) {

    this.map.set(element, {
      index: index,
      plus: plus
    });

    // element.classList.remove("selected", this.isSelected(index));
    element.classList.remove("selected");
    element.style.order = index.toString();

    element.ondblclick = event => {
      event.preventDefault();

      const request = this.createEvent({
        action: "edit",
        selection: this.selection || {index: this.map.get(element).index, length: 1}
      });
      this.dispatch(request);
      // const ids = await this.getSelection();
      // this.editSelection = this.selection;
      // this.uploader.open(ids);
    }

    element.onmousedown = event => {
      if (event.button !== 0) {
        return;
      }

      if (event.target !== element) {
         return;
      }



      const index = this.map.get(element).index;



      if (this.isSelected(index)) {

        event.preventDefault(); // -> prevent TA focusout

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;
        this.mouseX = this.pointerX;
        this.mouseY = this.pointerY;
        this.scrollTop = this.scrollContainer.scrollTop;
        this.scrollDiffY = 0;
        this.index = this.selection.index;

        const elements = this.getElements(this.selection);
        this.element = element;
        this.indexOffset = index - this.index;

        // this.offsetLeft = elements[0].offsetLeft;
        this.offsetLeft = this.element.offsetLeft;
        this.originOffsetLeft = this.offsetLeft;

        // this.offsetTop = elements[0].offsetTop;
        this.offsetTop = this.element.offsetTop;
        this.originOffsetTop = this.offsetTop;

        this.element.classList.add("grabbing");
        this.container.classList.add("dragging");

        elements.forEach(element => {
          element.classList.add("drag");
        });

        const mousemove = event => {
          this.mouseX = event.clientX;
          this.mouseY = event.clientY;
          this.drag();
        }

        const scroll = event => {
          this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
          this.drag();
        }

        const mouseup = event => {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);
          window.removeEventListener("scroll", scroll);
          // setTimeout(() => {
          //   document.body.classList.remove("karma-dragging");
          // }, 300);
          this.drop();
        }

        this.drag();

        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
        window.addEventListener("scroll", scroll);

        // document.body.classList.add("karma-dragging");

      } else {

        const mousemove = event => {

          if (this.map.has(event.target)) {
            this.growSelection({index: this.map.get(event.target).index, length: 1});
          }
        }

        const mouseup = event => {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);

          if (this.map.has(event.target)) {
            this.growSelection({index: this.map.get(event.target).index, length: 1});
            this.endSelection();
          } else {
            // this.clearSelection();
          }
          this.endSelection();



          this.container.classList.remove("selecting");

        }

        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        this.container.classList.add("selecting");

      }


    }

  }

  async endSelection() {

    this.container.classList.add("has-selection");

    this.ta = document.createElement("textarea");
    this.ta.style.zIndex = "999999999";
    this.ta.style.position = "fixed";
    this.ta.style.bottom = "0";
    this.ta.style.left = "-100%";

    document.body.appendChild(this.ta);

    const data = await this.slice(this.selection.index, this.selection.length) || [];

    // this.ta.value = JSON.stringify(data);
    this.ta.value = data.join("\n");
    this.ta.focus({preventScroll: true});
    this.ta.select();

    this.ta.onfocusout = event => {
      console.log(event);
      this.selection = null;
      this.focusRange = null;
      this.renderSelection();
      document.body.removeChild(this.ta);
      this.container.classList.remove("has-selection");
    }

    this.ta.onpaste = async event => {
      event.preventDefault();
      // await this.insert(JSON.parse(event.clipboardData.getData("text")), this.selection.index, this.selection.length);
      await this.insert(event.clipboardData.getData("text").split("\n"), this.selection.index, this.selection.length);
      this.ta.blur();
      await this.render();
    }
    //
    // this.ta.oncut = async event => {
    //   console.log("cut", this.ta.value);
    //
    //   // await this.insert([], this.selection.index, this.selection.length);
    //   // await this.render();
    //   // this.ta.blur();
    // }

    this.ta.oninput = async event => {
      switch (event.inputType) {
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
        case "deleteByCut":
          await this.insert([], this.selection.index, this.selection.length);
          this.ta.blur();
          await this.render();
          break;



        default:
          // console.log("oninput", event.inputType, this.ta.value);
          // await this.insert([this.ta.value], this.selection.index, this.selection.length);
          // await this.render();
          this.ta.blur();
          break;
      }
    }
    this.ta.onkeydown = async event => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          if (this.selection.index > 0) {
            await this.swapRange(this.selection.index, --this.selection.index, this.selection.length);
            await this.render();
          }
          break;
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          if (this.selection.index + this.selection.length < (await this.getArray() || []).length) {
            await this.swapRange(this.selection.index, ++this.selection.index, this.selection.length);
            await this.render();
          }
          break;
      }
    }


  }



  getElements(range) {
    const array = [];
    for (let [element, value] of this.map.entries()) {
      if (KarmaFieldsAlpha.Range.includes(value.index, range)) {
        array.push(element);
      }
    }
    return array;
  }

  getElement(index) {
    for (let [element, value] of this.map.entries()) {
      if (value.index === index) {
        return element;
      }
    }
  }

  growSelection(range) {


    if (this.focusRange) {
      range = KarmaFieldsAlpha.Range.union(this.focusRange, range);
    } else {
      this.focusRange = range;
    }

    if (!this.selection || !KarmaFieldsAlpha.Range.equals(this.selection, range)) {

      this.selection = range;
      this.renderSelection();

    }

	}

  clearSelection() {
    this.selection = null;
    this.focusRange = null;
    this.renderSelection();
  }

  renderSelection() {
    this.map.forEach((value, element) => {
      element.classList.toggle("selected", this.isSelected(value.index));
    });
    // this.getElement(this.length).classList.toggle("selected", this.isSelected(this.length));
	}

  updateOrder(element) {
    element.style.order = this.map.get(element).index.toString();
  }

  shift(element, offset) {
    const state = this.map.get(element);
    state.index += offset;
    element.style.order = state.index.toString();
  }

  isSelected(index) {
    return this.selection && KarmaFieldsAlpha.Range.includes(index, this.selection) || false;
  }

  getDiffX() {
    return this.mouseX - this.pointerX - (this.offsetLeft - this.originOffsetLeft);
  }

  getDiffY() {
    return this.mouseY - (this.pointerY) + this.scrollDiffY - (this.offsetTop - this.originOffsetTop);
  }



  drag() {

    if (!this.selection) {
      return;
    }

    let diffX = this.getDiffX();
    let diffY = this.getDiffY();


    const elements = this.getElements(this.selection);
    const firstElement = elements[0];
    const lastElement = elements[elements.length-1];
    const prevElement = this.getElement(this.selection.index-1);
    const nextElement = this.getElement(this.selection.index+this.selection.length);

    const grabElement = this.getElement(this.selection.index+this.indexOffset);
    const grabElementPrev = this.getElement(this.selection.index+this.indexOffset-1);
    const grabElementNext = this.getElement(this.selection.index+this.indexOffset+1);

    // if (prevElement && KarmaFieldsAlpha.Rect.fromElement(firstElement).offset(diffX, diffY).isBefore(KarmaFieldsAlpha.Rect.fromElement(prevElement))) {
    if (prevElement && grabElementPrev && KarmaFieldsAlpha.Rect.fromElement(grabElement).offset(diffX, diffY).isBefore(KarmaFieldsAlpha.Rect.fromElement(grabElementPrev))) {

      // swap:
      // const order = this.map.get(prevElement) + this.selection.length;
      // prevElement.style.order = order.toString();
      // this.map.set(prevElement, order);
      // this.map.get(prevElement).index += this.selection.length;
      // this.updateOrder(prevElement);
      this.shift(prevElement, this.selection.length);

      this.selection.index--;
      elements.forEach(element => {
        // const order = state.index - 1;
        // element.style.order = order.toString();
        // this.map.set(element, order);
        // this.map.get(element).index.index--;
        // this.updateOrder(element);
        this.shift(element, -1);
      });

      this.offsetLeft = this.element.offsetLeft;
      this.offsetTop = this.element.offsetTop;
      diffX = this.getDiffX();
      diffY = this.getDiffY();

    // } else if (nextElement && KarmaFieldsAlpha.Rect.fromElement(lastElement).offset(diffX, diffY).isAfter(KarmaFieldsAlpha.Rect.fromElement(nextElement))) {
    } else if (nextElement && !this.map.get(nextElement).plus && grabElementNext && KarmaFieldsAlpha.Rect.fromElement(grabElement).offset(diffX, diffY).isAfter(KarmaFieldsAlpha.Rect.fromElement(grabElementNext))) {

      // swap:
      // const order = this.map.get(nextElement) - this.selection.length;
      // nextElement.style.order = order.toString();
      // this.map.set(nextElement, order);
      // this.map.get(nextElement).index -= this.selection.length;
      // this.updateOrder(nextElement);
      this.shift(nextElement, -this.selection.length);

      this.selection.index++;
      elements.forEach(element => {
        // const order = this.map.get(element) + 1;
        // element.style.order = order.toString();
        // this.map.set(element, order);
        // this.map.get(element).index++;
        // this.updateOrder(element);
        this.shift(element, 1);
      });

      this.offsetLeft = this.element.offsetLeft;
      this.offsetTop = this.element.offsetTop;

      diffX = this.getDiffX();
      diffY = this.getDiffY();
    }

    const outside = !KarmaFieldsAlpha.Rect.fromElement(this.container).intersects(KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY));

    elements.forEach(element => {
      element.style.transform = "translate("+diffX+"px, "+diffY+"px)";
      element.classList.toggle("outside", outside);
    });



  }

  async drop() {
    if (this.selection) {
      this.getElements(this.selection).forEach(element => {
        element.classList.remove("drag");
        element.style.transform = "none";

        element.classList.remove("outside");
      });

      this.element.classList.remove("grabbing");
      this.container.classList.remove("dragging");

      let diffX = this.getDiffX();
      let diffY = this.getDiffY();
      const firstElement = this.getElement(this.selection.index);
      const lastElement = this.getElement(this.selection.index+this.selection.length-1);

      if (!KarmaFieldsAlpha.Rect.fromElement(this.container).intersects(KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY))) {
        await this.insert([], this.selection.index, this.selection.length);
        this.ta.blur();
        await this.render();
      } else if (this.index !== this.selection.index) {
        await this.swapRange(this.index, this.selection.index, this.selection.length);
        this.ta.blur();

        // await this.render();

        // setTimeout(async () => {
        //   console.log(this.index, this.selection.index, this.selection.length);
        //
        //
        //   await this.render();
        //   this.ta.blur();
        // }, 100);
      }
    }
  }



  static controls = class extends KarmaFieldsAlpha.fields.group {

    constructor(resource, ...args) {

      super({
        ...{
          id: "controls",
          children: [
            "add",
            "remove",
            "edit"
          ]
        },
        ...resource
      }, ...args);

    }

    static test = {
      type: "button",
      title: "Test",
      action: "test"
    }

    static add = {
      type: "button",
      title: "Add",
      action: "add",
      hidden: ["count", ["get", "array"]]
    }

    static remove = {
      type: "button",
      title: "Remove",
      action: "delete",
      // disabled: ["empty", ["selection"]],
      hidden: ["empty", ["get", "array"]]
    }

    static edit = {
      type: "button",
      title: "Change",
      action: "edit",
      // disabled: ["empty", ["selection"]],
      hidden: ["empty", ["get", "array"]]
    }

  }


}


KarmaFieldsAlpha.Range = class {

	constructor(index, length) {
		this.index = index || 0;
		this.length = length || 1;
	}

	static union(range1, range2) {
		let left = Math.min(range1.index, range2.index);
		let right = Math.max(range1.index + range1.length, range2.index + range2.length);
    return new this(left, right - left);
	}

	static equals(range1, range2) {
		return range1.index === range2.index && range1.length === range2.length;
	}

  static includes(index, range) {
    return index >= range.index && index < range.index + range.length;
  }

  static toArray(range) {
    const array = [];
    for (let i = range.index; i < range.index + range.length; i++) {
      array.push(i);
    }
    return array;
  }

}
