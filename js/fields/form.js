
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {

  // async getParams() {
  //
  //   const params = await this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat
  //   const stateParams = await this.getState("params");
  //
  //   if (!params.loading) {
  //
  //     params.value = {...params.toObject(), ...stateParams};
  //
  //   }
  //
  //   return params;
  // }
  //
  // async queryParam(key) { // cannot name getParam for compat reason
  //
  //   const params = await this.getParams();
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (params.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     response.value = params.toObject()[key];
  //
  //   }
  //
  //   return response;
  //
  // }

  // newChild(id) {
  //
  //   if  (id === "header") {
  //
  //     if (this.resource.header && this.resource.header.type === "header") {
  //
  //       return new KarmaFieldsAlpha.field.table.header(this.resource.header, "header", this);
  //
  //     } else {
  //
  //       return new KarmaFieldsAlpha.field.group(this.resource.header, "header", this);
  //
  //     }
  //
  //   } else if (id === "footer") {
  //
  //     return new KarmaFieldsAlpha.field.table.footer(this.resource.footer, "footer", this);
  //
  //   } else if (id === "body") {
  //
  //     // return new KarmaFieldsAlpha.field[this.resource.body.type]({
  //     //   sortable: this.resource.sortable,
  //     //   ...this.resource.body
  //     // }, "body", this);
  //
  //     return this.getBody();
  //
  //   }
  //
  // }

  // getBody(index) {
  //
  //   return new KarmaFieldsAlpha.field.form.single({
  //     // id: this.resource.id,
  //     children: this.resource.children, // compat
  //     display: this.resource.display,
  //     ...this.resource.body
  //   }, "body", this);
  //
  // }

  // getChild(index, ...path) {
  //
  //   let child = this.newChild(index);
  //
  //   if (child && path.length) {
  //
  //     return child.getChild(...path);
  //
  //   }
  //
  //   return child;
  //
  // }

  getBody() {

		// const constructor = this.getConstructor(this.resource.body && this.resource.body.type || "single");
    //
		// return new constructor(this.resource.body, "body", this);


    return new KarmaFieldsAlpha.field.form.single(this.resource.body, "body", this);

    // return new KarmaFieldsAlpha.field.group(this.resource.body, "body", this);

	}


  async getId() {

    let stateId = await this.getState("id");

    if (stateId) {

      return stateId;

    } else if (this.resource.id) {

      return this.parse(this.resource.id);

    } else if (this.resource.params.id) {

      return new KarmaFieldsAlpha.Content(this.resource.params.id);

    }

  }

  async getContent(key) {

    const id = await this.getId();

    if (id.loading) {

      const response = new KarmaFieldsAlpha.Content();
      response.loading = true;
      return response;

    } else {

      return this.getContentById(id.toString(), key);

    }



  }

  async setValue(value, key) {

    const id = await this.getId();

    if (!id.loading) {

      await this.setValueById(value, id.toString(), key);

    }

  }

  // build() {
  //
  //   return {
  //     class: "form-single",
  //     child: super.build()
  //   };
  //
  // }


  // *buildBody() {
  //
	// 	const body = this.getBody();
  //
	// 	yield {
  //     class: "table-body",
  //     child: body.build()
  //   };
  //
	// }

  // *buildParts() {
  //
  //   if (this.resource.header) {
  //
  //     yield {
  //       class: "karma-header table-header table-main-header simple-buttons",
  //       child: this.getChild("header").build()
  //     };
  //
  //   }
  //
  //   yield {
  //     class: "table-body form-body",
  //     child: this.getChild("body").build()
  //   };
  //
  //   if (this.resource.footer) {
  //
  //     yield {
  //       class: "table-footer table-control",
  //       child: this.getChild("footer").build(),
  //       update: footer => {
  //         const isLoading = this.request("hasTask");
  //         footer.element.classList.toggle("loading", Boolean(isLoading));
  //       }
  //     };
  //
  //   }
  //
  // }



  // build() {
  //
  //   return {
  //     class: "table-field",
  //     children: [
  //       {
  //         class: "mixed-content",
  //         init: node => {
  //           node.element.innerHTML = "[mixed content]";
  //         },
  //         update: node => {
  //           node.element.classList.add("hidden");
  //         }
  //       },
  //       {
  //         class: "karma-field-table",
  //         init: node => {
  //           node.element.style.width = this.resource.width || "100%";
  //         },
  //         update: node => {
  //
  //         },
  //         children: [
  //           ...this.buildParts()
  //         ]
  //       }
  //     ]
  //   };
  //
  // }

  getDriver() {

    return this.resource.driver || this.resource.body && this.resource.body.driver; // compat

  }

  // build() {
  //
  //   return this.getChild("single").build();
  //
  // }


  // getChild(index) {
  //
  //   return this.createChild({
  //     type: "single",
  //     id: this.resource.id,
  //     children: this.resource.children,
  //     display: this.resource.display
  //   }, index);
  //
  // }

  // async getShuttle() {
  //
  //   if (!this.shuttle) {
  //
  //     const driver = this.getDriver();
  //
  //     let shuttle = await KarmaFieldsAlpha.Store.get("shuttles", driver, undefined);
  //
  //     if (!shuttle) {
  //
  //       shuttle = new KarmaFieldsAlpha.Shuttle(driver);
  //
  //       shuttle.from = "post";
  //       shuttle.useCache = this.resource.cache || false;
  //
  //       await KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, undefined);
  //
  //     }
  //
  //     this.shuttle = shuttle;
  //
  //   }
  //
  //   return this.shuttle;
  // }

  // async load() {
  //
  //   this.id = await this.getState("id");
  //
  //   if (!this.id) {
  //
  //     this.id = this.resource.id;
  //
  //   }
  //
  //   // compat
  //   if (!this.id) {
  //
  //     const params = await this.parseObject(this.resource.params);
  //
  //     if (params.loading) {
  //
  //       this.loading = true;
  //
  //     } else {
  //
  //       this.loading = false;
  //
  //       this.id = params.id;
  //
  //     }
  //
  //   }
  //
  // }


  // async *fetch(driver, queryId, lazy = true) { // -> to be moved to form
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(true, driver, queryId, "started");
  //
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver);
  //
  //   let subqueries = await KarmaFieldsAlpha.Database.Queries.get(driver, queryId, "subqueries") || new Set();
  //
  //   let queriedIds;
  //
  //   if (subqueries.has("query")) {
  //
  //     queriedIds = await KarmaFieldsAlpha.Database.Queries.get(driver, queryId, "queriedIds") || [];
  //
  //   } else {
  //
  //     subqueries.add("query")
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(subqueries, driver, queryId, "subqueries");
  //
  //     let paramstring = queryId;
  //
  //     if (!paramstring) {
  //
  //       let requestedIds = await KarmaFieldsAlpha.Database.Queries.get(driver, queryId, "requestedIds") || new Set();
  //
  //       paramstring = `ids=${[requestedIds].join(",")}`;
  //
  //     }
  //
  //     yield;
  //
  //     const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);
  //
  //     queriedIds = [];
  //
  //     if (results) {
  //
  //       const items = [];
  //
  //       const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //       for (let item of results) {
  //
  //         const id = item[idAlias];
  //
  //         for (let key in item) {
  //
  //           items.push({id, key, data: [item[key]]});
  //
  //         }
  //
  //         queriedIds.add(id);
  //
  //       }
  //
  //       await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(queriedIds, driver, queryId, "queriedIds");
  //     await KarmaFieldsAlpha.Database.Queries.set(true, driver, queryId, "queried");
  //
  //     // this.queried = true;
  //
  //     if (lazy) {
  //
  //       await KarmaFieldsAlpha.Database.Queries.set(false, driver, queryId, "lock");
  //       // this.idle = true;
  //       return;
  //
  //     }
  //
  //   }
  //
  //
  //   if (relations && queriedIds.length > 0) {
  //
  //     for (let relation of relations) {
  //
  //       const subqueries = await KarmaFieldsAlpha.Database.Queries.get(driver, queryId, "subqueries") || new Set();
  //
  //       // or
  //       // const isQueried = await KarmaFieldsAlpha.Database.Queries.get(driver, queryId, `${relation}-queried`);
  //
  //       if (!subqueries.has(relation)) {
  //
  //         subqueries.add(relation);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(subqueries, driver, queryId, "subqueries");
  //
  //         // or
  //         // await KarmaFieldsAlpha.Database.Queries.set(true, driver, queryId, `${relation}-queried`);
  //
  //         yield;
  //
  //         const max = 100;
  //
  //         for (let i = 0; i < queriedIds.length; i += max) {
  //
  //           const paramstring = `ids=${queriedIds.slice(i, i + max).join(",")}`;
  //
  //           const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);
  //
  //           if (results) {
  //
  //             // await this.parseRelations(results, "remote");
  //             const dataset = {};
  //
  //             for (let relation of results) {
  //
  //               const id = relation.id.toString();
  //               const key = relation.key.toString();
  //
  //               if (!dataset[id]) {
  //
  //                 dataset[id] = {};
  //
  //               }
  //
  //               if (!dataset[id][key]) {
  //
  //                 dataset[id][key] = [];
  //
  //               }
  //
  //               dataset[id][key].push(relation.value);
  //
  //             }
  //
  //             const items = [];
  //
  //             for (let id in dataset) {
  //
  //               for (let key in dataset[id]) {
  //
  //                 items.push({id, key, data: dataset[id][key]});
  //
  //               }
  //
  //             }
  //
  //             await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //           }
  //
  //         }
  //
  //         // this.relationQuery[relation] = true;
  //
  //
  //         // do we really need this?
  //         const relationQuery = await KarmaFieldsAlpha.Database.Queries.get(driver, queryId, "relationQuery");
  //         relationQuery[relation] = true;
  //         await KarmaFieldsAlpha.Database.Queries.set(relationQuery, driver, queryId, "relationQuery");
  //
  //         if (lazy) {
  //
  //           // this.idle = true;
  //           await KarmaFieldsAlpha.Database.Queries.set(false, driver, queryId, "lock");
  //           return;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   // this.complete = true;
  //   await KarmaFieldsAlpha.Database.Queries.set(true, driver, queryId, "complete");
  //
  // }

  // async getValueById(id, key) {
  //
  //   const value = new KarmaFieldsAlpha.Content();
  //
  //   if (key === "id") {
  //
  //     value.value = id;
  //     return value;
  //
  //   }
  //
  //   // if (this.loading) {
  //   //
  //   //   value.loading = true;
  //   //   return value;
  //   //
  //   // }
  //
  //   const driver = this.getDriver();
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //   const delta = await KarmaFieldsAlpha.Database.State.get("external", driver, id, key);
  //   const current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
  //
  //   if (delta) {
  //
  //     value.value = delta;
  //     value.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(delta, current);
  //
  //   } else if (current) {
  //
  //     value.value = current;
  //
  //   } else {
  //
  //     // const query = await KarmaFieldsAlpha.Database.Queries.export(driver, "");
  //     const complete = await KarmaFieldsAlpha.Database.Queries.get(driver, "", "complete");
  //     const requestedIds = await KarmaFieldsAlpha.Database.Queries.get(driver, "", "requestedIds") || new Set();
  //
  //     if (requestedIds.has(id) && complete) {
  //
  //       value.value = [];
  //       value.notFound = true;
  //
  //     } else {
  //
  //       const running = await KarmaFieldsAlpha.Database.Queries.get(driver, "", "lock");
  //
  //       if (!running) {
  //
  //         if (!requestedIds.has(id)) {
  //
  //           if (query.started) {
  //
  //             // query.started = false;
  //             // query.queried = false;
  //             // query.complete = false;
  //             subqueries = new Set();
  //
  //             await KarmaFieldsAlpha.Database.Queries.set(false, driver, "", "started");
  //             await KarmaFieldsAlpha.Database.Queries.set(false, driver, "", "queried");
  //             await KarmaFieldsAlpha.Database.Queries.set(false, driver, "", "complete");
  //
  //             // query.requestedIds = new Set();
  //
  //           }
  //
  //           requestedIds.add(id);
  //
  //           await KarmaFieldsAlpha.Database.Queries.set(requestedIds, driver, "", "requestedIds");
  //
  //         }
  //
  //         const work = this.fetch(driver, "", true);
  //         KarmaFieldsAlpha.Jobs.add(work);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(true, driver, "", "lock");
  //
  //         // await KarmaFieldsAlpha.Database.Queries.import(query, driver, "");
  //
  //       }
  //
  //       value.loading = true;
  //
  //     }
  //
  //   }
  //
  //   return value;
  //
  // }

  async getValueById(id, key) {

    if (key === "id") {

      return new KarmaFieldsAlpha.Content(id);

    } else {

      const driver = this.getDriver();
      const server = new KarmaFieldsAlpha.Server(driver);

      if (server.loading) {

        const value = new KarmaFieldsAlpha.Content();
        value.loading = true;
        return value;

      } else {

        return server.getValue(id, key);

      }

    }

  }


  getContentById(id, key) {

    return this.getValueById(id, key);

  }

  // async setValueById(value, id, key) {
  //
  //   const current = await this.getValueById(id, key);
  //
  //   if (!current.loading) {
  //
  //     key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //     const array = new KarmaFieldsAlpha.Content(value).toArray();
  //
  //     await KarmaFieldsAlpha.Database.State.set(array, "external", driver, id, key);
  //
  //     if (typeof id !== "symbol" && id[0] !== "_") { // is not token
  //
  //       await KarmaFieldsAlpha.History.write(array, current, "external", driver, id, key); // update history
  //
  //     }
  //     //  else {
  //     //
  //     //   // const index = KarmaFieldsAlpha.History.getIndex();
  //     //   //
  //     //   // const current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
  //     //   //
  //     //   // await KarmaFieldsAlpha.Database.History.backup(delta, current, index, "external", driver, id, key);
  //     //
  //     // }
  //
  //   }
  //
  // }

  async setValueById(value, id, key) {

    const driver = this.getDriver();
    const server = new KarmaFieldsAlpha.Server(driver);

    await server.setValue(value, id, key);

  }


  // async getValueById(id, key) {
  //
  //   const value = new KarmaFieldsAlpha.Content();
  //
  //   if (key === "id") {
  //
  //     value.value = id;
  //     return value;
  //
  //   }
  //
  //   let shuttle = await this.getShuttle();
  //
  //   if (shuttle) {
  //
  //     key = shuttle.getAlias(key);
  //
  //     const delta = await KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, id, key);
  //     const current = await KarmaFieldsAlpha.Store.get("vars", "remote", shuttle.driver, id, key);
  //
  //     if (delta) {
  //
  //       value.value = delta;
  //       value.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(delta, current);
  //
  //     } else if (current) {
  //
  //       value.value = current;
  //
  //     } else {
  //
  //       if (shuttle.complete) {
  //
  //         value.value = [];
  //         value.notFound = true;
  //
  //       } else {
  //
  //         if (shuttle.cached) {
  //
  //           value.value = await KarmaFieldsAlpha.Store.get("vars", "cache", shuttle.driver, id, key);
  //           value.cache = true;
  //
  //         } else {
  //
  //           value.loading = true;
  //
  //         }
  //
  //         if (shuttle.paramstring === undefined && shuttle.queries.has("query") && !shuttle.requestedIds.has(id)) {
  //
  //           shuttle.reset();
  //
  //         }
  //
  //         shuttle.request(id, key);
  //
  //         if (shuttle.idle) {
  //
  //           const work = shuttle.mix(true);
  //           KarmaFieldsAlpha.Jobs.add(work);
  //
  //           shuttle.idle = false;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   } else {
  //
  //     value.loading = true;
  //   }
  //
  //   return value;
  //
  // }

  // async setValueById(value, id, key) {
  //
  //   const shuttle = await this.getShuttle();
  //
  //   // todo: verify it is not adding item (because there will be token into it)
  //
  //   // while (shuttle.isAdding) {
  //   //
  //   //   yield;
  //   //
  //   // }
  //
  //   if (shuttle) {
  //
  //     key = shuttle.getAlias(key);
  //
  //     const current = await KarmaFieldsAlpha.Store.get("vars", "remote", shuttle.driver, id, key);
  //     const delta = new KarmaFieldsAlpha.Content(value).toArray();
  //
  //     if (typeof id === "symbol" || id[0] === "_") { // is token
  //
  //       await KarmaFieldsAlpha.Store.set(delta, "buffer", "state", "delta", "vars", "remote", shuttle.driver, id, key); // do not update history
  //
  //     } else {
  //
  //       await KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", shuttle.driver, id, key); // -> update history
  //
  //     }
  //
  //   }
  //
  // }



  // getContent(key) {
  //
  //   return this.queryParam(key);
  //
  // }
  //
  // setValue(value, key) {
  //
  //   return this.setState(value, "params", key);
  //
  // }
  //
  // getParam(key) {
  //
  //   return this.queryParam(key);
  //
  // }
  //
  // setParam(value, key) {
  //
  //   return this.setValue(value, "params", key);
  //
  // }

  async submit() {



    // const body = this.getChild("body");
    //
    // if (body && body.removeSelection) {
    //
    //   await body.removeSelection();
    //
    // }

    const delta = await this.getDelta();

    // let edits = await this.getEdits();

    // if (edits.length) {
    //
    //   const delta = this.groupData(edits);

      for (let driver in delta) {

        // yield;

        await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

        await KarmaFieldsAlpha.Database.States.remove("external", driver);
        await KarmaFieldsAlpha.Database.Queries.remove({driver});
        await KarmaFieldsAlpha.Database.States.remove("queries", driver);

        // const queries = await KarmaFieldsAlpha.Database.States.select("queries", driver);
        //
        // for (let query of queries) {
        //
        //   await KarmaFieldsAlpha.Database.Queries.set(0, query.driver, query.paramstring, "expiracy");
        //
        // }

      }

    // }






    // const edits = await KarmaFieldsAlpha.Database.States.getEdits("external");

    // await KarmaFieldsAlpha.Database.Vars.import(edits);
    //
    // await KarmaFieldsAlpha.Database.States.removeEdits("external");
    //
    // for (let driver in delta) {
    //
    //   const queries = await KarmaFieldsAlpha.Database.Queries.export(driver);
    //
    //   if (queries) {
    //
    //     for (let paramstring in queries) {
    //
    //       yield* this.fetch(driver, paramstring);
    //
    //     }
    //
    //   }
    //
    // }



    // await KarmaFieldsAlpha.Database.Vars.clear();
    // await KarmaFieldsAlpha.Database.Queries.clear();
    // await KarmaFieldsAlpha.Database.States.removeEdits("queries"); // -> remove any added item + custom ordering





    // await KarmaFieldsAlpha.Database.Queries.set(false, query.driver, query.paramstring, "complete");
    // await KarmaFieldsAlpha.Database.Queries.set(false, query.driver, query.paramstring, "started");
    // await KarmaFieldsAlpha.Database.Queries.set(false, query.driver, query.paramstring, "queried");
    // await KarmaFieldsAlpha.Database.Queries.set(new Set(), query.driver, query.paramstring, "subqueries");

    // yield* this.fetch(this.driver, this.paramstring);



  }

  async isValueModified(value, driver, id, key) {

    const current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  // async getDelta() {
  //
  //   const output = {};
  //   // const delta = await KarmaFieldsAlpha.Store.Delta.get("vars", "remote");
  //   const delta = await KarmaFieldsAlpha.Database.States.select("external");
  //
  //   if (delta) {
  //
  //     for (let item of delta) {
  //
  //       const isModified = await this.isValueModified(item.data, item.driver, item.id, item.key);
  //
  //       if (isModified) {
  //
  //         if (!output[item.driver]) {
  //
  //           output[item.driver] = {};
  //
  //         }
  //
  //         if (!output[item.driver][item.id]) {
  //
  //           output[item.driver][item.id] = {};
  //
  //         }
  //
  //         output[item.driver][item.id][item.key] = item.data;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return output;
  //
  // }

  async groupData(items) {

    const output = {};

    for await (let item of items) {

      if (!output[item.driver]) {

        output[item.driver] = {};

      }

      if (!output[item.driver][item.id]) {

        output[item.driver][item.id] = {};

      }

      output[item.driver][item.id][item.key] = item.data;

    }

    return output;

  }

  async getEdits() { // deprecated

    const edits = await KarmaFieldsAlpha.Database.States.select("external");

    const filteredEdits = [];

    for (let item of edits) {

      const isModified = await this.isValueModified(item.data, item.driver, item.id, item.key);

      if (isModified) {

        filteredEdits.push(item);

      }

    }

    return filteredEdits;

  }

  async getDelta() { // compat

    const edits = this.edits();

    return this.groupData(edits);

  }

  async *edits() {

    const edits = await KarmaFieldsAlpha.Database.States.select("external");

    for (let item of edits) {

      const isModified = await this.isValueModified(item.data, item.driver, item.id, item.key);

      if (isModified) {

        yield item;

      }

    }

  }

  async hasDelta() {

    const states = await KarmaFieldsAlpha.Database.States.select("external");

    if (states) {

      for (let state of states) {

        const isModified = await this.isValueModified(state.data, state.driver, state.id, state.key);

        if (isModified) {

          return new KarmaFieldsAlpha.Content(true);

        }

      }

    }

    return new KarmaFieldsAlpha.Content(false);

  }




}

KarmaFieldsAlpha.field.form.single = class extends KarmaFieldsAlpha.field.group {

  // async getId() {
  //
  //   let stateId = await this.getState("id");
  //
  //   if (stateId) {
  //
  //     return stateId;
  //
  //   } else {
  //
  //     let resourceId = await this.parse(this.resource.id);
  //
  //     if (resourceId.value) {
  //
  //       return resourceId;
  //
  //     } else {
  //
  //       let parentResourceId = await this.parse(this.parent.resource.id);
  //
  //       if (parentResourceId.value) {
  //
  //         return parentResourceId;
  //
  //       } else {
  //
  //         return this.parent.resource.params.id.toString();
  //
  //       }
  //     }
  //   }
  //
  // }
  //
  // async getContent(key) {
  //
  //   const id = await this.getId();
  //
  //   if (id.loading) {
  //
  //     const response = new KarmaFieldsAlpha.Content();
  //     response.loading = true;
  //     return response;
  //
  //   } else {
  //
  //     return this.parent.getContentById(id.toString(), key);
  //
  //   }
  //
  //
  //
  // }
  //
  // async setValue(value, key) {
  //
  //   const id = await this.getId();
  //
  //   if (!id.loading) {
  //
  //     await this.parent.setValueById(value, id.toString(), key);
  //
  //   }
  //
  // }

  // setContent(content, key) {
  //
  //   const value = content && content.value !== undefined ? content.value : content;
  //
  //   return this.setValue(content, key);
  //
  // }

  build() {

    return {
      class: "form-single",
      child: super.build()
    };

  }


}



KarmaFieldsAlpha.field.form.header = class extends KarmaFieldsAlpha.field.container.header {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "title",
        "close"
      ],
      ...resource
    }, id, parent);

  }


}

// KarmaFieldsAlpha.field.form.title = class extends KarmaFieldsAlpha.field.text {
//
//   constructor(resource, id, parent) {
//
//     super({
//       tag: "h1",
//       style: "flex-grow:1",
//       class: "ellipsis",
//       content: "Title",
//       ...resource
//     }, id, parent);
//
//   }
//
//   getContent() {
//
//     const content = this.getResource("title");
//
//     return this.parse(content || this.resource.content);
//
//   }
//
// }

KarmaFieldsAlpha.field.form.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      dashicon: "no",
      title: "Close",
      request: ["close"],
      ...resource
    }, id, parent);
  }
}



KarmaFieldsAlpha.field.form.footer = class extends KarmaFieldsAlpha.field.container.footer {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "save"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.form.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource, id, parent) {
    super({
      task: ["submit"],
      title: "Save",
      text: "Save",
      enabled: ["request", "hasDelta"],
      primary: true,
      ...resource
    }, id, parent);
  }

}
