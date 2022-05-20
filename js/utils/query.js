
KarmaFieldsAlpha.Query = class {

  static buffer = new KarmaFieldsAlpha.Buffer("gateway");
  static cache = {};

  static create(request, joins) {
    if (!this.cache[request]) {
      this.cache[request] = new this(request, joins);
    }
    return this.cache[request];
  }

  static clear() {
    this.cache = {};
  }

  *generator() {

    this.promise = this.query();

    yield;

    if (this.joins.length) {

      this.joinPromises = [];

      for (let join of this.joins) {

        const promise = this.join(join);

        this.joinPromises.push(promise);

        yield;

      }

    }


  }

  // async *generator2() {
  //
  //   this.promise = this.query();
  //
  //   const joins = [...this.joins];
  //
  //   let promise = this.promise;
  //
  //
  //   for (let join of this.joins) {
  //
  //     while (true) {
  //
  //       promise = this.join(join);
  //
  //       yield promise;
  //
  //
  //     }
  //
  //
  //
  //   }
  //
  //
  //
  //   while (true) {
  //
  //     const found = yield value;
  //
  //     while (!value && joins.length) {
  //
  //       const join = joins.shift();
  //
  //       await this.join(join);
  //
  //       value = this.constructor.buffer.get(this.driver, id, ...path);
  //
  //     }
  //
  //     path = yield;
  //
  //     value = this.constructor.buffer.get(this.driver, id, ...path);
  //
  //
  //   }
  //
  //   if (this.joins.length) {
  //
  //     this.joinPromises = [];
  //
  //     for (let join of this.joins) {
  //
  //       const promise = this.join(join);
  //
  //       this.joinPromises.push(promise);
  //
  //       yield;
  //
  //     }
  //
  //   }
  //
  //
  // }

  constructor(request, joins = []) {

    this.request = request;
    this.joins = joins;

    [this.driver, this.paramString] = request.split("?");

    this.process = this.generator();

    // this.generator = function* () {
    //   // yield this.query(this.request);
    //   this.promise = this.query();
    //
    //   yield;
    //
    //   for (let join of joins) {
    //     this.promise = this.join(join);
    //     yield;
    //   }
    // }

    // this.promise = this.query();

    // this.promise = KarmaFieldsAlpha.Gateway.get("query/"+request).then(results => {
    //   results = results.items || results || []; // compat
    //   for (let i = 0; i < results.length; i++) {
    //     const id = results[i].id.toString();
    //     for (let key in results[i]) {
    //       this.constructor.buffer.set([results[i][key]], driver, id, key);
    //     }
    //     // this.buffer.set([id], driver, id, "id");
    //     this.constructor.buffer.set(["0"], driver, id, "trash");
    //   }
    //   return results;
    // });

  }

  query() {

    return KarmaFieldsAlpha.Gateway.get("query/"+this.request).then(results => {
      results = results.items || results || []; // compat
      for (let i = 0; i < results.length; i++) {
        const id = results[i].id.toString();
        for (let key in results[i]) {
          this.constructor.buffer.set([results[i][key]], this.driver, id, key);
        }
        // this.buffer.set([id], driver, id, "id");
        this.constructor.buffer.set(["0"], this.driver, id, "trash");
      }
      return results;
    });

  }

  // join() {
  //   if (!this.joins[join]) {
  //     this.joins[join] = this.promise.then(results => {
  //       const ids = results.reduce((set, row) => new Set([...set, row.id]), new Set());
  //       const joinRequest = join+"?ids="+[...ids].join(",");
  //
  //       return KarmaFieldsAlpha.Gateway.get("join/"+joinRequest).then(relations => {
  //         for (let relation of relations) {
  //           let values = this.constructor.buffer.get(this.driver, relation.id, relation.key) || [];
  //           this.constructor.buffer.set([...values, relation.value], this.driver, relation.id, relation.key);
  //         }
  //       });
  //     });
  //   }
  //
  //   return this.joins[join];
  // }

  join(join) {
    return this.promise.then(results => {
      const ids = results.reduce((set, row) => new Set([...set, row.id]), new Set());
      const joinRequest = join+"?ids="+[...ids].join(",");

      return KarmaFieldsAlpha.Gateway.get("join/"+joinRequest).then(relations => {
        for (let relation of relations) {
          let values = this.constructor.buffer.get(this.driver, relation.id, relation.key) || [];
          this.constructor.buffer.set([...values, relation.value], this.driver, relation.id, relation.key);
        }
        return results;
      });
    });
  }

  // *generator() {
  //
  //   yield this.query(this.request);
  //
  //   for (let join of this.joins) {
  //     yield this.join(join);
  //   }
  // }

  getResults() {

    if (!this.promise) {
      this.generator.next();
    }
    return this.promise;
  }

  // async get(...path) {
  //
  //   let value = this.constructor.buffer.get(driver, ...path);
  //
  //   await this.promise;
  //
  //   // let value = this.constructor.buffer.get(driver, ...path);
  //   //
  //   // let i = 0;
  //   //
  //   // while (!value && i < this.joins.length) {
  //   //
  //   //   await this.join(this.joins[i++]);
  //   //
  //   //   value = this.constructor.buffer.get(driver, ...path);
  //   //
  //   // }
  //
  //   let value = this.constructor.buffer.get(driver, ...path);
  //
  //   if (!value)  {
  //
  //     const result = this.generator.next();
  //
  //     if (!result.done) {
  //
  //       this.promise = await result.value;
  //
  //       value = this.get(...path);
  //
  //     }
  //
  //   }
  //
  //   return value;
  // }

  async getValue(...path) {

    // await this.promise;
    //
    // let value = this.constructor.buffer.get(driver, ...path);
    //
    // if (!value && !this.generator.next().done) {
    //
    //   value = await this.get(...path);
    //
    // }
    //
    // return value;

    // await this.promise;
    //
    // let value = this.constructor.buffer.get(this.driver, ...path);
    //
    // if (!value) {
    //
    //   const next = this.generator.next();
    //
    //   if (!next.done) {
    //
    //     value = this.getValue(this.driver, ...path);
    //
    //   }
    //
    // }
    //
    // return value;


    // let value = this.constructor.buffer.get(this.driver, ...path);
    //
    // if (!value) {
    //
    //   if (this.joinPromise) {
    //
    //     await this.joinPromise;
    //
    //   }
    //
    //   value = this.constructor.buffer.get(this.driver, ...path);
    //
    //   if (!value) {
    //
    //     const next = this.generator.next();
    //
    //     if (!next.done) {
    //
    //       value = await this.get(...path);
    //
    //     }
    //
    //   }
    //
    // }




    if (this.joinPromise) {

      await this.joinPromise;

    }

    let value = this.constructor.buffer.get(this.driver, ...path);

    if (!value) {

      const next = this.generator.next();

      if (!next.done) {

        value = await this.get(...path);

      }

    }


    return value;


  }

  async get(id, ...path) {

    if (!this.promise) {

      this.process.next();

      // this.promise = this.query();

    }

    const results = await this.promise;

    if (id === "*") {

      // return this.promise.reduce((array, item) => [...array, ...KarmaFieldsAlpha.DeepObject.get(item, ...path)], []);

      const array = [];

      for (let item in results) {

        // let value = await this.get(item.id, ...path);
        let value = await this.get(item.id, ...path);

        // let value = this.constructor.buffer.get(this.driver, item.id, ...path);
        //
        // while (!value && !this.generator.next().done) {
        //
        //   await this.promise;
        //
        //   value = this.constructor.buffer.get(this.driver, item.id, ...path);
        //
        // }

        array = [...array, ...value];

      }

      return array;

    } else if (id) {

      // return this.getValue(id, ...path);

      // let value = this.constructor.buffer.get(this.driver, id, ...path);
      //
      // // while (!value && !this.generator.next().done) {
      // //
      // //   await this.promise;
      // //
      // //   value = this.constructor.buffer.get(this.driver, id, ...path);
      // //
      // // }
      //
      //
      // if (!value) {
      //
      //   const next = this.generator.next();
      //
      //   if (!next.done) {
      //
      //     value = await this.get(id, ...path);
      //
      //   }
      //
      // }
      //
      // return value;

      // if (this.joinPromises.length) {
      //
      //   await Promise.all(this.joinPromises);
      //
      // }

      // let value = this.constructor.buffer.get(this.driver, id, ...path);
      //
      // while (!value) {
      //
      //   const next = this.process.next();
      //
      //   await next.value;
      //
      //   value = await this.get(id, ...path);
      //
      // }





      let i = 0;

      while (this.joinPromises && i < this.joinPromises.length) {

        await this.joinPromises[i++];

      }

      let value = this.constructor.buffer.get(this.driver, id, ...path);

      if (!value) {

        const next = this.process.next();

        if (!next.done) {

          value = await this.get(id, ...path);

        }

      }

      return value;

    } else {

      return results;

    }

  }

  clear() {

    delete this.constructor.cache[this.request];

  }




}
