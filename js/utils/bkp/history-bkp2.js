KarmaFieldsAlpha.History = class {

  static getSession() {

    if (!KarmaFieldsAlpha.History.sessionId) {

      KarmaFieldsAlpha.History.sessionId = sessionStorage.getItem("karmaSessionId");

      if (!KarmaFieldsAlpha.History.sessionId) {

        KarmaFieldsAlpha.History.sessionId = Date.now();

        sessionStorage.setItem("karmaSessionId", KarmaFieldsAlpha.History.sessionId);

      }

    }

    return KarmaFieldsAlpha.History.sessionId;
  }

  static getIndex() {

    if (!KarmaFieldsAlpha.History.index) {

      KarmaFieldsAlpha.History.index = history.state && history.state.karmaHistoryIndex;

      if (!KarmaFieldsAlpha.History.index) {

        KarmaFieldsAlpha.History.index = 0;

        history.replaceState({karmaHistoryIndex: 0}, "");

      }

    }

    return KarmaFieldsAlpha.History.index

  }

  static setIndex(index) {

    KarmaFieldsAlpha.History.index = index;

    history.pushState({karmaHistoryIndex: index}, "");

  }


  static async init() {

    // const index = await KarmaFieldsAlpha.Database.History.getCurrent();
    // const count = await KarmaFieldsAlpha.Database.History.count();
    //
    // KarmaFieldsAlpha.Store.set(index, "history", "index");
    // KarmaFieldsAlpha.Store.set(count - 1, "history", "max");




    // await KarmaFieldsAlpha.Database.History.set({}, 0);

  }

  static async save(id, name) {

    // const index = KarmaFieldsAlpha.Store.Buffer.get("history", "index") || 0;
    // const lastId = KarmaFieldsAlpha.Store.Buffer.get("history", "lastId");
    // const recordId = KarmaFieldsAlpha.Store.Buffer.get("recordId");

    const buffer = await KarmaFieldsAlpha.Store.Buffer.get() || {};
    const index = buffer.index || 0;

    if (buffer.lastId !== id) {

      await KarmaFieldsAlpha.Store.Buffer.set(id, "lastId");
      await KarmaFieldsAlpha.Store.Buffer.set(index+1, "index");
      await KarmaFieldsAlpha.Store.Buffer.set(index+1, "max");

      // KarmaFieldsAlpha.Store.Buffer.set({
      //   recordId: buffer.recordId,
      //   lastId: id,
      //   index: index+1,
      //   max: index+1,
      // });

      await KarmaFieldsAlpha.Database.History.put({}, buffer.recordId, index+1);

    }

  }

  static async undo() {

    // let index = KarmaFieldsAlpha.Store.Buffer.get("history", "index") || 0;
    // const recordId = KarmaFieldsAlpha.Store.Buffer.get("recordId");

    const buffer = KarmaFieldsAlpha.Store.Buffer.get();

    if (!buffer) {

      console.error("Buffer not set");

    }

    const index = buffer.index || 0;

    if (index > 0) {

      KarmaFieldsAlpha.Store.Buffer.set(index-1, "index");

      const state = await KarmaFieldsAlpha.Database.History.get(buffer.recordId, index-1);

      KarmaFieldsAlpha.Store.Buffer.merge(state, "state"); // must not update history!

      KarmaFieldsAlpha.Store.Buffer.remove("lastId");

    }

  }

  static async redo() {

    // let index = KarmaFieldsAlpha.Store.Buffer.get("history", "index") || 0;
    // let max = KarmaFieldsAlpha.Store.Buffer.get("history", "max") || 0;
    // const recordId = KarmaFieldsAlpha.Store.Buffer.get("recordId");

    const buffer = KarmaFieldsAlpha.Store.Buffer.get();

    if (!buffer) {

      console.error("Buffer not set");

    }

    const index = buffer.index || 0;
    const max = buffer.max || 0;

    if (index < max) {

      KarmaFieldsAlpha.Store.Buffer.set(index+1, "index");

      const state = await KarmaFieldsAlpha.Database.History.get(buffer.recordId, index+1);

      KarmaFieldsAlpha.Store.Buffer.merge(state, "state"); // must not update history!

      KarmaFieldsAlpha.Store.Buffer.remove("lastId");

    }

  }

  static async hasUndo() {

    const index = await KarmaFieldsAlpha.Store.Buffer.get("index") || 0;

    return index > 0;

  }

  static async hasRedo() {

    const index = await KarmaFieldsAlpha.Store.Buffer.get("index") || 0;
    const max = await KarmaFieldsAlpha.Store.Buffer.get("max") || 0;

    return index < max;

  }

  static async delta(value, currentValue, ...path) { // path is relative from state

    const buffer = await KarmaFieldsAlpha.Store.Buffer.get();
    const index = buffer.index || 0;

    if (!buffer) {

      console.error("Buffer not set");

    }

		if (index > 0) {

			if (currentValue === undefined) {

				currentValue = null;

			}

      // -> set only if last value is undefined
      await KarmaFieldsAlpha.Database.History.backup(currentValue, buffer.recordId, index - 1, ...path);

		}

    if (value === undefined) {

      value = null;

    }

		await KarmaFieldsAlpha.Database.History.set(value, buffer.recordId, index, ...path);

	}


  static async update() { // called on popstate



  }


}
