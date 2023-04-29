
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.container {

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

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  getValue(...path) {

    return KarmaFieldsAlpha.Terminal.getValue(this.resource.driver, this.resource.id, ...path);

	}

	setValue(value, ...path) {


    KarmaFieldsAlpha.Terminal.setValue(value, this.resource.driver, this.resource.id, ...path);



    // this.debounce("saving", async () => {
    //
    //   KarmaFieldsAlpha.History.save();
    //
    // }, 1000);

    // const data = this.getData() || {};
    //
    // if (data.saving) {
    //
    //   clearTimeout(data.saving);
    //
    // }
    //
    // data.saving = setTimeout(() => KarmaFieldsAlpha.History.save(), interval);
    //
    // await data.rendering;
    //
    // data.rendering = this.renderForm();
    //
    // this.setData(data);

    // this.update();

    this.deferSave();
    this.deferRender();

	}

  modified(...path) {

    return KarmaFieldsAlpha.Terminal.modified(this.resource.driver, this.resource.id, ...path);

  }

  getDriver() {

    return this.resource.driver;

  }

  getSelection() {

    return KarmaFieldsAlpha.Selection.get();

  }

  setSelection(value) {

    KarmaFieldsAlpha.Selection.set(value);

    // console.trace();

    // KarmaFieldsAlpha.Utils.debounce("render", () => {
    //
    //
    //   KarmaFieldsAlpha.History.save();
    //
    //   this.renderForm();
    //
    //
    // }, 50);

    // const data = this.getData() || {};
    //
    // if (data.saving) {
    //
    //   clearTimeout(data.saving);
    //
    // }
    //
    // data.saving = setTimeout(() => KarmaFieldsAlpha.History.save(), interval);
    //
    // await data.rendering;
    //
    // data.rendering = this.renderForm();
    //
    // this.setData(data);

    this.deferRender();

  }

  clearSelection() {

    KarmaFieldsAlpha.Selection.clear();

  }

  getData() {

    return KarmaFieldsAlpha.field.getData();

  }

  setData(value) {

    KarmaFieldsAlpha.field.setData(value);

  }

  save() {

    // KarmaFieldsAlpha.History.debounceSave(2000);

  }

  render() {

  }

  deferSave() {

    const data = this.getData() || {};

    if (data.saving) {

      clearTimeout(data.saving);

    }

    data.saving = setTimeout(() => KarmaFieldsAlpha.History.save(), 1000);

    this.setData(data);

  }

  deferRender() {

    const data = this.getData() || {};

    if (data.rendering) {

      clearTimeout(data.rendering);

    }

    data.rendering = setTimeout(async () => {

      await data.renderPromise;
      data.renderPromise = this.renderForm();

      this.setData(data);

    }, 50);

    this.setData(data);

  }

  build() {

    return {
      class: "post-form",
      init: form => {
        const clipboard = KarmaFieldsAlpha.Clipboard.getElement();

        clipboard.onblur = event => {
          this.clearSelection();
          form.render();
        }

        clipboard.onpaste = event => {
          event.preventDefault();
          const string = event.clipboardData.getData("text/plain").normalize();
          clipboard.value = string;
          const selection = this.getSelection();
          this.paste(string, selection);


          form.render();
        }

        clipboard.oncut = event => {
          event.preventDefault();
          event.clipboardData.setData("text/plain", clipboard.value);
          clipboard.value = "";
          const selection = this.getSelection();
          this.paste("", selection);
          form.render();
        }

        clipboard.onkeyup = event => {

          if (event.key === "Delete" || event.key === "Backspace") {

            clipboard.value = "";
            const selection = this.getSelection();
            this.paste("", selection);
            form.render();

          }

        }

        addEventListener("karmaFieldsAlpha-render", () => {
          form.render();
        });


      },
      update: form => {
        this.renderForm = form.render;
      },
      complete: async form => {

        const process = await KarmaFieldsAlpha.Terminal.process();

        if (process) {

          form.render();

        }

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
          },
          update: input => {
            const delta = KarmaFieldsAlpha.Delta.get(this.resource.driver, this.resource.id);
            if (delta) {
              input.element.value = JSON.stringify(delta);
            }
          }
        }
      ]
    }


  }

}
