
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.container {

  getDriver() {

    return this.resource.driver;

  }

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  getContent(key) {

    const driver = this.getDriver();
    const id = this.getId();

    // return KarmaFieldsAlpha.Query.getValue(driver, id, key);

    return new KarmaFieldsAlpha.Content.Value(driver, id, key);

  }

  setContent(content, key) {

    const driver = this.getDriver();
    const id = this.getId();

    // KarmaFieldsAlpha.Store.Delta.set(content.toArray(), driver, id, key);

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
    KarmaFieldsAlpha.Store.Delta.set(content.toArray(), "vars", driver, id, key);

  }

  removeContent(key) {

    const driver = this.getDriver();
    const id = this.getId();

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
    KarmaFieldsAlpha.Store.Delta.set([], "vars", driver, id, key);

  }

  build() {
    return {
      class: "post-form",
      init: form => {
        if (this.resource.style) {
          form.element.style = this.resource.style;
        }
      },
      children: [
        super.build(),
        {
          tag: "input",
          init: input => {
            input.element.type = "hidden";
            input.element.name = "karma-fields-items[]";
            if (input.element.form) {
              input.element.form.addEventListener("submit", async event => {

                event.preventDefault();

                const delta = KarmaFieldsAlpha.Store.Delta.get("vars");

                for (let driver in delta) {

                  await KarmaFieldsAlpha.Database.Vars.set(delta[driver], driver);

                }

                // KarmaFieldsAlpha.Store.Delta.set({}, this.getDriver(), this.getId());
                KarmaFieldsAlpha.Store.Delta.set({});
                KarmaFieldsAlpha.Store.Layer.removeSelection();

                input.element.form.submit();
              });
            }
          },
          update: input => {
            // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", this.getDriver(), this.getId());
            const delta = KarmaFieldsAlpha.Store.Delta.get("vars");
            if (delta) {
              input.element.value = JSON.stringify(delta);
            }
          }
        }
      ]
    }


  }

}
