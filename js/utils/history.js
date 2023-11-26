KarmaFieldsAlpha.History = class {


  static async init() {

    const index = await KarmaFieldsAlpha.Database.History.getCurrent();
    const count = await KarmaFieldsAlpha.Database.History.count();

    KarmaFieldsAlpha.Store.set(index, "history", "index");
    KarmaFieldsAlpha.Store.set(count - 1, "history", "max");

  }

  static async save(id, name) {

    // const lastId = KarmaFieldsAlpha.Store.Buffer.get("lastId");

    // const index = await KarmaFieldsAlpha.Database.History.getCurrent() || 0;
    //
    // const lastId = await KarmaFieldsAlpha.Database.History.get(index, "id");


    let index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
    const lastId = KarmaFieldsAlpha.Store.get("history", "lastId");

    if (lastId !== id) {

      KarmaFieldsAlpha.Store.set(id, "history", "lastId");

      // let historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;

      // console.log("History save: index", historyIndex);
      // console.log("History save: current", current);

      await KarmaFieldsAlpha.Database.History.set("", index, "current");

      // historyIndex++;

      // await KarmaFieldsAlpha.Store.Buffer.assign({
      //   historyIndex: historyIndex,
      //   historyMax: historyIndex,
      //   lastId: id
      // });

      await KarmaFieldsAlpha.Database.History.deleteFrom(index);

      // await KarmaFieldsAlpha.Database.History.assign({
      //   id: id,
      //   name: name || id,
      //   current: "1",
      //   state: null
      // }, index+1);

      index++;

      KarmaFieldsAlpha.Store.set(index, "history", "index");
      KarmaFieldsAlpha.Store.set(index, "history", "max");

      await KarmaFieldsAlpha.Database.History.add({
        id: id,
        name: name || id,
        current: "1"
      }, index);



    }

  }

  static async undo() {

    // const historyIndex = await KarmaFieldsAlpha.Database.History.getCurrent() || 0;

    // let historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;

    let index = KarmaFieldsAlpha.Store.get("history", "index") || 0;

    if (index > 1) {

      await KarmaFieldsAlpha.Database.History.set("", index);

      index--;

      // await KarmaFieldsAlpha.Store.Buffer.set(historyIndex, "historyIndex");

      await KarmaFieldsAlpha.Database.History.set("1", index);

      const state = await KarmaFieldsAlpha.Database.History.get(index, "state");

      await KarmaFieldsAlpha.Store.Buffer.merge(state, "state");



      // const name = await KarmaFieldsAlpha.Database.History.get(historyIndex, "name");
      //
      // const notice = `Undo ${name}`;
      //
      // KarmaFieldsAlpha.Store.set(notice, "notice");

      KarmaFieldsAlpha.Store.set(index, "history", "index");

    }

  }

  static async redo() {

    // const historyIndex = await KarmaFieldsAlpha.Database.History.getCurrent() || 0;

    // let historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;
    // const historyMax = KarmaFieldsAlpha.Store.Buffer.get("historyMax") || historyIndex;

    // const count = await KarmaFieldsAlpha.Database.History.count() || 0;

    let index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
    let max = KarmaFieldsAlpha.Store.get("history", "max") || 0;


    if (index < max) {

      await KarmaFieldsAlpha.Database.History.set("", index);

      index++;

      await KarmaFieldsAlpha.Database.History.set("1", index);

      // await KarmaFieldsAlpha.Store.Buffer.set(historyIndex, "historyIndex");

      const state = await KarmaFieldsAlpha.Database.History.get(index, "state");

      await KarmaFieldsAlpha.Store.Buffer.merge(state, "state");



      // const name = await KarmaFieldsAlpha.Database.History.get(historyIndex, "name");
      //
      // const notice = `Redo ${name}`;
      //
      // KarmaFieldsAlpha.Store.set(notice, "notice");

      KarmaFieldsAlpha.Store.set(index, "history", "index");

    }

  }

  static hasUndo() {

    const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;

    return new KarmaFieldsAlpha.Content(index > 1);

  }

  static hasRedo() {

    const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
    const max = KarmaFieldsAlpha.Store.get("history", "max") || 0;

    return new KarmaFieldsAlpha.Content(index < max);

  }

  // static async backup(...path) { // path is relative from state
  //
	// 	// const historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;
  //
  //   const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
  //
	// 	if (index > 0) {
  //
	// 		let currentValue = KarmaFieldsAlpha.Store.State.get(...path);
  //
	// 		if (currentValue === undefined) {
  //
	// 			currentValue = null;
  //
	// 		}
  //
	// 		let lastValue = await KarmaFieldsAlpha.Database.History.get(index - 1, "state", ...path);
  //
	// 		if (lastValue === undefined) {
  //
	// 			await KarmaFieldsAlpha.Database.History.set(currentValue, index - 1, "state", ...path);
  //
	// 		}
  //
	// 	}
  //
	// }


  static async update(value, ...path) { // path is relative from state

		// const historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;

    const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;

		if (index > 0) {

			let currentValue = KarmaFieldsAlpha.Store.State.get(...path);

			if (currentValue === undefined) {

				currentValue = null;

			}

			let lastValue = await KarmaFieldsAlpha.Database.History.get(index - 1, "state", ...path);

			if (lastValue === undefined) {

				await KarmaFieldsAlpha.Database.History.set(currentValue, index - 1, "state", ...path);

			}

		}

    if (value === undefined) {

      value = null;

    }

		await KarmaFieldsAlpha.Database.History.set(value, index, "state", ...path);

	}

  static async remove(...path) {

		await update(null, ...path);

	}

}


// KarmaFieldsAlpha.History = class {
//
//   static async save(id, name) {
//
//     const lastId = KarmaFieldsAlpha.Store.Buffer.get("lastId");
//
//     const current = await KarmaFieldsAlpha.Database.History.getCurrent() || {};
//
//
//
//
//     if (!lastId || lastId !== id) {
//
//       let historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;
//
//       console.log("History save: index", historyIndex);
//       console.log("History save: current", current);
//
//       await KarmaFieldsAlpha.Database.History.set("", historyIndex, "current");
//
//       historyIndex++;
//
//       await KarmaFieldsAlpha.Store.Buffer.assign({
//         historyIndex: historyIndex,
//         historyMax: historyIndex,
//         lastId: id
//       });
//
//       await KarmaFieldsAlpha.Database.History.assign({
//         id: id,
//         name: name || id,
//         current: "1",
//         state: null
//       }, historyIndex);
//
//     }
//
//   }
//
//   static async undo() {
//
//     let historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;
//
//     if (historyIndex > 1) {
//
//       historyIndex--;
//
//       await KarmaFieldsAlpha.Store.Buffer.set(historyIndex, "historyIndex");
//
//       const state = await KarmaFieldsAlpha.Database.History.get(historyIndex, "state");
//
//       await KarmaFieldsAlpha.Store.State.merge(state);
//
//       const name = await KarmaFieldsAlpha.Database.History.get(historyIndex, "name");
//
//       const notice = `Undo ${name}`;
//
//       KarmaFieldsAlpha.Store.set(notice, "notice");
//
//     }
//
//   }
//
//   static async redo() {
//
//     let historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;
//     const historyMax = KarmaFieldsAlpha.Store.Buffer.get("historyMax") || historyIndex;
//
//     if (historyIndex < historyMax) {
//
//       historyIndex++;
//
//       await KarmaFieldsAlpha.Store.Buffer.set(historyIndex, "historyIndex");
//
//       const state = await KarmaFieldsAlpha.Database.History.get(historyIndex, "state");
//
//       await KarmaFieldsAlpha.Store.State.merge(state, "state");
//
//       const name = await KarmaFieldsAlpha.Database.History.get(historyIndex, "name");
//
//       const notice = `Redo ${name}`;
//
//       KarmaFieldsAlpha.Store.set(notice, "notice");
//
//     }
//
//   }
//
//   static hasUndo() {
//
//     return KarmaFieldsAlpha.Store.Buffer.get("historyIndex") > 0;
//
//   }
//
//   static hasRedo() {
//
//     return KarmaFieldsAlpha.Store.Buffer.get("historyIndex") < KarmaFieldsAlpha.Store.Buffer.get("historyMax");
//
//   }
//
//   static async update(value, ...path) { // path is relative from state
//
// 		const historyIndex = KarmaFieldsAlpha.Store.Buffer.get("historyIndex") || 0;
//
// 		if (historyIndex > 0) {
//
// 			let currentValue = KarmaFieldsAlpha.Store.State.get(...path);
//
// 			if (currentValue === undefined) {
//
// 				currentValue = null;
//
// 			}
//
// 			let lastValue = await KarmaFieldsAlpha.Database.History.get(historyIndex - 1, "state", ...path);
//
// 			if (lastValue === undefined) {
//
// 				await KarmaFieldsAlpha.Database.History.set(currentValue, historyIndex - 1, "state", ...path);
//
// 			}
//
// 		}
//
//     if (value === undefined) {
//
//       value = null;
//
//     }
//
// 		await KarmaFieldsAlpha.Database.History.set(value, historyIndex, "state", ...path);
//
// 	}
//
//   static async remove(...path) {
//
// 		await update(null, ...path);
//
// 	}
//
// }
