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

    if (!this.db) {

      this.db = await this.openDB("karma67", 1);

    }

    return this.db;
  }


  static openDB(dbName, dbVersion) {

    return new Promise((resolve, reject) => {

      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event) => {

        const db = event.target.result;


        // const store = db.createObjectStore("vars");
        // store.createIndex("driver", "driver");

        const history = db.createObjectStore("history");
        history.createIndex("current", "current");


        db.createObjectStore("options");



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




  // constructor(dbName, dbVersion, tableNames) {
  //   this.dbName = dbName;
  //   this.dbVersion = dbVersion;
  //   this.tableNames = tableNames;
  //   this.db = null;
  //   this.openDB();
  // }


  // openDB() {
  //   const request = indexedDB.open(this.dbName, this.dbVersion);
  //
  //   request.onupgradeneeded = (event) => {
  //     this.db = event.target.result;
  //     this.createTables();
  //   };
  //
  //   request.onsuccess = (event) => {
  //     this.db = event.target.result;
  //   };
  //
  //   request.onerror = (event) => {
  //     console.error("Failed to open the database:", event.target.error);
  //   };
  // }

  // createTables() {
  //   this.tableNames.forEach((tableName) => {
  //     if (!this.db.objectStoreNames.contains(tableName)) {
  //       this.db.createObjectStore(tableName, { keyPath: 'id' });
  //     }
  //   });
  // }

  // static getValue(tableName, driver, id, key) {
  //   return new Promise((resolve, reject) => {
  //     const transaction = this.db.transaction(tableName);
  //     const objectStore = transaction.objectStore(tableName);
  //     const storeIndex = objectStore.index(driver);
  //     const request = storeIndex.get(id);
  //
  //     request.onsuccess = (event) => {
  //       const data = event.target.result;
  //       if (key) {
  //         resolve(data[key]);
  //       } else {
  //         resolve(data);
  //       }
  //     };
  //
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   });
  // }
  //
  // set(data, tableName, driver, id, key) {
  //   return new Promise((resolve, reject) => {
  //     const transaction = this.db.transaction(tableName, 'readwrite');
  //     const objectStore = transaction.objectStore(tableName);
  //     const storeIndex = objectStore.index(driver);
  //
  //     storeIndex.openCursor(id).onsuccess = (event) => {
  //       let row = event.target.result;
  //       if (row) {
  //         if (key) {
  //           row.value[key] = data;
  //         } else {
  //           row.value = {...cursor.value, ...data};
  //         }
  //         row.update(cursor.value);
  //       } else {
  //         if (key) {
  //           row = {driver, id, [key]: data};
  //         } else {
  //           row = {driver, id, ...data};
  //         }
  //         objectStore.add(row);
  //       }
  //       resolve();
  //     };
  //   })
  // }
  //
  // delete(tableName, driver, id, key) {
  //   return new Promise((resolve, reject) => {
  //     const transaction = this.db.transaction(tableName, 'readwrite');
  //     const objectStore = transaction.objectStore(tableName);
  //     const storeIndex = objectStore.index(driver);
  //
  //     if (id) {
  //       storeIndex.openCursor(id).onsuccess = (event) => {
  //         const row = event.target.result;
  //         if (row) {
  //           if (key) {
  //             delete row.value[key];
  //             row.update(row.value);
  //           } else {
  //             row.delete();
  //           }
  //           row.continue();
  //         } else {
  //           resolve();
  //         }
  //       };
  //     } else {
  //       storeIndex.openCursor().onsuccess = (event) => {
  //         const row = event.target.result;
  //         if (row) {
  //           row.delete();
  //           row.continue();
  //         } else {
  //           resolve();
  //         }
  //       };
  //     }
  //   });
  //
  // }
  //
  // static getResult(tableName, driver, ids) {
  //   const result = {};
  //
  //   if (ids.length === 0) {
  //     return result;
  //   }
  //
  //   return new Promise((resolve, reject) => {
  //     const transaction = this.db.transaction(tableName);
  //     const objectStore = transaction.objectStore(tableName);
  //     const storeIndex = objectStore.index(driver);
  //     const request = storeIndex.openCursor();
  //
  //     request.onsuccess = (event) => {
  //       const cursor = event.target.result;
  //       if (cursor) {
  //         const id = cursor.value.id;
  //
  //         if (ids.includes(id)) {
  //           result[id] = cursor.value;
  //         }
  //
  //         cursor.continue();
  //       } else {
  //         resolve(result);
  //       }
  //     };
  //
  //     request.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //   });
  // }
}


// KarmaFieldsAlpha.Data = class extends KarmaFieldsAlpha.Database {
//
//
//   static get(driver, id, key) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("data");
//       const objectStore = transaction.objectStore("data");
//       // const storeIndex = objectStore.index(driver);
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
//       const transaction = db.transaction("data", "readwrite");
//       const objectStore = transaction.objectStore("data");
//       // const storeIndex = objectStore.index("driver, id");
//       // const range = IDBKeyRange.only([driver, id]);
//       const request = objectStore.get(`${driver}-${id}`)
//       request.onsuccess = (event) => {
//         let row = event.target.result;
//         if (row) {
//           if (key) {
//             row[key] = data;
//           } else {
//             row = {...row, ...data};
//           }
//           objectStore.put(row);
//         } else {
//           if (key) {
//             row = {driverid: `${driver}-${id}`, id, [key]: data};
//           } else {
//             row = {driverid: `${driver}-${id}`, id, ...data};
//           }
//           objectStore.add(row);
//         }
//         resolve();
//       };
//     }));
//   }
//
//   static delete(driver, id, key) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("data", "readwrite");
//       const objectStore = transaction.objectStore("data");
//
//       if (id) {
//         const storeIndex = objectStore.index("driver, id");
//         const range = IDBKeyRange.only([driver, id]);
//         storeIndex.openCursor(range).onsuccess = (event) => {
//           const row = event.target.result;
//           if (row) {
//             if (key) {
//               delete row.value[key];
//               row.update(row.value);
//             } else {
//               row.delete();
//             }
//             row.continue();
//           } else {
//             resolve();
//           }
//         };
//       } else {
//         const storeIndex = objectStore.index("driver");
//         const range = IDBKeyRange.only(driver);
//         storeIndex.openCursor(range).onsuccess = (event) => {
//           const row = event.target.result;
//           if (row) {
//             row.delete();
//             row.continue();
//           } else {
//             resolve();
//           }
//         };
//       }
//     }));
//
//   }
//
//   // static get(driver, ids) {
//   //   const result = {};
//   //
//   //   if (ids.length === 0) {
//   //     return result;
//   //   }
//   //
//   //   return this.getDB().then(db => new Promise((resolve, reject) => {
//   //     const transaction = db.transaction("data");
//   //     const objectStore = transaction.objectStore("data");
//   //
//   //     const storeIndex = objectStore.index("driver");
//   //     const range = IDBKeyRange.only(driver);
//   //     const request = storeIndex.openCursor(range);
//   //
//   //     request.onsuccess = (event) => {
//   //       const cursor = event.target.result;
//   //       if (cursor) {
//   //         const id = cursor.value.id;
//   //
//   //         if (ids.includes(id)) {
//   //           result[id] = cursor.value;
//   //         }
//   //
//   //         cursor.continue();
//   //       } else {
//   //         resolve(result);
//   //       }
//   //     };
//   //
//   //     request.onerror = (event) => {
//   //       reject(event.target.error);
//   //     };
//   //   }));
//
//     // return new Promise((resolve, reject) => {
//     //   const transaction = this.db.transaction(tableName);
//     //   const objectStore = transaction.objectStore(tableName);
//     //   const storeIndex = objectStore.index(driver);
//     //   const request = storeIndex.openCursor();
//     //
//     //   request.onsuccess = (event) => {
//     //     const cursor = event.target.result;
//     //     if (cursor) {
//     //       const id = cursor.value.id;
//     //
//     //       if (ids.includes(id)) {
//     //         result[id] = cursor.value;
//     //       }
//     //
//     //       cursor.continue();
//     //     } else {
//     //       resolve(result);
//     //     }
//     //   };
//     //
//     //   request.onerror = (event) => {
//     //     reject(event.target.error);
//     //   };
//     // });
//   // }
// }
//




KarmaFieldsAlpha.Database.Vars = class extends KarmaFieldsAlpha.Database {


  static get(driver, id, key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars");
      const objectStore = transaction.objectStore("vars");
      const request = objectStore.get(`${driver}-${id}`);

      request.onsuccess = (event) => {
        const data = event.target.result;
        if (key) {
          resolve(data[key]);
        } else {
          resolve(data);
        }
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

      // if (id !== undefined) {
        const uid = `${driver}-${id}`;
        const request = objectStore.get(uid);

        request.onsuccess = (event) => {
          let value = event.target.result;
          if (key) {
            value = {driver, id, ...value, [key]: data};
          } else {
            value = {driver, id, ...value, ...data};
          }
          objectStore.put(value, uid);
          resolve();
        }

      // } else {
      //
      //   const storeIndex = objectStore.index("driver");
      //   const request = storeIndex.openCursor(IDBKeyRange.only(driver));
      //   request.onsuccess = (event) => {
      //     const cursor = event.target.result;
      //     if (cursor) {
      //       const id = cursor.value.id;
      //       if (data[id]) {
      //         objectStore
      //
      //       }
      //
      //     }
      //
      //   }
      // }



      // const storeIndex = objectStore.index("driverid");
      // const range = IDBKeyRange.only([driver, id]);
      // const request = objectStore.openCursor(range);
      // // const request = objectStore.get(`${driver}-${id}`)
      // request.onsuccess = (event) => {
      //   const cursor = event.target.result;
      //   let row;
      //   if (cursor) {
      //     row = cursor.value;
      //     if (key) {
      //       row[key] = data;
      //     } else {
      //       row = {...row, ...data};
      //     }
      //     cursor.update(row);
      //   } else {
      //     if (key) {
      //       row = {driver, id, [key]: data};
      //     } else {
      //       row = {driver, id, ...data};
      //     }
      //     objectStore.add(row, `${driver}-${id}`);
      //   }
      //   resolve();
      // };
    }));
  }

  static delete(driver, id, key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("vars", "readwrite");
      const objectStore = transaction.objectStore("vars");

      const storeIndex = objectStore.index("driver");
      const request = storeIndex.openCursor(driver);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (id === undefined || id === cursor.value.id) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };




      // if (id) {
      //   const storeIndex = objectStore.index("driver, id");
      //   const range = IDBKeyRange.only([driver, id]);
      //   storeIndex.openCursor(range).onsuccess = (event) => {
      //     const row = event.target.result;
      //     if (row) {
      //       if (key) {
      //         delete row.value[key];
      //         row.update(row.value);
      //       } else {
      //         row.delete();
      //       }
      //       row.continue();
      //     } else {
      //       resolve();
      //     }
      //   };
      // } else {
      //   const storeIndex = objectStore.index("driver");
      //   const range = IDBKeyRange.only(driver);
      //   storeIndex.openCursor(range).onsuccess = (event) => {
      //     const row = event.target.result;
      //     if (row) {
      //       row.delete();
      //       row.continue();
      //     } else {
      //       resolve();
      //     }
      //   };
      // }
    }));

  }

  static async getItems(driver, ...ids) {
    const result = {};

    for (let id of ids) {

      result[id] = await this.get(driver, id);

    }

    return result;

    // return this.getDB().then(db => new Promise((resolve, reject) => {
    //   const transaction = db.transaction("data");
    //   const objectStore = transaction.objectStore("data");
    //   const storeIndex = objectStore.index("driver");
    //   const request = storeIndex.openCursor(driver);
    //
    //   let id = ids.shift();
    //   let uid = `${driver}-${id}`;
    //
    //   request.onsuccess = (event) => {
    //     const cursor = event.target.result;
    //
    //     if (cursor) {
    //       if (cursor.primaryKey === uid) {
    //         result[id] = cursor.value;
    //         id = ids.shift();
    //         uid = `${driver}-${id}`;
    //       }
    //       cursor.continuePrimaryKey(driver, uid);
    //     } else {
    //       resolve(result);
    //     }
    //   };
    //
    //   request.onerror = (event) => {
    //     reject(event.target.error);
    //   };
    // }));
  }





}



// KarmaFieldsAlpha.Database.Queries = class extends KarmaFieldsAlpha.Database {
//
//   static get(driver, paramstring) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("queries");
//       const objectStore = transaction.objectStore("queries");
//       const request = objectStore.get(`${driver}?${paramstring}`);
//
//       request.onsuccess = (event) => {
//         const data = event.target.result;
//         resolve(data);
//       };
//
//       request.onerror = (event) => {
//         reject(event.target.error);
//       };
//     }));
//   }
//
//   static set(data, driver, paramstring) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("queries", "readwrite");
//       const objectStore = transaction.objectStore("queries");
//       const uid = `${driver}-${paramstring}`;
//       const request = objectStore.get(uid);
//
//       request.onsuccess = (event) => {
//         let value = event.target.result;
//         value = {driver, paramstring, ...value, [paramstring]: data};
//         objectStore.put(value, uid);
//       }
//
//
//     }));
//   }
//
//   static delete(driver) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("queries", "readwrite");
//       const objectStore = transaction.objectStore("queries");
//       const storeIndex = objectStore.index("driver");
//       const request = storeIndex.openCursor(driver);
//       request.onsuccess = (event) => {
//         const cursor = event.target.result;
//         if (cursor) {
//           cursor.delete();
//           cursor.continue();
//         } else {
//           resolve();
//         }
//       };
//     }));
//
//   }
//
//   static clear() {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("queries", "readwrite");
//       const objectStore = transaction.objectStore("queries");
//       const request = objectStore.clear();
//       request.onsuccess = (event) => {
//         resolve();
//       };
//     }));
//   }
//
//   static getItems(driver) {
//     return this.getDB().then(db => new Promise((resolve, reject) => {
//       const transaction = db.transaction("queries", "readwrite");
//       const objectStore = transaction.objectStore("queries");
//       const storeIndex = objectStore.index("driver");
//       const request = storeIndex.getAll(driver);
//       request.onsuccess = (event) => {
//         const values = event.target.result;
//         resolve(values);
//       };
//     }));
//   }
//
//
//
//
//
// }


KarmaFieldsAlpha.Database.History = class extends KarmaFieldsAlpha.Database {

  static get(index, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get(index);

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

  static set(data, index, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get(index);

      request.onsuccess = (event) => {
        const value = event.target.result || {index};
        KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
        objectStore.put(value, index);
        resolve();
      }

    }));
  }

  static assign(data, index, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get(index);

      request.onsuccess = (event) => {
        const value = event.target.result || {index};
        KarmaFieldsAlpha.DeepObject.assign(value, data, ...path);
        objectStore.put(value, index);
        resolve();
      }

    }));
  }

  static add(data, index) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.add(data, index);

      request.onsuccess = (event) => {
        resolve();
      }

    }));
  }

  static delete(index, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get(index);

      request.onsuccess = (event) => {
        const value = event.target.result;
        if (value) {
          if (path.length) {
            KarmaFieldsAlpha.DeepObject.remove(value, ...path);
            objectStore.put(value, index);
          } else {
            objectStore.delete(index);
          }
        }
        resolve();
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

  static count() {

    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.count();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

  static deleteFrom(index) {

    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("history", "readwrite");
      const objectStore = transaction.objectStore("history");
      const range = IDBKeyRange.lowerBound(index, true);
      const request = objectStore.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    }));
  }

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


KarmaFieldsAlpha.Database.Options = class extends KarmaFieldsAlpha.Database {

  static get(key, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("options");
      const objectStore = transaction.objectStore("options");
      const request = objectStore.get(key);

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

  static set(data, key, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("options", "readwrite");
      const objectStore = transaction.objectStore("options");
      const request = objectStore.get(key);
      request.onsuccess = (event) => {
        const value = event.target.result || {};
        if (data === null) {
          KarmaFieldsAlpha.DeepObject.remove(value, ...path);
        } else {
          KarmaFieldsAlpha.DeepObject.set(value, data, ...path);
        }
        objectStore.put(value, key);
        resolve();
      }
    }));
  }

  static assign(data, key, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("options", "readwrite");
      const objectStore = transaction.objectStore("options");
      const request = objectStore.get(key);
      request.onsuccess = (event) => {
        const value = event.target.result || {};
        KarmaFieldsAlpha.DeepObject.assign(value, data, ...path);
        objectStore.put(value, key);
        resolve();
      }
    }));
  }

  static remove(key, ...path) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("options", "readwrite");
      const objectStore = transaction.objectStore("options");
      const request = objectStore.get(key);
      request.onsuccess = (event) => {
        const value = event.target.result || {};
        KarmaFieldsAlpha.DeepObject.remove(value, ...path);
        objectStore.put(value, key);
        resolve();
      }
    }));
  }

  static delete(key) {
    return this.getDB().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction("options", "readwrite");
      const objectStore = transaction.objectStore("options");
      const request = objectStore.get(key);
      request.onsuccess = (event) => {
        objectStore.delete(key);
        resolve();
      };
    }));
  }

}
