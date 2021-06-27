
KarmaFieldsAlpha.core.queryField = class extends KarmaFieldsAlpha.core.coreField {

  // query API
  queryOptions(driver, params) {
    return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", params);
  }

  queryKey(driver, path) {
    return KarmaFieldsAlpha.Form.get(field.resource.driver, path);
  }

};
