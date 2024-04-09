
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.grid {

  // getParams() {
  //
  //   return new KarmaFieldsAlpha.Content({ids: this.resource.id});
  //
  // }

  build() {
    // return this.createChild({
    //   type: "single",
    //   children: this.resource.children
    // }, 0).build();

    return this.getChild(0).build();
  }

  getChild(index) {

    return this.createChild({
      type: "single",
      children: this.resource.children
    }, index);

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
