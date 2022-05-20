
KarmaFieldsAlpha.Driver = class {

  // static candidates = {};
  static buffer = new KarmaFieldsAlpha.Buffer("gateway");


  static cache = {};

  static clear(driver, paramString) {

    if (driver && paramString) {
      delete this.cache[driver + "?" + paramString];
    } else {
      this.cache = {};
    }

  }
  //
  // static cache = [];
  //
  // static find(driver, paramString, joins) {
  //
  //   return this.cache.find(item => {
  //     return (!driver || item.driver === driver)
  //       && paramString === item.paramString
  //       && KarmaFieldsAlpha.DeepObject.equal(joins, item.joins);
  //   });
  //
  // }
  //
  // // static async request(driver, paramString, ...joins) {
  // //
  // //   if (!this.candidates[driver]) {
  // //     this.candidates[driver] = this.query(driver, paramString);
  // //   }
  // //
  // //   return this.candidates[driver];
  // // }
  //
  // static query(driver, paramString, ...joins) {
  //
  //   if (!this.queryCache[driver]) {
  //
  //     this.queryCache[driver] = {};
  //
  //   }
  //
  //   if (!this.queryCache[driver][paramString]) {
  //
  //     this.queryCache[driver][paramString] = KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString).then(results => {
  //
  //       results = results.items || results || []; // compat
  //
  //       for (let i = 0; i < results.length; i++) {
  //
  //         const id = results[i].id.toString();
  //
  //         for (let key in results[i]) {
  //           this.buffer.set(results[i][key], driver, id, key, 0);
  //         }
  //
  //         this.buffer.set([id], driver, id, "id");
  //         this.buffer.set(["0"], driver, id, "trash");
  //
  //       }
  //
  //       if (joins.length) {
  //         for (let join of joins) {
  //           this.registerJoin(join.driver, this.tablePromise.then(results => results.map(row => row[join.on || "id"])));
  //         }
  //       }
  //
  //       return results;
  //
  //     }).then(async results => {
  //
  //       if (joins.length) {
  //
  //         for (let join of joins) {
  //
  //           const key = row[join.on || "id"];
  //           const ids = results.map(row => row[key].toString());
  //
  //           await KarmaFieldsAlpha.Gateway.get("join/"+join.driver).then(relations => {
  //
  //             for (let relation of relations) {
  //
  //               let values = this.buffer.get(driver, relation.id, relation.key) || [];
  //               this.buffer.set([...values, relation.value], driver, relation.id, relation.key);
  //
  //             }
  //
  //           });
  //
  //         }
  //       }
  //
  //       return results;
  //
  //
  //
  //
  //
  //
  //
  //     });
  //
  //
  //
  //   }
  //
  //   return this.queryCache[driver][paramString];
  // }
  //
  // // static async query(driver, paramString, ...joins) {
  // //
  // //
  // //
  // //   let results = await KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString);
  // //
  // //   results = results.items || results || []; // compat
  // //
  // //   for (let i = 0; i < results.length; i++) {
  // //
  // //     const id = results[i].id.toString();
  // //
  // //     for (let key in results[i]) {
  // //       this.buffer.set(results[i][key], driver, id, key, 0);
  // //     }
  // //
  // //     // this.buffer.set("0", driver, id, "trash", 0);
  // //   }
  // //
  // //
  // //
  // // }
  //
  // static async get(driver, ...path) {
  //
	// 	const key = path.join("/");
  //
  //   let value = await KarmaFieldsAlpha.Gateway.get("get/"+driver+"/"+key);
  //
  //   if (!Array.isArray(value)) {
  //     value = [value];
  //   }
  //
  //   this.buffer.set(value, driver, ...path);
  //
	// 	return value;
	// }
  //
  // static async select(driver, paramString, joins) {
  //
  //   const promise = KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString);
  //
  //   let results = await promise;
  //
  //   results = results.items || results || []; // compat
  //
  //   for (let i = 0; i < results.length; i++) {
  //
  //     const id = results[i].id.toString();
  //
  //     for (let key in results[i]) {
  //
  //       this.buffer.set([results[i][key]], driver, id, key);
  //
  //     }
  //
  //     // this.buffer.set("0", id, "trash", 0);
  //   }
  //
  //   return results;
  // }
  //
  //
  //
  // // static async join(driver, jointDriver, ids, args) {
  //
  //   // const relations = await KarmaFieldsAlpha.Gateway.get("join/"+jointDriver+"?ids="+[...ids].join(","));
  //
  // // static async join(driver, jointDriver) {
  // //
  // //   const relations = await KarmaFieldsAlpha.Gateway.get("join/"+jointDriver);
  // //
  // //   for (let relation of relations) {
  // //     const id = relation.id.toString();
  // //     if (id) {
  // //       for (let key in relation) {
  // //         if (key !== "id") {
  // //           // KarmaFieldsAlpha.DeepObject.sanitize(relation[key]); // -> compat
  // //
  // //           let values = this.buffer.get(driver, id, key) || [];
  // //           this.buffer.set([...values, relation[key]], driver, id, key);
  // //         }
  // //       }
  // //     }
  // //   }
  // //
  // // }
  //
  // static async join(driver, jointDriver) {
  //
  //   const relations = await KarmaFieldsAlpha.Gateway.get("join/"+jointDriver);
  //
  //   for (let relation of relations) {
  //
  //     let values = this.buffer.get(driver, relation.id, relation.key) || [];
  //     this.buffer.set([...values, relation.value], driver, relation.id, relation.key);
  //
  //   }
  //
  // }







  static query(driver, paramString) {

    const [driver, paramString] = request.split("?");

    const request = driver + "?" + paramString;

    if (!this.cache[request]) {
      this.cache[request] = {
        driver: driver,
        paramString: paramString,
        joins: {},
        promise: KarmaFieldsAlpha.Gateway.get("query/"+request).then(results => {
          results = results.items || results || []; // compat
          for (let i = 0; i < results.length; i++) {
            const id = results[i].id.toString();
            for (let key in results[i]) {
              this.buffer.set([results[i][key]], driver, id, key);
            }
            // this.buffer.set([id], driver, id, "id");
            this.buffer.set(["0"], driver, id, "trash");
          }
          return results;
        })
      }
    }

    return this.cache[request];
  }

  // static join(driver, paramString, join) {
  //
  //   const query = this.query(driver, paramString);
  //
  //   query.promise = query.promise.then(async results => {
  //
  //     const ids = results.reduce((set, row) => new Set([...set, ...this.buffer.get(driver, row.id, join.on)]), new Set());
  //
  //     const joinRequest = join.driver+"?ids="+[...ids].join(",");
  //
  //     await KarmaFieldsAlpha.Gateway.get("join/"+joinRequest).then(relations => {
  //
  //       for (let relation of relations) {
  //
  //         let values = this.buffer.get(driver, relation.id, relation.key) || [];
  //         this.buffer.set([...values, relation.value], driver, relation.id, relation.key);
  //
  //       }
  //
  //     });
  //
  //     return results;
  //   });
  //
  //   return query;
  // }

  static join(driver, paramString, join) {

    const query = this.query(driver, paramString);

    if (!query.joins[join]) {
      query.joins[join] = {
        promise: query.promise.then(results => {
          // const ids = results.reduce((set, row) => new Set([...set, ...this.buffer.get(driver, row.id, join.on || "id")]), new Set());
          const ids = results.reduce((set, row) => new Set([...set, row.id]), new Set());
          const joinRequest = join+"?ids="+[...ids].join(",");

          return KarmaFieldsAlpha.Gateway.get("join/"+joinRequest).then(relations => {
            for (let relation of relations) {
              let values = this.buffer.get(driver, relation.id, relation.key) || [];
              this.buffer.set([...values, relation.value], driver, relation.id, relation.key);
            }
          });
        })
      };
    }

    return query.joins[join];
  }


  static async get(driver, paramString, joins = [], ...path) {

    let value = this.buffer.get(driver, ...path);

    if (!value) {
      // query

      var result = await this.query(driver, paramString).promise;

      value = this.buffer.get(driver, ...path);

    }



    let i = 0;
ftg
    while (!value && i < joins.length) {
      // joins


      await this.join(driver, paramString, joins[i++]).promise;

      value = this.buffer.get(driver, ...path);



    }


    // for (let join of joins) {
    //
    //   await this.join(driver, paramString, join).promise;
    //
    //   value = this.buffer.get(driver, ...path);
    //
    //   if (value) break;
    //
    // }

    return value;
  }





}
