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

	static init() {

		this.id = this.getValue("karmaId");

		if (!this.id) {

			this.id = Date.now();

			this.setValue(this.id, "karmaId");

		}

	}


	static getId() {

		return this.id;

		// let id = KarmaFieldsAlpha.Session.id;

		// if (!id) {

		// 	id = this.getValue("karmaId");

		// 	if (!id) {

		// 		id = Date.now();

		// 		this.setValue(id, "karmaId");

		// 	}

		// 	KarmaFieldsAlpha.Session.id = id;

		// }

		// return id;
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

	static init() {

		if (!history.state || history.state.karmaHistoryIndex === undefined) {

			history.replaceState({ karmaHistoryIndex: 0 }, "");

		}

		this.current = 0;

	}

	static getIndex() {

		return history.state && history.state.karmaHistoryIndex || 0;

	}

	static setIndex(index) {

		history.pushState({ karmaHistoryIndex: index }, "");

	}



	static save(id, name) {

		// const buffer = await KarmaFieldsAlpha.Store.Buffer.get() || {};
		// const index = buffer.index || 0;

		const index = this.getIndex();

		if (!id || this.lastId !== id) {

			this.lastId = id;
			this.lastStep = name || id || "n/a";

			this.setIndex(index + 1);

			// KarmaFieldsAlpha.Session.setValue(index + 1, "karmaHistoryIndex");

			this.current = index + 1;

			KarmaFieldsAlpha.Session.setValue(index + 1, "karmaHistoryMax");

			KarmaFieldsAlpha.Store.tasks.set(true, "history", "save");

		}

	}

	static undo() {

		if (this.hasUndo()) {

			history.back();

		}

	}

	static redo() {

		if (this.hasRedo()) {

			history.forward();

		}

	}

	static hasUndo() {

		const index = this.getIndex();

		return index > 0;
	}

	static hasRedo() {

		const index = this.getIndex();
		const max = KarmaFieldsAlpha.Session.getValue("karmaHistoryMax");

		return index < max;

	}

 //  static async write(value, currentValue, context, driver, id, key) { // path is relative from state

	// 	console.error("DEPRECATED");

 //    const index = this.getIndex();

 //    if (index > 0) {

 //      const previous = await KarmaFieldsAlpha.Database.History.get(index-1, context, driver, id, key);

 //      if (!previous) {

 //        await KarmaFieldsAlpha.Database.History.set(currentValue, index-1, context, driver, id, key);

 //      }

 //    }

 //    await KarmaFieldsAlpha.Database.History.set(value, index, context, driver, id, key);

	// }


	static update() { // called on popstate DO NOTHING!!

		console.error("DEPRECATED (DO NOTHING)");

		// let current = KarmaFieldsAlpha.Session.getValue("karmaHistoryIndex") || 0;
		// current = parseInt(current);


		KarmaFieldsAlpha.server.changeHistory();


		// KarmaFieldsAlpha.Session.setValue(current, "karmaHistoryIndex");

	}


}
