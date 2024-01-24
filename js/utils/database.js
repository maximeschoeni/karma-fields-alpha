KarmaFieldsAlpha.Database = class {



  // static async getData(driver, ...ids) {
  //
  //   if (!this.db) {
  //
  //     this.db = await this.openDB("karma", "1");
  //
  //   }
  //
  //   return this.getResult("table", driver, ids);
  //
  // }

  static async getDB() {

    const dbName = "karma92";

    if (!this.db) {

      const databases = await indexedDB.databases();

      for (let database of databases) {

        if (database.name !== dbName) {

          await this.closeDB(database.name);

        }

      }

      this.db = await this.openDB("karma92", 1);

    }

    return this.db;
  }

  static closeDB(dbName) {

    return new Promise((resolve, reject) => {

      const request = indexedDB.deleteDatabase(dbName);

      request.onsuccess = (event) => {
        resolve();
      };

    });

  }


  static openDB(dbName, dbVersion) {

    return new Promise((resolve, reject) => {

      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event) => {

        const db = event.target.result;


//         console.log("onupgradeneeded");
// debugger;
//
//
//         db.deleteObjectStore("history");
//         db.deleteObjectStore("records");
//         db.deleteObjectStore("queries");
//         db.deleteObjectStore("vars");


        // const store = db.createObjectStore("vars");
        // store.createIndex("driver", "driver");

        const history = db.createObjectStore("history", {keyPath: ["index", "id"]});
        // history.createIndex("index", "index");
        history.createIndex("id", "id");


        db.createObjectStore("records", {keyPath: "recordId"});

        const queries = db.createObjectStore("queries", {keyPath: ["type", "driver", "paramstring"]});
        queries.createIndex("driver", "driver");

        const data = db.createObjectStore("vars");



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



// KarmaFieldsAlpha.Database.Vars = class extends KarmaFieldsAlpha.Database {
//
//
//   static get(driver, id, key) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("vars");
//       const objectStore = transaction.objectStore("vars");
//       const request = objectStore.get(`${driver}-${id}`);
//
//       request.onsuccess = (event) => {
//         const data = event.target.result;
//         if (key) {
//           resolve(data[key]);
//         } else {
//           resolve(data);
//         }
//       };
//
//       request.onerror = (event) => {
//         reject(event.target.error);
//       };
//     }));
//   }
//
//   static set(data, driver, id, key) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("vars", "readwrite");
//       const objectStore = transaction.objectStore("vars");
//
//       const uid = `${driver}-${id}`;
//       const request = objectStore.get(uid);
//
//       request.onsuccess = (event) => {
//         let value = event.target.result;
//         if (key) {
//           value = {driver, id, ...value, [key]: data};
//         } else {
//           value = {driver, id, ...value, ...data};
//         }
//         objectStore.put(value, uid);
//         resolve();
//       }
//
//     }));
//   }
//
//   static delete(driver, id, key) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("vars", "readwrite");
//       const objectStore = transaction.objectStore("vars");
//
//       const storeIndex = objectStore.index("driver");
//       const request = storeIndex.openCursor(driver);
//       request.onsuccess = (event) => {
//         const cursor = event.target.result;
//         if (cursor) {
//           if (id === undefined || id === cursor.value.id) {
//             cursor.delete();
//           }
//           cursor.continue();
//         } else {
//           resolve();
//         }
//       };
//
//     }));
//
//   }
//
//   static async getItems(driver, ...ids) {
//     const result = {};
//
//     for (let id of ids) {
//
//       result[id] = await this.get(driver, id);
//
//     }
//
//     return result;
//
//   }
//
//
//
//
//
// }



KarmaFieldsAlpha.Database.History = class extends KarmaFieldsAlpha.Database {

  static get(id, index, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history");
      const objectStore = transaction.objectStore("history");
      // const request = objectStore.get(index);

      const request = objectStore.get([index, id]);

      // const index = objectStore.index("id");
      // const request = storeIndex.openCursor(id);

      request.onsuccess = (event) => {
        const data = event.target.result;
        const value = KarmaFieldsAlpha.DeepObject.get(data, ...path);
        resolve(value);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static set(data, id, index, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      // const request = objectStore.get(index);
      const request = objectStore.get([index, id]);

      request.onsuccess = (event) => {
        const value = event.target.result || {id, index};
        KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
        const updateRequest = objectStore.put(value);

        updateRequest.onsuccess = (event) => {
          resolve();
        }
      }

    }));
  }

  static backup(data, id, index, ...path) { // like set but only if value does not exist
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get([index, id]);

      request.onsuccess = (event) => {
        const value = event.target.result || {id, index};
        if (KarmaFieldsAlpha.DeepObject.get(value, ...path) === undefined) {
          KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
          const updateRequest = objectStore.put(value);
          updateRequest.onsuccess = (event) => {
            resolve();
          }
        } else {
          resolve();
        }
      }

    }));
  }

  // static assign(data, index, ...path) {
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("history", "readwrite");
  //     const objectStore = transaction.objectStore("history");
  //     const request = objectStore.get(index);
  //
  //     request.onsuccess = (event) => {
  //       const value = event.target.result || {index};
  //       KarmaFieldsAlpha.DeepObject.assign(value, data, ...path);
  //       objectStore.put(value, index);
  //       resolve();
  //     }
  //
  //   }));
  // }

  static add(data, id, index) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.add({id, index, ...data});
      request.onsuccess = (event) => {
        resolve();
      }
    }));
  }

  static put(data, id, index) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.put({id, index, ...data});
      request.onsuccess = (event) => {
        resolve();
      }
    }));
  }

  static delete(id, index) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.delete([index, id]);
      request.onsuccess = (event) => {
        resolve();
      };
    }));
  }

  static deleteBefore(timestamp) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const index = objectStore.index("id");

      const range = IDBKeyRange.upperBound(timestamp, true);
      const request = index.openCursor(range, "prev");

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }

      };
    }));
  }

  // static delta(newData, data, index, ...path) {
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("history", "readwrite");
  //     const objectStore = transaction.objectStore("history");
  //     let request = objectStore.get(index);
  //
  //     request.onsuccess = (event) => {
  //       const value = event.target.result || {};
  //       KarmaFieldsAlpha.DeepObject.set(value, newData, ...path);
  //       objectStore.put(value, index);
  //
  //       request = objectStore.get(index-1);
  //       request.onsuccess = (event) => {
  //         const value = event.target.result || {};
  //         if (!KarmaFieldsAlpha.DeepObject.has(value, ...path)) {
  //           KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
  //           objectStore.put(value, index-1);
  //         }
  //         resolve();
  //       };
  //       request.onerror = (event) => {
  //         reject(event.target.error);
  //       };
  //     };
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   }));
  // }

  // static count() {
  //
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("history");
  //     const objectStore = transaction.objectStore("history");
  //     const request = objectStore.count();
  //
  //     request.onsuccess = (event) => {
  //       resolve(event.target.result);
  //     };
  //
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   }));
  // }
  //
  // static deleteFrom(index) {
  //
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("history", "readwrite");
  //     const objectStore = transaction.objectStore("history");
  //     const range = IDBKeyRange.lowerBound(index, true);
  //     const request = objectStore.openCursor(range);
  //
  //     request.onsuccess = (event) => {
  //       const cursor = event.target.result;
  //       if (cursor) {
  //         cursor.delete();
  //         cursor.continue();
  //       } else {
  //         resolve();
  //       }
  //     };
  //
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   }));
  // }

  // static getCurrent(...path) {
  //
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("history"); //, "readwrite");
  //     const objectStore = transaction.objectStore("history");
  //     const storeIndex = objectStore.index("current");
  //     // const range = IDBKeyRange.only(true);
  //     // const request = storeIndex.getKey("1");
  //     const request = storeIndex.openCursor("1");
  //
  //     request.onsuccess = (event) => {
  //       const cursor = event.target.result;
  //       if (cursor) {
  //         const value = KarmaFieldsAlpha.DeepObject.get(cursor.value, ...path);
  //         resolve(value);
  //       } else {
  //         resolve();
  //       }
  //     };
  //
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   }));
  // }

  static getCurrent(...path) {

    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history"); //, "readwrite");
      const objectStore = transaction.objectStore("history");
      const storeIndex = objectStore.index("current");
      // const range = IDBKeyRange.only(true);
      const request = storeIndex.getKey("1");
      // const request = storeIndex.openCursor("1");

      request.onsuccess = (event) => {
        resolve(event.target.result);
        // const cursor = event.target.result;
        // if (cursor) {
        //   const value = KarmaFieldsAlpha.DeepObject.get(cursor.value, ...path);
        //   resolve(value);
        // } else {
        //   resolve();
        // }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }


  // static setCurrent(boolean, index) {
  //
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("history"); //, "readwrite");
  //     const objectStore = transaction.objectStore("history");
  //     const storeIndex = objectStore.index("current");
  //     const request = storeIndex.get(true);
  //
  //     request.onsuccess = (event) => {
  //       const value = event.target.result;
  //       resolve(value);
  //     };
  //
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   });
  // }

}


// KarmaFieldsAlpha.Database.Options = class extends KarmaFieldsAlpha.Database {
//
//   static get(key, ...path) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("options");
//       const objectStore = transaction.objectStore("options");
//       const request = objectStore.get(key);
//
//       request.onsuccess = (event) => {
//         const value = event.target.result;
//         const data = KarmaFieldsAlpha.DeepObject.get(value, ...path);
//         resolve(data);
//       };
//
//       request.onerror = (event) => {
//         reject(event.target.error);
//       };
//     }));
//   }
//
//   static set(data, key, ...path) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("options", "readwrite");
//       const objectStore = transaction.objectStore("options");
//       const request = objectStore.get(key);
//       request.onsuccess = (event) => {
//         const value = event.target.result || {};
//         if (data === null) {
//           KarmaFieldsAlpha.DeepObject.remove(value, ...path);
//         } else {
//           KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
//         }
//         objectStore.put(value, key);
//         resolve();
//       }
//     }));
//   }
//
//   static assign(data, key, ...path) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("options", "readwrite");
//       const objectStore = transaction.objectStore("options");
//       const request = objectStore.get(key);
//       request.onsuccess = (event) => {
//         const value = event.target.result || {};
//         KarmaFieldsAlpha.DeepObject.assign(value, data, ...path);
//         objectStore.put(value, key);
//         resolve();
//       }
//     }));
//   }
//
//   static remove(key, ...path) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("options", "readwrite");
//       const objectStore = transaction.objectStore("options");
//       const request = objectStore.get(key);
//       request.onsuccess = (event) => {
//         const value = event.target.result || {};
//         KarmaFieldsAlpha.DeepObject.remove(value, ...path);
//         objectStore.put(value, key);
//         resolve();
//       }
//     }));
//   }
//
//   static delete(key) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("options", "readwrite");
//       const objectStore = transaction.objectStore("options");
//       const request = objectStore.get(key);
//       request.onsuccess = (event) => {
//         objectStore.delete(key);
//         resolve();
//       };
//     }));
//   }
//
// }


KarmaFieldsAlpha.Database.Records = class extends KarmaFieldsAlpha.Database {

  static get(id, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records");
      const objectStore = transaction.objectStore("records");
      const request = objectStore.get(id);

      request.onsuccess = (event) => {
        const value = event.target.result;
        const data = KarmaFieldsAlpha.DeepObject.get(value, ...path);
        resolve(data);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static set(data, id, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");
      const request = objectStore.get(id);
      request.onsuccess = (event) => {
        const value = event.target.result || {};
        // if (data === null) {
        //   KarmaFieldsAlpha.DeepObject.remove(value, ...path);
        // } else {
          KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
        // }
        const updateRequest = objectStore.put(value);
        updateRequest.onsuccess = (event) => {
          resolve();
        }
      }
    }));
  }

  static assign(data, id, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");
      const request = objectStore.get(id);
      request.onsuccess = (event) => {
        const value = event.target.result || {};
        KarmaFieldsAlpha.DeepObject.assign(value, data, ...path);
        objectStore.put(value);
        resolve();
      }
    }));
  }

  static remove(id, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");
      const request = objectStore.get(id);
      request.onsuccess = (event) => {
        const value = event.target.result || {};
        KarmaFieldsAlpha.DeepObject.remove(value, ...path);
        objectStore.put(value);
        resolve();
      }
    }));
  }

  static delete(id) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");
      const request = objectStore.get(id);
      request.onsuccess = (event) => {
        objectStore.delete(id);
        resolve();
      };
    }));
  }

  static deleteBefore(timestamp) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");
      const range = IDBKeyRange.upperBound(timestamp, true);
      const request = objectStore.openCursor(range, "prev");

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }

      };
    }));
  }

  static add(data) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");
      const request = objectStore.add(data);
      request.onsuccess = (event) => {
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
        const result = event.target.result;
        resolve(result && result.data);
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
      const request = objectStore.put({data, type, driver, paramstring});
      request.onsuccess = (event) => {
        resolve();
      }
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  // static remove(type, driver, paramstring) {
  //   return this.getDB().then(db => new Promise((resolve, reject) => {
  //     const transaction = db.transaction("queries", "readwrite");
  //     const objectStore = transaction.objectStore("queries");
  //     const request = objectStore.remove([type, driver, paramstring]);
  //     request.onsuccess = (event) => {
  //       resolve();
  //     }
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   }));
  // }

  static remove(driver) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("queries", "readwrite");
      const objectStore = transaction.objectStore("queries");
      const driverIndex = objectStore.index("driver");
      const request = driverIndex.openCursor(driver);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      }
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }




}



KarmaFieldsAlpha.Database.Vars = class extends KarmaFieldsAlpha.Database {

  static get(driver, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars");
      const objectStore = transaction.objectStore("vars");
      const request = objectStore.get(driver);
      request.onsuccess = (event) => {
        const data = event.target.result;
        const value = KarmaFieldsAlpha.DeepObject.get(data, ...path);
        resolve(value);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static set(data, driver, id, key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");
      const request = objectStore.get(driver);

      request.onsuccess = (event) => {
        const value = event.target.result || {};
        if (key) {
          KarmaFieldsAlpha.DeepObject.set(value, data, id, key);
        } else if (id) {
          KarmaFieldsAlpha.DeepObject.assign(value, data, id);
        } else {
          KarmaFieldsAlpha.DeepObject.merge(value, data);
        }
        const updateRequest = objectStore.put(value, driver);
        updateRequest.onsuccess = (event) => {
          resolve();
        }
      }

    }));
  }

  static remove(driver) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");
      const request = objectStore.delete(driver);
      request.onsuccess = (event) => {
        resolve();
      }
    }));
  }


}
