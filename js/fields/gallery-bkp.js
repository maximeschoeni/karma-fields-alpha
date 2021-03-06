KarmaFieldsAlpha.fields.gallery = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, parent, form) {
    super(resource, parent, form);

    this.files = {};
    this.uploader = this.createUploader(resource);

  }

  async dispatch(event) {

    switch(event.action) {

      case "add":
        this.uploader.open([]);
        break;

      case "edit": {
        // const ids = await this.getSelection();
        const ids = await this.slice(event.selection.index, event.selection.length);
        // console.log(ids, event.selection);
        this.editSelection = event.selection;
        this.uploader.open(ids);
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

      case "get": {
        const value = await this.getValue(...event.path);
        event.setValue(value);
        break;
      }

      default:
        super.dispatch(event);
        break;

    }
  }

  async getSelection() {
    return this.selection && this.slice(this.selection.index, this.selection.length) || await this.getArray();
  }

  async getValue(key) {

    switch(key) {

      case "selection":
        return await this.getSelection().length > 0;

      case "empty": {
        const array = await this.getArray();
        return array.length === 0;
      }

    }

  }

  async add(ids) {
    let array = await this.getArray();
    await this.setArray([...array, ...ids]);
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
    await this.setArray(values);
  }

  async slice(index, length) {
    let values = await this.getArray() || [];
    return values.slice(index, index + length);
  }

  async getArray() {

    const event = this.createEvent({
      action: "get",
      type: "array"
    });

    await super.dispatch(event);

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

    await super.dispatch(event);

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
          const attachmentIds = attachments.map(attachment => attachment.id);
          uploader.imageIds = attachmentIds;
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


  getDefault() {
    return [];
  }


  async validate(value) {

    if (!this.getFile(value[0])) {
      await this.fetchIds(value);
    }
    return value;

  }

  async fetchFiles(array) {
    if (!this.hasFiles(array)) {
      await this.fetchIds(array);
    }
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
        container.element.classList.add("loading");

        let array = await this.getArray();
        await this.fetchFiles(array);
        // container.element.classList.toggle("modified", await this.isModified());

        container.element.classList.remove("loading");

        container.children = [
          {
            class: "gallery",
            update: async gallery => {
              gallery.element.classList.toggle("has-image", array.length > 0);
              gallery.element.classList.toggle("empty", array.length === 0);

              this.register(gallery.element);
            },
            children: array.map((id, index) => {
              return {
                class: "frame",
                update: frame => {

                  this.registerCell(frame.element, index);
                  // frame.element.onclick = event => {
                  //   event.preventDefault();
                  //   // if (!this.resource.readonly) {
                  //   //   this.uploader.open(array[0]);
                  //   // }
                  // };
                },
                children: [
                  {
                    // class: "image-container",
                    tag: "figure",
                    update: wrapper => {
                      const file = id && this.getFile(id);
                      if (file) {
                        wrapper.children = [{
                          tag: "img",
                          update: image => {
                            image.element.src = file.src;
                            image.element.width = file.width;
                            image.element.height = file.height;
                          }
                        }];
                        wrapper.element.classList.toggle("type-image", file.type && file.type.startsWith("image") || false);
                      } else {
                        wrapper.children = [];
                      }
                    }
                  }
                ]
              };
            }).concat({
              class: "frame",
              update: frame => {
                this.registerCell(frame.element, array.length);
                frame.element.style.order = "99999";
                frame.element.classList.toggle("hidden", array.length >= this.getMax());
              },
              children: [
                {
                  // class: "image-container",
                  tag: "figure",
                  children: []
                },
                // {
                //   class: "button-container",
                //   child: this.createChild({
                //     type: "button",
                //     title: "Add image",
                //     // dashicon: "plus",
                //     action: "add"
                //   }).build()
                // }
                this.createChild({
                  type: "button",
                  title: "Add image",
                  // dashicon: "plus",
                  action: "add"
                }).build()
              ]
            })
          },
          {
            class: "controls",
            // update: controls => {
            //   controls.element.classList.add("hidden", !this.resource.controls);
            // },
            child: this.resource.controls && this.createChild({
              type: "group",
              children: [
                {
                  type: "button",
                  title: "Add",
                  action: "add"
                },
                {
                  type: "button",
                  title: "Remove",
                  action: "delete",
                  disabled: "!selection",
                  hidden: "empty"
                },
                {
                  type: "button",
                  title: "Change",
                  action: "edit",
                  disabled: "!selection",
                  hidden: "empty"
                }
              ]
            }).build()
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

  registerCell(element, index) {

    this.map.set(element, index);

    // element.classList.remove("selected", this.isSelected(index));
    element.classList.remove("selected");
    element.style.order = index.toString();

    element.ondblclick = event => {
      event.preventDefault();

      console.log("ondblclick", this.selection);

      const request = this.createEvent({
        action: "edit",
        selection: this.selection || {index: this.map.get(element), length: 1}
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



      const index = this.map.get(element);



      if (this.isSelected(index)) {

          console.log("onmousedown isSelected", this.selection);

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

        console.log("onmousedown !Selected", this.selection);

        const mousemove = event => {

          if (this.map.has(event.target)) {
            const index = this.map.get(event.target);
            this.growSelection({index: index, length: 1});
          }
        }

        const mouseup = event => {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);

          console.log(event.target, this.map.get(event.target));

          if (this.map.has(event.target)) {
            this.growSelection({index: this.map.get(event.target), length: 1});
            this.endSelection();
            console.log(this.selection);
          } else {
            this.clearSelection();
          }



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
    // this.ta.style.left = "-100%";

    document.body.appendChild(this.ta);

    const data = await this.slice(this.selection.index, this.selection.length) || [];

    this.ta.value = JSON.stringify(data);
    this.ta.focus({preventScroll: true});
    this.ta.select();

    this.ta.onfocusout = event => {
      this.selection = null;
      this.focusRange = null;
      this.renderSelection();
      document.body.removeChild(this.ta);
      this.container.classList.remove("has-selection");
    }

    this.ta.onpaste = async event => {
      event.preventDefault();
      await this.insert(JSON.parse(event.clipboardData.getData("text")), this.selection.index, this.selection.length);
      this.ta.blur();
      await this.render();
    }

    this.ta.oncut = async event => {
      await this.insert([], this.selection.index, this.selection.length);
      this.ta.blur();
      await this.render();
    }

    this.ta.oninput = async event => {
      switch (event.inputType) {
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
          await this.insert([], this.selection.index, this.selection.length);
          this.ta.blur();
          await this.render();
          break;

        default:
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
    for (let [element, index] of this.map.entries()) {
      if (KarmaFieldsAlpha.Range.includes(index, range)) {
        array.push(element);
      }
    }
    return array;
  }

  getElement(index) {
    for (let [element, value] of this.map.entries()) {
      if (value === index) {
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
    this.map.forEach((index, element) => {
      element.classList.toggle("selected", this.isSelected(index));
    });
    // this.getElement(this.length).classList.toggle("selected", this.isSelected(this.length));
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

    console.log("drag", this.selection);


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
      const order = this.map.get(prevElement) + this.selection.length;
      prevElement.style.order = order.toString();
      this.map.set(prevElement, order);

      this.selection.index--;
      elements.forEach(element => {
        const order = this.map.get(element) - 1;
        element.style.order = order.toString();
        this.map.set(element, order);
      });

      this.offsetLeft = this.element.offsetLeft;
      this.offsetTop = this.element.offsetTop;
      diffX = this.getDiffX();
      diffY = this.getDiffY();

    // } else if (nextElement && KarmaFieldsAlpha.Rect.fromElement(lastElement).offset(diffX, diffY).isAfter(KarmaFieldsAlpha.Rect.fromElement(nextElement))) {
    } else if (nextElement && grabElementNext && KarmaFieldsAlpha.Rect.fromElement(grabElement).offset(diffX, diffY).isAfter(KarmaFieldsAlpha.Rect.fromElement(grabElementNext))) {

      // swap:
      const order = this.map.get(nextElement) - this.selection.length;
      nextElement.style.order = order.toString();
      this.map.set(nextElement, order);

      this.selection.index++;
      elements.forEach(element => {
        const order = this.map.get(element) + 1;
        element.style.order = order.toString();
        this.map.set(element, order);
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

    console.log("dragend", this.selection);

    // console.log(KarmaFieldsAlpha.Rect.fromElement(this.container), KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY));
    // console.log(KarmaFieldsAlpha.Rect.fromElement(this.container).intersects(KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY)));
    // // if (!KarmaFieldsAlpha.Rect.fromElement(this.container).includes(KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY))) {
    //   console.log("outside");
    // }



  }

  async drop() {
    if (this.selection) {
      this.getElements(this.selection).forEach(element => {
        element.classList.remove("drag");
        element.style.transform = "none";
      });

      this.element.classList.remove("grabbing");
      this.container.classList.remove("dragging");

      console.log("drop", this.index, this.selection.index);

      if (this.index !== this.selection.index) {
        const index = this.index;
        const newIndex = this.selection.index;
        const length = this.selection.length;
        this.ta.blur();
        await this.swapRange(index, newIndex, length);
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
