
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.container {

  // constructor(resource) {
  //   console.log(resource);
  //   super(resource);
  // }


  // static row = class extends KarmaFieldsAlpha.field.container {

  //   getValue(key) {

  //     return this.parent.getValue(this.resource.id, key);

  //   }

  //   setValue(value, key) {

  //     this.parent.setValue(value, this.resource.id, key);

  //   }

  //   modified(...path) {

  //     return this.parent.modified(this.resource.id, ...path);

  //   }

  //   getIndex() {

  //     return this.resource.index;

  //   }

  //   getId() {

  //     return this.resource.id;

  //   }

  // }

  getDriver() {

    return this.resource.driver;

  }

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  // -> same as grid !
  getValue(...path) {

    // console.log(this.resource.driver, this.resource.id, ...path);

    const driver = this.getDriver();
    const id = this.getId();
    
    return KarmaFieldsAlpha.Store.get("delta", driver, id, ...path) || KarmaFieldsAlpha.Query.getValue(driver, id, ...path);

    // return KarmaFieldsAlpha.Query.getValue(this.resource.driver, this.resource.id, ...path);

	}

  // -> same as grid !
	setValue(value, ...path) {


    // KarmaFieldsAlpha.Query.setValue(value, this.resource.driver, this.resource.id, ...path);

    value = KarmaFieldsAlpha.Type.toArray(value);

    const driver = this.getDriver();
    const id = this.getId();

    KarmaFieldsAlpha.Store.setValue(value, driver, id, ...path);

    this.render();

		// let currentValue = this.getValue(...path);
    //
		// if (!KarmaFieldsAlpha.DeepObject.equal(value, currentValue)) {
    //
    //   KarmaFieldsAlpha.History.backup(value, currentValue, "delta", this.resource.driver, this.resource.id, ...path);
    //
    //   KarmaFieldsAlpha.Store.set(value, "delta", this.resource.driver, this.resource.id, ...path);
    //
    //   this.save();
    //
    //   this.render();
    //
		// }


	}

  // -> same as grid
  modified(...path) {

    // return KarmaFieldsAlpha.Terminal.modified(this.resource.driver, this.resource.id, ...path);

    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id, ...path), this.resource.driver, this.resource.id, ...path);

  }

  getDriver() {

    return this.resource.driver;

  }

  // getSelection() {
  //
  //   return KarmaFieldsAlpha.Store.get("selection", this.resource.index);
  //
  //   // return KarmaFieldsAlpha.Selection.get(this.resource.index);
  //
  // }
  //
  // setSelection(value) {
  //
  //   // KarmaFieldsAlpha.Selection.set(value, this.resource.index);
  //
  //   // this.render();
  //
  //   const currentSelection = KarmaFieldsAlpha.Store.get("selection");
  //   const newSelection = {[this.resource.index]: value};
  //
  //   Object.freeze(newSelection);
  //
  //   KarmaFieldsAlpha.History.backup(newSelection, currentSelection || null, "selection");
  //
  //   KarmaFieldsAlpha.Store.set(newSelection, "selection");
  //
  // }
  //
  // // clearSelection() {
  // //
  // //   KarmaFieldsAlpha.Selection.clear();
  // //
  // // }
  //
  // getData() {
  //
  //   if (!KarmaFieldsAlpha.field.data) {
  //
  //     KarmaFieldsAlpha.field.data = {};
  //
  //   }
  //
  //   if (!KarmaFieldsAlpha.field.data[this.resource.index]) {
  //
  //     KarmaFieldsAlpha.field.data[this.resource.index] = {};
  //
  //   }
  //
  //   return KarmaFieldsAlpha.field.data[this.resource.index];
  //
  //   // return KarmaFieldsAlpha.field.getData();
  //
  // }
  //
  // setData(value) {
  //
  //   // KarmaFieldsAlpha.field.setData(value);
  //
  // }
  //
  // save() {
  //
  //   KarmaFieldsAlpha.History.saveFlag = true;
  //
  // }
  //
  // submit() {
  //
  //   KarmaFieldsAlpha.Query.send();
  //
  //   this.render();
  //
  // }
  //
  //
  // async render() {
  //
  //   await this.renderPromise;
  //
  //   if (this.onRender) {
  //
  //     this.renderPromise = this.onRender();
  //
  //   }
  //
  //   return this.renderPromise;
  // }

  // multiple() {
  //
  //   return false;
  //
  // }


  // mousedown() {
  //
  //   this.setSelection(null);
  //
  // }

  // request(...path) {
  //
  //   console.error("Ungranted request", ...path);
  //
  // }

  // deferSave() {
  //
  //   const data = this.getData();
  //
  //   if (data.saving) {
  //
  //     clearTimeout(data.saving);
  //
  //   }
  //
  //   data.saving = setTimeout(() => KarmaFieldsAlpha.History.save(), 1000);
  //
  //   // this.setData(data);
  //
  // }

  // deferRender() {
  //
  //   const data = this.getData() || {};
  //
  //   if (data.rendering) {
  //
  //     clearTimeout(data.rendering);
  //
  //   }
  //
  //   data.rendering = setTimeout(async () => {
  //
  //     await data.renderPromise;
  //     data.renderPromise = this.renderForm();
  //
  //     this.setData(data);
  //
  //   }, 50);
  //
  //   this.setData(data);
  //
  // }

  build() {

    return {
      class: "post-form",
      init: form => {

        if (this.resource.style) {
          form.element.style = this.resource.style;
        }
        // const clipboard = KarmaFieldsAlpha.Clipboard.getElement();
        //
        // clipboard.onblur = event => {
        //   // this.clearSelection();
        //   // form.render();
        //   console.log("clipboard blur");
        //
        //   this.setSelection(null);
        // }
        //
        // clipboard.onpaste = event => {
        //   event.preventDefault();
        //   const string = event.clipboardData.getData("text/plain").normalize();
        //   clipboard.value = string;
        //   const selection = this.getSelection();
        //   this.paste(string, selection);
        //
        //
        //   form.render();
        // }
        //
        // clipboard.oncut = event => {
        //   event.preventDefault();
        //   event.clipboardData.setData("text/plain", clipboard.value);
        //   clipboard.value = "";
        //   const selection = this.getSelection();
        //   this.paste("", selection);
        //   form.render();
        // }
        //
        // clipboard.onkeyup = event => {
        //
        //   if (event.key === "Delete" || event.key === "Backspace") {
        //
        //     clipboard.value = "";
        //     const selection = this.getSelection();
        //     this.paste("", selection);
        //     form.render();
        //
        //   }
        //
        // }

        // window.onmousedown = event => {
        //
        //   this.setSelection(null);
        //
        // }

        // addEventListener("karmaFieldsAlpha-render", () => {
        //   // form.render();
        //   this.render();
        // });


        // -> problem if multiple...
        // window.addEventListener("popstate", async event => {
        //   KarmaFieldsAlpha.History.update();
        //   this.render();
        // });

        // window.addEventListener("mousedown", event => {
        //   const selection = this.getSelection();
        //   if (selection) {
        //     this.setSelection();
        //     this.render();
        //   }
        // });


      },
      update: form => {
        // this.render = form.render;

        // this.renderForm = form.render;

        // this.render = () => {
        //   this.getData().onrender = true;
        // };

        // console.log("render");

      },
      complete: async form => {

        // const process = await KarmaFieldsAlpha.Terminal.process();
        //
        // if (process) { //  || renderFlag
        //
        //   form.render();
        //
        // } else {
        //
        //   this.render = () => {
        //
        //     this.render = () => {};
        //     form.render();
        //
        //   };
        //
        // }

        // const task = KarmaFieldsAlpha.Query.tasks.shift();
        //
        //
        // if (task) {
        //
        //   await KarmaFieldsAlpha.Query.run(task);
        //
        //   await form.render();
        //
        // } else {
        //
        //   if (KarmaFieldsAlpha.History.saveFlag) {
        //
        //     KarmaFieldsAlpha.History.saveFlag = false;
        //     KarmaFieldsAlpha.History.save();
        //
        //   }
        //
        //   // this.rendering = false;
        //   this.onRender = form.render;
        //
        // }



      },
      children: [
        // this.createChild({
        //   ...this.resource.row,
        //   data: this.getData(),
        //   selection: this.getSelection(),
        //   type: "row"
        // }).build(),
        super.build(),
        {
          tag: "input",
          init: input => {
            input.element.type = "hidden";
            input.element.name = "karma-fields-items[]";
            if (input.element.form) {
              input.element.form.addEventListener("submit", event => {
                KarmaFieldsAlpha.Store.remove("delta");
                KarmaFieldsAlpha.Store.remove("selection");
              });
            }
          },
          update: input => {
            const delta = KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id);
            if (delta) {
              input.element.value = JSON.stringify(delta);
            }
          }
        }
      ]
    }


  }

}
