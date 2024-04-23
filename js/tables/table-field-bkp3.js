



KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field {

  // getShuttle() {
  //
  //   let shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, this.paramstring);
  //
  //   if (!shuttle) {
  //
  //     shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, this.paramstring);
  //
  //     const work = shuttle.mix();
  //
  //     KarmaFieldsAlpha.Jobs.add(work);
  //
  //   }
  //
  //   return shuttle;
  // }

  // init() {
  //
  //   super.init();
  //
  //   this.driver = this.getDriver();
  //   this.params = this.queryParams();
  //
  //   if (this.params.loading) {
  //
  //     this.loading = true;
  //
  //   } else {
  //
  //     this.paramstring = KarmaFieldsAlpha.Params.stringify(this.params.toObject());
  //     this.shuttle = this.getShuttle(this.driver, this.paramstring);
  //
  //   }
  //
  //
  // }



  getDriver() {

    return this.resource.driver || this.resource.body && this.resource.body.driver; // compat

  }

  getParams() {

    return this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat

  }

  getShuttle() {

    if (!this.shuttle) {

      if (this.resource.dynamic) {

        let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, undefined);

        if (!shuttle) {

          shuttle = new KarmaFieldsAlpha.Shuttle(driver);

          KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, undefined);

        }

        this.shuttle = shuttle;

      } else {

        let params = this.getParams();


        if (!params.loading) {

          params = {
            ...params.toObject(),
            ...this.getState("params")
          };

          const driver = this.getDriver();
          const paramstring = KarmaFieldsAlpha.Params.stringify(params);

          let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, paramstring);

          if (!shuttle) {

            shuttle = new KarmaFieldsAlpha.Shuttle(driver, paramstring);

            const {page, ppp, order, orderby, ...filters} = params;
            shuttle.page = page;
            shuttle.ppp = ppp;
            shuttle.order = order;
            shuttle.orderby = orderby;
            shuttle.filters = filters;
            shuttle.params = params;

            KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, paramstring);

          }

          this.shuttle = shuttle;

        }

      }

    }

    return this.shuttle;
  }


  // queryParams() {
  //
  //   const params = this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (params.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = {
  //       ...params.toObject(),
  //       ...this.getState("params")
  //     };
  //
  //   }
  //
  //   return content;
  //
  // }

  getFilters() {

    const shuttle = this.getShuttle();
    const filters = new KarmaFieldsAlpha.Content();

    if (shuttle) {

      filters.value = shuttle.filters;

    } else {

      filters.loading = true;

    }

    return filters;
  }



//
// }
//
// KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  getChild(index) {

    if (index === "body" && this.resource.body) {

      return this.createChild({
        type: "body",
        ...this.resource.body
      }, "body");

    } else if (index === "header" && this.resource.header) {

      return this.createChild({
        type: "header",
        ...this.resource.header
      }, "header");

    } else if (index === "footer" && this.resource.footer) {

      return this.createChild({
        type: "footer",
        ...this.resource.footer
      }, "footer");

    }



  }

  isMixed() {

    const id = this.getContent("id");

    return Boolean(id.mixed);

  }

  *buildHeader() {

    if (this.resource.header) {

      yield this.createChild({
        type: "header",
        ...this.resource.header
      }, "header").build();

    }

  }

  *buildFooter() {

    if (this.resource.controls || this.resource.footer) {

      const footer = this.createChild({
        type: "footer",
        ...(this.resource.controls || this.resource.footer)
      }, "footer");

      yield footer.build();

    }

  }



  build() {

    return {
      class: "table-field",
      children: [
        {
          class: "mixed-content",
          init: node => {
            node.element.innerHTML = "[mixed content]";
          },
          update: node => {
            node.element.classList.toggle("hidden", !this.isMixed());
          }
        },
        {
          class: "karma-field-table",
          update: node => {
            node.element.classList.toggle("hidden", this.isMixed());
          },
          children: [
            {
              class: "karma-header table-header table-main-header simple-buttons",
              // child: this.createChild({
              //   type: "header",
              //   ...this.resource.header
              // }, "header").build(),
              children: [...this.buildHeader()], // compat
              update: header => {
                header.element.classList.toggle("hidden", !this.resource.header);
              }
            },
            this.createChild({
              ...this.resource.body
            }, "body").build(),
            {
              class: "table-footer table-control",
              // child: this.createChild({
              //   type: "footer",
              //   ...(this.resource.controls || this.resource.footer)
              // }, "footer").build(),
              children: [...this.buildFooter()], // compat
              update: footer => {
                const isLoading = this.request("hasTask");
                footer.element.classList.toggle("loading", Boolean(isLoading));
                footer.element.classList.toggle("hidden", (!this.resource.controls && !this.resource.footer));
              }
            }
          ]
        }
      ]
    };

  }





  getIds() {

    const set = new KarmaFieldsAlpha.Content();
    const shuttle = this.getShuttle();

    if (shuttle) {

      if (shuttle.queried) {

        const deltaIds = KarmaFieldsAlpha.Store.State.get("ids", shuttle.driver, shuttle.paramstring);

        set.value = deltaIds || shuttle.queriedIds || [];

      } else {

        if (shuttle.cached) {

          set.value = shuttle.cachedIds || [];

          set.cache = true;

        } else {

          set.loading = true;

        }

        if (shuttle.idle) {

          const work = shuttle.mix();
          KarmaFieldsAlpha.Jobs.add(work);

          shuttle.idle = false;

        }

      }

    } else {

      set.loading = true;

    }

    return set;
  }

  getValueById(id, key) {

    const value = new KarmaFieldsAlpha.Content();
    const shuttle = this.getShuttle();

    if (shuttle) {

      key = shuttle.getAlias(key);

      const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, id, key);
      const current = KarmaFieldsAlpha.Store.get("vars", "remote", shuttle.driver, id, key);

      if (delta) {

        value.value = delta;
        value.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(delta, current);

      } else if (current) {

        value.value = current;

      } else {

        if (shuttle.complete) {

          value.value = [];
          value.notFound = true;

        } else {

          if (shuttle.cached) {

            value.value = KarmaFieldsAlpha.Store.get("vars", "cache", shuttle.driver, id, key);
            value.cache = true;

          } else {

            value.loading = true;

          }

          shuttle.request(id, key);

          if (shuttle.idle) {

            const work = shuttle.mix();
            KarmaFieldsAlpha.Jobs.add(work);

            shuttle.idle = false;

          }

        }

      }

    } else {

      value.loading = true;
    }

    return value;

  }

  setValueById(value, id, key) {

    const shuttle = this.getShuttle();

    // todo: verify it is not adding item (because there will be token into it)

    // while (shuttle.isAdding) {
    //
    //   yield;
    //
    // }

    if (shuttle) {

      key = shuttle.getAlias(key);

      const current = KarmaFieldsAlpha.Store.get("vars", "remote", shuttle.driver, id, key);
      const delta = new KarmaFieldsAlpha.Content(value).toArray();



      if (typeof id === "symbol" || id[0] === "_") { // is token

        KarmaFieldsAlpha.Store.set(delta, "buffer", "state", "delta", "vars", "remote", shuttle.driver, id, key); // do not update history

      } else {

        KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", shuttle.driver, id, key); // -> update history

      }

    }

  }




  getSet() {

    return this.getIds();

    // if (this.shuttle) {
    //
    //   return this.shuttle.getIds();
    //
    // } else {
    //
    //   return new KarmaFieldsAlpha.Content.Loading();
    //
    // }



    // const set = new KarmaFieldsAlpha.Set(this.driver, this.paramstring);
    //
    // if (this.params.loading) {
    //
    //   set.loading = true;
    //
    // } else {
    //
    //   set.query();
    //
    // }
    //
    // return set;

  }

  getLength() {


    // const content = new KarmaFieldsAlpha.Content();
    //
    // if (this.shuttle) {
    //
    //   const ids = this.shuttle.getIds();
    //
    //   if (ids.loading) {
    //
    //     content.loading = true;
    //
    //   } else {
    //
    //     content.value = ids.toArray().length;
    //
    //   }
    //
    // } else {
    //
    //   content.loading = true;
    //
    // }
    //
    // return content;

    const set = this.getSet();
    const content = new KarmaFieldsAlpha.Content();

    if (set.loading) {

      content.loading = true;

    } else {

      content.value = set.toArray().length;

    }

    return content;
  }

  getContentRange(index, length, key) {

    const content = new KarmaFieldsAlpha.Content();

    const ids = this.getSet();

    if (ids.loading) {

      content.loading = true;

    } else {

      const values = ids.toArray().slice(index, index + length).map(id => this.getValueById(id, key));

      if (values.some(value => value.loading)) {

        content.loading = true;

      } else if (values.slice(1).some(value => !value.equals(values[0]))) {

        content.mixed = true;

      } else if (values.length > 0) {

        content.value = values[0].value;

      }

    }

    return content;

  }

  getContentAt(index, key) {

    const ids = this.getIds();

    if (ids.loading) {

      return new KarmaFieldsAlpha.Content.Loading();

    } else {

      const id = ids.toArray()[index];

      if (id) {

        return this.getValueById(id, key);

      } else {

        return new KarmaFieldsAlpha.Content();

      }

    }

  }

  setContentAt(content, index, key) { // deprecated (use setValueAt)

    // const ids = this.getIds();
    //
    // if (ids.loading) {
    //
    //   return new KarmaFieldsAlpha.Content.Loading();
    //
    // } else {
    //
    //   const id = ids.toArray()[index];
    //
    //   if (id) {
    //
    //     return this.setValueById(content.value || content, id, key);
    //
    //   } else {
    //
    //     console.warn("Cannot set value. Index out of bounds");
    //
    //   }
    //
    // }
    //
    // const id = this.getSet().toArray()[index];
    //
    // if (id) {
    //
    //   this.shuttle.setValue(content.value || content, id, key); // compat
    //
    // }

    return this.setValueAt(content.value || content, index, key);
  }

  setValueAt(value, index, key) {

    const ids = this.getIds();
    const id = ids.toArray()[index];

    if (id) {

      return this.setValueById(value, id, key);

    } else {

      console.warn("Cannot set value. Index out of bounds!", value, index, key);

    }

  }



  getContent(key) {

    const content = new KarmaFieldsAlpha.Content();
    const shuttle = this.getShuttle();

    if (!shuttle) {

      content.loading = true;

    } else {

      content.value = shuttle.params[key];

    }

    return content;

  }

  // getValue(key) {
  //
  //   return this.params.getChild(key);
  //
  // }

  setContent(content, key) { // deprecated. Use setValue.

    this.setValue(content.value || content, key);

  }

  setValue(value, key) {

    this.setState(value, "params", key);

  }

  getParam(key) {

    return this.getContent(key);

  }

  setParam(value, key) {

    this.setValue(value, key);

  }

  getOptionsList() {

    const content = new KarmaFieldsAlpha.Content();
    const ids = this.getIds();

    if (ids.loading) {

      content.loading = true;

    } else {

      content.value = ids.toArray().map(id => ({id, name: this.getValueById(id, "name").toString()}));

    }

    return content;

  }



  // getDefaults() {
  //
  //   return this.parse(this.resource.defaults || {});
  //
  // }

  // getCount() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.shuttle) {
  //
  //     return this.shuttle.getCount();
  //
  //   } else {
  //
  //     return new KarmaFieldsAlpha.Content.Loading();
  //
  //   }
  //
  // }

  getCount() {

    const content = new KarmaFieldsAlpha.Content();
    const shuttle = this.getShuttle();

    if (shuttle) {

      if (shuttle.counted) {

        const delta = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring);

        content.value = delta !== undefined && delta || shuttle.total;

      } else {

        if (shuttle.countIdle) {

          const work = shuttle.count();

          KarmaFieldsAlpha.Jobs.add(work);

          shuttle.countIdle = false;

        }

        content.loading = true;

      }

    } else {

      content.loading = true;

    }

    return content;
  }

  setCount(num) {

    const shuttle = this.getShuttle();

    if (shuttle) {

      KarmaFieldsAlpha.Store.State.set(num, "count", shuttle.driver, shuttle.paramstring);

    }

  }

  *increaseCount(num) {

    // let count = this.getCount();
    //
    // while (count.loading) {
    //
    //   yield;
    //   count = this.getCount();
    //
    // }
    //
    // this.setCount(count.toNumber() + num);

    const shuttle = this.getShuttle();

    if (shuttle && shuttle.counted) {

      const total = KarmaFieldsAlpha.Store.State.get("count", shuttle.driver, shuttle.paramstring) || shuttle.total || 0;

      KarmaFieldsAlpha.Store.State.set(total + num, "count", shuttle.driver, shuttle.paramstring); // only bother if count was actually queried

    }

  }



  // initCount() {
  //
  //   const work = this.loadCount();
  //
  //   KarmaFieldsAlpha.Jobs.add(work);
  //
  //   this.counting = true;
  //
  // }



  getPage() {

    const content = new KarmaFieldsAlpha.Content();

    content.value = this.getParam("page").toNumber() || 1;

    return content;

  }

  getPpp() { // -> may cause problem if need loading !

    const content = new KarmaFieldsAlpha.Content();

    content.value = this.getParam("ppp").toNumber() || 100;

    return content;
  }

  getNumPage() {

    const count = this.getCount();
    const content = new KarmaFieldsAlpha.Content();

    if (count.loading) {

      this.loading = true;

    } else {

      content.value = Math.max(1, Math.ceil(count.toNumber()/this.getPpp()));

    }

    return content;
  }

  isFirstPage() {

    const content = new KarmaFieldsAlpha.Content();

    content.value = this.getPage().toNumber() === 1;

    return content;

  }

  isLastPage() {

    const numPage = this.getNumPage();
    const content = new KarmaFieldsAlpha.Content();

    if (numPage.loading) {

      content.loading = true;

    } else {

      content.value = this.getPage().toNumber() === numPage.toNumber()

    }

    return content;

  }

  setPage(page) {

    this.setContent(page, "page");

  }

  firstPage() {

    const page = this.getPage();

    if (page.toNumber() > 1) {

      this.save("changePage", "Change Page");
      this.setPage(1);

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page.toNumber() > 1) {

      this.save("changePage", "Change Page");
      this.setPage(page - 1);

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page.toNumber() < numPage.toNumber()) {

      this.save("changePage", "Change Page");
      this.setPage(page.toNumber() + 1);

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page.toNumber() < numPage.toNumber()) {

      this.save("changePage", "Change Page");
      this.setPage(numPage.toNumber());

    }

  }

  isCurrentLayer() {

    const currentLayer = KarmaFieldsAlpha.Store.Layer.getCurrent();

    return currentLayer && currentLayer.table === this.parent.id;

  }

  async *add(length = 1, index = undefined, params = {}, data = undefined) {

    let shuttle = this.getShuttle();

    while (!shuttle) {

      yield;
      shuttle = this.getShuttle();

    }

    let defaults = this.getDefaultParams();

    while (defaults.loading) {

      yield;
      defaults = this.getDefaultParams();
    }

    // let filters = this.getFilters();
    //
    // while (filters.loading) { // should never happens since this.params is loaded now !
    //
    //   yield;
    //   filters = this.getFilters();
    // }

    params = {...shuttle.filters, ...defaults.toObject(), ...params};

    const body = this.getChild("body");

    if (index === undefined) {

      index = body.getNewItemIndex();

    }

    this.save("insert", "Insert");

    // set.add(params, index, length);
    // const tokens = this.shuttle.add(params, index, length);

    // -> reformat params
    // params = Object.fromEntries(Object.entries(params).map(([key, value]) => [shuttle.getAlias(key), new KarmaFieldsAlpha.Content(value).toArray()]));

    const tokens = [];

    for (let i = 0; i < length; i++) {

      const token = this.createToken();
      tokens.push(token);

      for (let key in params) {

        this.setValueById(params[key], token, key);

        // KarmaFieldsAlpha.Store.set(params[key],"buffer", "state", "delta", "vars", "remote", shuttle.driver, token, key); // do not update history

      }

      if (data && data[i]) { // for when importing...

        for (let key in data[i]) {

          this.setValueById(data[i][key], token, key);

        }

      }

    }

    const ids = [...this.getIds().toArray()];
    ids.splice(index, 0, ...tokens);

    KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", shuttle.driver, shuttle.paramstring); // do not update history

    yield* this.increaseCount(length);

    // return tokens;

    // const work = this.loadTokens(tokens, params); // we can do this job right now because we need first to create default values
    //
    // KarmaFieldsAlpha.Jobs.add(work);









    yield* body.create(index, length);

    body.select(index, length);

    // const work = this.shuttle.loadTokens(tokens, params);
    //
    // KarmaFieldsAlpha.Jobs.add(work);

    const createdIds = [];

    for (let token of tokens) {

      yield;

      let id = await KarmaFieldsAlpha.HTTP.post(`add/${shuttle.driver}`, params);

      id = id.toString();

      createdIds.push(id);

      // replace already saved values
      const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, token);

      if (delta) {

        for (let key in delta) {

          KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", shuttle.driver, id, key); // update history

        }

      }

      KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", shuttle.driver, token); // do not update history

      KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
      KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", shuttle.driver, id, "trash");


      // replace token by id
      const ids = this.getIds().toArray().map(item => item === token ? id : item);

      KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history

    }


    // load newly created item

    // const paramstring = `ids=${createdIds.join(",")}`;
    // const newShuttle = new KarmaFieldsAlpha.Shuttle(shuttle.driver, paramstring);
    //
    // KarmaFieldsAlpha.Store.set(newShuttle, "shuttles", shuttle.driver, paramstring);
    //
    // yield* newShuttle.mix(false, false); // no lazy, no cache

  }






  // async *loadTokens(tokens, params) {
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //     id = id.toString();
  //
  //     // replace already saved values
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       for (let key in delta) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);
  //
  //       }
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", this.driver, token); // do not update history
  //
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //
  //
  //     // replace token by id
  //     const ids = this.getIds().toArray().map(item => item === token ? id : item);
  //
  //     KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //
  //   }
  //
  // }

  createToken() {

    let index = KarmaFieldsAlpha.Store.get("tokenIndex") || 0;

    index++;

    KarmaFieldsAlpha.Store.set(index, "tokenIndex");

    return `_${index}_`;

    // return Symbol("adding");

  }

  // add(params, index, num = 1) {
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
  //
  //   const ids = [...this.getIds().toArray()];
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     // const token = Symbol("adding");
  //     // const token = Math.random().toString(36).substr(2);
  //     const token = this.createToken();
  //
  //     // items.push({...params, id: token});
  //     tokens.push(token);
  //
  //     // KarmaFieldsAlpha.Jobs.add(() => shuttle.create(params, token));
  //
  //     // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
  //
  //     for (let key in params) {
  //
  //       // KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
  //
  //       KarmaFieldsAlpha.Store.set(params[key],"buffer", "state", "delta", "vars", "remote", this.driver, token, key); // do not update history
  //
  //     }
  //
  //     // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
  //
  //   }
  //
  //   ids.splice(index, 0, ...tokens);
  //
  //   // KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //   KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", this.driver, this.paramstring); // do not update history
  //
  //
  //   this.increaseCount(num);
  //
  //   // return tokens;
  //
  //   const work = this.loadTokens(tokens, params); // we can do this job right now because we need first to create default values
  //
  //   KarmaFieldsAlpha.Jobs.add(work);
  //
  // }











  getDefaultParams() {

    return this.parse(this.resource.defaults || this.resource.body && this.resource.body.defaults || {}); // compat

  }

  canDelete() {

    return this.hasSelection();

  }

  hasSelection() {

    if (this.resource.body) {

      const body = this.createChild(this.resource.body, "body");

      if (body && body.hasSelection) {

        return body.hasSelection();

      }

    }

    return false;

  }

  *delete(index, length) {

    const body = this.getChild("body");

    if (index === undefined || length === undefined) {

      const selection = body.querySelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    if (length) {

      let shuttle = this.getShuttle();

      while (!shuttle) {

        yield;
        shuttle = this.getShuttle();

      }

      let ids = this.getIds();

      while (ids.loading || ids.toArray().some(id => typeof id === "symbol")) {

        yield;
        ids = this.getIds();

      }

      this.save("delete", "Delete");

      const newIds = [...ids.toArray()];

      const removedIds = newIds.splice(index, length);

      for (let id of removedIds) {

        KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
        KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", shuttle.driver, id, "trash");

      }

      KarmaFieldsAlpha.Store.State.set(newIds, "ids", shuttle.driver, shuttle.paramstring);

      body.select(0, 0);

      yield* this.increaseCount(-length);

    }

  }

  *duplicate() {

    const body = this.getChild("body");
    const selection = body.querySelection();

    index = selection && selection.index || 0;
    length = selection && selection.length || 0;

    if (length) {

      this.save("duplicate", "Duplicate");

      let grid = body.export(index, length);

      while(grid.loading) {

        yield;

        grid = body.export(index, length);

      }

      yield* body.import(grid, index + length, length);

      this.select(index + length, length);

    }

  }

  isRowSelected() { // compat

    return this.hasSelection();

  }

  getSelectedIds() {

    const body = this.getChild("body");

    const ids = this.getSet().toArray();

    if (body) {

      const selection = body.querySelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.index || 0;

        return ids.slice(index, index + length);

      }

    }

    return [];

  }

  withdraw() {

    // const content = this.querySelectedItems();

    // if (!content.loading) {
    //
    //   const items = content.toArray();
    //   const ids = items.filter(item => item.id && !item.loading).map(item => item.id);

      const ids = this.getSelectedIds();

      this.save("withdraw", "Insert");

      // KarmaFieldsAlpha.Store.Layer.close();
      this.request("close");

      if (ids.length) {

        // this.request("dispatch", "insert", ids);

        this.dispatch("insert", ids);

      }

      this.request("render");

    // }

  }

  selectByIds(ids) {

    const body = this.getChild("body");
    const selection = {index: 0, length: Infinity};

    for (let i = 0; i < this.getSet().toArray().length; i++) {

      selection.index = Math.max(selection.index, i);
      selection.length = Math.min(selection.length, i - selection.index + 1);

    }

    if (body && selection.length < Infinity) {

      body.select(selection);

    }

  }

  async *submit() {

    // const ids = this.getSelectedIds();

    const body = this.getChild("body");

    if (body && body.removeSelection) {

      body.removeSelection();

    }

    const delta = this.getDelta();

    for (let driver in delta) {

      yield;

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      for (let id in delta[driver]) {

        for (let key in delta[driver][id]) {

          KarmaFieldsAlpha.Store.set(delta[driver][id][key], "vars", "remote", driver, id, key);

        }

      }

      // remove from delta buffer without updating history
      KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver);


      // reset shuttles
      const shuttles = KarmaFieldsAlpha.Store.get("shuttles", driver);

      if (shuttles) {

        for (let paramstring in shuttles) {

          const shuttle = shuttles[paramstring];

          yield* shuttle.mix();

          // shuttle.init();
          //
          // shuttle.send();

        }

      }



      await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);

    }

    // if (ids.length) {
    //
    //   this.selectByIds(ids);
    //
    // }

  }

  isValueModified(value, driver, id, key) {

    let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  getDelta() {

    const output = {};
    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isValueModified(delta[driver][id][key], driver, id, key)) {

              KarmaFieldsAlpha.DeepObject.set(output, delta[driver][id][key], driver, id, key);

            }

          }

        }

      }

    }

    return output;

  }

  hasDelta() {

    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isValueModified(delta[driver][id][key], driver, id, key)) {

              return new KarmaFieldsAlpha.Content(true);

            }

          }

        }

      }

    }

    return new KarmaFieldsAlpha.Content(false);

  }

}

KarmaFieldsAlpha.field.table.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "save",
        "add",
        "delete",
        "separator",
        "insert",
        "undo",
        "redo"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.table.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource) {
    super({
      task: ["submit"],
      title: "Save",
      text: "Save",
      enabled: ["request", "hasDelta"],
      primary: true,
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.table.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      // task: ["add"],
      request: ["add"],
      title: "Add",
      text: "Add",
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.table.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      task: ["delete"],
      title: "Delete",
      text: "Delete",
      enabled: ["request", "hasSelection"],
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.table.insert = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["withdraw"],
      primary: true,
      text: "Insert",
      enabled: ["request", "hasSelection"],
      visible: ["request", "tunnel", -1, "useSocket"],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.export = class extends KarmaFieldsAlpha.field.download {
  constructor(resource) {
    super({
      text: "Export",
      ...resource
    });
  }
}



KarmaFieldsAlpha.field.table.header = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "title",
        "count",
        "pagination",
        "close"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.table.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      content: "Title",
      ...resource
    });

  }

  getContent() {

    const content = this.getResource("title");

    return this.parse(content || this.resource.content);

  }

}

KarmaFieldsAlpha.field.table.count = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "justify-content:center;white-space: nowrap;",
      value: ["replace", "# elements", "#", ["request", "getCount"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      dashicon: "no",
      title: "Close",
      request: ["close"],
      ...resource
    });
  }
}


KarmaFieldsAlpha.field.table.pagination = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      hidden: ["=", ["request", "getNumPage"], 1],
      children: [
        "firstpage",
        "prevpage",
        "currentpage",
        "nextpage",
        "lastpage"
      ],
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.table.pagination.firstpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      task: ["set", 1, "page"],
      request: ["firstPage"],
      title: "First Page",
      text: "«",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.prevpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      // request: ["body", "prevPage"],
      task: ["set", ["-", ["request", "getPage"], 1], "page"],
      title: "Previous Page",
      text: "‹",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.currentpage = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "font-family: monospace;", //"min-width: 4em;text-align: right;",
      value: ["replace", "#/#", "#", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.nextpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      // request: ["body", "nextPage"],
      task: ["set", ["+", ["request", "getPage"], 1], "page"],
      title: "Next Page",
      text: "›",
      // disabled: ["==", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.lastpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "lastPage"],
      task: ["set", ["request", "getNumPage"], "page"],
      title: "Last Page",
      text: "»",
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
