
KarmaFieldsAlpha.fields.tables = class extends KarmaFieldsAlpha.fields.field {


  constructor(...args) {
    super(...args);

    KarmaFieldsAlpha.tables = this; // -> debug

  }

  getTable() {
    let key = this.getParam("karma");

    const resource = this.resource.children && this.resource.children.find(resource => key === (resource.id || resource.driver || resource.key));

    return resource && this.createChild(resource);
  }


  // async edit(value) {
  //
  //   switch (value) {
  //
  //     case "close":
  //       KarmaFieldsAlpha.Nav.empty();
  //       this.render();
  //       break;
  //
  //     case "nav":
  //       this.render(true);
  //       break;
  //
  //     case "start-selection":
  //     case "end-selection":
  //     case "grow-selection":
  //       this.updateTA();
  //       break;
  //
  //   }
  //
  //
  // };

  async set(value, ...path) {

    const context = path.pop();

    switch (value) {

      case "close":
        KarmaFieldsAlpha.Nav.empty();
        this.render();
        break;

      case "nav":
        this.render(true);
        break;

      case "start-selection":
      case "end-selection":
      case "grow-selection":
        this.updateTA();
        break;

    }


  };

  // fetchValue(expectedType, key) {
  //   return [this.getParam(key) || ""];
  // }
  //
  // // getValue(key) {
  // //   if (KarmaFieldsAlpha.Nav.hasParam(key)) {
  // //     return [KarmaFieldsAlpha.Nav.getParam(key) || ""];
  // //   }
  // // }
  //
  // setValue(deprec, value, key) {
  //   value = value.toString();
  //   if (value) {
  //     this.setParam(key, value);
  //   } else {
  //     this.removeParam(key);
  //   }
  // }
  //
  // removeValue(key) {
  //   this.removeParam(key);
  // }


  createTA() {


    this.ta = document.createElement("textarea");
    this.ta.className = "karma-grid-ta";
    document.body.appendChild(this.ta);


    this.ta.onfocusout = event => {
      const table = this.getTable();
      table.grid.endSelection();
    }

    this.ta.oninput = async event => {

      let data = this.ta.value.split(/[\r\n]/).map(row => row.split("\t"));

      const table = this.getTable();

      if (table) {

        await table.importSelection(data, this.grid.selection || {});

        switch (event.inputType) {

          case "insertFromPaste":
          case "deleteByCut":

          case "deleteContentBackward":
          case "deleteContentForward":
          case "deleteContent":
            this.ta.blur();

        }

      }

      this.edit("grid");
    }

  }


  async updateTA() {

    const table = this.getTable();
    const data = [];

    if (table) {

      const ids = await table.getIds();

      if (table.grid.selection) {

        for (let j = 0; j < table.grid.selection.height; j++) {

          const dataRow = [];
          const id = ids[table.grid.selection.y+j];
          const row = table.grid.getChild(id);

          for (let i = 0; i < table.grid.selection.width; i++) {

            const field = row.children.find(child => child.resource.index === table.grid.selection.x+i);
            const value = await field.exportValue();

            dataRow.push(value);

          }

          data.push(dataRow);

        }

      }

    }

    this.ta.focus();
    this.ta.value = data.map(row => row.join("\t")).join("\n");
    this.ta.select();

  }


  build() {
    return {
      class: "karma-fields-navigation",
      init: container => {
        KarmaFieldsAlpha.Nav.onpopstate = () => {
          container.render(true);
        }

      },
      child: {
        class: "karma-fields-content",
        init: container => {
          this.render = container.render;
        },
        update: container => {
          const currentTable = this.getTable();
          if (currentTable) {
            if (!this.ta) {
              this.createTA();
            }
            container.children = [
              currentTable.build()
            ];
            document.body.style.overflow = "hidden";
            container.element.classList.toggle("single-open", KarmaFieldsAlpha.Nav.hasParam("id"));
          } else {
            container.children = [];
            document.body.style.overflow = "visible";
          }
        }
      }
    };
  }

}
