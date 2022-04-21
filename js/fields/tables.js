
KarmaFieldsAlpha.fields.tables = class extends KarmaFieldsAlpha.fields.field {


  constructor(...args) {
    super(...args);

    KarmaFieldsAlpha.tables = this; // -> debug

    KarmaFieldsAlpha.Nav.onpopstate = () => {
      this.render(true);
    }

  }

  // getTable() {
  //   let key = this.getParam("karma");
  //
  //   const resource = this.resource.children && this.resource.children.find(resource => key === (resource.id || resource.driver || resource.key));
  //
  //   return resource && this.createChild(resource);
  // }

  async dispatch(event) {

    switch (event.action) {

      case "close":
        KarmaFieldsAlpha.Nav.empty();
        this.render();
        break;

      // case "nav":
      //   this.render(true);
      //   break;

    }

    return event;
  }


  build() {
    return {
      class: "karma-fields-navigation",
      init: container => {
        this.render = container.render;
      },
      children: this.resource.children.map((resource, index) => {
        return this.createChild({
          id: resource.id || resource.key || resource.driver, // -> compat (id should be set)
          ...resource
        }).build();
      })
    };
  }


  // build() {
  //   return {
  //     class: "karma-fields-navigation",
  //     init: container => {
  //       console.log("init tables");
  //       KarmaFieldsAlpha.Nav.onpopstate = () => {
  //         container.render(true);
  //       }
  //     },
  //     child: {
  //       class: "karma-fields-content",
  //       init: container => {
  //         this.render = container.render;
  //       },
  //       // update: container => {
  //       //   container.children = this.resource.children.map((resource, index) => {
  //       //     const table = this.createChild({
  //       //       id: resource.id || resource.key || resource.driver, // -> compat (id should be set)
  //       //       ...resource
  //       //     });
  //       //     table.clearQuery();
  //       //     table.clearCount();
  //       //     return table.build();
  //       //   });
  //       // }
  //       children: this.resource.children.map((resource, index) => {
  //         return this.createChild({
  //           id: resource.id || resource.key || resource.driver, // -> compat (id should be set)
  //           ...resource
  //         }).build();
  //       })
  //     }
  //   };
  // }



}