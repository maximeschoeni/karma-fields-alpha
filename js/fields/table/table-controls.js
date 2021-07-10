KarmaFieldsAlpha.fields.tableControls =  {}

KarmaFieldsAlpha.fields.tableControls.button = class {

  constructor(resource) {
    this.resource = resource;
  }

  init() {}
  update() {}
  onLoad() {}

  async load(promise) {
    await Promise.resolve(this.loadingPromise);
    this.onLoad(true);
    this.loadingPromise = promise;
    await this.loadingPromise;
    this.onLoad(false);
  }

  build(...args) {
    return {
      tag: "button",
      class: "karma-button footer-item",
      init: (button) => {
        if (this.resource.primary) {
          button.element.classList.add("primary");
        }
        button.element.title = this.resource.name || this.resource.type || "";
        this.init(button.element, ...args);
      },
      children: [
        {
          tag: "span",
          class: "button-content",
          init: content => {
            content.element.textContent = this.resource.name || this.resource.type || "";
          }
        },
        {
          class: "karma-field-spinner"
        }
      ],
      update: button => {
        this.onLoad = loading => button.element.classList.toggle("loading", loading);
        this.update(button.element, ...args);
      }
    }
  }
}

KarmaFieldsAlpha.fields.tableControls.save = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.class = "primary";
  //   this.resource.name = "Save";
  // }

  update(element, field) {
    element.onclick = (event) => {
      this.load(field.sync()).then(() => {
        element.blur();
        // field.render();
        field.try("onSetHeader");
        field.try("onSetFooter");
      });
    }
    element.disabled = !field.content.getModifiedValue();
  }

}

KarmaFieldsAlpha.fields.tableControls.undo = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Undo";
  // }

  update(element, field) {
    element.onclick = (event) => {
      field.content.domain.undo();
      field.domain.setIndex(field.content.domain.index);


      field.try("onSetHeader");
      field.try("onSetBody");
      field.try("onSetFooter");

      // this.load(new Promise(resolve => {
      //
      //
      //   requestIdleCallback(() => {
      //
      //     resolve();
      //   });
      //   // setTimeout(() => {
      //   //   field.try("onSetBody");
      //   //   field.try("onSetFooter");
      //   //   resolve();
      //   // }, 100);
      // }));





    }
    element.disabled = !field.content.domain.hasUndo();
    element.title = field.content.domain.countUndo();
  }

}

KarmaFieldsAlpha.fields.tableControls.redo = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Redo";
  // }

  update(element, field) {
    element.onclick = (event) => {
      field.content.domain.redo();
      field.domain.setIndex(field.content.domain.index-1);

      field.try("onSetHeader");
      field.try("onSetBody");
      field.try("onSetFooter");

      // this.load(new Promise(resolve => {
      //
      //
      //   requestIdleCallback(() => {
      //     field.try("onSetHeader");
      //     field.try("onSetBody");
      //     field.try("onSetFooter");
      //     resolve();
      //   });
      //   // setTimeout(() => {
      //   //   field.try("onSetBody");
      //   //   field.try("onSetFooter");
      //   //   resolve();
      //   // }, 100);
      // }));

      // field.try("onSetBody");
      // field.try("onSetFooter");


    }

    element.disabled = !field.content.domain.hasRedo(); //field.domain.index >= field.domain.max;
    element.title = field.content.domain.countRedo();
  }

}

KarmaFieldsAlpha.fields.tableControls.add = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Add";
  // }

  update(element, field) {
    element.onclick = (event) => {
      this.load(field.add()).then(() => {
        // field.render();

        field.try("onSetBody");
        field.try("onSetFooter");
      });
    }
  }

}

KarmaFieldsAlpha.fields.tableControls.delete = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Delete";
  // }

  update(element, field) {
    element.onmousedown = (event) => {
      event.preventDefault(); // prevent current table cell losing focus
      this.load(field.remove()).then(() => {

        field.select.removeFocus();
        // field.render();

        field.try("onSetBody");
        field.try("onSetFooter");
      });
    }
    element.disabled = !(field.select.selection && field.select.selection.width === field.select.grid.width);
  }

}

KarmaFieldsAlpha.fields.tableControls.reload = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Reload";
  // }

  update(element, field) {
    element.onclick = (event) => {
      KarmaFieldsAlpha.Form.cache = {};
      this.load(field.query().then(() => {
        // field.render();

        field.try("onSetHeader");
        field.try("onSetBody");
        field.try("onSetFooter");
      }));
    }
  }

}
