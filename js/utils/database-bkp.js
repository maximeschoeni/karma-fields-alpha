KarmaFieldsAlpha.Database = class {

	static stores = {};

	constructor(storeName, keyPath) {

		this.keyPath = keyPath;
		this.storeName = storeName;

		this.constructor.stores[storeName] = keyPath;

	}

	async getDB() {

		return this.constructor.getDB();

	}

	async getValue(...path) {
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName);
		const objectStore = transaction.objectStore(this.storeName);
		const request = objectStore.get(path);

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				resolve(event.target.result && event.target.result.value);
			};
			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	}

	async get(...path) {
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName);
		const objectStore = transaction.objectStore(this.storeName);
		const request = objectStore.get(path);

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				resolve(event.target.result);
			};
			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	}

	async getAll() {
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName);
		const objectStore = transaction.objectStore(this.storeName);
		const request = objectStore.getAll();
		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				resolve(request.result);
			};
			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	}

	async remove(...path) { // -> get all edits
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName);
		const objectStore = transaction.objectStore(this.storeName);

		objectStore.delete(path);

		await new Promise((resolve, reject) => {
			transaction.oncomplete = event => {
				resolve();
			}
		});
	}

	async put(query) {
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName, "readwrite");
		const objectStore = transaction.objectStore(this.storeName);
		const request = objectStore.put(query);

		await new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				resolve();
			}
		});
	}

	async setValue(value, ...path) {

		const query = Object.fromEntries(path.map((value, index) => [this.keyPath[index], value]));

		await this.put({ ...query, value });

	}

	async clear() { // -> empty
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName, "readwrite");
		const objectStore = transaction.objectStore(this.storeName);
		objectStore.clear();
		await new Promise((resolve, reject) => {
			transaction.oncomplete = event => {
				resolve();
			}
		});
	}

	async delete(callback) { // -> empty
		return new Promise(async (resolve, reject) => {
			const db = await KarmaFieldsAlpha.Database.getDB();
			const transaction = db.transaction(this.storeName, "readwrite");
			const objectStore = transaction.objectStore(this.storeName);
			const cursor = objectStore.openCursor();

			cursor.onsuccess = (event) => {
				const cursor = event.target.result;
				if (cursor) {
					if (callback(cursor.value)) {
						cursor.delete();
					}
					cursor.continue();
				}
			}
			transaction.oncomplete = event => {
				resolve();
			}
		});
	}

	async count() {
		const db = await KarmaFieldsAlpha.Database.getDB();
		const transaction = db.transaction(this.storeName);
		const objectStore = transaction.objectStore(this.storeName);
		const request = objectStore.count();
		await new Promise((resolve, reject) => {
			transaction.onsuccess = event => {
				resolve(request.result);
			}
		});
	}



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

				// const general = db.createObjectStore("general");

				// const queries = db.createObjectStore("queries", { keyPath: ["type", "driver", "paramstring"] });
				// queries.createIndex("driver", "driver");

				// const vars = db.createObjectStore("vars", { keyPath: ["driver", "id", "key"] });
				// vars.createIndex("driver", "driver");
				// vars.createIndex("id", ["driver", "id"]);

				// const history = db.createObjectStore("history", { keyPath: ["session", "index", "context", "driver", "id", "key"] });
				// history.createIndex("index", ["session", "index"]);

				// const states = db.createObjectStore("states", { keyPath: ["session", "context", "driver", "id", "key"] });
				// states.createIndex("context", ["session", "context"]);
				// states.createIndex("driver", ["session", "context", "driver"]);
				// states.createIndex("id", ["session", "context", "driver", "id"]);

				for (let storeName in this.stores) {

					const keyPath = this.stores[storeName];
					db.createObjectStore(storeName, { keyPath });

				}

			}

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

	static clearOtherSessions() { // -> get all edits
		const session = KarmaFieldsAlpha.Session.getId();
		return this.getDB().then(db => new Promise((resolve, reject) => {
			const transaction = db.transaction("history", "readwrite");
			const objectStore = transaction.objectStore("history");
			const request = objectStore.openCursor();
			request.onsuccess = (event) => {
				const cursor = event.target.result;
				if (cursor) {
					if (cursor.value.session !== session) {
						cursor.delete();
					}
					cursor.continue();
				}
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

	static async getAll(context) {
		const session = KarmaFieldsAlpha.Session.getId();
		const db = await this.getDB();

		const transaction = db.transaction("states");
		const objectStore = transaction.objectStore("states");

		const index = objectStore.index("context");
		const request = index.getAll([session, context]);

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				resolve(request.result);
			};
		});
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



KarmaFieldsAlpha.Database.Fields = class extends KarmaFieldsAlpha.Database {

	async set(value, fieldId, key) {
		await this.put({ value, fieldId, key });
	}

	// async get(fieldId, key) {
	// 	const db = await KarmaFieldsAlpha.Database.getDB();
	// 	const transaction = db.transaction(this.storeName);
	// 	const objectStore = transaction.objectStore(this.storeName);
	// 	const request = objectStore.get([fieldId, key]);

	// 	return new Promise((resolve, reject) => {
	// 		request.onsuccess = (event) => {
	// 			resolve(event.target.result && event.target.result.value);
	// 		};
	// 		request.onerror = (event) => {
	// 			reject(event.target.error);
	// 		};
	// 	});
	// }

	// async getAll() {
	// 	const db = await KarmaFieldsAlpha.Database.getDB();
	// 	const transaction = db.transaction(this.storeName);
	// 	const objectStore = transaction.objectStore(this.storeName);
	// 	const request = objectStore.getAll();
	// 	return new Promise((resolve, reject) => {
	// 		request.onsuccess = (event) => {
	// 			resolve(request.result);
	// 		};
	// 		request.onerror = (event) => {
	// 			reject(event.target.error);
	// 		};
	// 	});
	// }

	// async remove(fieldId, key) { // -> get all edits
	// 	const db = await KarmaFieldsAlpha.Database.getDB();
	// 	const transaction = db.transaction(this.storeName);
	// 	const objectStore = transaction.objectStore(this.storeName);

	// 	objectStore.delete([fieldId, key]);

	// 	await new Promise((resolve, reject) => {
	// 		transaction.oncomplete = event => {
	// 			resolve();
	// 		}
	// 	});
	// }

	// async set(value, fieldId, key) {
	// 	const db = await KarmaFieldsAlpha.Database.getDB();
	// 	const transaction = db.transaction(this.storeName, "readwrite");
	// 	const objectStore = transaction.objectStore(this.storeName);
	// 	const request = objectStore.put({ value, fieldId, key });

	// 	await new Promise((resolve, reject) => {
	// 		request.onsuccess = (event) => {
	// 			resolve();
	// 		}
	// 	});
	// }

	// async clear() { // -> empty
	// 	const db = await KarmaFieldsAlpha.Database.getDB();
	// 	const transaction = db.transaction(this.storeName, "readwrite");
	// 	const objectStore = transaction.objectStore(this.storeName);
	// 	objectStore.clear();
	// 	await new Promise((resolve, reject) => {
	// 		transaction.oncomplete = event => {
	// 			resolve();
	// 		}
	// 	});
	// }

}

// KarmaFieldsAlpha.Database.Edits = class extends KarmaFieldsAlpha.Database {

// 	async set(value, driver, id, key) {
// 		await this.put({ value, driver, id, key });
// 	}

// }

// KarmaFieldsAlpha.Database.QueriesNEW = class extends KarmaFieldsAlpha.Database {

// 	async set(value, driver, paramstring, key) {
// 		await this.put({ value, driver, paramstring, key });
// 	}

// }

// KarmaFieldsAlpha.Database.fields = new KarmaFieldsAlpha.Database.Fields("fields", ["fieldId", "key"]);
// KarmaFieldsAlpha.Database.edits = new KarmaFieldsAlpha.Database.Edits("edits", ["driver", "id", "key"]);
// // KarmaFieldsAlpha.Database.queries = new KarmaFieldsAlpha.Database.QueriesNEW("queriesNEW", ["driver", "paramstring", "key"]);

// KarmaFieldsAlpha.Collection.queries = new KarmaFieldsAlpha.Collection.Queries();

// KarmaFieldsAlpha.Collection = class {

// 	constructor() {

// 		this.data = {};

// 	}

// 	get(...path) {

// 		return KarmaFieldsAlpha.DeepObject.get(this.data, ...path);

// 	}

// 	set(value, ...path) {

// 		KarmaFieldsAlpha.DeepObject.get(this.data, value, ...path);

// 	}

// 	remove(...path) {

// 		KarmaFieldsAlpha.DeepObject.get(this.data, ...path);

// 	}

// 	// *getAll(query = {}, object = this.data) {

// 	// 	// const depth = Object.keys(query).length;

// 	// 	const depth = Object.keys(query).filter(key => this.keyPath.includes(key)).length;

// 	// 	if (depth < this.keyPath.length) {

// 	// 		const key = this.keyPath[depth];

// 	// 		for (let value in object) {

// 	// 			yield* this.getAll({ ...query, [key]: value }, object[value]);

// 	// 		}

// 	// 	} else {

// 	// 		yield { ...query, value: object };

// 	// 	}

// 	// }

// 	*query(query = {}, object = this.data, depth = 0) {

// 		if (depth < this.keyPath.length) {

// 			const key = this.keyPath[depth];

// 			for (let value in object) {

// 				if (query[key] === undefined || query[key] === value) {

// 					yield* this.query({ ...query, [key]: value }, object[value], depth + 1);

// 				}

// 			}

// 		} else {

// 			yield { ...query, value: object };

// 		}

// 	}

// 	getAll() {

// 		return [...this.query()];

// 	}

// 	count(object = this.data, depth = 0) {

// 		const total = 0;

// 		if (depth < this.keyPath.length) {

// 			for (let value in object) {

// 				total += this.count(object[value], depth + 1);

// 			}

// 		} else {

// 			total++;

// 		}

// 		return total;
// 	}

// 	// *getAll(object = this.data, ...path) {

// 	// 	const depth = path.length;

// 	// 	if (depth < this.keyPath.length) {

// 	// 		const key = this.keyPath[depth];

// 	// 		for (let value in object) {

// 	// 			yield* this.getAll(object[value], ...path, key);

// 	// 		}

// 	// 	} else {

// 	// 		yield { ...results, value: object };

// 	// 	}

// 	// }

// }

// KarmaFieldsAlpha.Collection.Queries = class extends KarmaFieldsAlpha.Collection {

// 	getAll() {
// 		const items = [];
// 		for (let driver in this.data) {
// 			for (let paramstring in this.data[driver]) {
// 				const value = this.data[driver][paramstring];
// 				items.push({driver, paramstring, value});
// 			}
// 		}
// 		return items;
// 	}

// 	count() {
// 		const count = 0;
// 		for (let driver in this.data) {
// 			for (let paramstring in this.data[driver]) {
// 				count++;
// 			}
// 		}
// 		return count;
// 	}

// }
