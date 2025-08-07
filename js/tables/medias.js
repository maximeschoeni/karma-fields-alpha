

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.table {

	// constructor(resource, id, parent) {

	// 	super(resource, id, parent);

	// 	this.defaultResource = {
	// 		driver: "medias",
	// 		// params: {
	// 		// 	parent: "0"
	// 		// },
	// 		header: {
	// 			type: "header",
	// 			title: "Medias", // deprec
	// 			children: [
	// 				{
	// 					type: "title",
	// 					title: "Medias"
	// 				},
	// 				"count",
	// 				"pagination",
	// 				"close"
	// 			]
	// 		},
	// 		body: {
	// 			type: "gallery",
	// 			draganddrop: true,
	// 			modal: {
	// 				body: {
	// 					type: "single",
	// 					children: [
	// 						"description",
	// 						{
	// 							type: "input",
	// 							key: "post_title",
	// 							label: "Name",
	// 							visible: ["=", "folder", ["get", "filetype"]]
	// 						},
	// 						{
	// 							type: "textarea",
	// 							key: "post_excerpt",
	// 							label: "Caption",
	// 							height: '3rem',
	// 							visible: ["=", "file", ["get", "filetype"]]
	// 						}
	// 					]
	// 				}
	// 			},
	// 		},
	// 		footer: {
	// 			type: "footer",
	// 			children: [
	// 				"submit",
	// 				"upload",
	// 				"add",
	// 				"delete",
	// 				"separator",
	// 				"insert"
	// 			]
	// 		}
	// 	}

	// }

	getResource(...path) {

		let resource = KarmaFieldsAlpha.Collection.get(this.resource, ...path);

		if (resource === undefined) {

			resource = KarmaFieldsAlpha.Collection.get(this.defaultResource, ...path);

		}

		return resource;

	}

  getDriver() {

    return this.resource.driver || "medias";

  }

  edit() {

  }



	add(length = 1, params = {}, index) {

		if (index === undefined) {

			const body = this.getChild("body");
			index = body && body.getFolderIndex() || 0;

		}


		super.add(length, { ...params, filetype: "folder" }, index );

	}



	upload(...files) {


		const filters = this.getFilters();
		const defaults = this.getDefaults();

		const values = {};

		const params = { ...filters, ...defaults };

		for (let key in params) {

			const value = params[key] || "";

			values[key] = value.split(",");

		}

		const body = this.getChild("body");
		const index = body && body.getFileIndex() || 0;
		const driver = this.getDriver();
		const paramstring = this.getParamstring();

		const query = KarmaFieldsAlpha.Store.getQuery(driver, paramstring);

		const ids = [...query.ids];
		ids.splice(index, 0, ...files.map(file => ({ ...values, file })));
		const count = query.count + files.length;

		KarmaFieldsAlpha.Store.setQuery({ ...query, ids, count }, driver, paramstring);

		if (body) {

			body.selectAt(index, length);

		}



		// const driver = this.getDriver();

		// const tokens = [];

		// for (let file of files) {

		// 	const token = KarmaFieldsAlpha.server.upload(file, driver);

		// 	tokens.push(token);

		// }

		// const body = this.getChild("body");

		// if (body) {

		// 	body.addFiles(tokens);

		// }

	}

	// uploadAt(index, files) {

	// 	const driver = this.getDriver();
	// 	const params = this.getParams();
	// 	const paramstring = this.getParamstring();

	// 	if (paramstring === undefined) {

	// 		console.error("uploading files but paramstring is not set");

	// 	}

	// 	if (params === undefined) {

	// 		console.error("uploading files but params is not set");

	// 	}

	// 	if (driver === undefined) {

	// 		console.error("uploading files but driver is not set");

	// 	}

	// 	// if (index === undefined) {

	// 	// 	const body = this.getChild("body");

	// 	// 	index = body.getNewFileIndex();

	// 	// }

	// 	// this.save("upload", "Upload");

	// 	KarmaFieldsAlpha.server.upload(this.uid, driver, paramstring, index, files, params);

	// }

	// async upload(files, index) {

	//   const driver = this.getDriver();

	//   const params = this.getParams() || {};
	//   const paramstring = this.getParamstring() || "";

	//   const body = this.getChild("body");

	//   let defaults = body.exportDefaults();

	//   while (defaults.loading) {

	//     await this.render();
	//     defaults = body.exportDefaults();

	//   }

	//   if (index === undefined) {

	//     if (body) {

	//       index = body.getNewFileIndex();

	//     } else {

	//       index = 0;

	//     }

	//   }

	//   if (body) {

	//     await body.select(index, files.length);

	//   }

	//   await this.save("insert", "Insert");

	//   const {page, ppp, order, orderby, ...filters} = params;

	//   const gen = KarmaFieldsAlpha.server.upload(driver, paramstring, index, files, {...filters, ...defaults.toObject()});

	//   for await (let token of gen) {

	//     await this.render();

	//   }

	// }

	// async move(index, length, destId) {

	//   const driver = this.getDriver();
	//   // let params = this.queryParams();
	//   //
	//   // while (params.loading) {
	//   //
	//   //   await this.render();
	//   //   params = this.queryParams();
	//   //
	//   // }

	//   const params = this.getParams() || {};
	//   const paramstring = this.getParamstring() || "";

	//   // remove ids
	//   const originalIds = this.getIds().toArray();

	//   // const destId = originalIds[destIndex];
	//   const movedIds = originalIds.slice(index, index+length);
	//   const newIds = originalIds.filter(id => !movedIds.includes(id));

	//   KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "ids", driver);

	//   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, newIds, "ids", driver, paramstring);


	//   await this.render();

	//   // clear cache
	//   await KarmaFieldsAlpha.Database.Queries.remove(driver);
	//   await KarmaFieldsAlpha.Database.States.remove("queries", driver);


	//   await KarmaFieldsAlpha.Database.States.set(newIds, "queries", driver, paramstring, "ids");
	//   await KarmaFieldsAlpha.History.write(newIds, originalIds, "queries", driver, paramstring, "ids");

	//   const parentKey = KarmaFieldsAlpha.Driver.getAlias(driver, "parent");

	//   // update vars

	//   for (let id of movedIds) {

	//     // await this.setWild(destId, id, "parent"); // just for update history

	//     const originId = params.parent || "";

	//     await KarmaFieldsAlpha.Database.Vars.set([destId], driver, id, parentKey);
	//     await KarmaFieldsAlpha.Database.States.set([destId], "external", driver, id, parentKey);
	//     await KarmaFieldsAlpha.History.write([destId], [originId], "external", driver, id, parentKey);

	//   }

	//   // save changes



	//   const obj = Object.fromEntries(movedIds.map(id => [id, {[parentKey]: [destId]}]));
	//   await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, obj);



	// }
	// move(index, length, delta) {

	// 	const driver = this.getDriver();
	// 	const params = this.getParams();
	// 	const paramstring = this.getParamstring();

	// 	if (!driver || paramstring === undefined) {

	// 		console.error("adding item but driver or paramstring is not set");

	// 	}

	// 	const destParamstring = KarmaFieldsAlpha.Params.stringify({ ...params, ...delta });

	// 	KarmaFieldsAlpha.server.move(this.uid, driver, paramstring, index, length, delta, destParamstring);




	//   // const driver = this.getDriver();
	//   // // let params = this.queryParams();
	//   // //
	//   // // while (params.loading) {
	//   // //
	//   // //   await this.render();
	//   // //   params = this.queryParams();
	//   // //
	//   // // }

	//   // const params = this.getParams() || {};
	//   // const paramstring = this.getParamstring() || "";

	//   // // remove ids
	//   // const originalIds = this.getIds().toArray();

	//   // // const destId = originalIds[destIndex];
	//   // const movedIds = originalIds.slice(index, index+length);
	//   // const newIds = originalIds.filter(id => !movedIds.includes(id));

	//   // KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "ids", driver);

	//   // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, newIds, "ids", driver, paramstring);


	//   // await this.render();

	//   // // clear cache
	//   // await KarmaFieldsAlpha.Database.Queries.remove(driver);
	//   // await KarmaFieldsAlpha.Database.States.remove("queries", driver);


	//   // await KarmaFieldsAlpha.Database.States.set(newIds, "queries", driver, paramstring, "ids");
	//   // await KarmaFieldsAlpha.History.write(newIds, originalIds, "queries", driver, paramstring, "ids");

	//   // const parentKey = KarmaFieldsAlpha.Driver.getAlias(driver, "parent");

	//   // // update vars

	//   // for (let id of movedIds) {

	//   //   // await this.setWild(destId, id, "parent"); // just for update history

	//   //   const originId = params.parent || "";

	//   //   await KarmaFieldsAlpha.Database.Vars.set([destId], driver, id, parentKey);
	//   //   await KarmaFieldsAlpha.Database.States.set([destId], "external", driver, id, parentKey);
	//   //   await KarmaFieldsAlpha.History.write([destId], [originId], "external", driver, id, parentKey);

	//   // }

	//   // // save changes



	//   // const obj = Object.fromEntries(movedIds.map(id => [id, {[parentKey]: [destId]}]));
	//   // await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, obj);



	// }

  // getModal() {
  //
  //   return this.createChild({
  //     type: "modal",
  //     body: {
  //       type: "single",
  //       children: ["description"]
  //     },
  //     ...this.resource.modal
  //   }, "*");
  //
  // }


  getBody() {

    return this.createChild({
      type: "gallery",
			// children: this.resource.children, // compat
      draganddrop: true,

      modal: {
        body: {
          type: "single",
          children: [
            "description",
            // {
            //   type: "text",
            //   content: ["queryValue", "posttypes", ["getValue", "post_type"], "name"]
            // },
            // {
            //   type: "text",
            //   content: ["replace", "% > %", "%", ["queryValue", "posttypes", ["getValue", "post_type"], "name"], ["getValue", "post_title"]],
            //   visible: ["=", "autofolder", ["getValue", "filetype"]]
            // },
            {
              type: "input",
              key: "post_title",
              label: "Name",
              visible: ["=", "folder", ["getValue", "filetype"]]
            },
            {
              type: "textarea",
              key: "post_excerpt",
              label: "Caption",
              height: '3rem',
              visible: ["=", "file", ["getValue", "filetype"]]
            }
          ]
        }
      },
			...this.resource.body
		}, "body");

	}

  getHeader() {

    return this.createChild({
      type: "header",
      title: "Medias",
      children: [
        "title",
        "close"
      ],
      ...this.resource.header
    }, "header");

	}

  getFooter() {

    return this.createChild({
      type: "footer",
      children: [
        "submit",
        "upload",
        "add",
        "delete",
        "separator",
        "insert"
      ],
      ...this.resource.footer
    }, "header");

	}

}


// KarmaFieldsAlpha.field.gallery = class extends KarmaFieldsAlpha.field.grid {

// 	static exit = Symbol("exit");

// 	getExit() {

// 		return this.constructor.exit;

// 	}

// 	isExit(id) {

// 		return id === this.constructor.exit;

// 	}

// 	*listItems() {

// 		const parent = this.getValue("parent");

// 		if (parent && parent[0] && parent[0] !== "0") {

// 			yield "exit";

// 		}

// 		const query = this.parent.getQuery();

// 		if (query !== undefined) {

// 			for (let i = 0; i < query.ids.length; i++) {

// 				yield i;

// 			}

// 		}

// 	}

// 	*listSockets() {

// 		const parentKey = this.getParentKey();
// 		const parentId = this.getParam(parentKey);

// 		if (parentId && parentId !== "0") {

// 			const grandParentId = this.getParent(parentId) || "0";

// 			yield { id: grandParentId, exit: true };

// 		}

// 		const query = this.parent.getQuery();

// 		if (query !== undefined) {

// 			// for (let i = 0; i < query.ids.length; i++) {
// 			for (let id of query.ids) {

// 				yield { id };

// 			}

// 		}

// 	}

// 	*listIds() {

// 		const parentKey = this.getParentKey();
// 		const parentId = this.getParam(parentKey);
// 		let index = 0;

// 		if (parentId && parentId !== "0") {

// 			yield this.constructor.EXIT;

// 		}

// 		const query = this.parent.getQuery();

// 		if (query !== undefined) {

// 			for (let id of query.ids) {

// 				yield id;

// 			}

// 		}

// 	}

// 	getSockets() {

// 		let sockets = KarmaFieldsAlpha.server.getState("sockets");

// 		if (!sockets) {

// 			sockets = [...this.listSockets()];

// 		}

// 		return sockets;
// 	}

// 	getIds() {

// 		let ids = KarmaFieldsAlpha.server.getState("ids");

// 		if (!ids) {

// 			ids = [...this.listIds()];

// 		}

// 		return ids;
// 	}


// 	mapIndex(index) {

// 		// return this.listItems().drop(index).next().value;

// 		return this.listSockets().drop(index).next().value.id;

// 	}

// 	getLength() {

// 		return [...this.listItems()].length;

// 	}

// 	getExportableColumns() {

// 		return [
// 			{
// 				// type: "input", // -> type = "group"
// 				key: "id"
// 			}
// 		];

// 	}


//   // getContentAt(index, key) {



//   //   if (index === "exit") {

//   //     switch (key) {
//   //       case "id":
//   //         const id = this.getContent("parent");
//   //         return this.getParent(id.toString());

//   //       case "filetype":
//   //         return new KarmaFieldsAlpha.Content("folder");

//   //       case "filename":
//   //       case "name":
//   //         return new KarmaFieldsAlpha.Content("..");

//   //       default:
//   //         return new KarmaFieldsAlpha.Content("");

//   //     }

//   //   } else if (index === "*" || index === "modal") {

//   //     let selection = this.getSelection() || {};

//   //     const socketsQuery = this.getSockets();

//   //     if (socketsQuery.slice(selection.index || 0, (selection.index || 0)+(selection.length || 0)).some(socket => socket.id === "exit")) {

//   //       const content = new KarmaFieldsAlpha.Content();

//   //       if (length > 1) {

//   //         content.mixed = true;

//   //       } else if (key === "filetype") {

//   //         content.value = "exit";

//   //       }

//   //       return content;

//   //     } else {

//   //       return super.getContentAt(index, key);

//   //     }

//   //   } else {

//   //     return super.getContentAt(index, key);

//   //   }

//   // }


// 	getParentKey() {

// 		if (this.hierarchical === true) {

// 			return "parent";

// 		}

// 		return this.hierarchical;
// 	}

// 	// getValueAt(index, key) {

// 	// 	index = this.mapIndex(index);

// 	// 	const parentKey = this.getParentKey();

// 	// 	if (index === "exit") {

// 	// 		switch (key) {
// 	// 			case "id":
// 	// 				const id = this.getValue(parentKey);
// 	// 				if (id) {
// 	// 					if (!id[0] || id[0] === "0") {
// 	// 						console.error("Getting id of exit but this folder is root");
// 	// 					}
// 	// 					return this.getWild(this.getDriver(), id[0], parentKey);
// 	// 				}
// 	// 				break;

// 	// 			case "filetype":
// 	// 				return ["folder"];

// 	// 			case "filename":
// 	// 			case "name":
// 	// 				return [".."];

// 	// 			default:
// 	// 				return [];

// 	// 		}

// 	// 	} else {

// 	// 		return this.parent.getValueAt(index, key);

// 	// 	}

// 	// }

// 	getValue(key, id) {

// 		if (id === this.constructor.exit) {

// 			switch (key) {
// 				case "id":
// 					return id;
// 					// const parentKey = this.getParentKey();
// 					// const parentId = this.getParam(parentKey);
// 					// return parentId && this.getParent(parentId) || ["0"];

// 				case "filetype":
// 					return ["folder"];

// 				case "filename":
// 				case "name":
// 					return [".."];

// 				default:
// 					return [];

// 			}

// 		} else {

// 			return this.parent.getValue(key, id);

// 		}

// 	}

// 	// setValueAt(value, index, key) {

// 	// 	index = this.mapIndex(index);

// 	// 	if (index !== "exit") {

// 	// 		this.parent.setValueAt(value, index, key);

// 	// 	}

// 	// }

// 	setValue(value, key, id) {

// 		if (id !== this.constructor.exit) {

// 			this.parent.setValue(value, key, id);

// 		}

// 	}

// 	// addAt(index, length = 1, params = {}, data = undefined) {

// 	// 	index = this.mapIndex(index);

// 	// 	if (index === "exit") {

// 	// 		index = 0;

// 	// 	}

// 	// 	this.parent.addAt(index, length, params, data);

// 	// }

// 	// add(length = 1, itemParams = {}, data = undefined) {

// 	// 	const socket = this.getNewItemSocket();

// 	// 	this.addAtSocket(socket, length, itemParams, data);

// 	// }

// 	// addAtSocket(socket, length = 1, params = {}, data = undefined) {

// 	// 	if (socket.exit) {

// 	// 		index = 0;

// 	// 	}

// 	// 	this.parent.addAt(socket.queryId, length, params, data);

// 	// }

// 	// addSocket() {

// 	// 	let index = 0;
// 	// 	const sockets = this.getSockets();

// 	// 	while (sockets[index].exit) index++;

// 	// 	const defaults = this.parent.getDefaults();
// 	// 	const filters = this.parent.getFilters();

// 	// 	const socket = Symbol("token");

// 	// 	sockets.splice(index, 0, socket);

// 	// 	KarmaFieldsAlpha.server.setState(sockets, "sockets");

// 	// }



// 	// this function is intended to be called by parent (table, etc.)
// 	// add(length, index = 0) {

// 	// 	// -> just for gallery:
// 	// 	while (ids[index] === this.constructor.exit) index++;

// 	// 	let ids = [...this.getIds()];
// 	// 	// const tokens = [];

// 	// 	// for (let i = 0; i < length; i++) {

// 	// 	// 	const token = KarmaFieldsAlpha.server.createToken();

// 	// 	// 	tokens.push(token);

// 	// 	// }

// 	// 	ids.splice(index, 0, ...tokens);

// 	// 	this.setIds(ids);

// 	// 	return tokens;

// 	// }





// 	getIdsAt(index, length) {

// 		let ids = super.getIdsAt(index, length);

// 		return ids.filter(id => id !== this.constructor.exit);

// 	}

// 	addIds(tokens, index = 0) { // -> to be called by parent

// 		let ids = this.getIds();

// 		// -> just for gallery:
// 		while (ids[index] === this.constructor.exit) index++;

// 		super.addIds(tokens, index);

// 	}

// 	addFiles(tokens, index = 0, files) { // -> to be called by parent

// 		let ids = this.getIds();

// 		while (ids[index] === this.constructor.exit) index++;
// 		while (this.isFolder(ids[index])) index++;

// 		super.addIds(tokens, index);

// 	}

// 	// deleteAt(index, length = 1) {

// 	// 	const ids = this.getIds();

// 	// 	// for (let i = 0; i < length; i++) {

// 	// 	// 	this.setValue(["1"], "trash", ids[i + index]);

// 	// 	// }

// 	// 	const remainingIds = [...ids];
// 	// 	const deletedIds = remainingIds.slice(index, index + length);

// 	// 	this.setIds(remainingIds);

// 	// 	this.parent.deleteIds(deletedIds);

// 	// 	// KarmaFieldsAlpha.server.setState(ids, this.uid, "ids");



// 	// 	// const ids = [...this.getIds()];

// 	// 	// const removedIds = ids.slice(index, length).filter(id => id !== this.constructor.exit);

// 	// 	// if (removedIds.length) {

// 	// 	// 	this.parent.deleteIds(removedIds);



// 	// 	// }

// 	// }

// 	// upload(files) {

// 	// 	const index = this.getNewFileIndex();

// 	// 	this.uploadAt(index, files);

// 	// }

// 	// uploadAt(index, files) {

// 	// 	index = this.mapIndex(index);

// 	// 	this.parent.uploadAt(index, files);

// 	// }

// 	// setContentAt(content, index, key) {

// 	// 	// if (index !== "exit") {

// 	// 	//   return super.setContentAt(content, index, key);

// 	// 	// }

// 	// 	return this.setValueAt(content.toArray(), index, key);

// 	// }


// 	// select(index = 0, length = 0) { // to be overrided (ie. Medias grid)

// 	// 	for (let socket of this.genSockets()) {

// 	// 		if (socket.id === index) {

// 	// 			this.setSelection({ index: socket.index, length });
// 	// 			break;

// 	// 		}

// 	// 	}

// 	// }

//   // querySelection() {

//   //   const selection = this.getSelection();

//   //   if (selection) {

//   //     const index = selection.index || 0;
//   //     const length = selection.length || 0;

//   //     const socketsQuery = this.getSockets();

//   //     const sockets = socketsQuery.slice(index, index+length).filter(socket => socket.id !== "exit");

//   //     if (sockets.length) {

//   //       return {index: sockets[0].id, length: sockets.length};

//   //     }

//   //   }

//   //   return {index: 0, length: 0};

//   // }

//   // getSockets() {

//   //   return [...this.genSockets()];

//   // }

// 	// *genSockets() {


// 	//   const length = this.parent.getLength();
// 	//   const parentQuery = this.getContent("parent");

// 	//   if (parentQuery.loading) {

// 	//     return;

// 	//   }

// 	//   const parent = parentQuery.toString() || "0";
// 	//   let index = 0;

// 	//   if (parent.toString() !== "0") {

// 	//     yield {
// 	//       index: index++,
// 	//       id: "exit",
// 	//       filetype: "folder"
// 	//     };

// 	//   }

// 	//   for (let i = 0; i < length; i++) {

// 	//     // const itemParent = this.getContentAt(i, "parent").toString() || "0";
// 	//     const filetype = this.getContentAt(i, "filetype");
// 	//     // const id = this.getContentAt(i, "id").toString();

// 	//     // if (itemParent === parent) {

// 	//       yield {
// 	//         id: i,
// 	//         index: index++,
// 	//         filetype: filetype.toString()
// 	//       };

// 	//     // }

// 	//   }

// 	// }



// 	// listDropZones() {

// 	// 	// yield* this.listItems().filter((item, i) => {
// 	// 	// 	const filetype = this.getValueAt(i, "filetype");
// 	// 	// 	return filetype && (filetype[0] === "folder" || filetype[0] === "autofolder");
// 	// 	// });

// 	// 	// yield* this.listItems()
// 	// 	// 	.map((item, i) => this.getValueAt(i, "filetype") || [])
// 	// 	// 	.filter(filetype => filetype[0] === "folder" || filetype[0] ===  "autofolder");

// 	// 	return this.listSockets().filter(socket => this.isFolder(socket.index)).map(socket => socket.index);

// 	// 	// for (let i = 0; i < this.getLength(); i++) {

// 	// 	// 	const filetype = this.getValueAt(i, "filetype");

// 	// 	// 	if (filetype && (filetype[0] === "folder" || filetype[0] ===  "autofolder")) {

// 	// 	// 		yield i;

// 	// 	// 	}

// 	// 	// }

// 	// }

// 	// selectSockets(index, length) {

// 	// 	const sockets = [...this.getSocketIndexes()];

// 	// 	this.setSelection({ index: sockets[index], length });

// 	// }

// 	// getSelectedSockets() {

// 	// 	const selection = this.getSelection();

// 	// 	// return {index: }


// 	// }

// 	// getIndexAt(socket) {

// 	// 	return [...this.getSocketIndexes()][socket];

// 	// }



//   // queryItems() {
//   //
//   //
//   //   const query = super.queryItems();
//   //   const parent = this.parent.getContent("parent").toString() || "0";
//   //
//   //   if (!query.loading) {
//   //
//   //     query.value = query.toArray().map(item => {
//   //
//   //       const parent = this.getContent(item.index, "parent").toString() || "0";
//   //       const filetype = this.getContent(item.index, "filetype").toString();
//   //       let order;
//   //
//   //       if (item.uploading) {
//   //
//   //         order = 3;
//   //
//   //       } else if (item.adding) {
//   //
//   //         order = 1;
//   //
//   //       } else if (filetype === "folder") {
//   //
//   //         order = 2;
//   //
//   //       } else if (filetype === "file") {
//   //
//   //         order = 4;
//   //
//   //       } else {
//   //
//   //         order = 2;
//   //
//   //       }
//   //
//   //       return {...item, parent, filetype, order};
//   //     });
//   //
//   //     query.value = query.toArray().filter(item => item.parent === parent);
//   //
//   //     query.value.sort((a, b) => a.order - b.order);
//   //
//   //     if (!this.isRoot()) {
//   //
//   //       const grandParent = this.queryUpperFolderId();
//   //
//   //       query.value = [
//   //         {
//   //           index: "exit",
//   //           id: grandParent.toString() || "0",
//   //           order: 0
//   //         },
//   //         ...query.toArray()
//   //       ];
//   //
//   //     }
//   //
//   //   }
//   //
//   //   return query;
//   //
//   // }

//   // getLength() {

//   //   return this.getSockets().length;

//   // }

// 	// getNewItemIndex() {

// 	// 	let index = 0;

// 	// 	for (let item of this.listItems()) {

// 	// 		if (item !== "root") {

// 	// 			return index;

// 	// 		}

// 	// 		index++;

// 	// 	}

// 	// 	return index;

// 	// }

// 	// getNewFileIndex() {

// 	// 	let index = 0;

// 	// 	for (let item of this.listItems()) {

// 	// 		const filetype = this.getValueAt(index, "filetype") || [];

// 	// 		if (filetype[0] === "file") {

// 	// 			return index;

// 	// 		}

// 	// 		index++;

// 	// 	}

// 	// 	return index;

// 	// }

//   // async openFolder(socket) {

//   //   if (socket.filetype === "folder" || socket.filetype === "autofolder") {

//   //     if (socket.id === "exit") {

//   //       await this.save(`open`, "Upper Directory");

//   //       const parent = this.getContent("parent");

//   //       let id = this.getParent(parent.toString());

//   //       while (id.loading) {

//   //         await this.render();
//   //         id = this.getParent(parent.toString());

//   //       }

//   //       await this.setValue(id.toString() || "0", "parent");

//   //       await this.removeSelection();


//   //     } else {

//   //       await this.save(`open`, "Open Directory");

//   //       const id = this.getContentAt(socket.id, "id");

//   //       await this.setValue(id.toString() || "0", "parent");

//   //       await this.removeSelection();

//   //     }

//   //   }

//   // }

// 	isFolder(id) {

// 		const filetype = this.getValue("filetype", id) || [];

// 		return filetype[0] === "folder" || filetype[0] === "autofolder";

// 	}

// 	isAutoFolder(id) {

// 		const filetype = this.getValue("filetype", id) || [];

// 		return filetype[0] === "autofolder";

// 	}

// 	isDroppable(id) {

// 		if (id === this.constructor.exit) {

// 			return false;

// 		}

// 		const [filetype] = this.getValue("filetype", id) || [];

// 		return filetype !== "autofolder"

// 	}

// 	openFolder(id) {

// 		const parentKey = this.getParentKey();

// 		if (id === this.constructor.exit) {

// 			const parentId = this.getParam(parentKey);

// 			if (!parentId || parentId === "0") {

// 				console.error("opening parent but folder is root");

// 			}

// 			id = this.getParent(parentId);

// 			if (id === undefined) {

// 				console.error("opening parent folder but grand-parent is undefined");
// 				return;

// 			}

// 		}

// 		const filetype = this.getValue("filetype", id);

// 		if (filetype === undefined) {

// 			console.error("opening folder but filetype is not set");
// 			return;

// 		}

// 		if (filetype[0] === "folder" || filetype[0] === "autofolder") {

// 			this.setParam(id || "0", parentKey);
// 			this.removeSelection();

// 		}

// 	}

// 	openFolderAt(index) {

// 		const ids = this.getIds();
// 		const id = ids[index];

// 		if (id) {

// 			this.openFolder(id);

// 		}

// 	}

// 	getParent(id) {

// 		const parentKey = this.getParentKey();

// 		// const parentId = KarmaFieldsAlpha.server.getValue(driver, id, parentKey);
// 		const parentId = this.getValue(parentKey, id);

// 		if (parentId !== undefined) {

// 			return parentId[0] || "0";

// 		}

// 	}

// 	// hasGrandParent() {

// 	// 	const parentKey = this.getParentKey();
// 	// 	const parentId = this.getParam(parentKey);

// 	// 	if (!parentId || parentId === "0") {

// 	// 		return false

// 	// 	}

// 	// 	return true;

// 	// }

// 	// getGrandParent() {

// 	// 	const parentKey = this.getParentKey();
// 	// 	const parentId = this.getParam(parentKey);

// 	// 	if (!parentId || parentId === "0") {

// 	// 		console.error("getting grand-parent but there is no grand-parent!");

// 	// 	}

// 	// 	return this.getParent(parentId);

// 	// }


//   // async move(sockets, targetSocket) {

//   //   if (targetSocket.filetype === "folder" || targetSocket.filetype === "autofolder") {

//   //     await this.removeSelection();

//   //     if (targetSocket.id === "exit") {

//   //       await this.save("move", "Move upper");

//   //       const id = this.getContent("parent");

//   //       let parent = this.getParent(id.toString());

//   //       while (parent.loading) {

//   //         await this.render();
//   //         parent = this.getParent(id.toString());

//   //       }

//   //       await this.parent.move(sockets[0].id, sockets.length, parent.toString());

//   //     } else {

//   //       await this.save("move", "Move to Folder");

//   //       const id = this.getContentAt(targetSocket.id, "id");

//   //       // destId = id;

//   //       await this.parent.move(sockets[0].id, sockets.length, id.toString());

//   //     }

//   //   }


//   // }

// 	// move(index, target) {

// 	// 	const targetFiletype = this.getValueAt(target, "filetype");
// 	// 	const parentKey = this.getParentKey();

// 	// 	if (targetFiletype === undefined) {

// 	// 		console.error("moving item in target folder but folder filetype is undefined");

// 	// 	}

// 	// 	const targetId = this.mapIndex(target);

// 	// 	if (targetId === "exit") {

// 	// 		// this.save("move", "Move upper");
// 	// 		this.removeSelection();

// 	// 		const parentId = this.getParam(parentKey);

// 	// 		if (!parentId || parentId === "0") {

// 	// 			console.error("moving upper but folder is root");

// 	// 		}

// 	// 		let grandParentId = this.getParent(parentId);

// 	// 		if (grandParentId === undefined) {

// 	// 			console.error("moving upper but upper folder parent is undefined");

// 	// 		}

// 	// 		this.parent.move(index, length, { [parentKey]: grandParentId[0] || "0" });

// 	// 	} else if (targetFiletype[0] === "folder" || targetFiletype[0] === "autofolder") {

// 	// 		// this.save("move", "Move to Folder");
// 	// 		this.removeSelection();

// 	// 		const id = this.getValueAt(target, "id");

// 	// 		if (id === undefined) {

// 	// 			console.error("moving to folder but folder id is undefined");

// 	// 		}

// 	// 		this.parent.move(index, length, { [parentKey]: id[0] });

// 	// 	}

// 	// }

// 	moveAt(index, length, target) {

// 		const ids = this.getIdsAt(index, length);

// 		const [targetId] = this.getIdsAt(target, 1);

// 		this.move(ids, targetId);

// 	}

// 	move(ids, targetId) {

// 		const parentKey = this.getParentKey();

// 		if (targetId === "exit") {

// 			const parentId = this.getParam(parentKey);

// 			if (!parentId || parentId === "0") {

// 				console.error("moving upper but folder is root");

// 			}

// 			targetId = this.getParent(parentId);

// 			if (targetId === undefined) {

// 				console.error("moving upper but upper folder parent is undefined");

// 			}

// 		}

// 		const targetFiletype = this.getValue("filetype", targetId);

// 		if (targetFiletype === undefined) {

// 			console.error("moving item in target folder but folder filetype is undefined");

// 		}

// 		if (targetFiletype[0] === "folder" || targetFiletype[0] === "autofolder") {

// 			this.removeSelection();

// 			for (let id of ids) {

// 				this.setValue(targetId, parentKey, id);

// 			}

// 			const remainingIds = this.getIds().filter(id => !ids.includes(id));

// 			this.setIds(remainingIds);

// 		}

// 	}


//   // *upload(files, index) {
//   //
//   //   if (!this.parent.shuttle) {
//   //
//   //     return;
//   //
//   //   }
//   //
//   //   let defaults = this.parent.getDefaultParams();
//   //
//   //   while (defaults.loading) {
//   //
//   //     yield;
//   //     defaults = this.parent.getDefaultParams();
//   //   }
//   //
//   //   let filters = this.parent.getFilters();
//   //
//   //   while (filters.loading) { // should never happens since this.params is loaded now !
//   //
//   //     yield;
//   //     filters = this.parent.getFilters();
//   //   }
//   //
//   //   const params = {...filters.toObject(), ...defaults.toObject()};
//   //
//   //   if (index === undefined) {
//   //
//   //     index = this.getNewItemIndex();
//   //
//   //   }
//   //
//   //   this.save("insert", "Insert");
//   //
//   //   // set.add(params, index, length);
//   //   const tokens = this.parent.shuttle.add(params, index, length);
//   //
//   //   yield* body.create(index, length);
//   //
//   //   this.select(index, length);
//   //
//   //   // const work = this.shuttle.loadTokens(tokens, params);
//   //   //
//   //   // KarmaFieldsAlpha.Jobs.add(work);
//   //
//   // }



//   // getUploadIndex() {
//   //
//   //   return this.parent.getLength().toNumber();
//   //
//   // }
//   //
//   // upload(files) {
//   //
//   //   const index = this.getUploadIndex();
//   //
//   //   this.save("upload", "Upload");
//   //
//   //   this.uploadAt(files, index);
//   //
//   //
//   //   const uploadedIndex = this.queryItems().toArray().findLastIndex(item => item.uploading);
//   //
//   //   if (uploadedIndex > -1) {
//   //
//   //     this.setSelection({index: uploadedIndex, length: 1});
//   //
//   //   }
//   //
//   //
//   //   this.request("render");
//   //
//   // }
//   //
//   // uploadAt(files, index) { // index is relative to collection !
//   //
//   //   const collection = this.getCollection();
//   //   const defaults = this.parse(this.resource.defaults || {});
//   //   const filters = this.getFilters();
//   //
//   //
//   //
//   //   if (defaults.loading || filters.loading) {
//   //
//   //     console.warn("procrastinating uploadAt");
//   //
//   //     this.procrastinate("uploadAt", files, index);
//   //
//   //   } else {
//   //
//   //     const params = {...filters.toObject(), ...defaults.toObject()};
//   //
//   //     collection.upload(files, params, index);
//   //
//   //     let query = this.queryItems();
//   //
//   //     let items = query.toArray().filter(item => item.index >= index && item.index < index + files.length);
//   //
//   //     for (let item of items) {
//   //
//   //       const field = this.createChild({
//   //         type: "row",
//   //         children: this.resource.children,
//   //       }, item.index);
//   //
//   //       field.create();
//   //
//   //       if (this.resource.modal) {
//   //
//   //         const field = this.createChild({
//   //           type: "row",
//   //           children: this.resource.modal.children,
//   //         }, item.index);
//   //
//   //         field.create();
//   //
//   //       }
//   //
//   //     }
//   //
//   //   }
//   //
//   // }



//   // remove(collectionIndex, length = 1) {
//   //
//   //   if (collectionIndex !== "exit") {
//   //
//   //     super.remove(collectionIndex, length);
//   //
//   //   }
//   //
//   // }


//   // changeFile(file, id) {
//   //
//   //   this.upload([file], {id: id});
//   //
//   // }
//   //
//   // regen() {
//   //
//   //   const ids = this.getSelectedItems().filter(item => !item.exit).map(item => item.id).filter(id => id);
//   //   const driver = this.getDriver();
//   //
//   //   if (ids.length) {
//   //
//   //     KarmaFieldsAlpha.Query.regen(driver, ids);
//   //
//   //   }
//   //
//   //   this.render();
//   // }
//   //
//   // async uploadFromUrl(url) {
//   //
//   //   // url = "https://upload.wikimedia.org/wikipedia/commons/6/65/Schwalbenschwanz-Duell_Winterthur_Schweiz.jpg";
//   //   const response = await fetch(url);
//   //   const blob = await response.blob();
//   //   const filename = url.split('/').pop();
//   //
//   //   // const file = new File([blob], filename, {type: "image/jpg"});
//   //   const file = new File([blob], filename);
//   //   // const [fileId] = await this.upload([file]);
//   //   this.upload(file);
//   //
//   // }




//   // isFolderAt(index) {
//   //
//   //   const query = this.getContentAt(index, "filetype");
//   //
//   //   return (query.toString() === "folder" || query.toString() === "exit");
//   //
//   // }

// 	*buildThumbnails() {

// 		// const selection = this.getSelection();
// 		// const hasFocus = this.hasFocus();
// 		// const sockets = this.genSockets();

// 		const ids = this.getIds();

// 		for (let i = 0; i < ids.length; i++) {

// 			const id = ids[i];

// 			const row = this.createChild({
// 				type: "row",
// 				id
// 			}, i);

// 			const media = row.createChild({
// 				type: "media",
// 				display: "thumb",
// 				// exit: socket.queryId === "exit"
// 				exit: id === this.constructor.exit
// 			}, "media");

// 			yield {
// 				tag: "li",
// 				class: "frame",
// 				update: element => {

// 					element.classList.remove("drop-active");
// 					element.classList.toggle("selected", this.hasFocus() && this.isSelected(id));
// 					element.classList.toggle("media-dropzone", this.isFolder(id));
// 					element.classList.toggle("droppable", this.isDroppable(id));

// 					element.ondblclick = event => {
// 						if (this.isFolder(id)) {
// 							this.save("open folder");
// 							this.openFolder(id);
// 							this.render();
// 						} else { // -> edit image in files field
// 							this.setSelection({ index: i, length: 1 });
// 							this.request("edit");
// 							this.render();
// 						}
// 					}
// 				},
// 				children: media.build()
// 			};

// 		}

// 	}

// 	*buildBody() {

// 		yield {
// 			class: "media-table-container",
// 			init: element => {
// 				element.ondrop = async event => {
// 					event.preventDefault();
// 					const files = event.dataTransfer.files;
// 					if (files.length) {
// 						this.request("upload", files);
// 						this.render();
// 					}
// 					element.classList.remove("drop-active");
// 				}

// 				element.ondragover = event => {
// 					event.preventDefault();
// 					element.classList.add("drop-active");
// 				}
// 				element.ondragleave = event => {
// 					event.preventDefault();
// 					element.classList.remove("drop-active");
// 				}
// 				if (this.parent.id === "popup") {
// 					element.classList.add("scroll-container");
// 				}
// 			},
// 			child: {
// 				class: "media-table",
// 				tag: "ul",
// 				init: element => {
// 					if (this.resource.style) {
// 						element.style = this.resource.style;
// 					}
// 				},
// 				update: element => {

// 					const sockets = this.getSocketIndexes();
// 					const hasFocus = this.hasFocus();
// 					const selection = hasFocus && this.getSelection();

// 					const ids = this.getIds();

// 					if (this.resource.draganddrop) {

// 						// const dropZones = sockets.filter(socket => (socket.filetype === "folder" || socket.filetype === "autofolder")).map(socket => socket.index);
// 						// const dropZones = this.getDropZones();
// 						// const dropZones = [...this.listSockets()]
// 						// 	.filter(socket => this.isFolder(socket.index))
// 						// 	.map(socket => socket.index);
// 						const dropZones = ids.map((id, index) => index).filter(index => this.isFolder(ids[index]));
// 						const selector = new KarmaFieldsAlpha.Handler.DragAndDrop(element, selection, dropZones);

// 						selector.onSelect = elements => {
// 							elements.map(element => element.classList.add("selected"));
// 							this.setSelection(selector.state.selection);
// 						}

// 						selector.onUnselect = elements => {
// 							elements.map(element => element.classList.remove("selected"));
// 						}

// 						selector.onSelectionComplete = () => {
// 							this.setFocus(true);
// 							this.render();

// 						}

// 						selector.onDragOver = element => {
// 							element.classList.add("drop-active");
// 						};

// 						selector.onDragOut = element => {
// 							element.classList.remove("drop-active");
// 						};

// 						selector.onDraggedOver = element => {
// 							element.classList.add("drop-active");
// 						};

// 						selector.onDraggedOut = element => {
// 							element.classList.remove("drop-active");
// 						};

// 						selector.ondrop = (index, selection) => {
// 							const slice = ids.slice(selector.state.selection.index, selector.state.selection.index + selector.state.selection.length);
// 							const target = ids[index];

// 							if (slice.every(id => !this.isExit(id) && !this.isAutoFolder(id))) {
// 								this.move(slice, target);
// 							}

// 							this.setFocus(true);
// 							this.render();
// 						};

// 						selector.onCancelDrag = () => {
// 							this.setFocus(true);
// 							this.render();
// 						}

// 					} else if (this.resource.sortable) {

// 						const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

// 						sorter.onSelect = elements => {
// 							elements.map(element => element.classList.add("selected"));
// 							this.setSelection(sorter.state.selection);
// 						}

// 						sorter.onUnselect = elements => {
// 							elements.map(element => element.classList.remove("selected"));
// 						}

// 						sorter.onSelectionComplete = () => {
// 							this.setFocus(true);
// 							 this.render();
// 						}

// 						sorter.onSwap = (newState, lastState) => {
// 							this.save("reorder");
// 							this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
// 							this.setSelection(newState.selection);
// 						};

// 						sorter.onSort = (newSelection, lastSelection) => {
// 							if (KarmaFieldsAlpha.DeepObject.differ(newSelection, lastSelection)) {
// 								this.setFocus(true);
// 								this.render();
// 							}
// 						}

// 					}




// 					// grid.element.classList.toggle("has-selection", Boolean(this.hasFocus()));

// 					// grid.children = items.map((item, index) => {
// 					//   return {
// 					//     tag: "li",
// 					//     class: "frame",
// 					//     update: li => {
// 					//
// 					//       li.element.classList.remove("drop-active");
// 					//       li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, index));
// 					//       li.element.classList.toggle("media-dropzone", Boolean(item.exit || this.isFolderAt(index)));
// 					//
// 					//       li.element.ondblclick = event => {
// 					//         const query = this.getContent(item.index, "filetype");
// 					//         if (query.toString() === "folder" || query.toString() === "exit") {
// 					//           this.openFolder(item.index);
// 					//         }
// 					//       }
// 					//
// 					//       const row = this.createChild({
// 					//         type: "row",
// 					//       }, item.index);
// 					//
// 					//       const media = row.createChild({
// 					//         type: "media",
// 					//         // id: item.id,
// 					//         // driver: this.getDriver(),
// 					//         display: "thumb",
// 					//         exit: item.index === "exit",
// 					//         loading: item.loading,
// 					//         uploading: item.uploading
// 					//       }, item.index);
// 					//
// 					//       li.child = media.build();
// 					//
// 					//     }
// 					//
// 					//   };
// 					// });

// 					// }

// 					// const selection = this.getSelection();
// 					// const hasFocus = this.hasFocus();
// 					//
// 					// for (let socket of this.genSockets()) {

// 					// grid.children = [...this.buildThumbnails()];

// 				},
// 				children: this.buildThumbnails()
// 			}
// 		};

// 	}

// }

// KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field.group {

// 	getValue(key) {

// 		return this.parent.getValueAt(key, this.resource.index);

// 	}

// 	setValue(value, key) {

// 		this.parent.setValueAt(value, key, this.resource.index);

// 	}

// 	getIndex() {

// 		return this.parent.getIndex() + this.resource.index;

// 	}

// 	delete() {

// 		return this.parent.deleteAt(this.resource.index);

// 	}

// }


// KarmaFieldsAlpha.field.saucer.table.footer = class extends KarmaFieldsAlpha.field.group {
//
//   constructor(resource) {
//
//     super({
//       display: "flex",
//       children: [
//         // "reload",
//         // "save",
//         // "add",
//         // "delete",
//         // "separator",
//         // "insert",
//         // "undo",
//         // "redo"
//         "save",
//         "upload",
//         "createFolder",
//         "delete",
//         "separator",
//         "undo",
//         "redo",
//         "insert"
//       ],
//       ...resource
//     });
//
//   }
//
// }


KarmaFieldsAlpha.field.saucer.upload = class extends KarmaFieldsAlpha.field.button {

	*build() {

		yield {
			class: "karma-upload karma-field button",
			init: element => {
				element.id = "upload-button";
			},
			children: [
				{
					tag: "input",
					init: element => {
						element.type = "file",
						element.id = this.getUid();
						element.multiple = true;
						element.hidden = true;
					},
					update: element => {
						element.onchange = event => {
							const files = element.files;
							if (files.length) {
								this.save("upload");
								this.parent.request("upload", ...files);
								this.render();
							}
						}
					}
				},
				{
					tag: "label",
					class: "label",
					init: element => {
						element.htmlFor = this.getUid();
						element.textContent = this.resource.title || "Add File";
					}
				}
			]

		};
	}

}

// KarmaFieldsAlpha.field.gallery.description = class extends KarmaFieldsAlpha.field {

// 	*build() {
// 		yield {
// 			class: "karma-field karma-field-container media-description",
// 			children: [
// 				...this.createChild({
// 					type: "media",
// 					width: "100%",
// 					height: "15em",
// 					// loading: loading,
// 					// uploading: uploading,
// 					// token: token, // not implemented
// 					// mixed: mixed,
// 					// exit: exit,
// 					// id: id,
// 					caption: false,
// 					display: "medium" // = default
// 				}, "media").build(),
// 				...this.createChild("imageDescription").build()
// 			]
// 		};
// 	}
// }

// KarmaFieldsAlpha.field.gallery.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

//   constructor(resource, id, parent) {

//     super({
//       children: [
//         "fileDescription",
//         "sizeDescription",
//         "resolutionDescription",
//         "dateDescription",
//         "multipleDescription"
//       ],
//       ...resource
//     }, id, parent);

//   }

// }

// KarmaFieldsAlpha.field.gallery.description.fileType = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       content: ["getValue", "filetype"],
//       ...resource
//     }, id, parent);
//   }
// }


// KarmaFieldsAlpha.field.gallery.description.mimeType = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       content: ["getValue", "mimetype"],
//       ...resource
//     }, id, parent);
//   }
// }

// KarmaFieldsAlpha.field.gallery.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
//       hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]], ["=", ["getValue", "filetype"], "folder"]],
//       ...resource
//     }, id, parent);
//   }
// }

// KarmaFieldsAlpha.field.gallery.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       content: ["?", [">", ["getValue", "size"], 1000], ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]], ["replace", "% B", "%", ["getValue", "size"]]],
//       hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]], ["=", ["getValue", "filetype"], "folder"]],
//       ...resource
//     }, id, parent);
//   }
// }

// KarmaFieldsAlpha.field.gallery.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
//       visible: ["&&", ["like", ["getValue", "mimetype"], "^image/.*$"], ["!", ["isMixed", ["getValue", "width"]]], ["!", ["isMixed", ["getValue", "height"]]]],
//       ...resource
//     }, id, parent);
//   }
// }

// KarmaFieldsAlpha.field.gallery.description.fileDescription = class extends KarmaFieldsAlpha.field.link {
//   constructor(resource, id, parent) {
//     super({
//       style: "word-break: break-word",
//       content: ["getValue", "filename"],
//       href: ["replace", `${KarmaFieldsAlpha.uploadURL}#/#`, "#", ["getValue", "dir"], ["getValue", "filename"]],
//       target: "_blank",
//       // hidden: ["||", ["=", ["getIds"], "0"], ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
//       hidden: ["||", ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
//       ...resource
//     }, id, parent);
//   }
// }

// KarmaFieldsAlpha.field.gallery.description.multipleDescription = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       content: "[Mixed files]",
//       visible: ["isMixed", ["getValue", "filename"]],
//       ...resource
//     }, id, parent);
//   }
// }
// KarmaFieldsAlpha.field.gallery.description.folderName = class extends KarmaFieldsAlpha.field.input {
//   constructor(resource, id, parent) {
//     super({
//       type: "input",
//       label: "Folder name",
//       key: "name",
//       visible: ["&&", ["!", ["getValue", "mimetype"]], ["!", ["isMixed", ["getValue", "mimetype"]]]],
//       ...resource
//     }, id, parent);
//   }
// }



// KarmaFieldsAlpha.field.medias.modal = class extends KarmaFieldsAlpha.field.grid.modal {
//
//   build() {
//     return {
// 			class: "karma-field karma-field-container",
//       update: container => {
//         const items = this.request("getSelectedItems");
//
//         if (!items.some(item => item.exit)) {
//           container.children = [
//             super.build()
//           ];
//         } else {
//           container.children = [];
//         }
//       }
//     };
//   }
//
// }


// KarmaFieldsAlpha.field.saucer.createFolder = {
//   type: "button",
//   action: "createFolder",
//   title: "Create Folder"
// }

KarmaFieldsAlpha.field.medias.add = class extends KarmaFieldsAlpha.field.table.add {
  constructor(resource, id, parent) {
    super({
      text: "Create Folder",
      title: "Create Folder",
      ...resource
    }, id, parent)
  }
}


// KarmaFieldsAlpha.field.medias.header = class extends KarmaFieldsAlpha.field.container.header {
//
//   constructor(resource, id, parent) {
//
//     super({
//       display: "flex",
//       children: [
//         "title",
//         "close"
//       ],
//       ...resource
//     }, id, parent);
//
//   }
//
// }

KarmaFieldsAlpha.field.medias.title = class extends KarmaFieldsAlpha.field.container.title {

  // constructor(resource, id, parent) {
  //
  //   super({
  //     tag: "h1",
  //     style: "flex-grow:1",
  //     class: "ellipsis",
  //     content: "Title",
  //     ...resource
  //   }, id, parent);
  //
  // }


  // getContent() {
  //
	// 	return this.queryLabel();
  //
  //   let parent = this.getParam("parent");
  //
  //   console.log(parent);
  //
  //
  //   return 'XX';
  //
  //
  // }

	getAncestors(id) {

		const ancestors = [];

		const driver = this.getDriver();

		while (id && id !== "0") {

			const name = this.getValue("name", id, driver);

			if (name === undefined) {

				return;

			} else {

				ancestors.unshift({
					id: id,
					name: name[0] || ""
				});

			}

			const parent = this.getValue("parent", id, driver);

			if (parent === undefined) {

				return;

			} else {

				id = parent[0];

			}

		}

		ancestors.unshift({
			id: "0",
			name: 'Medias'
		});

		return ancestors;
	}


	*buildChildren() {

		let id = this.getParam("parent");

		const ancestors = this.getAncestors(id);

		if (ancestors !== undefined) {
			for (const ancestor of ancestors) {
				yield {
					tag: "li",
					child: {
						tag: "a",
						update: element => {
							element.innerHTML = ancestor.name;
							element.classList.toggle("active", id !== ancestor.id);
							element.onclick = event => {
								event.preventDefault();
								this.save("open", "Upper Directory");
								this.setParam(ancestor.id, "parent");
								this.removeSelection();
								this.render();
							}
						}
					}
				};
			}

		}

	}

	*build() {

		yield {
			tag: "h1",
			class: "text",
			child: {
				tag: "ul",
				class: "breadcrumb ellipsis",
				children: this.buildChildren()
			}
		}

	}

}


// KarmaFieldsAlpha.field.saucer.breadcrumb = class extends KarmaFieldsAlpha.field {
//
//   getAncestors() {
//
//     let parent = KarmaFieldsAlpha.Store.getParam("parent");
//
//     const ancestors = [];
//
//     const driver = this.resource.driver;
//
//     if (!driver) {
//       console.error("no driver");
//     }
//
//     const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
//     const nameAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "name") || "name";
//
//     while (parent && parent != "0" && parent !== KarmaFieldsAlpha.loading) {
//
//       const [name] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, nameAlias) || [KarmaFieldsAlpha.loading];
//
//       if (name === KarmaFieldsAlpha.loading) {
//
//         break;
//
//       }
//
//       ancestors.unshift({
//         id: parent,
//         name: name || ""
//       });
//
//       [parent] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, parentAlias) || [KarmaFieldsAlpha.loading];
//
//     }
//
//     return ancestors;
//   }
//
//   build() {
//     return {
//       class: "karma-breadcrumb",
//       tag: "ul",
//       update: ul => {
//
//         const ancestors = this.getAncestors() || [KarmaFieldsAlpha.loading];
//
//         ul.children = [{
//           id: "0",
//           name: "Uploads",
//           active: ancestors.length === 0
//         }, ...ancestors].map((item, index, array) => {
//           return {
//             tag: "li",
//             child: {
//               tag: "a",
//               update: a => {
//                 if (item === KarmaFieldsAlpha.loading) {
//                   a.element.innerHTML = "...";
//                 } else {
//                   a.element.classList.toggle("active", index === array.length - 1);
//                   a.element.innerHTML = item.name || "no name";
//                   a.element.onclick = event => {
//                     if (index !== array.length - 1) {
//                       this.parent.setValue(item.id, "parent");
//                       this.render();
//                     }
//                   }
//                 }
//               }
//             }
//           };
//         });
//       }
//     }
//   }
//
// }
