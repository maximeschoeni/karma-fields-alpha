
KarmaFieldsAlpha.Relations = class {

  static candidates = {};
  static buffer = new KarmaFieldsAlpha.Buffer("gateway");

  static register(driver, promise) {
    if (!this.candidates[driver]) {
      this.candidates[driver] = [];
    }
    this.candidates[driver].push(promise);
  }

  static async request(driver, id, ...path) {

    let value = this.buffer.get(driver, id, ...path);
    // if (value) {
    //   return value; // -> value is an array
    // } else

    if (!value && this.candidates[driver] && this.candidates[driver].length) {
      const promises = this.candidates[driver];
      this.candidates[driver] = [];
      const ids = await Promise.all(promises);
      await this.query(driver, ids);

      return this.buffer.get(driver, id, ...path);
    }

  }


  static async query(driver, joinDriver, ids) {

    // const driver = this.resource.driver;
    // const ids = await this.getQueriedIds();
    const relations = await KarmaFieldsAlpha.Gateway.get("relations/"+joinDriver+"?ids="+ids.join(","));

    for (let relation of relations) {
      const id = relation.id.toString();
      if (id) {
        for (let key in relation) {
          if (key !== "id") {
            // KarmaFieldsAlpha.DeepObject.sanitize(relation[key]); // -> compat

            let values = this.buffer.get(driver, id, key) || [];
            this.buffer.set([...values, relation[key]], driver, id, key);
          }
        }
      }
    }

  }



}
