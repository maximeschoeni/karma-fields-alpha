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
