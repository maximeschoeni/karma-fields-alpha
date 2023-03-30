
KarmaFieldsAlpha.sbuffer = {};

KarmaFieldsAlpha.SmartBuffer = class {

  constructor(...path) {
    this.path = path;
  }

  static createRow(driver, id, data, query) {

    this.data[driver] ||= {}; 
    this.data[driver][id] = {
      query: query,
      data: data
    };

  }

  static add(driver, id, key, value, query) {

    this.data[driver] ||= {}; 
    this.data[driver][id] = {
      query: query,
      data: data
    };

  }




  getObject() {
    // return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.buffer, ...this.path) || {};
    return KarmaFieldsAlpha.buffer || {};
  }

  setObject(object) {
    // return KarmaFieldsAlpha.DeepObject.assign(KarmaFieldsAlpha.buffer, object, ...this.path);
    KarmaFieldsAlpha.buffer = object;
  }

  empty() {

    // this.setObject({});
    this.remove();
    // KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.buffer, ...this.path);
  }

  get(...path) {
    let object = this.getObject();
    if (this.path.length || path.length) {
      return KarmaFieldsAlpha.DeepObject.get(object, ...this.path, ...path);
    } else {
      return object;
    }

    // return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);
  }

  set(value, ...path) {
    let object = this.getObject();
    if (this.path.length || path.length) {
      KarmaFieldsAlpha.DeepObject.assign(object, value, ...this.path, ...path);
    } else {
      object = value;
    }
    this.setObject(object);
  }

  remove(...path) {
    // let object = this.getObject();
    // KarmaFieldsAlpha.DeepObject.remove(object, ...path);
    // this.setObject(object);

    let object;
    if (this.path.length || path.length) {
      object = this.getObject();
      KarmaFieldsAlpha.DeepObject.remove(object, ...this.path, ...path);
    } else {
      object = {};
    }
    this.setObject(object);
  }

  has(...path) {
    let object = this.getObject();
    if (this.path.length || path.length) {
      return KarmaFieldsAlpha.DeepObject.has(object, ...this.path, ...path);
    } else {
      return true;
    }
  }

  merge(value, ...path) {
    const object = this.get(...path) || {};
    KarmaFieldsAlpha.DeepObject.merge(object, value);
    this.set(object, ...path);
  }

  clean(...path) {
    let object = this.get(...path) || {};
    object = KarmaFieldsAlpha.DeepObject.filter(object, item => item !== undefined && item !== null, ...path);
    this.set(object, ...path);
  }

  // setAndBackup(value, ...path) {
  //   KarmaFieldsAlpha.History.backup(value, this.get(...path), false, ...this.path, ...path);
  //   this.set(value, ...path);
  // }

  backup(value = null, ...path) {
    KarmaFieldsAlpha.History.backup(value, this.get(...path), false, ...this.path, ...path);
  }

  change(value, prevValue, ...path) {

    if (!prevValue) {

      prevValue = this.get(...path);

    }

    KarmaFieldsAlpha.History.backup(value, prevValue, false, ...this.path, ...path);

    if (value === null) {
      this.remove(...path);
    } else {
      this.set(value, ...path);
    }

  }

}

KarmaFieldsAlpha.DataTable = class {

  constructor(driver) {
    this.driver = driver;
  }

  async query(paramString) {

		if (typeof paramString === "object") {
      
			paramString = KarmaFieldsAlpha.Params.stringify(paramString);

		}

    let request = "query/"+this.driver;

    if (paramString) {

      request += "?" + paramString;

    }

    let promise = KarmaFieldsAlpha.Gateway.get(request).then(results => {

      for (let item of results) {

        const id = item.id.toString();

        const row = new KarmaFieldsAlpha.DataRow(item, promise);

        for (let key in item) {

          row.add(key, item[key]);

        }

        this.rows[id] = row;

      }
    });

    return promise;

  }

  join(relation, ids) {

    const idString = ids.join(",");

		let promise = KarmaFieldsAlpha.Gateway.get(`relations/${this.driver}/${relation}?ids=${idString}`).then(relations => {

      for (let relation of relations) {

        const id = relation.id.toString();
        const key = relation.key.toString();

        const row = this.rows[id];

        if (row) {

          row.add(key, relation.value);

        }

      }

      return relations;
    });

    for (let id of ids) {

      const row = this.rows[id];
      
      if (row) {

        row.setRelation(relation, promise);

      }

    }

    return promise;
  }

  get(id, key) {
    const row = this.rows[]
  }


}


KarmaFieldsAlpha.DataRow = class {

  constructor(query) {
    this.query = query;
    this.data = {
      trash: [false]
    };
    this.delta = {};
    this.relations = [];
  }

  add(key, value) {
    const current = this.data[key] || [];
    this.data[key] = [...current, value];
  }

  async get(key) {
    await this.query;
    return this.delta[key] || this.data[key] || [];
  }

  async set(key, values) {
    const current = await this.get(key);
    if (KarmaFieldsAlpha.DeepObject.differ(values, current)) {
      this.delta[key] = values;
    }
  }

  // async transform(key, value) {
  //   const prevValue = await this.get(key);

  //   KarmaFieldsAlpha.History.backup(value, prevValue, false, ...this.path, ...path);

  //   if (value === null) {
  //     this.remove(...path);
  //   } else {
  //     this.set(value, ...path);
  //   }
  // }


}
