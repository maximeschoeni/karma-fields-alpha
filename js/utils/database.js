KarmaFieldsAlpha.Database = class {

  static async getDB() {

    const dbName = "karma101";

    if (!this.db) {

      this.db = await this.openDB(dbName, 1);

    }

    return this.db;
  }

  // static async close() {
  //
  //   const db = await this.getDB();
  //
  //   db.close();
  //
  // }
  //
  //
  // static deleteDB(dbName) {
  //
  //   return new Promise((resolve, reject) => {
  //
  //     const request = indexedDB.deleteDatabase(dbName);
  //
  //     request.onsuccess = (event) => {
  //       resolve();
  //     };
  //
  //   });
  //
  // }


  static openDB(dbName, dbVersion) {

    return new Promise((resolve, reject) => {

      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event) => {

        const db = event.target.result;

        const general = db.createObjectStore("general");

        const queries = db.createObjectStore("queries", {keyPath: ["type", "driver", "paramstring"]});
        queries.createIndex("driver", "driver");

        const vars = db.createObjectStore("vars", {keyPath: ["driver", "id", "key"]});
        vars.createIndex("driver", "driver");
        vars.createIndex("id", ["driver", "id"]);

        const history = db.createObjectStore("history", {keyPath: ["session", "index", "context", "driver", "id", "key"]});
        history.createIndex("index", ["session", "index"]);

        const states = db.createObjectStore("states", {keyPath: ["session", "context", "driver", "id", "key"]});
        states.createIndex("context", ["session", "context"]);
        states.createIndex("driver", ["session", "context", "driver"]);
        states.createIndex("id", ["session", "context", "driver", "id"]);

      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject("Failed to open the database");
      };

    });
  }


}


KarmaFieldsAlpha.Database.General = class extends KarmaFieldsAlpha.Database {

  static get(key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("general");
      const objectStore = transaction.objectStore("general");
      const request = objectStore.get(key);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static set(value, key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("general", "readwrite");
      const objectStore = transaction.objectStore("general");
      objectStore.put(value, key);
      transaction.oncomplete = (event) => {
        resolve();
      }
    }));
  }

}


KarmaFieldsAlpha.Database.Vars = class extends KarmaFieldsAlpha.Database {

  static get(driver, id, key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars");
      const objectStore = transaction.objectStore("vars");
      const request = objectStore.get([driver, id, key]);
      request.onsuccess = (event) => {
        resolve(event.target.result && event.target.result.data);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static select(driver, id) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars");
      const objectStore = transaction.objectStore("vars");
      if (id) {
        const index = objectStore.index("id");
        const request = index.getAll([driver, id]);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else if (driver) {
        const index = objectStore.index("driver");
        const request = index.getAll(driver);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else {
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      }
    }));
  }

  static set(data, driver, id, key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");
      objectStore.put({driver, id, key, data});
      transaction.oncomplete = (event) => {
        resolve();
      }
    }));
  }
  static insert(items, driver) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");
      for (let item of items) {
        objectStore.put({driver, ...item});
      }
      transaction.oncomplete = (event) => {
        resolve();
      }
    }));
  }

  static remove(driver, id, key) { // -> get all edits
    console.log("remove vars", driver, id, key);
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");
      if (id) {
        objectStore.delete([driver, id, key]);
      } else if (id) {
        const index = objectStore.index("id");
        const request = index.openCursor([driver, id]);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else if (driver) {
        const index = objectStore.index("driver");
        const request = index.openCursor(driver);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else {
        objectStore.clear();
      }
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

  static clear() { // -> get all edits
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");
      objectStore.clear();
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

}

KarmaFieldsAlpha.Database.Queries = class extends KarmaFieldsAlpha.Database {

  static get(type, driver, paramstring) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries");
      const objectStore = transaction.objectStore("queries");
      const request = objectStore.get([type, driver, paramstring]);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static set(data, type, driver, paramstring) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries", "readwrite");
      const objectStore = transaction.objectStore("queries");

      objectStore.put({type, driver, paramstring, ...data});
      transaction.oncomplete = (event) => {
        resolve();
      }
    }));
  }

  static select(params) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries");
      const objectStore = transaction.objectStore("queries");
      if (params.open !== undefined) {
        const index = objectStore.index("open");
        const request = index.getAll(params.open);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else if (params.driver) {
        const index = objectStore.index("driver");
        const request = index.getAll(params.driver);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else {
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      }
    }));
  }

  static insert(data, type, driver, paramstring) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries", "readwrite");
      const objectStore = transaction.objectStore("queries");
      for (let item of data) {
        objectStore.put({type, driver, paramstring, ...data});
      }
      transaction.oncomplete = (event) => {
        resolve();
      }
    }));
  }

  static remove(params = {}) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries", "readwrite");
      const objectStore = transaction.objectStore("queries");
      if (params.paramstring !== undefined && params.driver) {
        objectStore.delete([driver, paramstring]);
      } else if (params.driver) {
        const index = objectStore.index("driver");
        const request = index.openCursor(params.driver);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else if (params.open) {
        const index = objectStore.index("open");
        const request = index.openCursor(params.open);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else {
        objectStore.clear();
      }
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

  static clear() {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries", "readwrite");
      const objectStore = transaction.objectStore("queries");
      objectStore.clear();
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

}


KarmaFieldsAlpha.Database.History = class extends KarmaFieldsAlpha.Database {

  static get(index, context, driver, id, key) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get([session, index, context, driver, id, key]);
      request.onsuccess = (event) => {
        resolve(event.target.result && event.target.result.data);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static set(data, index, context, driver, id, key) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.put({data, session, index, context, driver, id, key});
      request.onsuccess = (event) => {
        resolve();
      }
    }));
  }

  static select(index, context) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history");
      const objectStore = transaction.objectStore("history");
      if (context) {
        const objectIndex = objectStore.index("context");
        const request = objectIndex.getAll([session, index, context]);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else if (index || index === 0) {
        const objectIndex = objectStore.index("index");
        const request = objectIndex.getAll([session, index]);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else {
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      }
    }));
  }

  static insert(data, index, context, driver, id, key) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      for (let item of data) {
        objectStore.put({session, index, context, driver, ...data});
      }
      transaction.oncomplete = (event) => {
        resolve();
      }
    }));
  }

  static remove(index, context) { // -> get all edits
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      if (context) {
        const objectIndex = objectStore.index("context");
        const request = objectIndex.openCursor([session, index, context]);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else if (index) {
        const objectIndex = objectStore.index("index");
        const request = objectIndex.openCursor([session, index]);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else {
        objectStore.clear();
      }
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

  static clear() { // -> get all edits
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      objectStore.clear();
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

  // static backup(newData, backupData, index, context, driver, id, key) {
  //   const session = KarmaFieldsAlpha.Session.getId();
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction(["history", "states"], "readwrite");
  //     const statesStore = transaction.objectStore("states");
  //     const historyStore = transaction.objectStore("history");
  //
  //     statesStore.put({data: newData, session, context, driver, id, key});
  //     historyStore.put({data: newData, session, index, context, driver, id, key});
  //
  //     if (index > 0) {
  //
  //       const request = historyStore.get([session, index-1, context, driver, id, key]);
  //
  //       request.onsuccess = (event) => {
  //         if (!event.target.result) {
  //           historyStore.add({data: backupData, session, index: index-1, context, driver, id, key});
  //         }
  //       };
  //
  //     }
  //
  //     transaction.oncomplete = (event) => {
  //       resolve();
  //     }
  //
  //   }));
  // }

  // static revert(index) {
  //   const session = KarmaFieldsAlpha.Session.getId();
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction(["history", "states"], "readwrite");
  //     const statesStore = transaction.objectStore("states");
  //     const historyStore = transaction.objectStore("history");
  //
  //     const index = historyStore.index("index");
  //     const request = index.getAll([session, index]);
  //
  //     request.onsuccess = (event) => {
  //       if (event.target.result) {
  //         for (let item of event.target.result) {
  //           statesStore.put(item);
  //         }
  //       }
  //     };
  //     transaction.oncomplete = (event) => {
  //       resolve();
  //     }
  //   }));
  // }

}

KarmaFieldsAlpha.Database.States = class extends KarmaFieldsAlpha.Database {

  static get(context, driver, id, key) {
    // if (context === undefined || driver === undefined || id === undefined || key === undefined) {
    //   console.trace();
    //   console.log(context, driver, id, key);
    // }
    // console.log(context, driver, id, key);
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("states");
      const objectStore = transaction.objectStore("states");
      // if (key) {
        const request = objectStore.get([session, context, driver, id, key]);
        request.onsuccess = (event) => {
          resolve(event.target.result && event.target.result.data);
        };
      // }
      // else if (id) {
      //   const index = objectStore.index("id");
      //   const request = index.getAll([session, context, driver, id]);
      //   request.onsuccess = (event) => {
      //     const object = {};
      //     for (let item of request.result) {
      //       object[item.key] = item.data;
      //     }
      //     resolve(object);
      //   };
      // } else if (driver) {
      //   const index = objectStore.index("driver");
      //   const request = index.getAll([session, context, driver]);
      //   request.onsuccess = (event) => {
      //     const object = {};
      //     for (let item of request.result) {
      //       if (!object[item.id]) {
      //         object[item.id] = {};
      //       }
      //       object[item.id][item.key] = item.data;
      //     }
      //     resolve(object);
      //   };
      // } else if (context) {
      //   const index = objectStore.index("context");
      //   const request = index.getAll([session, context]);
      //   request.onsuccess = (event) => {
      //     const object = {};
      //     for (let item of request.result) {
      //       if (!object[item.driver]) {
      //         object[item.driver] = {};
      //       }
      //       if (!object[item.driver][item.id]) {
      //         object[item.driver][item.id] = {};
      //       }
      //       object[item.driver][item.id][item.key] = item.data;
      //     }
      //     resolve(object);
      //   };
      // }
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static select(context, driver, id) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("states");
      const objectStore = transaction.objectStore("states");
      if (id) {
        const index = objectStore.index("id");
        const request = index.getAll([session, context, driver, id]);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else if (driver) {
        const index = objectStore.index("driver");
        const request = index.getAll([session, context, driver]);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else if (context) {
        const index = objectStore.index("context");
        const request = index.getAll([session, context]);
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      } else {
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      }
    }));
  }



  // static getEdits(context = "external") { // -> get all edits
  //   console.error("deprecated");
  //   const session = KarmaFieldsAlpha.Session.getId();
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("states");
  //     const objectStore = transaction.objectStore("states");
  //     const index = objectStore.index("context");
  //     const request = index.getAll([session, context]);
  //     request.onsuccess = (event) => {
  //       resolve(event.target.result);
  //     };
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   }));
  // }

  // static removeEdits(context = "external") { // -> get all edits
  //   const session = KarmaFieldsAlpha.Session.getId();
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("states", "readwrite");
  //     const objectStore = transaction.objectStore("states");
  //     const index = objectStore.index("context");
  //     const request = index.openCursor([session, context]);
  //     request.onsuccess = (event) => {
  //       const cursor = event.target.result;
  //       if (cursor) {
  //         cursor.delete();
  //         cursor.continue();
  //       } else {
  //         resolve();
  //       }
  //     }
  //   }));
  // }

  static remove(context, driver, id, key) { // -> get all edits
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("states", "readwrite");
      const objectStore = transaction.objectStore("states");
      if (key) {
        objectStore.delete([session, context, driver, id, key]);
      } else if (id) {
        const index = objectStore.index("id");
        const request = index.openCursor([session, context, driver, id]);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else if (driver) {
        const index = objectStore.index("driver");
        const request = index.openCursor([session, context, driver]);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      } else if (context) {
        const index = objectStore.index("context");
        const request = index.openCursor([session, context]);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        }
      }
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

  static set(data, context, driver, id, key) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("states", "readwrite");
      const objectStore = transaction.objectStore("states");
      const request = objectStore.put({data, session, context, driver, id, key});
      request.onsuccess = (event) => {
        resolve();
      }
    }));
  }

  static insert(data, context, driver, id) {
    const session = KarmaFieldsAlpha.Session.getId();
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("states", "readwrite");
      const objectStore = transaction.objectStore("states");
      for (let item of data) {
        objectStore.put({session, context, driver, id, ...item});
      }
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }

  static clear() { // -> get all edits
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("states", "readwrite");
      const objectStore = transaction.objectStore("states");
      objectStore.clear();
      transaction.oncomplete = event => {
        resolve();
      }
    }));
  }



  /**
   * items = [{data: [array], id: "string", key: "string"}, {...}]
   */
  // static import(items, context, driver) {
  //   const session = KarmaFieldsAlpha.Session.getId();
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("states", "readwrite");
  //     const objectStore = transaction.objectStore("states");
  //     for (let item of items) {
  //       objectStore.put({session, context, driver, ...item});
  //     }
  //     transaction.oncomplete = (event) => {
  //       resolve();
  //     }
  //   }));
  // }

}
