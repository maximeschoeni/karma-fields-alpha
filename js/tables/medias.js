

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.table {

  // getChild(index) {
  //
  //
  //
  //   if (index === "body") {
  //
  //
  //
  //     return this.createChild({
  //       type: "gallery", // by default
  //       draganddrop: true,
  //       ...this.resource.body
  //     }, "body");
  //
  //   } else {
  //
  //     return super.getChild(index);
  //
  //   }
  //
  // }


  getDriver() {

    return this.resource.driver || "medias";

  }

  // *createFolder(num = 1) {
  //
  //   yield* add(num, undefined, {filetype: "folder"});
  //
  // }


  async *edit() {

  }

  async *add(length = 1, index = undefined, params = {}) {

    params = {...params, filetype: "folder"}

    yield* super.add(1, index, params);

  }

  // *genIds() {
  //
  //   const ids = super.getSet().toArray();
  //   const filters = this.getFilters().toObject();
  //   const parentParam = this.getValue("parent");
  //   const set = new Set();
  //
  //   // -> filter out ids whose parent is not current folder id
  //   for (let id of ids) {
  //
  //     const parent = this.shuttle.getValue(id, "parent");
  //
  //     if (parent.toString() === parentParam.toString()) {
  //
  //       set.add(id);
  //
  //       yield id;
  //
  //     }
  //
  //   }
  //
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver);
  //
  //   if (delta) {
  //
  //     for (let id in delta) {
  //
  //       if (!set.has(id)) {
  //
  //         const parent = this.shuttle.getValue(id, "parent");
  //
  //         if (parent.toString() === parentParam.toString()) {
  //
  //           yield id;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // getSet() {
  //
  //   return new KarmaFieldsAlpha.Content([...this.genIds()]);
  //
  // }

  // getLength() {
  //
  //   return new KarmaFieldsAlpha.Content(this.getSet().toArray().length);
  //
  // }

  async *upload(files, index) {

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

    const params = {...shuttle.filters, ...defaults.toObject()};

    const body = this.getChild("body");

    if (index === undefined) {

      if (body) {

        index = body.getNewFileIndex();

      } else {

        index = 0;

      }

    }

    this.save("insert", "Insert");

    // set.add(params, index, length);
    // this.shuttle.upload(files, params, index);


    // -> reformat params
    // params = Object.fromEntries(Object.entries(params).map(([key, value]) => [shuttle.getAlias(key), new KarmaFieldsAlpha.Content(value).toArray()]));



    // create a token per file

    const tokens = [];

    for (let file of files) {

      const token = this.createToken();
      tokens.push(token);

      // set default params
      for (let key in params) {

        this.setValueById(params[key], token, key);

      }

    }

    let set = this.getIds();

    while (set.loading) {

      yield;
      set = this.getIds();

    }

    // add token in queried ids

    const ids = [...set.toArray()];

    ids.splice(index, 0, ...tokens);

    KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", shuttle.driver, shuttle.paramstring); // do not update history

    if (body) {

      body.select(index, tokens.length);

    }

    yield* body.create(index, files.length);

    yield* this.increaseCount(tokens.length);


    // upload files

    const createdIds = [];

    for (let file of files) {

      const token = tokens.shift();

      yield;

      let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!

      id = id.toString();

      createdIds.push(id);

      // if (params) {
      //
      //   await KarmaFieldsAlpha.HTTP.post(`update/${shuttle.driver}`, {[id]: {trash: ["0"], ...params}});
      //
      // }

      // set preliminary values

      const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, token);

      if (delta) {

        for (let key in delta) {

          KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", shuttle.driver, id, key); // update history !

        }

        await KarmaFieldsAlpha.HTTP.post(`update/${shuttle.driver}`, {[id]: {trash: ["0"], ...delta}});

      }

      // remove preliminary values
      KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", shuttle.driver, token); // do not update history

      // handle history
      KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
      KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
      KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", shuttle.driver, id, "trash");

      // replace tokens by id
      let newIds = this.getIds().toArray().map(item => item === token ? id : item);

      if (newIds.some(id => typeof id === "symbol")) {

        KarmaFieldsAlpha.Store.set(newIds, "buffer", "state", "ids", shuttle.driver, shuttle.paramstring); // do not update history

      } else {

        KarmaFieldsAlpha.Store.State.set(newIds, "ids", shuttle.driver, shuttle.paramstring); // update history

      }

    }


    // load newly created files

    const paramstring = `ids=${createdIds.join(",")}`;
    const newShuttle = new KarmaFieldsAlpha.Shuttle(shuttle.driver, paramstring);

    KarmaFieldsAlpha.Store.set(newShuttle, "shuttles", shuttle.driver, paramstring);

    yield* shuttle.mix();


  }

  async *move(index, length, destId) {

    let shuttle = this.getShuttle();

    while (!shuttle) {

      yield;
      shuttle = this.getShuttle();

    }

    let set = this.getIds();

    while (set.loading) {

      yield;
      set = this.getIds();

    }

    // remove ids

    const movedIds = set.toArray().slice(index, index+length);

    const newIds = set.toArray().filter(id => !movedIds.includes(id));

    KarmaFieldsAlpha.Store.State.set(newIds, "ids", shuttle.driver, shuttle.paramstring);


    // update vars

    for (let id of movedIds) {

      this.setValueById(destId, id, "parent"); // just for update history

    }

    // submit changes

    yield* this.submit();



    // reload destination folder

    const params = {...shuttle.params, parent: destId};
    const paramstring = KarmaFieldsAlpha.Params.stringify(params);
    const destShuttle = KarmaFieldsAlpha.Store.get("shuttles", shuttle.driver, paramstring);

    KarmaFieldsAlpha.Store.remove("buffer", "state", "ids", shuttle.driver, paramstring); // remove delta without updating cache

    if (destShuttle) {

      destShuttle.reset();
      yield* destShuttle.mix(false, false); // no lazy, no cache

    }





    // KarmaFieldsAlpha.Store.Delta.get("vars");
    //
    // const delta = movedIds.map(id => )




    // yield;
    //
    // await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta);
    //
    //
    //
    // const filters = this.parent.getFilters();
    // const params = {...filters.toObject(), parent: destId};
    // const paramstring = KarmaFieldsAlpha.Params.stringify(params);
    //
    // let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, paramstring);
    //
    // if (shuttle) {
    //
    //   yield* shuttle.mix();
    //
    // }



  }



  // async *uploadFiles(files, tokens, params) {
  //
  //   const createdIds = [];
  //
  //   for (let file of files) {
  //
  //     const token = tokens.shift();
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //     id = id.toString();
  //
  //     createdIds.push(id);
  //
  //     if (params) {
  //
  //       await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: {trash: ["0"], ...params}});
  //
  //     }
  //
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       for (let key in delta) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key); // update history !
  //
  //       }
  //
  //     }
  //
  //     // KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //     KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", this.driver, token); // do not update history
  //
  //
  //     // handle history
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //
  //     // replace token by id
  //     const ids = this.getIds().toArray().map(item => item === token ? id : item);
  //
  //     // KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //     KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", this.driver, this.paramstring); // do not update history
  //
  //
  //
  //
  //     // init shuttle -> force reload query
  //
  //     // const shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, this.paramstring);
  //     //
  //     // if (shuttle) {
  //     //
  //     //   shuttle.init();
  //     //
  //     // }
  //
  //
  //
  //   }
  //
  //   // create new query and reload
  //   // const shuttle = KarmaFieldsAlpha.Shuttle.get(this.driver, `ids=${createdIds.join(",")}`);
  //   //
  //   // yield* shuttle.mix();
  //
  //   // this.paramstring = `ids=${createdIds.join(",")}`;
  //   //
  //   // *this.mix();
  //
  //   // const paramstring = `ids=${createdIds.join(",")}`;
  //   // let shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, paramstring);
  //   //
  //   // if (!shuttle) {
  //   //
  //   //   shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, paramstring);
  //   //
  //   //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, paramstring);
  //   //
  //   //   // const work = shuttle.mix();
  //   //   //
  //   //   // KarmaFieldsAlpha.Jobs.add(work);
  //   //
  //   //   yield* shuttle.mix();
  //   //
  //   // }
  //
  //
  //   const paramstring = `ids=${createdIds.join(",")}`;
  //   const shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, paramstring);
  //
  //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, paramstring);
  //
  //   yield* shuttle.mix();
  //
  // }
  //
  //
  // upload(files, params, index) {
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
  //
  //   const tokens = [];
  //
  //   for (let file of files) {
  //
  //     const token = this.createToken();
  //     tokens.push(token);
  //
  //     // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
  //     //
  //     // // for (let key in params) {
  //     // //
  //     // //   KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
  //     // //
  //     // // }
  //     //
  //     // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
  //     // // KarmaFieldsAlpha.Store.Delta.set(["file"], "vars", "remote", this.driver, token, "filetype");
  //     //
  //     // KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, token, "trash");
  //
  //   }
  //
  //   const ids = [...this.getIds().toArray()];
  //
  //   ids.splice(index, 0, ...tokens);
  //
  //   KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //
  //   this.increaseCount(tokens.length);
  //
  //
  //   const work = this.uploadFiles(files, tokens, params);
  //
  //   KarmaFieldsAlpha.Jobs.add(work);
  //
  // }


}


KarmaFieldsAlpha.field.gallery = class extends KarmaFieldsAlpha.field.grid {



  // getContent(index, key) {
  //
  //   if (index === "exit") {
  //
  //     switch (key) {
  //       case "id":
  //         return this.queryUpperFolderId()
  //
  //       case "filetype":
  //         return new KarmaFieldsAlpha.Content("exit");
  //
  //       case "filename":
  //       case "name":
  //         return new KarmaFieldsAlpha.Content("..");
  //
  //       default:
  //         return new KarmaFieldsAlpha.Content("");
  //
  //     }
  //
  //   } else {
  //
  //     return super.getContent(index, key);
  //
  //   }
  //
  // }

  getContentAt(index, key) {

    if (index === "exit") {

      switch (key) {
        case "id":
          const id = this.getContent("parent");
          return this.getParent(id.toString());

        case "filetype":
          return new KarmaFieldsAlpha.Content("folder");

        case "filename":
        case "name":
          return new KarmaFieldsAlpha.Content("..");

        default:
          return new KarmaFieldsAlpha.Content("");

      }

    // } else if (index === "*") {
    //
    //   const sockets =

    } else {

      return super.getContentAt(index, key);

    }

  }

  setValueAt(content, index, key) {

    if (index !== "exit") {

      super.setValueAt(content, index, key);

    }

  }

  setContentAt(content, index, key) {

    if (index !== "exit") {

      super.setContentAt(content, index, key);

    }

  }


  select(index = 0, length = 0) { // to be overrided (ie. Medias grid)

    for (let socket of this.genSockets()) {

      if (socket.id === index) {

        this.setSelection({index: socket.index, length});
        break;

      }

    }

  }

  querySelection() { // to be overrided (ie. Medias grid)

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      const sockets = this.getSockets().slice(index, index+length).filter(socket => socket.id !== "exit");

      if (sockets.length) {

        return {index: sockets[0].id, length: sockets.length};

      }

    }

    return {index: 0, length: 0};

  }




  // getSockets() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //   const length = this.parent.getLength();
  //
  //
  //
  // }

  getSockets() {

    return [...this.genSockets()];

  }

  *genSockets() {

    const length = this.parent.getLength().toNumber();
    const parent = this.getContent("parent").toString() || "0";
    let index = 0;

    if (parent !== "0") {

      yield {
        index: index++,
        id: "exit",
        filetype: "folder"
      };

    }

    for (let i = 0; i < length; i++) {

      // const itemParent = this.getContentAt(i, "parent").toString() || "0";
      const filetype = this.getContentAt(i, "filetype").toString();
      // const id = this.getContentAt(i, "id").toString();

      // if (itemParent === parent) {

        yield {
          id: i,
          index: index++,
          filetype
        };

      // }

    }

    // const driver = this.getDriver();
    // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", driver);
    // const parentAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "parent");
    //
    // for (let id in delta) {
    //
    //   if (delta[id][parentAlias] === parent) {
    //
    //     yield {
    //       id: id,
    //       index: index++,
    //       filetype: this.getValueById(id, "filetype")
    //     }
    //
    //   }
    //
    //
    // }

  }




  // queryItems() {
  //
  //
  //   const query = super.queryItems();
  //   const parent = this.parent.getContent("parent").toString() || "0";
  //
  //   if (!query.loading) {
  //
  //     query.value = query.toArray().map(item => {
  //
  //       const parent = this.getContent(item.index, "parent").toString() || "0";
  //       const filetype = this.getContent(item.index, "filetype").toString();
  //       let order;
  //
  //       if (item.uploading) {
  //
  //         order = 3;
  //
  //       } else if (item.adding) {
  //
  //         order = 1;
  //
  //       } else if (filetype === "folder") {
  //
  //         order = 2;
  //
  //       } else if (filetype === "file") {
  //
  //         order = 4;
  //
  //       } else {
  //
  //         order = 2;
  //
  //       }
  //
  //       return {...item, parent, filetype, order};
  //     });
  //
  //     query.value = query.toArray().filter(item => item.parent === parent);
  //
  //     query.value.sort((a, b) => a.order - b.order);
  //
  //     if (!this.isRoot()) {
  //
  //       const grandParent = this.queryUpperFolderId();
  //
  //       query.value = [
  //         {
  //           index: "exit",
  //           id: grandParent.toString() || "0",
  //           order: 0
  //         },
  //         ...query.toArray()
  //       ];
  //
  //     }
  //
  //   }
  //
  //   return query;
  //
  // }

  getLength() {

    const length = new KarmaFieldsAlpha.Content();

    length.value = [...this.genSockets()].length;

  }

  // selectAll() {
  //
  //   const query = this.queryItems();
  //
  //   if (!query.loading) {
  //
  //     const index = query.toArray().findIndex(item => item.index !== "exit");
  //
  //     if (index > -1) {
  //
  //       this.setSelection({
  //         index: index,
  //         length: query.toArray().length - index
  //       });
  //
  //       this.request("render");
  //
  //     }
  //
  //   }
  //
  // }




  getNewItemIndex() {

    for (let socket of this.genSockets()) {

      if (socket.filetype === "file") {

        return socket.id;

      }

    }

    return [...this.genSockets()].length - 1;

  }

  getNewFileIndex() {

    // const sockets = this.getSockets();
    //
    // return sockets[sockets.length - 1].id;

    return this.parent.getLength().toNumber();

  }

  *openFolder(socket) {

    if (socket.filetype === "folder") {

      if (socket.id === "exit") {

        this.save(`open`, "Upper Directory");

        const parent = this.getContent("parent");

        let id = this.getParent(parent.toString());

        while (id.loading) {

          yield;
          id = this.getParent(parent.toString());

        }

        this.setValue(id.toString() || "0", "parent");

        this.removeSelection();


      } else {

        this.save(`open`, "Open Directory");

        const id = this.getContentAt(socket.id, "id");

        this.setValue(id.toString() || "0", "parent");

        this.removeSelection();

      }

    }

  }

  getParent(id) {

    if (id && id !== "0") {

      const table = new KarmaFieldsAlpha.field.table({
        driver: this.getDriver()
      });

      return table.getValueById(id, "parent");



      // const driver = this.getDriver();
      // // const shuttle = KarmaFieldsAlpha.Shuttle.get(driver);
      //
      // let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, undefined);
      //
      // if (!shuttle) {
      //
      //   shuttle = new KarmaFieldsAlpha.Shuttle(driver);
      //
      //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, undefined);
      //
      //   const work = shuttle.mix();
      //
      //   KarmaFieldsAlpha.Jobs.add(work);
      //
      // }
      //
      //
      // return shuttle.getValue(id, "parent");

    } else {

      return new KarmaFieldsAlpha.Content("0");

    }

  }





  // queryUpperFolderId() {
  //
  //   let content = this.parent.getContent("parent");
  //
  //   if (!content.loading) {
  //
  //     const driver = this.getDriver();
  //     const model = new KarmaFieldsAlpha.Model(driver);
  //
  //     content = model.queryValue(content.toString(), "parent");
  //
  //   }
  //
  //   return content;
  // }

//   upperFolder() {
// console.error("deprecated");
//
//     this.openFolder(0);
//
//
//     // const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent") || "0";
//     //
//     // const grandParent = this.getParent(parent);
//     //
//     // if (grandParent.loading) {
//     //
//     //   KarmaFieldsAlpha.Store.Tasks.add({
//     //     type: "upperfolder",
//     //     resolve: () => this.upperFolder()
//     //   });
//     //
//     // } else {
//     //
//     //   this.openFolder(grandParent.toString() || "0");
//     //
//     // }
//
//   }

  // hasParent(id) {
  //
  //   const parent = this.getParent(id);
  //
  //   return !parent.loading && parent.toBoolean();
  // }
  //
  // getParent(id) {
  //
  //   if (id) {
  //
  //     const driver = this.getDriver();
  //
  //     return new KarmaFieldsAlpha.Content.Value(driver, id, key);
  //
  //     //
  //     // return this.getSingleValue(id, "parent") || "0";
  //
  //
  //
  //     // return this.getContent(id, "parent");
  //
  //   } else {
  //
  //     // return KarmaFieldsAlpha.Store.getParam("parent") || "0";
  //
  //     const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent");
  //
  //     return new KarmaFieldsAlpha.Content(parent);
  //
  //   }
  //
  // }

  // isRoot() {
  //
  //   // const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent");
  //   const parent = this.parent.getContent("parent");
  //
  //   return (parent.toString() === "0");
  // }


  async *move(sockets, targetSocket) {


    // let targetId;



    if (targetSocket.filetype === "folder") {

      // let destId;

      this.removeSelection();

      if (targetSocket.id === "exit") {

        this.save("move", "Move upper");

        const id = this.getContent("parent");

        let parent = this.getParent(id.toString());

        while (parent.loading) {

          yield;
          parent = this.getParent(id.toString());

        }

        // destId = parent;

        yield* this.parent.move(sockets[0].id, sockets.length, parent.toString());

        // for (let socket of sockets) {
        //
        //   this.setValueAt(parent.toString(), socket.id, "parent");
        //
        // }

      } else {

        this.save("move", "Move to Folder");

        const id = this.getContentAt(targetSocket.id, "id");

        // destId = id;

        yield* this.parent.move(sockets[0].id, sockets.length, id.toString());

        // for (let socket of sockets) {
        //
        //   this.setValueAt(id.toString(), socket.id, "parent");
        //
        // }

      }

      // const ids = sockets.map(socket => this.getContentAt(socket.id, "id").toString());

      // const driver = this.getDriver();
      //
      // const delta = {};
      //
      // const ids = [];
      //
      // for (let socket of sockets) {
      //
      //   this.setValueAt(destId, socket.id, "parent"); // just for update history
      //
      //   const id = this.getContentAt(socket.id, "id").toString();
      //
      //   KarmaFieldsAlpha.Store.set(destId, "vars", "remote", driver, id, "parent");
      //
      //   ids.push(id);
      //
      //   const parentAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "parent");
      //
      //   delta[id] = {[parentAlias]: destId.toArray()};
      //
      // }
      //
      // const newIds = this.parent.getSet().toArray().filter(id => !ids.includes(id));
      //
      // KarmaFieldsAlpha.Store.State.set(newIds, "ids", driver, this.parent.paramstring);
      //
      // this.removeSelection();
      //
      //
      // yield;
      //
      // await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta);
      //
      //
      //
      // const filters = this.parent.getFilters();
      // const params = {...filters.toObject(), parent: destId};
      // const paramstring = KarmaFieldsAlpha.Params.stringify(params);
      //
      // let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, paramstring);
      //
      // if (shuttle) {
      //
      //   yield* shuttle.mix();
      //
      // }

    }


  }


  // *upload(files, index) {
  //
  //   if (!this.parent.shuttle) {
  //
  //     return;
  //
  //   }
  //
  //   let defaults = this.parent.getDefaultParams();
  //
  //   while (defaults.loading) {
  //
  //     yield;
  //     defaults = this.parent.getDefaultParams();
  //   }
  //
  //   let filters = this.parent.getFilters();
  //
  //   while (filters.loading) { // should never happens since this.params is loaded now !
  //
  //     yield;
  //     filters = this.parent.getFilters();
  //   }
  //
  //   const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //   if (index === undefined) {
  //
  //     index = this.getNewItemIndex();
  //
  //   }
  //
  //   this.save("insert", "Insert");
  //
  //   // set.add(params, index, length);
  //   const tokens = this.parent.shuttle.add(params, index, length);
  //
  //   yield* body.create(index, length);
  //
  //   this.select(index, length);
  //
  //   // const work = this.shuttle.loadTokens(tokens, params);
  //   //
  //   // KarmaFieldsAlpha.Jobs.add(work);
  //
  // }



  // getUploadIndex() {
  //
  //   return this.parent.getLength().toNumber();
  //
  // }
  //
  // upload(files) {
  //
  //   const index = this.getUploadIndex();
  //
  //   this.save("upload", "Upload");
  //
  //   this.uploadAt(files, index);
  //
  //
  //   const uploadedIndex = this.queryItems().toArray().findLastIndex(item => item.uploading);
  //
  //   if (uploadedIndex > -1) {
  //
  //     this.setSelection({index: uploadedIndex, length: 1});
  //
  //   }
  //
  //
  //   this.request("render");
  //
  // }
  //
  // uploadAt(files, index) { // index is relative to collection !
  //
  //   const collection = this.getCollection();
  //   const defaults = this.parse(this.resource.defaults || {});
  //   const filters = this.getFilters();
  //
  //
  //
  //   if (defaults.loading || filters.loading) {
  //
  //     console.warn("procrastinating uploadAt");
  //
  //     this.procrastinate("uploadAt", files, index);
  //
  //   } else {
  //
  //     const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //     collection.upload(files, params, index);
  //
  //     let query = this.queryItems();
  //
  //     let items = query.toArray().filter(item => item.index >= index && item.index < index + files.length);
  //
  //     for (let item of items) {
  //
  //       const field = this.createChild({
  //         type: "row",
  //         children: this.resource.children,
  //       }, item.index);
  //
  //       field.create();
  //
  //       if (this.resource.modal) {
  //
  //         const field = this.createChild({
  //           type: "row",
  //           children: this.resource.modal.children,
  //         }, item.index);
  //
  //         field.create();
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }



  // remove(collectionIndex, length = 1) {
  //
  //   if (collectionIndex !== "exit") {
  //
  //     super.remove(collectionIndex, length);
  //
  //   }
  //
  // }


  // changeFile(file, id) {
  //
  //   this.upload([file], {id: id});
  //
  // }
  //
  // regen() {
  //
  //   const ids = this.getSelectedItems().filter(item => !item.exit).map(item => item.id).filter(id => id);
  //   const driver = this.getDriver();
  //
  //   if (ids.length) {
  //
  //     KarmaFieldsAlpha.Query.regen(driver, ids);
  //
  //   }
  //
  //   this.render();
  // }
  //
  // async uploadFromUrl(url) {
  //
  //   // url = "https://upload.wikimedia.org/wikipedia/commons/6/65/Schwalbenschwanz-Duell_Winterthur_Schweiz.jpg";
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   const filename = url.split('/').pop();
  //
  //   // const file = new File([blob], filename, {type: "image/jpg"});
  //   const file = new File([blob], filename);
  //   // const [fileId] = await this.upload([file]);
  //   this.upload(file);
  //
  // }




  // isFolderAt(index) {
  //
  //   const query = this.getContentAt(index, "filetype");
  //
  //   return (query.toString() === "folder" || query.toString() === "exit");
  //
  // }

  *buildThumbnails() {

    const selection = this.getSelection();
    const hasFocus = this.hasFocus();

    for (let socket of this.genSockets()) {

      yield {
        tag: "li",
        class: "frame",
        update: li => {

          li.element.classList.remove("drop-active");
          li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, socket.index) && hasFocus);
          li.element.classList.toggle("media-dropzone", socket.filetype === "folder");

          li.element.ondblclick = event => {
            if (socket.filetype === "folder") {
              const work = this.openFolder(socket);
              KarmaFieldsAlpha.Jobs.add(work);
              this.render();
            } else { // -> edit image in files field
              this.setSelection({index: socket.index, length: 1});
              const work = this.request("edit");
              if (work) {
                KarmaFieldsAlpha.Jobs.add(work);
                this.render();
              }
            }
          }

          const row = this.createChild({
            type: "row",
          }, socket.id);

          const media = row.createChild({
            type: "media",
            display: "thumb",
            exit: socket.id === "exit"
            // loading: item.loading,
            // uploading: item.uploading
          }, "media");

          li.child = media.build();

        }

      };

    }

  }

  buildBody() {

    return {
      class: "media-table-container",
      init: node => {
        node.element.ondrop = event => {
          event.preventDefault();
          // debugger;
          const files = event.dataTransfer.files;
          if (files.length) {
            const work = this.request("upload", files);
            KarmaFieldsAlpha.Jobs.add(work);
            this.render();
          }
          node.element.classList.remove("drop-active");
        }

        node.element.ondragover = event => {
          event.preventDefault();
          node.element.classList.add("drop-active");
        }
        node.element.ondragleave = event => {
          event.preventDefault();
          node.element.classList.remove("drop-active");
        }
      },
      update: node => {
        // node.element.classList.toggle("has-selection", Boolean(this.hasFocus()));
      },
      child: {
        class: "media-table",
        tag: "ul",
        init: grid => {
          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }
        },
        update: grid => {
          const sockets = this.getSockets();
          const selection = this.getSelection();


          if (this.resource.draganddrop) {

            const dropZones = sockets.filter(socket => socket.filetype === "folder").map(socket => socket.index);
            const selector = new KarmaFieldsAlpha.Handler.DragAndDrop(grid.element, selection, dropZones);

            selector.onSelect = elements => {
              elements.map(element => element.classList.add("selected"));
              this.setSelection(selector.state.selection);
            }

            selector.onUnselect = elements => {
              elements.map(element => element.classList.remove("selected"));
            }

            selector.onSelectionComplete = () => {
              this.setFocus(true);
              this.request("render");

            }

            selector.onDragOver = element => {
              element.classList.add("drop-active");
            };

            selector.onDragOut = element => {
              element.classList.remove("drop-active");
            };

            selector.onDraggedOver = element => {
              element.classList.add("drop-active");
            };

            selector.onDraggedOut = element => {
              element.classList.remove("drop-active");
            };

            selector.ondrop = (index, selection) => {
              // const sockets = this.getSockets();
              const slice = sockets.slice(selector.state.selection.index, selector.state.selection.index + selector.state.selection.length);
              const target = sockets[index];
              const work = this.move(slice, target);
              KarmaFieldsAlpha.Jobs.add(work);
              this.setFocus(true);
              this.render();
            };

            selector.onCancelDrag = () => {
              this.setFocus(true);
              this.request("render");
            }

          } else if (this.resource.sortable) {

            const sorter = new KarmaFieldsAlpha.ListSorterInline(grid.element, selection);

            sorter.onSelect = elements => {

              elements.map(element => element.classList.add("selected"));
              this.setSelection(sorter.state.selection);

            }

            sorter.onUnselect = elements => {

              elements.map(element => element.classList.remove("selected"));

            }

            sorter.onSelectionComplete = () => {

              this.setFocus(true);
              this.request("render");

            }

            sorter.onSwap = (newState, lastState) => {

              this.parent.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
              this.setSelection(newState.selection);

            };

            sorter.onSort = (newSelection, lastSelection) => {

              this.setFocus(true);
              this.request("render");

            }

          }




          // grid.element.classList.toggle("has-selection", Boolean(this.hasFocus()));

            // grid.children = items.map((item, index) => {
            //   return {
            //     tag: "li",
            //     class: "frame",
            //     update: li => {
            //
            //       li.element.classList.remove("drop-active");
            //       li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, index));
            //       li.element.classList.toggle("media-dropzone", Boolean(item.exit || this.isFolderAt(index)));
            //
            //       li.element.ondblclick = event => {
            //         const query = this.getContent(item.index, "filetype");
            //         if (query.toString() === "folder" || query.toString() === "exit") {
            //           this.openFolder(item.index);
            //         }
            //       }
            //
            //       const row = this.createChild({
            //         type: "row",
            //       }, item.index);
            //
            //       const media = row.createChild({
            //         type: "media",
            //         // id: item.id,
            //         // driver: this.getDriver(),
            //         display: "thumb",
            //         exit: item.index === "exit",
            //         loading: item.loading,
            //         uploading: item.uploading
            //       }, item.index);
            //
            //       li.child = media.build();
            //
            //     }
            //
            //   };
            // });

          // }

        },
        children: [...this.buildThumbnails()]
      }
    };

  }

}


// KarmaFieldsAlpha.field.saucer.table.footer = class extends KarmaFieldsAlpha.field.group {
//
//   constructor(resource) {
//
//     super({
//       display: "flex",
//       children: [
//         // "reload",
//         // "save",
//         // "add",
//         // "delete",
//         // "separator",
//         // "insert",
//         // "undo",
//         // "redo"
//         "save",
//         "upload",
//         "createFolder",
//         "delete",
//         "separator",
//         "undo",
//         "redo",
//         "insert"
//       ],
//       ...resource
//     });
//
//   }
//
// }


KarmaFieldsAlpha.field.saucer.upload = class extends KarmaFieldsAlpha.field.button {

	build() {

		return {
			class: "karma-upload karma-field button",
			init: button => {
				button.element.id = "upload-button";
			},
      // update: button => {
      //   if (this.resource.loading) {
      //     const loading = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.loading));
      //     button.element.classList.toggle("loading", loading);
      //   }
			// },
			children: [
				{
					tag: "input",
					init: input => {
						input.element.type = "file",
						input.element.id = this.getUid();
						input.element.multiple = true;
						input.element.hidden = true;
					},
					update: input => {
						input.element.onchange = async event => {
							const files = input.element.files;
							if (files.length) {
                // this.parent.request("body", "upload", files);

                const work = this.parent.request("upload", files);
                KarmaFieldsAlpha.Jobs.add(work);
                this.render();
							}
						}
					}
				},
				{
					tag: "label",
          class: "label",
					init: input => {
						input.element.htmlFor = this.getUid();
						input.element.textContent = this.resource.title || "Add File";
					}
				}
			]

		};
	}

}

KarmaFieldsAlpha.field.medias.description = class extends KarmaFieldsAlpha.field {

  build() {
    return {
      class: "karma-field karma-field-container media-description display-flex",
      update: container => {

        // const query = this.request("querySelectedItems");
        //
        // // const item = items.toSingle();
        // const loading = query.loading;
        // const mixed = query.toArray().length > 1;
        // // const exit = item && item.exit;
        // // const id = item && item.id;
        // const uploading = query.toObject().uploading;
        // const adding = query.toObject().adding;

        // const token = item && item.token; //

        container.children = [

          this.createChild({
            type: "media",
            width: "100%",
            height: "15em",
            // loading: loading,
            // uploading: uploading,
            // token: token, // not implemented
            // mixed: mixed,
            // exit: exit,
            // id: id,
            caption: false,
            display: "medium" // = default
          }, "media").build(),

          this.createChild("imageDescription").build()
        ];

      }
    };
  }
}

KarmaFieldsAlpha.field.medias.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      children: [
        // "fileType",
        // "mimeType",
        "fileDescription",
        "sizeDescription",
        "resolutionDescription",
        "dateDescription",
        "multipleDescription"
        // "folderName"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.medias.description.fileType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "filetype"],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.medias.description.mimeType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "mimetype"],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.medias.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
      hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.medias.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      // content: ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]],
      content: ["?", [">", ["getValue", "size"], 1000], ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]], ["replace", "% B", "%", ["getValue", "size"]]],
      hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.medias.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
      visible: ["&&", ["like", ["getValue", "mimetype"], "^image/.*$"], ["!", ["isMixed", ["getValue", "width"]]], ["!", ["isMixed", ["getValue", "height"]]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.medias.description.fileDescription = class extends KarmaFieldsAlpha.field.links {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "filename"],
      href: ["replace", `${KarmaFieldsAlpha.uploadURL}#/#`, "#", ["getValue", "dir"], ["getValue", "filename"]],
      target: "_blank",
      hidden: ["||", ["=", ["getIds"], "0"], ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.medias.description.multipleDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: "[Mixed files]",
      visible: ["isMixed", ["getValue", "filename"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.medias.description.folderName = class extends KarmaFieldsAlpha.field.input {
  constructor(resource, id, parent) {
    super({
      type: "input",
      label: "Folder name",
      key: "name",
      visible: ["&&", ["!", ["getValue", "mimetype"]], ["!", ["isMixed", ["getValue", "mimetype"]]]],
      ...resource
    }, id, parent);
  }
}



// KarmaFieldsAlpha.field.medias.modal = class extends KarmaFieldsAlpha.field.grid.modal {
//
//   build() {
//     return {
// 			class: "karma-field karma-field-container",
//       update: container => {
//         const items = this.request("getSelectedItems");
//
//         if (!items.some(item => item.exit)) {
//           container.children = [
//             super.build()
//           ];
//         } else {
//           container.children = [];
//         }
//       }
//     };
//   }
//
// }


// KarmaFieldsAlpha.field.saucer.createFolder = {
//   type: "button",
//   action: "createFolder",
//   title: "Create Folder"
// }

KarmaFieldsAlpha.field.saucer.createFolder = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      action: "add",
      text: "Create Folder",
      title: "Create Folder",
      ...resource
    }, id, parent)
  }
}


// KarmaFieldsAlpha.field.saucer.breadcrumb = class extends KarmaFieldsAlpha.field {
//
//   getAncestors() {
//
//     let parent = KarmaFieldsAlpha.Store.getParam("parent");
//
//     const ancestors = [];
//
//     const driver = this.resource.driver;
//
//     if (!driver) {
//       console.error("no driver");
//     }
//
//     const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
//     const nameAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "name") || "name";
//
//     while (parent && parent != "0" && parent !== KarmaFieldsAlpha.loading) {
//
//       const [name] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, nameAlias) || [KarmaFieldsAlpha.loading];
//
//       if (name === KarmaFieldsAlpha.loading) {
//
//         break;
//
//       }
//
//       ancestors.unshift({
//         id: parent,
//         name: name || ""
//       });
//
//       [parent] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, parentAlias) || [KarmaFieldsAlpha.loading];
//
//     }
//
//     return ancestors;
//   }
//
//   build() {
//     return {
//       class: "karma-breadcrumb",
//       tag: "ul",
//       update: ul => {
//
//         const ancestors = this.getAncestors() || [KarmaFieldsAlpha.loading];
//
//         ul.children = [{
//           id: "0",
//           name: "Uploads",
//           active: ancestors.length === 0
//         }, ...ancestors].map((item, index, array) => {
//           return {
//             tag: "li",
//             child: {
//               tag: "a",
//               update: a => {
//                 if (item === KarmaFieldsAlpha.loading) {
//                   a.element.innerHTML = "...";
//                 } else {
//                   a.element.classList.toggle("active", index === array.length - 1);
//                   a.element.innerHTML = item.name || "no name";
//                   a.element.onclick = event => {
//                     if (index !== array.length - 1) {
//                       this.parent.setValue(item.id, "parent");
//                       this.render();
//                     }
//                   }
//                 }
//               }
//             }
//           };
//         });
//       }
//     }
//   }
//
// }
