
KarmaFieldsAlpha.fields.table.tableFilters = class extends KarmaFieldsAlpha.fields.form {

  fetchValue(expectedType, key) {
    return KarmaFieldsAlpha.Nav.getParam(key) || "";
  }

  getValue(expectedType, key) {
    console.error("depreacted");
    return KarmaFieldsAlpha.Nav.getParam(key) || "";
  }

  setValue(value, key) {
    if (value) {
      KarmaFieldsAlpha.Nav.setParam(key, value);
    } else  {
      KarmaFieldsAlpha.Nav.removeParam(key);
    }
  }

  removeValue(key) {
    KarmaFieldsAlpha.Nav.removeParam(key);
  }

  isModified() {
    return false;
  };

  submit() {
    KarmaFieldsAlpha.Nav.setParam("page", 1);
    return this.editParam();
  }

  edit() {
    KarmaFieldsAlpha.Nav.setParam("page", 1);

    return this.editParam();
  }

  backup() {
    KarmaFieldsAlpha.Nav.backup();
  }

  // this.filters.getDriver = () => { // for fetching options (dropdown)
  //   return this.resource.driver;
  // }

  write() {
    // noop
  }

}
