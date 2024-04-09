

KarmaFieldsAlpha.field.popup = class extends KarmaFieldsAlpha.field {


  build() {

    return {
      class: "popup",
      update: popup => {

        let currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();

        document.body.classList.toggle("karma-table-open", Boolean(currentTableId));
        popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);

        if (currentTableId || this.resource.navigation) {
          popup.children = [
            {
              class: "popup-content",
              children: [
                {
                  class: "navigation karma-field-frame",
                  update: navigation => {
                    navigation.element.classList.toggle("hidden", !this.resource.navigation);
                    if (this.resource.navigation) {
                      navigation.child = this.getChild("menu").build();
                    }
                  }
                },

                {
                  class: "tables",
                  update: container => {

                    currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();

                    container.children = Object.keys(this.resource.tables).map((tableId, index) => {
                      return {
                        class: "table-container",
                        update: container => {

                          container.element.classList.toggle("hidden", tableId !== currentTableId);

                          if (tableId === currentTableId) {

                            container.children = [this.getChild(tableId).build()];

                          } else {

                            container.children = [];

                          }
                        }
                      };
                    });
                  }
                }
              ]
            }
          ]
        }
      }
    };

  }

}
