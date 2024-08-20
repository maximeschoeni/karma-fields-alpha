KarmaFieldsAlpha.Session = class {

  static getValue(key) {

    return sessionStorage.getItem(key);

  }

  static setValue(value, key) {

    sessionStorage.setItem(key, value);

  }

  // static getId() {
  //
  //   let id = this.getValue("karmaId");
  //
  //   if (!id) {
  //
  //     id = Date.now();
  //
  //     this.setValue(id, "karmaId");
  //   }
  //
  //   return id;
  // }

  static getId() {

    let id = KarmaFieldsAlpha.Session.id;

    if (!id) {

      id = this.getValue("karmaId");

      if (!id) {

        id = Date.now();

        this.setValue(id, "karmaId");

      }

      KarmaFieldsAlpha.Session.id = id;

    }

    return id;
  }

}

history.scrollRestoration = "manual";

KarmaFieldsAlpha.History = class {

  // static getSessionId() {
  //
  //   if (!KarmaFieldsAlpha.History.sessionId) {
  //
  //     KarmaFieldsAlpha.History.sessionId = sessionStorage.getItem("karmaId");
  //
  //     if (!KarmaFieldsAlpha.History.sessionId) {
  //
  //       KarmaFieldsAlpha.History.sessionId = Date.now();
  //
  //       sessionStorage.setItem("karmaId", KarmaFieldsAlpha.History.sessionId);
  //
  //     }
  //
  //   }
  //
  //   return KarmaFieldsAlpha.History.sessionId;
  // }

  // static getSessionValue(key) {
  //
  //   if (!KarmaFieldsAlpha.History.sessionId) {
  //
  //     KarmaFieldsAlpha.History.sessionId = sessionStorage.getItem("karmaId");
  //
  //     if (!KarmaFieldsAlpha.History.sessionId) {
  //
  //       KarmaFieldsAlpha.History.sessionId = Date.now();
  //
  //       sessionStorage.setItem("karmaId", KarmaFieldsAlpha.History.sessionId);
  //
  //     }
  //
  //   }
  //
  //   return KarmaFieldsAlpha.History.sessionId;
  // }

  static getIndex() {

    // if (!KarmaFieldsAlpha.History.index) {
    //
    //   KarmaFieldsAlpha.History.index = history.state && history.state.karmaHistoryIndex;
    //
    //   if (!KarmaFieldsAlpha.History.index) {
    //
    //     KarmaFieldsAlpha.History.index = 0;
    //
    //     history.replaceState({karmaHistoryIndex: 0}, "");
    //
    //   }
    //
    // }

    let index = history.state && history.state.karmaHistoryIndex;

    if (!index) {

      index = 0;

      history.replaceState({karmaHistoryIndex: index}, "");

    }

    return index;

  }

  static setIndex(index) {

    // KarmaFieldsAlpha.History.index = index;

    history.pushState({karmaHistoryIndex: index}, "");

  }


  static async init() {

  }

  static async save(id, name) {

    // const buffer = await KarmaFieldsAlpha.Store.Buffer.get() || {};
    // const index = buffer.index || 0;

    const index = this.getIndex();

    if (this.lastId !== id) {

      this.lastId = id;

      this.setIndex(index+1);

      KarmaFieldsAlpha.Session.setValue(index+1, "karmaHistoryIndex");
      KarmaFieldsAlpha.Session.setValue(index+1, "karmaHistoryMax");

      // await KarmaFieldsAlpha.Database.General.set(index+1, "current");
      // await KarmaFieldsAlpha.Database.General.set(index+1, "max");

      // await KarmaFieldsAlpha.Database.General.import([
      //   {value: index+1, key: "current"},
      //   {value: index+1, key: "max"}
      // ]);


      // await KarmaFieldsAlpha.Store.Buffer.set(id, "lastId");
      // await KarmaFieldsAlpha.Store.Buffer.set(index+1, "index");
      // await KarmaFieldsAlpha.Store.Buffer.set(index+1, "max");

      // KarmaFieldsAlpha.Store.Buffer.set({
      //   recordId: buffer.recordId,
      //   lastId: id,
      //   index: index+1,
      //   max: index+1,
      // });

      // await KarmaFieldsAlpha.Database.History.put({}, buffer.recordId, index+1);

    }

  }

  static async undo() {

    history.back();

    // const buffer = KarmaFieldsAlpha.Store.Buffer.get();
    //
    // if (!buffer) {
    //
    //   console.error("Buffer not set");
    //
    // }
    //
    // const index = buffer.index || 0;
    //
    // if (index > 0) {
    //
    //   KarmaFieldsAlpha.Store.Buffer.set(index-1, "index");
    //
    //   const state = await KarmaFieldsAlpha.Database.History.get(buffer.recordId, index-1);
    //
    //   KarmaFieldsAlpha.Store.Buffer.merge(state, "state"); // must not update history!
    //
    //   KarmaFieldsAlpha.Store.Buffer.remove("lastId");
    //
    // }

  }

  static async redo() {

    history.forward();

    // let index = KarmaFieldsAlpha.Store.Buffer.get("history", "index") || 0;
    // let max = KarmaFieldsAlpha.Store.Buffer.get("history", "max") || 0;
    // const recordId = KarmaFieldsAlpha.Store.Buffer.get("recordId");

    // const buffer = KarmaFieldsAlpha.Store.Buffer.get();
    //
    // if (!buffer) {
    //
    //   console.error("Buffer not set");
    //
    // }
    //
    // const index = buffer.index || 0;
    // const max = buffer.max || 0;
    //
    // if (index < max) {
    //
    //   KarmaFieldsAlpha.Store.Buffer.set(index+1, "index");
    //
    //   const state = await KarmaFieldsAlpha.Database.History.get(buffer.recordId, index+1);
    //
    //   KarmaFieldsAlpha.Store.Buffer.merge(state, "state"); // must not update history!
    //
    //   KarmaFieldsAlpha.Store.Buffer.remove("lastId");
    //
    // }

  }

  static async hasUndo() {

    // const index = await KarmaFieldsAlpha.Store.Buffer.get("index") || 0;
    //
    // return index > 0;

    const index = this.getIndex();

    return index > 0;
  }

  static async hasRedo() {

    // const index = await KarmaFieldsAlpha.Store.Buffer.get("index") || 0;
    // const max = await KarmaFieldsAlpha.Store.Buffer.get("max") || 0;

    const index = this.getIndex();
    const max = KarmaFieldsAlpha.Session.getValue("karmaHistoryMax");

    return index < max;

  }

  static async write(value, currentValue, context, driver, id, key) { // path is relative from state

    const index = this.getIndex();

    if (index > 0) {

      const previous = await KarmaFieldsAlpha.Database.History.get(index-1, context, driver, id, key);

      if (!previous) {

        await KarmaFieldsAlpha.Database.History.set(currentValue, index-1, context, driver, id, key);

      }

    }

    await KarmaFieldsAlpha.Database.History.set(value, index, context, driver, id, key);

	}


  static async update() { // called on popstate

    let current = KarmaFieldsAlpha.Session.getValue("karmaHistoryIndex") || 0;
    current = parseInt(current);
    const index = this.getIndex();

    while (current > index) {

      current--;

      const states = await KarmaFieldsAlpha.Database.History.select(current);

      await KarmaFieldsAlpha.Database.States.insert(states, current);

      // await KarmaFieldsAlpha.Database.History.revert(current);

    }

    while (current < index) {

      current++;

      const states = await KarmaFieldsAlpha.Database.History.select(current);

      await KarmaFieldsAlpha.Database.States.insert(states, current);

      // await KarmaFieldsAlpha.Database.History.revert(current);

    }

    KarmaFieldsAlpha.Session.setValue(current, "karmaHistoryIndex");

  }


}
