KarmaFieldsAlpha.History = class {


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

    const buffer = KarmaFieldsAlpha.Store.Buffer.get() || {};
    const index = buffer.index || 0;

    if (buffer.lastId !== id) {

      KarmaFieldsAlpha.Store.Buffer.set(id, "lastId");
      KarmaFieldsAlpha.Store.Buffer.set(index+1, "index");
      KarmaFieldsAlpha.Store.Buffer.set(index+1, "max");

      // KarmaFieldsAlpha.Store.Buffer.set({
      //   recordId: buffer.recordId,
      //   lastId: id,
      //   index: index+1,
      //   max: index+1,
      // });

      KarmaFieldsAlpha.Database.History.put({}, buffer.recordId, index+1);

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

    }

  }

  static hasUndo() {

    const index = KarmaFieldsAlpha.Store.Buffer.get("index") || 0;

    return index > 0;

  }

  static hasRedo() {

    const index = KarmaFieldsAlpha.Store.Buffer.get("index") || 0;
    const max = KarmaFieldsAlpha.Store.Buffer.get("max") || 0;

    return index < max;

  }

  // static async update(value, ...path) { // path is relative from state
  //
  //   const index = KarmaFieldsAlpha.Store.Buffer.get("history", "index") || 0;
  //
	// 	if (index > 0) {
  //
	// 		let currentValue = KarmaFieldsAlpha.Store.State.get(...path);
  //
  //     if (currentValue === undefined && path[0] === "delta") {
  //
  //       currentValue = KarmaFieldsAlpha.Store.get("vars", ...path.slice(1)) || [];
  //
  //     }
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
  //   if (value === undefined) {
  //
  //     value = null;
  //
  //   }
  //
	// 	await KarmaFieldsAlpha.Database.History.set(value, index, "state", ...path);
  //
	// }

  static async delta(value, currentValue, ...path) { // path is relative from state

    // const index = KarmaFieldsAlpha.Store.Buffer.get("history", "index") || 0;
    // const recordId = KarmaFieldsAlpha.Store.Buffer.get("recordId");

    const buffer = KarmaFieldsAlpha.Store.Buffer.get();
    const index = buffer.index || 0;


    if (!buffer) {

      console.error("Buffer not set");

    }

		if (index > 0) {

			if (currentValue === undefined) {

				currentValue = null;

			}

			let lastValue = await KarmaFieldsAlpha.Database.History.get(buffer.recordId, index - 1, ...path);

			if (lastValue === undefined) {

				await KarmaFieldsAlpha.Database.History.set(currentValue, buffer.recordId, index - 1, ...path);

			}

		}

    if (value === undefined) {

      value = null;

    }

		await KarmaFieldsAlpha.Database.History.set(value, buffer.recordId, index, ...path);

	}


}

// KarmaFieldsAlpha.History = class {
//
//
//   static async init() {
//
//     const index = await KarmaFieldsAlpha.Database.History.getCurrent();
//     const count = await KarmaFieldsAlpha.Database.History.count();
//
//     KarmaFieldsAlpha.Store.set(index, "history", "index");
//     KarmaFieldsAlpha.Store.set(count - 1, "history", "max");
//
//   }
//
//   static async save(id, name) {
//
//     let index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//     const lastId = KarmaFieldsAlpha.Store.get("history", "lastId");
//
//     if (lastId !== id) {
//
//       KarmaFieldsAlpha.Store.set(id, "history", "lastId");
//       KarmaFieldsAlpha.Store.set(index+1, "history", "index");
//       KarmaFieldsAlpha.Store.set(index+1, "history", "max");
//
//       await KarmaFieldsAlpha.Database.History.set("", index, "current");
//
//       await KarmaFieldsAlpha.Database.History.deleteFrom(index);
//
//       await KarmaFieldsAlpha.Database.History.add({
//         id: id,
//         name: name || id,
//         current: "1"
//       }, index+1);
//
//     }
//
//   }
//
//   static async undo() {
//
//     let index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//
//     if (index > 1) {
//
//       KarmaFieldsAlpha.Store.set(index-1, "history", "index");
//
//       await KarmaFieldsAlpha.Database.History.set("", index);
//
//       await KarmaFieldsAlpha.Database.History.set("1", index-1);
//
//       const state = await KarmaFieldsAlpha.Database.History.get(index-1, "state");
//
//       KarmaFieldsAlpha.Store.Buffer.merge(state, "state"); // must not update history!
//
//     }
//
//   }
//
//   static async redo() {
//
//     let index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//     let max = KarmaFieldsAlpha.Store.get("history", "max") || 0;
//
//     if (index < max) {
//
//       KarmaFieldsAlpha.Store.set(index+1, "history", "index");
//
//       await KarmaFieldsAlpha.Database.History.set("", index);
//
//       await KarmaFieldsAlpha.Database.History.set("1", index+1);
//
//       const state = await KarmaFieldsAlpha.Database.History.get(index+1, "state");
//
//       KarmaFieldsAlpha.Store.Buffer.merge(state, "state"); // must not update history!
//
//     }
//
//   }
//
//   static hasUndo() {
//
//     const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//
//     return new KarmaFieldsAlpha.Content(index > 1);
//
//   }
//
//   static hasRedo() {
//
//     const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//     const max = KarmaFieldsAlpha.Store.get("history", "max") || 0;
//
//     return new KarmaFieldsAlpha.Content(index < max);
//
//   }
//
//   static async update(value, ...path) { // path is relative from state
//
//     const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//
// 		if (index > 0) {
//
// 			let currentValue = KarmaFieldsAlpha.Store.State.get(...path);
//
//       if (currentValue === undefined && path[0] === "delta") {
//
//         currentValue = KarmaFieldsAlpha.Store.get("vars", ...path.slice(1)) || [];
//
//       }
//
// 			if (currentValue === undefined) {
//
// 				currentValue = null;
//
// 			}
//
// 			let lastValue = await KarmaFieldsAlpha.Database.History.get(index - 1, "state", ...path);
//
// 			if (lastValue === undefined) {
//
// 				await KarmaFieldsAlpha.Database.History.set(currentValue, index - 1, "state", ...path);
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
// 		await KarmaFieldsAlpha.Database.History.set(value, index, "state", ...path);
//
// 	}
//
//   static async delta(value, currentValue, ...path) { // path is relative from state
//
//     const index = KarmaFieldsAlpha.Store.get("history", "index") || 0;
//
// 		if (index > 0) {
//
// 			if (currentValue === undefined) {
//
// 				currentValue = null;
//
// 			}
//
// 			let lastValue = await KarmaFieldsAlpha.Database.History.get(index - 1, "state", ...path);
//
// 			if (lastValue === undefined) {
//
// 				await KarmaFieldsAlpha.Database.History.set(currentValue, index - 1, "state", ...path);
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
// 		await KarmaFieldsAlpha.Database.History.set(value, index, "state", ...path);
//
// 	}
//
//
// }
