
// KarmaFieldsAlpha.Loading = class {

//   toString() {
//     return "...";
//   }

//   // [Symbol.iterator]() {
//   //   return {
//   //     next: () => ({ value: "...", done: true })
//   //   };
//   // }

//   *[Symbol.iterator]() {
//     yield this;
//   }

// };

KarmaFieldsAlpha.Query = class {


  static VarsRequirement = class {

    constructor(driver) {

      if (!KarmaFieldsAlpha.drivers[driver]) {

        console.error("Driver not found", driver);

      }

      this.driver = driver;
      this.relations = KarmaFieldsAlpha.drivers[driver].relations || [];
      this.ids = new Set();
      this.queriedIds = new Set();
      this.done = true;
      this.queried = false;
      this.step = 0;
  
    }
  
    has(id) {
  
      return this.ids.has(id);
  
    }
  
    isQueried(id) {
  
      return this.queriedIds.has(id);
  
    }
  
    add(id) {
  
      // if (!this.queriedIds.has(id) && !this.ids.has(id)) {
  
      //   this.ids.add(id);
        
      //   this.done = false;
      //   this.queried = false;
      //   this.step = 0;
  
      // }

      if (!this.queriedIds.has(id)) {
        
        if (!this.ids.has(id)) {

          this.ids.add(id);
          this.queried = false;
          this.step = 0;

        }

        this.done = false;
  
      }
    
    }
  
    async fulfill() {
  
      if (!this.queried) {
  
        await KarmaFieldsAlpha.Query.query(this.driver, `ids=${[...this.ids].join(",")}`);
  
        this.queried = true;
  
      } else if (this.step < this.relations.length) {
        
        await KarmaFieldsAlpha.Query.queryRelations(this.driver, this.relations[this.step], [...this.ids]);
        
        this.step++;
  
      }
  
      if (this.step >= this.relations.length) {
  
        this.queriedIds = new Set([...this.queriedIds, ...this.ids]);
  
        this.ids = new Set();
  
      }

      this.done = true;
  
    }

  }
  
  static requirements = {};
  static vars = {};
  static queries = {};
  static counts = {};
  static uploads = [];

  static getValue(driver, id, key) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);
    }

    const value = KarmaFieldsAlpha.DeepObject.get(this.vars, driver, id, key);

    
    
    if (!value) {
      
      let requirement = KarmaFieldsAlpha.DeepObject.get(this.requirements, "vars", driver);

      if (!requirement) {

        requirement = new this.VarsRequirement(driver);

        KarmaFieldsAlpha.DeepObject.assign(this.requirements, requirement, "vars", driver);

      }

      if (requirement.isQueried(id)) {

        return [];

      } else {

        requirement.add(id);

      }

    }

    return value;
  }

  static async processVars() {

    const requirements = KarmaFieldsAlpha.DeepObject.get(this.requirements, "vars");

    if (requirements) {

      const driver = Object.keys(requirements).find(driver => !requirements[driver].done);

      if (driver) {

        await requirements[driver].fulfill();

        return true;

      }

    }

    return false;
  }

  static async query(driver, paramstring = "") {

    const results = await KarmaFieldsAlpha.Gateway.get(`query/${driver}${paramstring && "?"}${paramstring}`);

    for (let item of results) {

      const id = item.id.toString(); // -> alias!

      for (let key in item) {

        const value = KarmaFieldsAlpha.Type.toArray(item[key]);

        KarmaFieldsAlpha.DeepObject.assign(this.vars, value, driver, id, key);

      }

    }

    return results;
  }

  static async queryRelations(driver, relation, ids) {

    const relations = await KarmaFieldsAlpha.Gateway.get(`relations/${driver}/${relation}?ids=${ids.join(",")}`);

    for (let relation of relations) {

      const id = relation.id.toString();
      const key = relation.key.toString();

      let value = KarmaFieldsAlpha.DeepObject.get(this.vars, driver, id, key);

      if (!value) {

        value = [];

        KarmaFieldsAlpha.DeepObject.assign(this.vars, value, driver, id, key);

      }

      value.push(relation.value);

    }

    return relations;
  }

  static getResults(driver, params) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);
    }

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let query = KarmaFieldsAlpha.DeepObject.get(this.queries, driver, paramstring);

    if (!query) {

      let set = KarmaFieldsAlpha.DeepObject.get(this.requirements, "queries", driver);

      if (!set) {

        set = new Set();

        KarmaFieldsAlpha.DeepObject.assign(this.requirements, set, "queries", driver);
      }

      set.add(paramstring);

    }

    return query;
  }

  static async processQueries() {

    const requirements = KarmaFieldsAlpha.DeepObject.get(this.requirements, "queries");

    if (requirements) {

      const driver = Object.keys(requirements).find(driver => requirements[driver].size);

      if (driver) {

        const set = requirements[driver];
        const paramstring = [...set][0];

        const results = await this.query(driver, paramstring);

        KarmaFieldsAlpha.DeepObject.assign(this.queries, results, driver, paramstring);

        set.delete(paramstring);

        return true;

      }

    }

    return false;
  }

  getCount(driver, params) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);
    }

    const paramString = KarmaFieldsAlpha.Params.stringify(params);

    let count = KarmaFieldsAlpha.DeepObject.get(this.counts, driver, paramString);

    if (count === undefined) {

      let set = KarmaFieldsAlpha.DeepObject.get(this.requirements, "counts", driver);

      if (!set) {

        set = new Set();

        KarmaFieldsAlpha.DeepObject.assign(this.requirements, set, "counts", driver);
      }

      set.add(paramString);

    }

    return count;

  }

  static async processCounts() {

    const requirements = KarmaFieldsAlpha.DeepObject.get(this.requirements, "counts");

    if (requirements) {

      const driver = Object.keys(requirements).find(driver => requirements[driver].size);

      if (driver) {

        const set = requirements[driver];
        const paramstring = [...set][0];

        const count = await KarmaFieldsAlpha.Gateway.get(`count/${driver}${paramstring && "?"}${paramstring}`);

        KarmaFieldsAlpha.DeepObject.assign(this.counts, count, driver, paramstring);

        set.delete(paramstring);

        return true;

      }

    }

    return false;
  }

  // static requestUpload(files) {
  //   this.uploads = [...this.uploads, ...files];
  // }

  // static async uploadFile(file) {

  //   // let id = await KarmaFieldsAlpha.Gateway.upload(file);

  //   const fileName = file.name.normalize();

  //   const formData = new FormData();
  //   formData.append("async-upload", file);
  //   formData.append("name", fileName);
  //   formData.append("action", wp.Uploader.defaults.multipart_params.action);
  //   formData.append("_wpnonce", wp.Uploader.defaults.multipart_params._wpnonce);

  //   fetch(KarmaFieldsAlpha.adminURL+"async-upload.php", {
  //     method: "post",
  //     body: formData,
  //     mode: "cors"
  //   }).then(response => response.json()).then(function(result) {
  //     console.log(result);
  //   });

  // }

  // static async processUpload() {
  //   if (this.uploads.length) {

  //     const file = this.uploads.shift();
  //     await this.uploadFile(file);

  //     return true;
  //   }
    
  //   return false;
  // }





  static async process() {

    return (await this.processQueries() || await this.processCounts() || await this.processVars());

  }

  static reset() {
    this.requirements = {};
  }

  static empty() {
    this.requirements = {};
    this.vars = {};
    this.queries = {};
  }

}


