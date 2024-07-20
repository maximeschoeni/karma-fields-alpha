
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.form {

  // getDriver() {
  //
  //   return this.resource.driver;
  //
  // }

  // getParams() {
  //
  //   return new KarmaFieldsAlpha.Content({ids: this.resource.id});
  //
  // }
  //
  // submit() {
  //
  //   const task = new KarmaFieldsAlpha.Task.Save();
  //
  //   KarmaFieldsAlpha.Task.add(task);
  //
  //   this.render();
  //
  // }
  //
  // getContent(index, key) {
  //
  //   // if the post status is "auto-draft" -> post is not going to be found when queried by id
  //
  //   if (key === "id" && index === 0) {
  //
  //     const content = new KarmaFieldsAlpha.Content();
  //
  //     content.value = this.resource.id;
  //
  //     return content;
  //
  //   }
  //
  //   return super.getContent(index, key);
  // }


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

  // build() {
  //   return {
  //     class: "post-form",
  //     init: form => {
  //       if (this.resource.style) {
  //         form.element.style = this.resource.style;
  //       }
  //     },
  //     update: form => {
  //
  //       const single = this.createChild({
  //         type: "single",
  //         children: this.resource.children,
  //       }, 0);
  //
  //       form.children = [
  //         single.build(),
  //         {
  //           tag: "input",
  //           init: input => {
  //             input.element.type = "hidden";
  //             input.element.name = "karma-fields-items[]";
  //             if (input.element.form) {
  //               input.element.form.addEventListener("submit", async event => {
  //
  //                 // event.preventDefault();
  //
  //
  //                 const task = new KarmaFieldsAlpha.Task.Save();
  //                 const driver = this.getDriver();
  //
  //                 await task.cleanDriver(driver);
  //
  //                 // KarmaFieldsAlpha.Store.Delta.remove("items");
  //
  //                 // input.element.form.submit();
  //               });
  //             }
  //           },
  //           update: input => {
  //             // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", this.getDriver(), this.getId());
  //             // const delta = KarmaFieldsAlpha.Store.Delta.get("vars");
  //
  //             const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");
  //
  //             if (delta) {
  //               input.element.value = JSON.stringify(delta);
  //             } else {
  //               input.element.value = "";
  //             }
  //           }
  //         }
  //       ];
  //
  //
  //     }
  //
  //   }
  //
  //
  // }

  async clean() {

    const delta = this.getDelta();

    for (let driver in delta) {

      await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);

    }

  }

  *buildHidden() {



    if (this.resource.hiddenfield !== false) {

      yield {
        tag: "input",
        init: input => {
          input.element.type = "hidden";
          input.element.name = "karma-fields-items[]";
          if (input.element.form) {
            input.element.form.addEventListener("submit", async event => {
            });
          }
        },
        update: input => {
          // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");
          
          const delta = this.getDelta();
          if (delta) {
            input.element.value = JSON.stringify(delta);
          } else {
            input.element.value = "";
          }

        }
      };

    }

  }

  build() {
    return {
      class: "post-form",
      children: [
        super.build(),
        ...this.buildHidden()
        // {
        //   tag: "input",
        //   init: input => {
        //     input.element.type = "hidden";
        //     input.element.name = "karma-fields-items[]";
        //     if (input.element.form) {
        //       input.element.form.addEventListener("submit", async event => {
        //         // const task = new KarmaFieldsAlpha.Task.Save();
        //         // const driver = this.getDriver();
        //         // await task.cleanDriver(driver);
        //
        //         // event.preventDefault();
        //         // await this.clean();
        //         //
        //         // // console.log(input.element.form.querySelector("[type=submit]"));
        //         //
        //         // input.element.form.querySelector("[type=submit]").click();
        //
        //       });
        //     }
        //   },
        //   update: input => {
        //     // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");
        //     const delta = this.getDelta();
        //     if (delta) {
        //       input.element.value = JSON.stringify(delta);
        //     } else {
        //       input.element.value = "";
        //     }
        //   }
        // }
      ]
    };


  }

}


// KarmaFieldsAlpha.field.single = class extends KarmaFieldsAlpha.field.group {
//
//   getContent(key) {
//
//
//     return this.parent.getContentAt(0, key);
//
//   }
//
//   setContent(value, key) {
//
//     this.parent.setContentAt(value, 0, key);
//
//   }
//
//
// }
