KarmaFieldsAlpha.fields.tableControls =  {}

KarmaFieldsAlpha.fields.tableControls.button = class {

  constructor(resource) {
    this.resource = resource;
  }

  init() {}
  update() {}
  onLoad() {}

  async load(promise) {
    this.onLoad(true);
    const results = await promise;
    this.onLoad(false);
    return results;
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
            content.element.innerHTML = this.resource.name || this.resource.type || "";
          }
        },
        {
          class: "karma-field-spinner"
        }
      ],
      update: button => {
        // this.onLoad = loading => button.element.classList.toggle("loading", loading);
        this.update(button.element, ...args);
      }
    }
  }
}

KarmaFieldsAlpha.fields.tableControls.optionsButton = class {

  buildMain(element, field) {
  }

  buildOption(element, item, field) {
  }

  build(...field) {
    return {
      class: "ppp-selector footer-item",
      init: item => {
        item.element.tabIndex = "-1"; // for safari
      },
      children: [
        {
          tag: "button",
          class: "karma-button current-page footer-item",
          update: item => {
            this.buildMain(item.element, ...field);
          }
        },
        {
          class: "ppp-selector-options",
          child: {
            tag: "ul",
            children: this.options.map(item => {
              return {
                tag: "li",
                update: li => {
                  const button = new KarmaFieldsAlpha.fields.tableControls.button({
                    name: item.value
                  });
                  button.update = element => {
                    this.buildOption(element, item, ...field);
                  }
                  li.child = button.build();
                }
              };
            })
          }
        }
      ]
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
    element.onclick = async (event) => {
      if (field.content.hasModifiedValue()) {
        element.classList.add("loading");
        await field.sync();
        await field.render();
        element.blur();
        element.classList.remove("loading");
      }
    }
    element.disabled = !field.content.hasModifiedValue();
  }

}

KarmaFieldsAlpha.fields.tableControls.undo = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Undo";
  // }

  update(element, field) {
    element.onclick = async (event) => {
      //await this.load(field.content.undo());

      field.content.undo();
      field.setHistoryIndex(field.content.historyIndex);

      element.classList.add("loading");
      // await field.update();
      await field.render();
      element.classList.remove("loading");




      // await field.try("onSetHeader");
      // await this.load(field.try("onSetBody"));
      // await field.try("onSetFooter");

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
    element.disabled = !field.content.hasUndo();
    element.title = field.content.countUndo();
  }

}

KarmaFieldsAlpha.fields.tableControls.redo = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Redo";
  // }

  update(element, field) {
    element.onclick = async (event) => {
      // field.content.redo();
      field.content.redo()

      // await this.load(field.content.update());




      field.setHistoryIndex(field.content.historyIndex-0);

      element.classList.add("loading");
      // await field.update();
      await field.render();
      element.classList.remove("loading");

      // field.try("onSetHeader");
      // field.try("onSetBody");
      // field.try("onSetFooter");

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

    element.disabled = !field.content.hasRedo(); //field.domain.index >= field.domain.max;
    element.title = field.content.countRedo();
  }

}

KarmaFieldsAlpha.fields.tableControls.add = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Add";
  // }

  update(element, field) {
    element.onclick = async (event) => {

      element.classList.add("loading");
      await field.add();
      await field.render();
      element.classList.remove("loading");

      // this.load(field.add()).then(() => {
      //   // field.render();
      //
      //   field.try("onSetBody");
      //   field.try("onSetFooter");
      // });
    }
  }

}

KarmaFieldsAlpha.fields.tableControls.delete = class extends KarmaFieldsAlpha.fields.tableControls.button {

  // constructor() {
  //   super();
  //   this.name = "Delete";
  // }

  update(element, field) {
    element.onmousedown = async (event) => {
      event.preventDefault(); // prevent current table cell losing focus
      // await this.load(this.load(field.remove()));
      // await this.load(field.update());

      element.classList.add("loading");
      await field.remove();
      await field.render();
      element.classList.remove("loading");

      // this.load(field.remove()).then(() => {
      //
      //   field.select.removeFocus();
      //   // field.render();
      //
      //   field.try("onSetBody");
      //   field.try("onSetFooter");
      // });
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
    element.onclick = async (event) => {
      KarmaFieldsAlpha.Form.cache = {}; // deprecated
      KarmaFieldsAlpha.cache = {};
  		field.content.original = {};
      field.paramString = undefined;

      // debugger;

      element.classList.add("loading");
      // await field.update();
      await field.render();
      element.classList.remove("loading");

      // this.load(field.query().then(() => {
      //   // field.render();
      //
      //   field.try("onSetHeader");
      //   field.try("onSetBody");
      //   field.try("onSetFooter");
      // }));
    }
  }

}


KarmaFieldsAlpha.fields.tableControls.firstPage = class extends KarmaFieldsAlpha.fields.tableControls.button {
  update(element, field) {
    const count = field.count.getValue();
    const page = field.page.getValue();
    const ppp = field.ppp.getValue();

    element.style.display = ppp > 0 && count > ppp ? "block" : "none";
    element.disabled = (page == 1);
    element.onclick = async (event) => {
      const page = field.page.getValue();
      if (page > 0) {
        element.classList.add("loading");
        field.page.setValue(1);
        // await field.update();
        await field.render();
        element.classList.remove("loading");
      }
    }
  }
}
KarmaFieldsAlpha.fields.tableControls.prevPage = class extends KarmaFieldsAlpha.fields.tableControls.button {
  update(element, field) {
    const count = field.count.getValue();
    const page = field.page.getValue();
    const ppp = field.ppp.getValue();

    element.style.display = ppp > 0 && count > ppp ? "block" : "none";
    element.disabled = (page === 1);

    element.onclick = async (event) => {
      const page = field.page.getValue();
      if (page > 0) {
        element.classList.add("loading");
        field.page.setValue(page-1);
        // await field.update();

        // requestIdleCallback( async () => {
        //   await field.render();
        //   element.classList.remove("loading");
        // });

        await field.render();
        element.classList.remove("loading");




      }
    }
  }
}
KarmaFieldsAlpha.fields.tableControls.nextPage = class extends KarmaFieldsAlpha.fields.tableControls.button {
  update(element, field) {
    const count = field.count.getValue();
    const page = field.page.getValue();
    const ppp = field.ppp.getValue();
    const numPage = Math.ceil(count/ppp);

    element.style.display = ppp > 0 && count > ppp ? "block" : "none";
    element.disabled = page >= numPage;

    element.onclick = async (event) => {
      if (page < numPage) {
        element.classList.add("loading");
        field.page.setValue(page+1);
        // await field.update();
        await field.render();
        element.classList.remove("loading");
      }
    }
  }
}
KarmaFieldsAlpha.fields.tableControls.lastPage = class extends KarmaFieldsAlpha.fields.tableControls.button {
  update(element, field) {
    const count = field.count.getValue();
    const page = field.page.getValue();
    const ppp = field.ppp.getValue();
    const numPage = Math.ceil(count/ppp);

    element.style.display = ppp > 0 && count > ppp ? "block" : "none";
    element.disabled = page >= numPage;

    element.onclick = async (event) => {
      if (page < numPage) {
        element.classList.add("loading");
        field.page.setValue(numPage);
        // await field.update();
        await field.render();
        element.classList.remove("loading");
      }
    }
  }
}

KarmaFieldsAlpha.fields.tableControls.currentPage = class {
  build(field) {
    return {
      class: "current-page footer-item",
      update: item => {
        const count = field.count.getValue();
        const page = field.page.getValue();
        const ppp = field.ppp.getValue();

        item.element.style.display = ppp > 0 && count > ppp ? "block" : "none";
        item.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
      }
    }
  }
}


KarmaFieldsAlpha.fields.tableControls.ppp = class extends KarmaFieldsAlpha.fields.tableControls.optionsButton {

  constructor(resource) {
    super();
    this.options = resource.options || [
      {key: 100, value: "100&nbsp;items/page"},
      {key: 200, value: "200&nbsp;items/page"},
      {key: 500, value: "500&nbsp;items/page"},
      {key: 0, value: "all"}
    ];
  }

  buildMain(element, field) {
    let num = field.count.getValue();
    element.textContent = num ? num + " items" : "";
  }

  buildOption(element, item, field) {
    const ppp = field.ppp.getValue();
    element.classList.toggle("active", ppp == item.key);

    element.onclick = async (event) => {

      field.ppp.setValue(item.key);
      field.page.setValue(1);
      element.classList.add("loading");
      // await field.update();
      await field.render();
      element.classList.remove("loading");

      // element.blur();
      document.activeElement.blur(); // for safari
    }
  }

}


KarmaFieldsAlpha.fields.tableControls.order = class {

  reorder(column, field) {
    const orderby = field.orderby.getValue();
    const order = field.order.getValue();
    if (orderby === column.field.key) {
      field.order.setValue(order === "asc" ? "desc" : "asc");
    } else {
      field.order.setValue(column.order || "asc");
      field.orderby.setValue(column.field.key);
    }
  }

  build(column, field) {
    return {
      tag: "a",
      class: "header-cell-order",
      child: {
        class: "karma-field-spinner"
      },
      update: a => {
        const orderby = field.orderby.getValue();
        const order = field.order.getValue();
        a.element.onclick = async event => {
          event.preventDefault();
          a.element.classList.add("loading");
          this.reorder(column, field);
          // await field.update();
          await field.render();
          a.element.classList.remove("loading");
        };
        a.element.classList.toggle("asc", orderby === column.field.key && order === "asc");
        a.element.classList.toggle("desc", orderby === column.field.key && order === "desc");
      }
    };
  }
}
