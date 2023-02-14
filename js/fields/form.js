
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {

	constructor(resource) {
		super(resource);

		// const bufferPath = this.resource.bufferPath || ["data", this.resource.driver || this.resource.key || "nodriver"];

		if (!this.resource.driver) {
			console.error("no driver", this.resource);
		}

		this.buffer = new KarmaFieldsAlpha.Buffer("data", this.resource.driver);


		this.initialBuffer = new KarmaFieldsAlpha.Buffer("gateway", this.resource.driver);
		this.trashBuffer = new KarmaFieldsAlpha.Buffer("trash", this.resource.driver);
		// this.store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins);

		this.cache = new KarmaFieldsAlpha.Buffer("cache", this.resource.driver);


    // this.queryBuffer = new KarmaFieldsAlpha.Buffer("queries", this.resource.driver); // query cache indexed by ids

    // this.lazyBuffer = new KarmaFieldsAlpha.Buffer("lazy", this.resource.driver); // query cache indexed by ids


	}

	// async getInitial(...path) {
	//
	// 	const key = this.getKey();
	//
	// 	if (key) {
	//
	// 		path = [key, ...path];
	//
	// 	}
	//
	// 	let value = await this.store.getValue(...path);
	//
	// 	if (!value) {
	//
	// 		value = this.trashBuffer.get(...path);
	//
	// 	}
	//
	// 	return value;
	// }


	


	async send(data) {

		// const key = this.getKey();
		//
		// if (key) {
		//
		// 	data = {[key]: data};
		//
		// }

		if (!data) {
			data = this.buffer.get();
		}

		this.initialBuffer.merge(data); // -> needed for autosave

		for (let id in data) {

			await KarmaFieldsAlpha.Gateway.post(`update/${this.resource.driver}/${id}`, data[id]);

		}

		this.buffer.remove();
  }

	async isModified(...path) {

		const delta = this.buffer.get(...path);

		if (delta) {

			if (path.length) {

				const initialValue = await this.getInitial(...path);

				return KarmaFieldsAlpha.DeepObject.differ(delta, initialValue);

			} else {

			  return KarmaFieldsAlpha.DeepObject.differ(delta, {
          ...await this.trashBuffer.get(),
          ...await this.initialBuffer.get()
        });

			}

		}

		return false;
	}

	// async getValue(...path)) {
	//
	// 	return this.buffer.get(...path) || this.getInitial(...path);
	//
	// }

	async getValue(...path) {

		return this.buffer.get(...path) || await this.getInitial(...path);

	}

	async setValue(value, ...path) {

		const newValue = KarmaFieldsAlpha.Type.toArray(value);

		let currentValue = await this.getValue(...path);

		if (KarmaFieldsAlpha.DeepObject.differ(newValue, currentValue)) {

			this.buffer.change(newValue, currentValue, ...path);

		}

	}




	async request(subject, content = {}, ...path) {

		switch (subject) {

			case "state": {

				return {
					value: this.buffer.get(...path) || await this.getInitial(...path),
					modified: await this.isModified(...path)
				};

			}

			case "get": {

				// let value = this.buffer.get(...path);
				//
				// if (value) {
				//
				// 	return KarmaFieldsAlpha.Type.toArray(value);
				//
				// } else {
				//
				// 	// return super.request(subject, content, ...path); // -> extends group
				//
				// 	return this.getInitial(...path);
				//
				// }



				return this.buffer.get(...path) || this.getInitial(...path);
			}

			case "set": {

				// const newValue = KarmaFieldsAlpha.Type.toArray(content.data);
				//
				// let currentValue = this.buffer.get(...path) || await this.getInitial(...path);
				//
				// if (KarmaFieldsAlpha.DeepObject.differ(newValue, currentValue)) {
				//
				// 	if (content.autosave) {
				//
				// 		this.buffer.change(newValue, currentValue, ...path);
				//
				// 		const value = KarmaFieldsAlpha.Type.toArray(content.data);
				// 		const data = KarmaFieldsAlpha.DeepObject.create(value, ...path);
				//
				// 		return this.send(data); // -> data is an object of arrays
				//
				//
				// 	} else {
				//
				// 		this.buffer.change(newValue, currentValue, ...path);
				//
				// 	}
				//
				// }

				await this.setValue(content.data, ...path);

				if (content.autosave) {

					const value = KarmaFieldsAlpha.Type.toArray(content.data);
					const data = KarmaFieldsAlpha.DeepObject.create(value, ...path);

					await this.send(data);

				}



				break;
			}

			case "modified": {

				// const delta = this.buffer.get(...path);
				//
				// if (content.data) {
				//
				// 	return KarmaFieldsAlpha.DeepObject.differ(content.data, delta);
				//
				// } else if (delta) {
				//
				// 	// return super.request(subject, {data: delta}, ...path);
				//
				// 	const initialValue = await this.getInitial(...path);
				//
				// 	return KarmaFieldsAlpha.DeepObject.differ(delta, initialValue);
				//
				// }
				//
				// return false;

				return this.isModified(...path);
			}

			case "submit": {
				// const delta = this.buffer.get(...path);
				// await this.parent.request("send", {data: delta});


				// await this.send(delta);
				// this.initialBuffer.empty();
				await this.send();
				await this.parent.request("render");

				// this.buffer.remove();
				// await this.render();
				break;
			}

			case "path": {
				return [this.resource.driver, ...path];
			}


			default:
				return super.request(subject, content, ...path); // -> extends group

		}

	}







	// previous store:



  // static empty() {
  //   const buffer = new KarmaFieldsAlpha.Buffer("gateway");
  //   const cache = new KarmaFieldsAlpha.Buffer("cache");
  //   cache.remove();
  //   buffer.remove();
  // }

  empty() {
    this.cache.remove();
    this.initialBuffer.remove();
  }

  // write(value, id, key) {
	//
  //   const array = KarmaFieldsAlpha.Type.toArray(value);
	//
  //   this.initialBuffer.set(array, id, key);
	//
  //   if (!this.trashBuffer.has(id, key)) {
	//
  //     this.trashBuffer.set(array, id, key);
	//
  //   }
	//
  // }

  get(id) {

    let promise = this.cache.get("get", id);

    if (!promise) {

      promise = KarmaFieldsAlpha.Gateway.get("get/"+this.resource.driver+"/"+id).then(item => {

        if (item) {

          for (let key in item) {

            const value = KarmaFieldsAlpha.Type.toArray(item[key]);

            this.initialBuffer.set(value, id, key);

          }

        }

        return item;
      });

      this.cache.set(promise, "get", id);
    }

    return promise;
  }

  count(paramString) {

		if (typeof paramString === "object") {

			paramString = KarmaFieldsAlpha.Params.stringify(paramString);

		}

    let promise = this.cache.get("count", paramString);

    if (!promise) {

      promise = KarmaFieldsAlpha.Gateway.get("count/"+this.resource.driver, paramString);

      this.cache.set(promise, "count", paramString);
    }

    return promise;
  }

  // updateQuery() {

  //   const params = this.getParams();
  //   const paramString = KarmaFieldsAlpha.Params.stringify(params);

  //   if (this.paramString !== paramString) {



  //   }





  // }

  query(paramString) {

		if (typeof paramString === "object") {
      
			paramString = KarmaFieldsAlpha.Params.stringify(paramString);

		}

    let promise = this.cache.get("query", paramString);

    if (!promise) {

      let request = this.resource.driver;

      if (paramString) {
        request += "?"+paramString;
      }

      promise = KarmaFieldsAlpha.Gateway.get("query/"+request).then(results => {

        results = results.items || results || []; // -> compat

        for (let item of results) {

          const id = KarmaFieldsAlpha.Type.toString(item.id);

          for (let key in item) {

            const value = KarmaFieldsAlpha.Type.toArray(item[key]);

            this.initialBuffer.set(value, id, key);

          }

          this.initialBuffer.set(["0"], id, "trash"); // -> to be removed!


          // this.queryBuffer.set(promise, id, "query");

        }

        return results;

      });

      this.cache.set(promise, "query", paramString);

    }

    return promise;
  }


  // query2(params) {

  //   const paramString = KarmaFieldsAlpha.Params.stringify(params || {}) || "";    

	// 	return KarmaFieldsAlpha.Gateway.get(`query/${this.resource.driver}?${paramString}`).then(results => {

  //     results = results.items || results || []; // -> compat

  //     for (let item of results) {

  //       const id = KarmaFieldsAlpha.Type.toString(item.id);

  //       for (let key in item) {

  //         const value = KarmaFieldsAlpha.Type.toArray(item[key]);

  //         this.initialBuffer.set(value, id, key);

  //       }

  //       this.initialBuffer.set(["0"], id, "trash"); // -> to be removed!

  //     }

  //     return results;

  //   });

  // }



  // query2(params) {

  //   params = {page: 1, ppp: 10, ...this.resource.params, ...params};


	// 	return KarmaFieldsAlpha.Gateway.get(`query/${this.resource.driver}?${KarmaFieldsAlpha.Params.stringify(params)}`).then(results => {

  //     results = results.items || results || []; // -> compat

  //     for (let item of results) {

  //       const id = KarmaFieldsAlpha.Type.toString(item.id);

  //       for (let key in item) {

  //         const value = KarmaFieldsAlpha.Type.toArray(item[key]);

  //         this.initialBuffer.set(value, id, key);

  //       }

  //       this.initialBuffer.set(["0"], id, "trash"); // -> to be removed!

  //     }

  //     return results;

  //   });

  // }


	// deprecated ?
  // queryIds(paramString) {
	//
  //   let promise = this.cache.get("ids", paramString);
	//
  //   if (!promise) {
  //     promise = this.query(paramString).then(results => results.map(item => item.id.toString()));
  //     this.cache.set(promise, "ids", paramString);
  //   }
	//
  //   return promise;
  // }


  join(join, paramString, offset = 0, max = 9999) {

		if (typeof paramString === "object") {

			paramString = KarmaFieldsAlpha.Params.stringify(paramString);

		}

    let promise = this.cache.get("join", paramString, join, offset);

    if (!promise) {

      promise = this.query(paramString).then(results => {

        const ids = results.slice(offset, offset+max).map(item => item.id);

        return KarmaFieldsAlpha.Gateway.get("join/"+join+"?ids="+ids.join(","));

      }).then(relations => {

        const data = {};

        for (let relation of relations) {

          const id = relation.id.toString();
          const key = relation.key;

          data[id] ||= {};
          data[id][key] ||= [];
          data[id][key].push(relation.value);

        }

        this.initialBuffer.merge(data);

        return relations;

      });

      this.cache.set(promise, "join", paramString, join, offset);

    }

    return promise;
  }


  queryRelations(relation, ids) {

    const idString = ids.join(",");

		let promise = this.cache.get("relations", relation, idString);

    if (!promise) {
      
      promise = KarmaFieldsAlpha.Gateway.get(`relations/${this.resource.driver}/${relation}?ids=${idString}`).then(relations => {

        const data = {};

        for (let relation of relations) {

          const id = relation.id.toString();
          const key = relation.key.toString();

          data[id] ||= {};
          data[id][key] ||= [];
          data[id][key].push(relation.value);

        }

        this.initialBuffer.merge(data);

        return relations;
      });
      
      this.cache.set(promise, "relations", relation, idString);

      // this.queryBuffer.set(promise, id, "relations", relation);

    }

    return promise;
  }

  

  async getInitialBKP(...path) {

		const key = this.getKey();

		if (key) {

			path = [key, ...path];

		}

    let value = this.initialBuffer.get(...path);

    if (!value) {

      const queries = this.cache.get("query") || {};

      for (let paramString in queries) {

        const results = await this.query(paramString);

				value = this.initialBuffer.get(...path);

				if (!value && this.resource.joins) {

					for (let join of this.resource.joins) {

						const max = 25;
						let i = 0;

						while (i < results.length) {

							await this.join(join, paramString, i, max);

							i += max;

							value = this.initialBuffer.get(...path);

							if (value) break;

						}

						if (value) break;

					}

				}

				if (value) break;

      }

    }

		if (!value) {

			value = this.trashBuffer.get(...path);

		}

    return value;
  }




  // async getInitial2(id, key) {

  //   let value = this.initialBuffer.get(id, key);
  //   const idAlias = this.getAlias("id");

  //   let params = {page: 1, ppp: 100, ...this.resource.params};

  //   let results = await this.query(params);

  //   while(results.length && !results.some(item => item[idAlias] === id)) {

  //     params.page++;

  //     results = await this.query(paramString);

  //   }

  //   value = this.initialBuffer.get(...path);

  //   if (!value && results.length && this.resource.joins) {

  //     const ids = results.map(item => item[idAlias]);

  //     for (let relation of this.resource.relations) {

  //       await this.queryRelations(relation, ids);

  //       value = this.initialBuffer.get(...path);

  //       if (value) break;

  //     }

  //   }

	// 	if (!value) {

	// 		value = this.trashBuffer.get(...path); // -> ?

	// 	}

  //   return value;
  // }



  // async getInitial(id, key) {

	// 	let value = this.initialBuffer.get(id, key);

  //   if (value) {

  //     return value;

  //   }

  //   const results = await this.query({id: id});

  //   if (results.length) {

  //     value = this.initialBuffer.get(id, key);

  //     if (value) {

  //       return value;
  
  //     }

  //     if (this.resource.relations) {

  //       for (let relation of this.resource.relations) {
  
  //         await this.queryRelations(relation, [id]);
  
  //         value = this.initialBuffer.get(id, key);
  
  //         if (value) {
  
  //           return value;
      
  //         }
  
  //       }
  
  //     }

  //   }

  //   return [];

	// 	// if (!value) {

	// 	// 	value = this.trashBuffer.get(...path);

	// 	// }

  //   // return value;
  // }




  // async getInitial(id, key) {

  //   if (!this.initialBuffer.has(id)) {

  //     await this.query({id: id});

  //   }

	// 	let value = this.initialBuffer.get(id, key);

  //   if (value) {

  //     return value;

  //   } else if (this.initialBuffer.has(id) && this.resource.relations) {

  //     for (let relation of this.resource.relations) {
  
  //       await this.queryRelations(relation, [id]);

  //       value = this.initialBuffer.get(id, key);

  //       if (value) {

  //         return value;
    
  //       }

  //     }

  //   }

  //   return [];

  // }

  async getInitial(id, key) {

    let value = this.initialBuffer.get(id, key);

    if (value) {

      return value;

    }

    if (!this.initialBuffer.has(id)) {

      const query = await this.query({id: id});
      
      value = this.initialBuffer.get(id, key);

      if (value) {

        return value;

      } else if (this.resource.relations) {

        for (let relation of this.resource.relations) {
    
          const relationquery = await this.queryRelations(relation, [id]);

          console.log(relationquery);

          value = this.initialBuffer.get(id, key);

          if (value) {

            return value;
      
          }

        }

      }

    }

		

    return [];

  }


  async getInitial(id, key) {

    let value = this.initialBuffer.get(id, key);

    if (value) {

      return value;

    }

    if (!this.initialBuffer.has(id)) {

      const query = await this.query({id: id});
      
       if (this.resource.relations) {

        for (let relation of this.resource.relations) {
    
          await this.queryRelations(relation, [id]);

        }

      }

      value = this.initialBuffer.get(id, key);

      if (value) {

        return value;

      }

    }

		

    return [];

  }
  
};
