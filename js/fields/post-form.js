
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.grid {

  // getDriver() {
  //
  //   return this.resource.driver;
  //
  // }

  getParams() {

    return new KarmaFieldsAlpha.Content({ids: this.resource.id});

  }
  //
  // getId() {
  //
  //   return this.resource.id;
  //
  // }
  //
  // getIndex() {
  //
  //   return this.resource.index;
  //
  // }

  // getContent(key) {
  //
  //   const driver = this.getDriver();
  //   const id = this.getId();
  //
  //   // return KarmaFieldsAlpha.Query.getValue(driver, id, key);
  //
  //   return new KarmaFieldsAlpha.Content.Value(driver, id, key);
  //
  // }
  //
  // setContent(content, key) {
  //
  //   const driver = this.getDriver();
  //   const id = this.getId();
  //
  //   // KarmaFieldsAlpha.Store.Delta.set(content.toArray(), driver, id, key);
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //   KarmaFieldsAlpha.Store.Delta.set(content.toArray(), "vars", driver, id, key);
  //
  // }
  //
  // removeContent(key) {
  //
  //   const driver = this.getDriver();
  //   const id = this.getId();
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //   KarmaFieldsAlpha.Store.Delta.set([], "vars", driver, id, key);
  //
  // }

  build() {
    return {
      class: "post-form",
      init: form => {
        if (this.resource.style) {
          form.element.style = this.resource.style;
        }
      },
      update: form => {

        const single = this.createChild({
          type: "single",
          children: this.resource.children,
        }, 0);

        form.children = [
          single.build(),
          {
            tag: "input",
            init: input => {
              input.element.type = "hidden";
              input.element.name = "karma-fields-items[]";
              if (input.element.form) {
                input.element.form.addEventListener("submit", async event => {

                  // event.preventDefault();


                  const task = new KarmaFieldsAlpha.Task.Save();
                  const driver = this.getDriver();

                  await task.cleanDriver(driver);

                  // KarmaFieldsAlpha.Store.Delta.remove("items");

                  // input.element.form.submit();
                });
              }
            },
            update: input => {
              // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", this.getDriver(), this.getId());
              // const delta = KarmaFieldsAlpha.Store.Delta.get("vars");

              const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

              if (delta) {
                input.element.value = JSON.stringify(delta);
              } else {
                input.element.value = "";
              }
            }
          }
        ];


      }
      // children: [
      //   super.build(),
      //   {
      //     tag: "input",
      //     init: input => {
      //       input.element.type = "hidden";
      //       input.element.name = "karma-fields-items[]";
      //       if (input.element.form) {
      //         input.element.form.addEventListener("submit", async event => {
      //
      //           event.preventDefault();
      //
      //           // const delta = KarmaFieldsAlpha.Store.Delta.get("vars");
      //           //
      //           // for (let driver in delta) {
      //           //
      //           //   await KarmaFieldsAlpha.Database.Vars.set(delta[driver], driver);
      //           //
      //           // }
      //           //
      //           // // KarmaFieldsAlpha.Store.Delta.set({}, this.getDriver(), this.getId());
      //           // KarmaFieldsAlpha.Store.Delta.set({});
      //           // KarmaFieldsAlpha.Store.Layer.removeSelection();
      //
      //           const task = new KarmaFieldsAlpha.Task.Save();
      //
      //           await task.update();
      //
      //           input.element.form.submit();
      //         });
      //       }
      //     },
      //     update: input => {
      //       // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", this.getDriver(), this.getId());
      //       // const delta = KarmaFieldsAlpha.Store.Delta.get("vars");
      //
      //       const task = new KarmaFieldsAlpha.Task.Save();
      //       const delta = task.getDelta();
      //
      //       if (delta) {
      //         input.element.value = JSON.stringify(delta);
      //       }
      //     }
      //   }
      // ]
    }


  }

}


KarmaFieldsAlpha.field.single = class extends KarmaFieldsAlpha.field.group {

  getContent(key) {


    return this.parent.getContent(this.id, key);

  }

  setContent(value, key) {

    this.parent.setContent(value, this.id, key);

  }
}
