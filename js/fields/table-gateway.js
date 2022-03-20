
KarmaFieldsAlpha.fields.tableGateway = class extends KarmaFieldsAlpha.fields.gateway {

	async getQueriedIds() {
    const results = await this.getRemoteTable();
    return (results.items || results || []).map(row => row.id);
  }

	async getParamString() {

    const params = new URLSearchParams(KarmaFieldsAlpha.Nav.params);

    if (!params.has("page")) {
      params.set("page", "1");
    }

    if (!params.has("ppp")) {
      const ppp = await this.parent.fetchValue(null, "ppp");
			params.set("ppp", ppp.toString());
    }

    if (!params.has("orderby")) {
      // const orderby = this.getDefaultOrderby();
      // if (orderby) {
      //   params.set("orderby", orderby);
      // }
			const orderby = await this.parent.fetchValue(null, "orderby");
			params.set("orderby", orderby.toString());
    }

    if (!params.has("order")) {
      // const order = this.getDefaultOrder(params.get("orderby"));
      // if (order) {
      //   params.set("order", order);
      // }

			const order = await this.parent.fetchValue(null, "order");
			params.set("order", order.toString());
    }

    params.sort();

    return params.toString();
  }


  async queryTable() {
    const paramString = await this.getParamString();
    const driver = this.resource.driver;
    const results = await KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString);


    for (let item of results.items || results || []) { // compat

			const id = item.id.toString();

      for (let key in item) {

				const value = [item[key]];

				// if (!this.buffer.equal(value, id, key)) {
				// 	this.delta.set(value, id, key);
				// }

        this.buffer.set(value, id, key);
      }

      this.buffer.set(["0"], item.id.toString(), "trash");
    }
    return results;
  }

  async getRemoteTable() {
    if (!this.tablePromise) {
      this.tablePromise = this.queryTable();
    }
    return this.tablePromise;
  }




  async queryRelations() {

    const driver = this.resource.driver;
    const ids = await this.getQueriedIds();
    // const relations = await KarmaFieldsAlpha.Gateway.getRelations(driver, ids);
		const relations = await KarmaFieldsAlpha.Gateway.get("relations/"+driver+"?ids="+ids.join(","));

    if (relations.length) {
      const groups = relations.reduce((group, item) => {
        if (!item.id) {
          console.error("item does not have an id");
        }
        if (!group[item.id]) {
          group[item.id] = {};
        }
        for (let key in item) {
          if (key !== "id") {
            if (!group[item.id][key]) {
              group[item.id][key] = [];
            }
            group[item.id][key].push(item[key]);
          }
        }
        return group;
      }, {});

      for (let id of ids) {
        for (let key of keys) {
          this.buffer.set(groups[id] && groups[id][key] || [], id.toString(), key);
        }
      }
    }

  }


  async getRemoteRelations() {
    if (!this.relationPromise) {
      this.relationPromise = this.queryRelations();
    }
    return this.relationPromise;
  }

  async getRemoteValue(id, key) {
    await this.getRemoteTable();
		await this.getRemoteRelations();

    let value = this.buffer.get(id, key);

    if (!value && key === "trash") {
      value = ["1"];
    }

    return value || [];
  }

	clearQuery() {
    this.tablePromise = null;
    this.relationPromise = null;
  }

	async getRemoteCount() {
    if (!this.countPromise) {
			this.countPromise = this.getParamString().then(paramString => KarmaFieldsAlpha.Gateway.get("count/"+this.resource.driver+"?"+paramString));
    }
    return this.countPromise;
  }

	async getCount() {
    const count = await this.getRemoteCount();
		return Number(count || 0);
  }

	clearCount() {
		this.countPromise = null;
	}



	// async add(rows) {
	//
  //   const ids = await KarmaFieldsAlpha.Gateway.add(this.resource.driver, {num: rows.length});
	//
  //   for (let row of rows) {
	//
	//
	//
  //     for (let field of this.grid.getRow(id).getDescendants()) {
	//
  //       const path = field.getPath();
	//
  //       this.buffer.set([], ...path);
  //       // this.setDeltaValue(await field.getDefault(), ...path);
  //       this.grid.writeHistory([], ...path);
	//
  //     }
	//
  //     // this.writeHistory(["1"], id, "trash");
  //     this.grid.writeHistory(["1"], id, "trash");
  //     this.gateway.buffer.set(["1"], id, "trash");
	//
  //   }
	//
  //   KarmaFieldsAlpha.History.backup();
  //   KarmaFieldsAlpha.History.id = null;
	//
  //   for (let id of ids) {
	//
  //     // await this.write(id);
	//
  //     for (let field of this.grid.getRow(id).getDescendants()) {
	//
  //       const value = await field.getDefault();
  //       await field.setValue(null, value);
	//
  //     }
	//
  //     await this.grid.setValue(null, ["0"], id, "trash");
	//
  //   }
	//
  //   return ids;
  // }
	// // async add(num) {
	// //
  // //   const ids = await KarmaFieldsAlpha.Gateway.add(this.resource.driver, {num: num || 1});
	// //
  // //   for (let id of ids) {
	// //
  // //     for (let field of this.grid.getRow(id).getDescendants()) {
	// //
  // //       const path = field.getPath();
	// //
  // //       this.buffer.set([], ...path);
  // //       // this.setDeltaValue(await field.getDefault(), ...path);
  // //       this.grid.writeHistory([], ...path);
	// //
  // //     }
	// //
  // //     // this.writeHistory(["1"], id, "trash");
  // //     this.grid.writeHistory(["1"], id, "trash");
  // //     this.gateway.buffer.set(["1"], id, "trash");
	// //
  // //   }
	// //
  // //   KarmaFieldsAlpha.History.backup();
  // //   KarmaFieldsAlpha.History.id = null;
	// //
  // //   for (let id of ids) {
	// //
  // //     // await this.write(id);
	// //
  // //     for (let field of this.grid.getRow(id).getDescendants()) {
	// //
  // //       const value = await field.getDefault();
  // //       await field.setValue(null, value);
	// //
  // //     }
	// //
  // //     await this.grid.setValue(null, ["0"], id, "trash");
	// //
  // //   }
	// //
  // //   return ids;
  // // }
	//
  // async remove() {
  //   let ids = await this.getSelectedIds();
	//
  //   if (ids.length) {
	//
  //     for (let id of ids) {
	//
  //       this.grid.writeHistory(["0"], id, "trash");
	//
  //       for (let field of this.grid.getRow(id).getDescendants()) {
	//
  //         await field.write();
	//
  //       }
	//
  //     }
	//
  //     KarmaFieldsAlpha.History.backup();
  //     KarmaFieldsAlpha.History.id = null;
	//
  //     for (let id of ids) {
	//
  //       await this.grid.setValue(null, ["1"], id, "trash");
	//
  //       for (let field of this.table.getRow(id).getDescendants()) {
	//
  //         // this.writeHistory(null, ...field.getPath());
  //         await field.removeValue();
	//
  //       }
	//
  //     }
	//
  //   }
  // }
	//
  // async duplicate() {
  //   let ids = await this.getSelectedIds();
	//
  //   if (ids.length) {
  //     const cloneIds = await this.add(ids.length);
	//
  //     for (let i = 0; i < ids.length; i++) {
  //       let id = ids[i];
  //       let cloneId = cloneIds[i];
	//
  //       for (let field of this.table.getRow(id).getDescendants()) {
	//
  //         const path = field.getPath().slice(1);
  //         const value = await field.fetchValue();
  //         this.grid.setValue(null, value, cloneId, ...path);
	//
  //       }
	//
  //       const contentIds = await this.grid.getIds();
	//
  //       let index = contentIds.indexOf(ids[ids.length-1]);
  //       this.grid.setOrder(cloneId, index+1);
	//
  //     }
	//
  //   }
  // }
	//



}
