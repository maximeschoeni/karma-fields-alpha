
KarmaFieldsAlpha.field.hierarchy = class extends KarmaFieldsAlpha.field.grid {

	getParent(id) {

		const parentKey = this.getParentKey();

		const parentId = this.getValue(parentKey, id);

		if (parentId !== undefined) {

			return parentId[0] || "0";

		}

	}

	setParent(value, id) {

		const parentKey = this.getParentKey();

		this.setValue([value], parentKey, id);

	}

	getPosition(id) {

		const positionKey = this.getPositionKey();

		const position = this.getValue(positionKey, id);

		if (position !== undefined) {

			return parseInt(position[0] || 0);

		}

	}

	setPosition(value, id) {

		const positionKey = this.getPositionKey();

		this.setValue([value], positionKey, id);

	}

	getRoot() {

		const rootId = "0";

		const ids = this.getIds();

		if (ids !== undefined) {

			// const items = ids.map((id, index) => ({ id, parent: this.getParent(id), children: [], index }));

			// if (items.some(item => item.parent === undefined)) {

			// 	return;

			// }

			const map = { [rootId]: { id: rootId, children: [], index: 0 } };

			// for (let item of items) {

			// 	map[item.id] = item;

			// }
			//
			// for (let item of items) {

			// 	const parentId = item.parent || rootId;

			// 	if (map[parentId]) {

			// 		map[parentId].children.push(item);

			// 	}

			// }

			const items = [];

			for (let index = 0; index < ids.length; index++) {

				const id = ids[index];
				const parentId = this.getParent(id);
				const position = this.getPosition(id);

				if (parentId === undefined || position === undefined) {

					return;

				}

				const item = { id, parentId, children: [], index, position, parent: null };

				map[id] = item;
				items.push(item);

			}

			items.sort((a, b) => {
				if (a.position < b.position) return -1;
				else if (a.position > b.position) return 1;
				else return 0;
			});

			for (let item of items) {

				const parentId = item.parentId || rootId;
				const parent = map[parentId];

				if (parent) {

					item.parent = parent;
					map[parentId].children.push(item);

				}

			}

			return map[rootId];

		}

		// 	for (let id of ids) {

		// 		const item = map[id];
		// 		const parentId = item.parentId || rootId;

		// 		if (map[parentId]) {

		// 			item.parent = map[parentId];
		// 			map[parentId].children.push(item);



		// 		}

		// 	}

		// 	return map[rootId];

		// }

	}

	// deprec
	// spliceObject(object, num, values, index = 0, ...path) {

	// 	if (!object || !object.children) {

	// 		console.error("Invalid object");

	// 	}

	// 	if (path.length > 0) {

	// 		return this.spliceObject(object.children[index], num, values, ...path);

	// 	}

	// 	return object.children.splice(index, num, ...values);

	// }

	getItem(...path) {

		const root = this.getRoot();

		if (root) {

			return this.getDescendant(root, ...path);

		}

	}

	getDescendant(item, ...path) {

		if (item && path.length > 0) {

			const index = path.shift();
			return this.getDescendant(item.children[index], ...path);

		}

		return item;

	}

	forEachObject(object, callback) {

		for (let i = 0; i < object.children.length; i++) {

			callback(object.children[i], i, object);

			this.forEachObject(object.children[i], callback);

		}

	}

	findItem(callback, item = this.getRoot()) {

		if (!item) {

			return;

		}

		for (let i = 0; i < item.children.length; i++) {

			if (callback(item.children[i], i, item)) {

				return true;

			}

			this.findItem(callback, item.children[i]);

		}

	}

	filterItems(callback, item = this.getRoot()) {

		if (!item) {

			return;

		}

		const items = [];

		for (let i = 0; i < item.children.length; i++) {

			if (callback(item.children[i], i, item)) {

				items.push(item.children[i]);

			}

			items.push(...this.filterItems(object.children[i], callback));

		}

		return items;

	}



	getParentKey() {

		return this.resource.parentKey || "parent";

	}

	getPositionKey() {

		return this.resource.positionKey || "position";

	}

	// swap(index, newIndex, length, path, newPath) {

	// 	let root = this.getRoot();

	// 	let positionKey = this.getPositionKey();
	// 	let parentKey = this.getParentKey();

	// 	if (root) {

	// 		root = KarmaFieldsAlpha.DeepObject.clone(root);

	// 		const transferedItems = this.spliceObject(root, length, [], ...path, index);

	// 		this.spliceObject(root, 0, transferedItems, ...newPath, newIndex);

	// 		this.forEachObject(root, (item, index, parent) => {

	// 			const currentPosition = this.getValue(item.id, positionKey);
	// 			const currentParent = this.getValue(item.id, parentKey);

	// 			if (currentPosition === undefined || currentPosition === undefined) {

	// 				console.error("swapping object but position or parent is not loaded");

	// 			}

	// 			if (parseInt(currentPosition[0]) !== index) {

	// 				this.setValue([index], item.id, positionKey);

	// 			}

	// 			if (currentParent[0] !== parent) {

	// 				this.setValue([parent], item.id, parentKey);

	// 			}

	// 		});

	// 	}

	// }

	// swap(index, newIndex, length, path, newPath) {

	// 	const origItem = this.getItem(path);
	// 	const destItem = this.getItem(newPath);

	// 	if (origItem && destItem) {

	// 		const origChildren = [...origItem.children];
	// 		const destChildren = [...destItem.children];

	// 		const transferedItems = origChildren.splice(index, length);

	// 		destChildren.splice(newIndex, 0, ...transferedItems);

	// 		for (let i = 0; i < origChildren.length; i++) {

	// 			const child = origChildren[i];
	// 			const position = this.getPosition(child.id);

	// 			if (position === undefined) {

	// 				console.error("swapping object but position is not loaded");

	// 			}

	// 			if (position !== i) {

	// 				this.setPosition(i, child.id);

	// 			}

	// 		}

	// 		for (let i = 0; i < destChildren.length; i++) {

	// 			const child = destChildren[i];
	// 			// const childPosition = this.getValue(positionKey, child.id);
	// 			const position = this.getPosition(child.id)
	// 			const parent = this.getParent(child.id);

	// 			if (position === undefined) {

	// 				console.error("swapping object but position is not loaded");

	// 			}

	// 			if (parent === undefined) {

	// 				console.error("swapping object but parent is not loaded");

	// 			}

	// 			if (position !== i) {

	// 				this.setPosition(i, child.id);

	// 			}

	// 			if (parent !== destItem.id) {

	// 				this.setParent(destItem.id, child.id);

	// 			}

	// 		}

	// 	}

	// }

	swap(index, newIndex, length, path, newPath) {

		const root = this.getRoot();

		if (root) {

			const origItem = this.getDescendant(root, ...path);
			const transferedItems = origItem.children.splice(index, length); // must be done before getting destItem

			const destItem = this.getDescendant(root, ...newPath);
			destItem.children.splice(newIndex, 0, ...transferedItems);

			for (let i = 0; i < origItem.children.length; i++) {

				const child = origItem.children[i];
				const position = this.getPosition(child.id);

				if (position === undefined) {

					console.error("swapping object but position is not loaded");

				}

				if (position !== i) {

					this.setPosition(i, child.id);

				}

			}

			if (destItem !== origItem) {

				for (let i = 0; i < destItem.children.length; i++) {

					const child = destItem.children[i];
					// const childPosition = this.getValue(positionKey, child.id);
					const position = this.getPosition(child.id)
					const parent = this.getParent(child.id);

					if (position === undefined) {

						console.error("swapping object but position is not loaded");

					}

					if (parent === undefined) {

						console.error("swapping object but parent is not loaded");

					}

					if (position !== i) {

						this.setPosition(i, child.id);

					}

					if (parent !== destItem.id) {

						this.setParent(destItem.id, child.id);

					}

				}

			}



		}

	}


	getItemSelection(item) {

		if (item.children.length) {

			const selection = this.getSelection();

			if (selection) {

				const index = item.children.findIndex(item => item.index === selection.index || 0);

				if (index > -1) {

					const length = Math.min(selection.length || 0, item.children.length - index);

					return { index, length };

				}

			}

			// let { index = 0, length = 0 } = selection;

			// const firstChild = item.children[0];
			// const lastChild = item.children[item.children.length - 1];

			// if (index <= lastChild.index && index + length >= firstChild.index) {

			// 	index = Math.max(firstChild.index, index - firstChild.index);
			// 	length = Math.min(length, item.children.length - index);

			// 	return { index, length };

			// }

		}

	}

	setItemSelection(selection, item) {

		if (selection.index < item.children.length) {

			const firstSelectedItem = item.children[selection.index];

			// console.log(selection, item);

			if (!firstSelectedItem) {

				console.error("no item selected in range");

			}

			const index = firstSelectedItem.index;
			const length = selection.length;

			this.setSelection({ index, length });

		} else {

			console.warn("no item selected in range", selection, item);

		}



	}

	isItemSelected(item) {

		return this.isSelectedAt(item.index);

	}


	// setAbsoluteSelection(selection, ...path) {

	// 	while (path.length) {

	// 		const index = path.pop();

	// 		selection = {
	// 			childId: index,
	// 			child: selection
	// 		};

	// 	}

	// 	this.setSelection(selection);

	// }

	// setDeepSelection(selection, ...path) {

	// 	while (path.length) {

	// 		const index = path.pop();

	// 		selection = {
	// 			[index]: selection
	// 		};

	// 	}

	// 	super.setSelection(selection);

	// }

	// // getDeepSelection(...path) {

	// // 	const selection = super.getSelection();

	// // 	if (path.length === selection.path.length && selection.path.every((id, index) === path[index])) {

	// // 		return {};

	// // 	}

	// // }

	// getDeepSelection(...path) {

	// 	let selection = super.getSelection();

	// 	while (path.length) {

	// 		const index = path.shift();
	// 		selection = selection[index];

	// 	}

	// 	return selection;

	// }

	// getNormalSelection() {

	// 	const selection = this.getDeepSelection2();

	// 	if (selection) {

	// 		const item = this.getItem(...selection.path);

	// 		if (item) {

	// 			const selectedItem = item.children[selection.index];

	// 			if (selectedItem) {

	// 				return { index: selectedItem.index, length: selection.length };

	// 			}

	// 		}

	// 	}

	// }

	// setNormalSelection(selection) {

	// 	const item = this.getItem(...selection.path);

	// 	if (item) {

	// 		const selectedItem = item.children[selection.index];

	// 		if (selectedItem) {

	// 			return { index: selectedItem.index, length: selection.length };

	// 		}

	// 	}

	// }

	// getSelectedIds2() {

	// 	const selection = this.getDeepSelection2();

	// 	if (selection) {

	// 		const { index = 0, length = 0, path = [] } = selection;

	// 		const item = this.getItem(...path);

	// 		if (item) {

	// 			const selectedItems = item.children.slice(index, index + length);

	// 			return selectedItems.map(item => item.id);

	// 		}

	// 	}

	// }

	// selectIds2(ids) {

	// 	const item = this.findItems(item => item.id === ids[0]);

	// 	if (item) {

	// 		const index = item.index;
	// 		const length = ids.length;
	// 		const path = this.getItemPath();

	// 		this.setDeepSelection2({ index, length }, ...path);

	// 	}

	// }

	// getDeepSelection2(...path) {

	// 	let selection = super.getSelection();

	// 	if (selection && selection.path && path.length === selection.path.length && path.every((id, index) => id === selection.path[index])) {

	// 		return selection;

	// 	}

	// }

	// setDeepSelection2(selection, ...path) {

	// 	super.setSelection({ ...selection, path });

	// }

	// getDeepSelectionAt(...path) {

	// 	const selection = this.getSelection();
	// 	const item = this.getItem(...path);

	// 	if (item !== undefined && selection !== undefined) {

	// 		const selectedItems = item.children.filter(item => this.isSelectedAt(item.index));

	// 		if (selectedItems.length) {

	// 			return { index: selectedItems[0].index, length: selectedItems.length };

	// 		}

	// 	}

	// }

	// setDeepSelectionAt(selection, ...path) {

	// 	const item = this.getItem(...path);

	// 	if (!item) {

	// 		console.error("selecting but item is undefined");

	// 	}

	// 	const selectedItem = item.children[selection.index];

	// 	if (!selectedItem) {

	// 		console.error("no item selected in range");

	// 	}

	// 	const index = selectedItem.index;
	// 	const length = Math.min(selection.length, item.children.length);

	// 	this.setSelection({ index, length });

	// }

	// getSelection() {

	// 	const selectedIds = this.getSelectedIds();
	// 	const ids = this.getIds();

	// 	if (selectedIds !== undefined && ids !== undefined) {

	// 		if (selectedIds.length) {

	// 			const index = ids.indexOf(selectedIds[0]);

	// 			if (index > -1) {

	// 				return { index, length: selectedIds.length };

	// 			}

	// 		}

	// 		return {};

	// 	}

	// }



	// setSelection(selection) {

	// 	const ids = this.getIds();

	// 	if (ids === undefined) {

	// 		console.error("setting selection but ids is undefined");

	// 	}

	// 	if (selection.index === undefined || selection.length === undefined) {

	// 		console.error("setting selection but selection is invalid");

	// 	}

	// 	const selectedIds = ids.slice(selection.index, selection.index + selection.length);

	// 	if (selectedIds.length) {

	// 		this.selectIds(selectedIds);

	// 	}

	// }

	// getSelectedIds(item = this.getRoot(), selection = this.getDeepSelection()) {

	// 	if (item === undefined || selection === undefined) {

	// 		return;

	// 	}

	// 	const ids = [];

	// 	for (let i = 0; i < item.children.length; i++) {

	// 		if (selection.length) {

	// 			const items = item.children.slice(selection.index, selection.index + selection.length);

	// 			ids.push(...items.map(item => item.id));

	// 		}

	// 		if (selection[i]) {

	// 			const selectedIds = this.getSelectedIds(item.children[i], selection[i]);

	// 			if (selectedIds === undefined) {

	// 				return;

	// 			}

	// 			ids.push(...selectedIds);

	// 		}

	// 	}

	// 	return ids;
	// }

	// selectIds(ids, item = this.getRoot(), ...path) {

	// 	if (item === undefined) {

	// 		console.error("selecting ids but root item is not set");

	// 	}

	// 	for (let i = 0; i < item.children.length; i++) {

	// 		if (item.children[i].id === ids[0]) {

	// 			this.setDeepSelection({ index: i, length: ids.length }, ...path);

	// 		} else {

	// 			this.selectIds(ids, item.children[i], ...path, i);

	// 		}

	// 	}

	// }


 //  getSelectedItems(selection = this.getSelection()) {

 //    const child = this.getSelectedChild(selection);

 //    if (child) {

 //      return child.getSelectedItems(selection.child);

 //    }

 //    return [];

 //  }

	// hasSelection() {

	// 	const selection = this.getSelection() || {};

	// 	// const tree = this.createTree();
	// 	//
	// 	// if (tree && selection[0]) {
	// 	//
	// 	//   return tree.hasSelection(selection[0]);
	// 	//
	// 	// }

	// 	// if (selection && selection[0]) {
	// 	//
	// 	//   const branch = this.getChild(0);
	// 	//
	// 	//   return branch.hasSelection(selection[0]);
	// 	//
	// 	// }

	// 	if (selection && selection.child) {

	// 		const branch = this.getChild(selection.childId);

	// 		return branch.hasSelection(selection.child);

	// 	}

	// 	return false;

	// }

	// getSubSelection(item, selection) {

	// 	if (selection.index !== undefined) {

	// 		const { index = 0, length = 0 } = selection;

	// 		return { index, length };

	// 	} else {

	// 		for (let i = 0; i < item.children.length; i++) {

	// 			if (selection[i]) {

	// 				return this.getSubSelection(item.children[i], selection[i]);

	// 			}

	// 		}

	// 	}

	// }

	// getSelection() {

	// 	const selection = super.getSelection();
	// 	const item = this.getRoot();

	// 	if (item && selection) {

	// 		return this.getSubSelection(item, selection);

	// 	}

	// }

	// setSelection(selection) {

	// 	const item = this.getRoot();

	// 	for (let i = 0; i < item.children.length; i++) {

	// 	}


	// }

 //  isRowSelected(selection = this.getSelection()) {

 //    if (selection) {

 //      const child = this.getSelectedChild(selection);

 //      if (child) {

 //        return child.isRowSelected();
 //      }

 //    }

 //    return false;
 //  }

  // follow(selection, callback) {
  //
  //   if (selection.final || selection.modal && selection.modal.final) {
  //
  //     return callback(this, selection);
  //
  //   } else if (selection.modal) {
  //
  //     // const modal = this.createChild({
  //     //   ...this.resource.modal,
  //     //   type: "modal",
  //     //   index: "modal",
  //     //   ids: this.getSelectedIds(selection)
  //     // });
  //     //
  //     // return modal.follow(selection.modal, callback);
  //
  //     return this.getChild("modal").follow(selection.modal, callback);
  //
  //   } else if (selection[0]) { // -> follow branches
  //
  //     // const tree = this.createTree();
  //     //
  //     // if (tree.hasSelection(selection)) {
  //     //
  //     //   return callback(this, selection);
  //     //
  //     // } else { // -> follow branches till row
  //     //
  //     //   const branch = this.createChild({
  //     //     type: "branch",
  //     //     children: tree.children,
  //     //     id: tree.id,
  //     //     columns: this.resource.children,
  //     //     depth: 0,
  //     //     index: 0,
  //     //     path: [],
  //     //   });
  //     //
  //     //   return branch.follow(selection[0], callback);
  //     //
  //     // }
  //
  //     return this.getChild(0).follow(selection[0], callback);
  //
  //   }
  //
  // }

  // getModal(selection = this.getSelection()) {

  //   const child = this.getSelectedChild(selection);

  //   if (child) {

  //     if (!child.getModal) {

  //       console.warn("child is not a branch", child, selection);

  //     } else {

  //       return child.getModal(selection.child);

  //     }

  //   }

  // }


  // getChild(index) {

  //   if (index === 0) {

  //     // const tree = this.createTree();

  //     const items = this.getItems() || [{children: []}];

  //     // const root = this.getRoot();



  //     return this.createChild({
  //       type: "branch",
  //       items: items[index].children,
  //       id: "0",
  //       columns: this.resource.modal && this.resource.modal.children || this.resource.children,
  //       modal: this.resource.modal,
  //       hierarchical: this.resource.hierarchical,
  //       depth: 0,
  //       index: index,
  //       path: [],
  //       classes: ["table", "grid", "arrangement", "tree"],
  //       maxDepth: this.resource.maxDepth || 0
  //     });

  //     // const branch = this.createChild({
  //     //   type: "branch",
  //     //   items: items["0"],
  //     //   id: "0",
  //     //   columns: this.resource.children,
  //     //   depth: 0,
  //     //   index: 0,
  //     //   path: [],
  //     //
  //     // });

  //   } else if (index === "modal") {

  //     return this.createChild({
  //       ...this.resource.modal,
  //       type: "modal",
  //       index: "modal"
  //     });

  //   }

  // }

  // getSelectionChild(selection) {

  //   if (selection) {

  //     if (selection.modal) {

  //       return this.createChild({
  //         ...this.resource.modal,
  //         type: "modal",
  //         index: "modal",
  //       });

  //     } else if (selection[0]) {

  //       const items = this.getItems();

  //       return this.createChild({
  //         type: "branch",
  //         items: items[0].children,
  //         id: "0",
  //         columns: this.resource.modal && this.resource.modal.children || this.resource.children,
  //         depth: 0,
  //         index: 0,
  //         path: [],
  //         classes: ["table", "grid", "arrangement", "tree"],
  //         maxDepth: this.resource.maxDepth || 0
  //       });

  //     }

  //   }

  // }

  // copy(selection) {
  //
  //   const tree = this.createTree();
  //
  //   const index = tree.mapIndex(selection[0]);
  //
  //   if (selection[0]) {
  //
  //   }
  //
  // }

  // paste(value, selection) {

  //   // if (selection[0]) {
  //   //
  //   //   // const tree = this.createTree();
  //   //   //
  //   //   // const branch = this.createChild({
  //   //   //   type: "branch",
  //   //   //   children: tree.children,
  //   //   //   id: tree.id,
  //   //   //   columns: this.resource.modal && this.resource.modal.children || this.resource.children,
  //   //   //   depth: 0,
  //   //   //   index: 0,
  //   //   //   path: [],
  //   //   // });
  //   //
  //   //   const branch = this.getChild(0);
  //   //
  //   //   return branch.paste(value, selection[0]);
  //   //
  //   // }


  //   // -> same as field !

  //   if (selection.child) {

  //     const branch = this.getChild(selection.childId);

  //     return branch.paste(value, selection.child);

  //   }

  // }

  // copy(selection) {

  //   // if (selection[0]) {
  //   //
  //   //   // const tree = this.createTree();
  //   //   //
  //   //   // const branch = this.createChild({
  //   //   //   type: "branch",
  //   //   //   children: tree.children,
  //   //   //   id: tree.id,
  //   //   //   columns: this.resource.modal && this.resource.modal.children || this.resource.children,
  //   //   //   depth: 0,
  //   //   //   index: 0,
  //   //   //   path: [],
  //   //   // });
  //   //
  //   //   const branch = this.getChild(0);
  //   //
  //   //   return branch.copy(selection[0]);
  //   //
  //   // }

  //   // -> same as field !

  //   if (selection.child) {

  //     const branch = this.getChild(selection.childId);

  //     return branch.copy(selection.child);

  //   }

  // }

  // delete(selection) {
  //
  //   if (selection[0]) {
  //
  //     const branch = this.getChild(0);
  //
  //     const items = branch.getSelectedItems(selection[0]);
  //
  //     if (items && items.length) {
  //
  //       this.removeIds(items.map(item => item.id));
  //
  //     }
  //
  //   }
  //
  // }


  // remove(index, length, ...path) {

  //   let items = this.getItems();

  //   for (let item of items) {

  //     this.setValue("1", item.id, "trash");

  //   }

  //   items = KarmaFieldsAlpha.DeepArray.clone(items);

  //   const splicedItems = KarmaFieldsAlpha.DeepArray.splice(items, length, [], ...path, index);

  //   const driver = this.getDriver();
  //   KarmaFieldsAlpha.Query.removeIds(driver, splicedItems.map(item => item.id));

  //   KarmaFieldsAlpha.Store.setIds(items);

  //   this.setSelection({index: 0, length: 0});
  //   this.save("delete");
  //   this.render();

  // }



  // clearModalSelection(selection = this.getSelection()) {

  //   // const selection = this.getSelection();
  //   //
  //   // this.setSelection({0: selection[0]}); // = remove modal property

  //   // this.setSelection({child: {}, childId: "modal"});

  //   const child = this.getSelectedChild(selection);

  //   if (child && child.clearModalSelection) {

  //     child.clearModalSelection(selection);

  //   }

  // }




	// build() {

	// 	return {
	// 		class: "arrangement",
	// 		init: body => {
	// 			// body.element.tabIndex = -1;
	// 		},
	// 		update: body => {

	// 			const items = this.getItems();

	// 			if (items) {

	// 				const branch = this.createChild({
	// 					type: "branch",
	// 					items: items[0].children,
	// 					// children: root.children,
	// 					id: "0",
	// 					columns: this.resource.children,
	// 					depth: 0,
	// 					index: 0,
	// 					path: [],
	// 					classes: ["table", "grid", "arrangement", "tree", "root"],
	// 					hierarchical: this.resource.hierarchical
	// 					// maxDepth: this.resource.maxDepth || 0
	// 				});

	// 				body.children = [
	// 					// this.clipboard.build(),
	// 					branch.build()
	// 				];

	// 			}

	// 		}

	// 	}

	// }

	*buildBody() {

		yield {
			class: "karma-field-table-grid-container karma-field-frame karma-field-group final table-body-column table-body-main-column",
			children: this.buildUL()
		}




		// if (root !== undefined) {

		// 	yield {
		// 		class: "arrangement",
		// 		children: this.buildUL(root, 0)
		// 	};

		// } else {

		// 	yield {
		// 		class: "arrangement"
		// 	};

		// }



	}


	// *build() {

	// 	const root = this.getRoot();

	// 	return {
	// 		class: "arrangement",
	// 		// init: body => {
	// 		// 	// body.element.tabIndex = -1;
	// 		// },
	// 		// update: body => {

	// 		// 	const items = this.getItems();

	// 		// 	if (items) {

	// 		// 		const branch = this.createChild({
	// 		// 			type: "branch",
	// 		// 			items: items[0].children,
	// 		// 			// children: root.children,
	// 		// 			id: "0",
	// 		// 			columns: this.resource.children,
	// 		// 			depth: 0,
	// 		// 			index: 0,
	// 		// 			path: [],
	// 		// 			classes: ["table", "grid", "arrangement", "tree", "root"],
	// 		// 			hierarchical: this.resource.hierarchical
	// 		// 			// maxDepth: this.resource.maxDepth || 0
	// 		// 		});

	// 		// 		body.children = [
	// 		// 			// this.clipboard.build(),
	// 		// 			branch.build()
	// 		// 		];

	// 		// 	}

	// 		// },
	// 		children: this.buildUL(root, 0)

	// 	}

	// }

	*buildListHeader(item, index) {

		const columns = this.getColumns();

		const rowField = this.getRow(index, item.id)

		for (let i = 0; i < columns.length; i++) {

			const column = columns[i];

			yield {
				tag: "li",
				init: element => {
					if (column.style) {
						element.style = column.style;
					}
				},
				children: rowField.createChild(column, i).build()
			};

		}


	}

	*buildListContent(item, index, ...path) {

		yield {
			tag: "ul",
			class: "arrangement-item-header",
			children: this.buildListHeader(item, index)
		};

		yield* this.buildUL(item, ...path, index);

	}

	*buildLI(item, ...path) {

		for (let i = 0; i < item.children.length; i++) {

			const child = item.children[i];

			const positionKey = this.getPositionKey();
			const childPosition = this.getValue(child.id, positionKey);

			yield {
				tag: "li",
				class: "arrangement-item",
				update: element => {
					// const isSelected = this.isDeepSelectedAt(i, ...path);
					const isSelected = this.isItemSelected(child);
					element.classList.toggle("selected", Boolean(isSelected));
					element.classList.toggle("empty", child.children.length === 0);
					element.classList.toggle("odd", i % 2 === 0);
				},
				children: this.buildListContent(child, i, ...path)
			};

		}

	}

	*buildUL(item, ...path) {

		if (!item) {

			item = this.getRoot();

		}


		if (item !== undefined) {

		// 	yield* this.buildUL(root);

		// } else {

		// 	yield {
		// 		tag: "ul",
		// 		class: "arrangement-item-body dropzone table grid arrangement tree"
		// 	};

		// }

			yield {
				tag: "ul",
				class: "arrangement-item-body dropzone table grid arrangement tree",
				// init: ul => {
				// 	if (this.resource.classes) {
				// 		ul.element.classList.add(...this.resource.classes);
				// 	}
				// },
				children: this.buildLI(item, ...path),
				update: element => {

					element.style.height = "auto";

					// let selection = this.getDeepSelection(path);
					let selection = this.getItemSelection(item);

					// console.log(selection, element);

					let sorter = new KarmaFieldsAlpha.ListSortHierarchy(element, selection, true, ...path);


					sorter.onSelect = elements => {
						elements.map(element => element.classList.add("selected"));
						// this.setDeepSelection(sorter.state.selection, ...sorter.state.path);
						//

						const item = this.getItem(...sorter.state.path);


						this.setItemSelection(sorter.state.selection, item);
					}

					sorter.onUnselect = elements => {
						elements.map(element => element.classList.remove("selected"));

						// console.log("onUnselect", elements);
					}

					sorter.onSelectionComplete = () => {
						this.setFocus(1);
						// console.log("onSelectionComplete");
						this.render();
					}

					sorter.onSwap = (newState, lastState) => {
						this.save("swap");
						this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);
					};

					sorter.onSort = (newState, lastState) => {

						// this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);
						this.render();
					}

				}
			};

		}

	}

	// *buildUL(item, ...path) {

	// 	return {
	// 		tag: "ul",
	// 		class: "arrangement-item-body dropzone table grid arrangement tree",
	// 		// init: ul => {
	// 		// 	if (this.resource.classes) {
	// 		// 		ul.element.classList.add(...this.resource.classes);
	// 		// 	}
	// 		// },
	// 		update: element => {

	// 			element.style.height = "auto";

	// 			let selection = this.getDeepSelection(path);

	// 			let sorter = new KarmaFieldsAlpha.ListSortHierarchy(ul.element, selection, this.resource.hierarchical, ...path, this.resource.index);

	// 			sorter.onSelect = elements => {
	// 				elements.map(element => element.classList.add("selected"));
	// 				this.setDeepSelection(sorter.state.selection, ...sorter.state.path);
	// 			}

	// 			sorter.onUnselect = elements => {
	// 				elements.map(element => element.classList.remove("selected"));
	// 			}

	// 			sorter.onSelectionComplete = () => {
	// 				this.setFocus(1);
	// 				this.render();
	// 			}

	// 			sorter.onSwap = (newState, lastState) => {
	// 				// this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);
	// 			};

	// 			sorter.onSort = (newState, lastState) => {
	// 				this.save("reorder");
	// 				this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);
	// 				this.render();
	// 			}

	// 			ul.children = items.map((child, index) => {
	// 				// const path = this.resource.path || [];
	// 				const branch = this.createChild({
	// 					type: "branch",
	// 					items: child.children,
	// 					id: child.id,
	// 					// ...child, // -> children + id + parent + i
	// 					columns: this.resource.columns,
	// 					depth: (this.resource.depth || 0) + 1,
	// 					// maxDepth: this.getMaxDepth() - 1,
	// 					index: index,
	// 					path: [...this.resource.path, this.resource.index],
	// 					hierarchical: this.resource.hierarchical
	// 				});

	// 				// const branch = this.getChild(index);

	// 				// return branch.build();

	// 				return {
	// 					tag: "li",
	// 					class: "arrangement-item",
	// 					update: li => {
	// 						// const isSelected = KarmaFieldsAlpha.Selection.check(...path, index);
	// 						// console.log(selection, li.element);
	// 						const isSelected = selection && !selection[selection.index] && KarmaFieldsAlpha.Segment.contain(selection, index);

	// 						li.element.classList.toggle("selected", Boolean(isSelected));
	// 						li.element.classList.toggle("empty", !child.children || child.children.length === 0);
	// 						li.element.classList.toggle("odd", index % 2 === 0);
	// 					},
	// 					children: [
	// 						{
	// 							tag: "ul",
	// 							class: "arrangement-item-header",
	// 							update: header => {
	// 								header.element.classList.toggle("loading", !child.id);


	// 								// if (child.id) {
	// 								const row = branch.createChild({
	// 									id: child.id,
	// 									type: "row",
	// 									children: this.resource.columns || [],
	// 									index: "row",
	// 									rowIndex: branch.resource.index
	// 									// depth: this.resource.depth || 0
	// 								});
	// 								header.children = this.resource.columns.map((child, childIndex) => {
	// 									return {
	// 										tag: "li",
	// 										init: li => {
	// 											if (child.style) {
	// 												li.element.style = child.style;
	// 											}
	// 										},
	// 										child: row.createChild({
	// 											...child,
	// 											index: childIndex
	// 										}).build()
	// 									}
	// 								});
	// 								// }


	// 							}
	// 						},
	// 						branch.build()
	// 					]
	// 				};
	// 			});


	// 		}
	// 	};

	// }

}


// KarmaFieldsAlpha.field.hierarchy.branch = class extends KarmaFieldsAlpha.field {

//   // getValue(...path) {
//   //   return super.getValue(...path);
//   // }

//   copy(selection) {

//     // if (selection && selection[selection.index]) {
//     //
//     //   const branch = this.getChild(selection.index);
//     //
//     //   return branch.copy(selection[selection.index]);
//     //
//     // } else if (selection) {
//     //
//     //   const grid = new KarmaFieldsAlpha.Grid();
//     //   const index = selection.index || 0;
//     //   const length = selection.length || 0;
//     //
//     //   for (let i = 0; i < length; i++) {
//     //
//     //     const child = this.getChild(i + index);
//     //
//     //     const row = child.getChild("row");
//     //
//     //     const rowItems = row.export();
//     //
//     //     grid.addRow(rowItems);
//     //
//     //   }
//     //
//     //   return grid.toString();
//     //
//     // }

//     if (selection && !selection.child) {

//       const grid = new KarmaFieldsAlpha.Grid();
//       const index = selection.index || 0;
//       const length = selection.length || 0;

//       for (let i = 0; i < length; i++) {

//         const child = this.getChild(i + index);

//         const row = child.getChild("row");

//         const rowItems = row.export();

//         grid.addRow(rowItems);

//       }

//       return grid.toString();

//     } else {

//       return super.copy(selection);

//     }

//   }

//   async paste(value, selection) {

//     // if (selection && selection[selection.index]) {
//     //
//     //   const branch = this.getChild(selection.index);
//     //
//     //   return branch.paste(value, selection[i]);
//     //
//     // } else if (selection) {
//     //
//     //   const grid = new KarmaFieldsAlpha.Grid(value);
//     //   const index = selection.index || 0;
//     //   const length = selection.length || 0;
//     //
//     //   if (grid.array.length < length) {
//     //
//     //     this.remove(index + grid.array.length, length - grid.array.length);
//     //
//     //   } else if (grid.array.length > length) {
//     //
//     //     for (let i = 0; i < grid.array.length - length; i++) {
//     //
//     //       await this.add(index + length);
//     //
//     //     }
//     //
//     //   }
//     //
//     //   for (let i = 0; i < grid.array.length; i++) {
//     //
//     //     const rowItems = grid.array[i];
//     //
//     //     const branch = this.getChild(i + index);
//     //     const row = branch.getChild("row");
//     //
//     //     row.import(rowItems);
//     //
//     //   }
//     //
//     // }

//     if (selection && !selection.child) {

//       const grid = new KarmaFieldsAlpha.Grid(value);
//       const index = selection.index || 0;
//       const length = selection.length || 0;

//       if (grid.array.length < length) {

//         this.remove(index + grid.array.length, length - grid.array.length);

//       } else if (grid.array.length > length) {

//         for (let i = 0; i < grid.array.length - length; i++) {

//           await this.add(index + length);

//         }

//       }

//       for (let i = 0; i < grid.array.length; i++) {

//         const rowItems = grid.array[i];

//         const branch = this.getChild(i + index);
//         const row = branch.getChild("row");

//         row.import(rowItems);

//       }

//     } else {

//       super.paste(value, selection);

//     }

//   }

//   // collectIds(selection) {
//   //
//   //   if (selection.final) {
//   //
//   //     const index = selection.index || 0;
//   //     const length = selection.length || 0;
//   //
//   //     return this.resource.children.slice(index, index + length).map(tree => tree.id);
//   //
//   //   } else {
//   //
//   //     for (let i = 0; i < this.resource.children.length; i++) {
//   //
//   //       if (selection[i]) {
//   //
//   //         const child = this.getChild(i);
//   //
//   //         return child.collectIds(selection[i]);
//   //
//   //       }
//   //
//   //     }
//   //
//   //   }
//   //
//   // }


//   // !!  modal needs selected items from above, saucer need selected items from below (transfers)
//   getSelectedItems(selection = this.getSelection()) {

//     // if (selection.final) {
//     //
//     //   const index = selection.index || 0;
//     //   const length = selection.length || 0;
//     //
//     //   return this.resource.items.slice(index, index + length);
//     //
//     // } else {
//     //
//     //   for (let i = 0; i < this.resource.items.length; i++) {
//     //
//     //     if (selection[i]) {
//     //
//     //       const child = this.getChild(i);
//     //
//     //       return child.getSelectedItems(selection[i]);
//     //
//     //     }
//     //
//     //   }
//     //
//     // }

//     // if (selection) {
//     //
//     //   if (selection[selection.index]) {
//     //
//     //     const child = this.getChild(selection.index);
//     //
//     //     return child.getSelectedItems(selection[selection.index]);
//     //
//     //   } else {
//     //
//     //     const index = selection.index || 0;
//     //     const length = selection.length || 0;
//     //
//     //     return this.resource.items.slice(index, index + length);
//     //
//     //   }
//     //
//     // }

//     if (selection) {

//       const index = selection.index || 0;
//       const length = selection.length || 0;

//       return this.resource.items.slice(index, index + length);

//     }

//     return [];


//     // else {
//     //
//     //   for (let i = 0; i < this.resource.items.length; i++) {
//     //
//     //     if (selection[i]) {
//     //
//     //       const child = this.getChild(i);
//     //
//     //       return child.getSelectedItems(selection[i]);
//     //
//     //     }
//     //
//     //   }
//     //
//     // }

//   }

//   // setSelection(selection) {
//   //
//   //   if (selection) {
//   //
//   //     selection = {
//   //       ...this.getSelection(), // keep index/length
//   //       ...selection
//   //     };
//   //
//   //   }
//   //
//   //   super.setSelection(selection);
//   // }

//   hasSelection(selection) {

//     if (selection && selection.child) {

//       const child = this.getChild(selection.childId);

//       return child.hasSelection(selection.child);

//     } else if (selection) {

//       return selection.length > 0;

//     }

//     return false;

//   }

//   getMaxDepth() {

//     return this.resource.maxDepth || 0;

//   }

//   getModal(selection = this.getSelection()) {

//     if (selection && selection.length) {

//       return this.getChild("modal");

//     } else if (selection && selection.child) {

//       const child = this.getSelectedChild(selection);

//       if (child && child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {

//         return child.getModal(selection.child);

//       }

//     }

//     // const child = this.getSelectedChild(selection);
//     //
//     // if (child) {
//     //
//     //   if (child instanceof KarmaFieldsAlpha.field.grid.modal) {
//     //
//     //     return child;
//     //
//     //   } else if (child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {
//     //
//     //     return child.getModal(selection.child);
//     //
//     //   }
//     //
//     // }

//   }

//   clearModalSelection(selection = this.getSelection()) {

//     const child = this.getSelectedChild(selection);

//     if (child && child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {

//       this.clearModalSelection(selection.child);

//     } else if (selection && selection.childId === "modal") {

//       const index = selection.index || 0;
//       const length = selection.length || 0;

//       this.setSelection({index: index, length: length});

//     }

//   }

//   isRowSelected(selection = this.getSelection()) {

//     const child = this.getSelectedChild(selection);

//     if (child && child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {

//       return child.isRowSelected(selection.child);

//     } else {

//       return selection && selection.length ? true : false;

//     }


//   }


//   getChild(index) {

//     if (index === "row") {

//       return this.createChild({
//         id: this.resource.id,
//         type: "row",
//         children: this.resource.columns || [],
//         index: index
//       });

//     } else if (index === "modal") {

//       return this.createChild({
//         type: "modal",
//         ...this.resource.modal,
//         // items: this.resource.items,
//         index: "modal"
//       });

//     } else {

//       const item = this.resource.items[index] || {};

//       return this.createChild({
//         type: "branch",
//         items: item.children || [],
//         // children: tree.children || [],
//         id: item.id,
//         columns: this.resource.columns,
//         modal: this.resource.modal,
//         depth: this.resource.depth++,
//         index: index,
//         path: [...this.resource.path, this.resource.index],
//         maxDepth: this.getMaxDepth() - 1
//       });

//     }

//   }


//   // follow(selection, callback) {
//   //
//   //   if (selection.final) {
//   //
//   //     return callback(this, selection)
//   //
//   //   } else if (selection.row) {
//   //
//   //     const row = this.getChild("row");
//   //
//   //     return row.follow(selection.row, callback);
//   //
//   //   } else {
//   //
//   //     for (let i = 0; i < this.resource.items.length; i++) {
//   //
//   //       const item = this.resource.items[i];
//   //
//   //       if (selection[i]) {
//   //
//   //         // const branch = this.createChild({
//   //         //   type: "branch",
//   //         //   items: item.children,
//   //         //   // children: item.children,
//   //         //   id: item.id,
//   //         //   columns: this.resource.columns,
//   //         //   depth: this.resource.depth++,
//   //         //   index: i,
//   //         //   path: [...this.resource.path, this.resource.index],
//   //         // });
//   //
//   //         const branch = this.getChild(i);
//   //
//   //         return branch.follow(selection[i], callback);
//   //       }
//   //
//   //     }
//   //
//   //   }
//   //
//   // }

//   // getSelectionChild(selection) {
//   //
//   //   if (selection.row) {
//   //
//   //     return this.createChild({
//   //       id: this.resource.id,
//   //       type: "row",
//   //       children: this.resource.columns || [],
//   //       index: "row"
//   //     });
//   //
//   //   } else {
//   //
//   //     for (let index in this.resource.items) {
//   //
//   //       if (selection[index]) {
//   //
//   //         const item = this.resource.items[index];
//   //
//   //         return this.createChild({
//   //           type: "branch",
//   //           items: item.children || [],
//   //           // children: tree.children || [],
//   //           id: item.id,
//   //           columns: this.resource.columns,
//   //           depth: this.resource.depth++,
//   //           index: index,
//   //           path: [...this.resource.path, this.resource.index],
//   //           maxDepth: this.getMaxDepth() - 1
//   //         });
//   //
//   //       }
//   //
//   //     }
//   //
//   //   }
//   //
//   // }



//   // setSelection(selection) {
//   //
//   //   // console.log("setSelection", selection, this.resource);
//   //
//   //   this.parent.setSelection(selection && {
//   //     [this.resource.index]: selection,
//   //     index: this.resource.index,
//   //     length: 0
//   //   });
//   //
//   // }



//   setAbsoluteSelection(selection, ...path) { // -> needed to set a selection with a different path from a reference node

//     // const path = selection.path || [];
//     //
//     // delete selection.path;
//     //
//     // while (path.length) {
//     //
//     //   const index = path.pop();
//     //
//     //   selection = {index: index, length: 0, [index]: selection};
//     //
//     // }


//     // if (selection.path) {
//     //
//     //   const newSelection = {index: selection.path[0], length: 0};
//     //
//     //   KarmaFieldsAlpha.DeepObject.set(newSelection, {index: selection.index, length: selection.length}, ...selection.path);
//     //
//     //   this.setAbsoluteSelection(newSelection);
//     //
//     // } else {
//     //
//     //   this.parent.setAbsoluteSelection(selection);
//     //
//     // }

//     this.parent.setAbsoluteSelection(selection, ...path);

//   }

//   select(selection) {
// console.error("deprecated");
//     this.parent.select({[this.resource.index]: selection});

//   }

//   // swap(originPath, originIndex, destPath, destIndex, length) {
//   swap(index, newIndex, length, path, newPath) {

//     // this.parent.swap(originPath, originIndex, destPath, destIndex, length);
//     this.parent.swap(index, newIndex, length, path, newPath);

//   }

//   delete(selection = this.getSelection()) {

//     // const child = this.getSelectionChild(selection);
//     //
//     // if (child) {
//     //
//     //   child.delete(selection[child.resource.index]);
//     //
//     // } else if (selection) {
//     //
//     //   this.remove(selection.index || 0, selection.length || 0)
//     //
//     // }

//     if (selection && !selection.child) {

//       const index = selection.index || 0;
//       const length = selection.length || 0;

//       this.remove(index, length);

//     } else {

//       super.delete(selection);

//     }

//   }

//   remove(index, length, ...path) {

//     this.parent.remove(index, length, this.resource.index, ...path);

//   }

//   // getPath() {
//   //
//   //   const selection = this.getSelection();
//   //
//   //   if (selection) {
//   //
//   //     return [...this.parent.getPath(), this.resource.index]
//   //
//   //   }
//   //
//   //
//   // }
//   //
//   // getSelectionPath() {
//   //
//   //   const selection = this.getSelection();
//   //
//   //   if (selection) {
//   //
//   //     return [...this.parent.getPath(), this.resource.index]
//   //
//   //   }
//   //
//   //
//   // }

//   build() {

//     return {
//       tag: "ul",
//       class: "arrangement-item-body dropzone",
//       init: ul => {
//         if (this.resource.classes) {
//           ul.element.classList.add(...this.resource.classes);
//         }
//       },
//       update: ul => {


//         const items = this.resource.items || [];
//         ul.element.style.height = "auto";
//         const path = this.resource.path || [];

//         let selection = this.getSelection();

//         // const sorter = new KarmaFieldsAlpha.HSorter(ul.element);
//         //
//         //
//         // sorter.colCount = 1;
//         // sorter.rowCount = items.length;
//         // sorter.currentSelection = selection;
//         // sorter.selection = selection;
//         // sorter.path = [...path, this.resource.index];
//         //
//         // sorter.maxDepth = this.getMaxDepth();

//         // if (selection) {
//         //
//         //   selection = {index: selection.index, length: selection.length}; // -> get ride of subselection
//         //
//         // }




//         let sorter = new KarmaFieldsAlpha.ListSortHierarchy(ul.element, selection, this.resource.hierarchical, ...path, this.resource.index);





//         // if (this.resource.hierarchical) {
//         //
//         //   sorter = new KarmaFieldsAlpha.ListSortHierarchy(ul.element, selection, ...path, this.resource.index);
//         //
//         // } else {
//         //
//         //   sorter = new KarmaFieldsAlpha.ListSorter(ul.element, selection);
//         //
//         // }

//         // sorter.selection = {selection};
//         // sorter.path = [...path, this.resource.index];


//         // sorter.onselect = newSelection => {
//         //
//         //   this.setSelection(newSelection);
//         //   this.deferFocus();
//         //   this.save("nav");
//         //   this.render();
//         //
//         //
//         // }

//         sorter.onSelect = elements => {

//           elements.map(element => element.classList.add("selected"));

//           this.setAbsoluteSelection(sorter.state.selection, ...sorter.state.path);

//         }

//         sorter.onUnselect = elements => {

//           elements.map(element => element.classList.remove("selected"));

//         }

//         sorter.onSelectionComplete = () => {

//           this.deferFocus();
//           this.render();

//         }

//         sorter.onSwap = (newState, lastState) => {

//           // const that = sorter;
//           // debugger;

//           this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);



//         };

//         sorter.onSort = (newState, lastState) => {

//           this.deferFocus();
//           this.save("order");
//           this.render();

//         }





//         // sorter.onsort = (index, newIndex, length, path, newPath) => {
//         //
//         //   this.parent.request("completeSwap");
//         //   this.deferFocus();
//         //   this.save("swap");
//         //   this.render();
//         //
//         // }
//         //
//         // sorter.onSwap = (index, newIndex, length, path, newPath) => {
//         //
//         //   this.swap(index, newIndex, length, path, newPath);
//         //
//         // }
//         //
//         //
//         // sorter.onSelectionChange = newSelection => {
//         //
//         //   this.setSelection(newSelection);
//         //
//         // }
//         //
//         // sorter.onPaintRow = elements => {
//         //   elements.forEach(element => element.classList.add("selected"))
//         // }
//         //
//         // sorter.onUnpaintRow = elements => {
//         //
//         //   elements.forEach(element => element.classList.remove("selected"))
//         // }



//         ul.children = items.map((child, index) => {
//           // const path = this.resource.path || [];
//           const branch = this.createChild({
//             type: "branch",
//             items: child.children,
//             id: child.id,
//             // ...child, // -> children + id + parent + i
//             columns: this.resource.columns,
//             depth: (this.resource.depth || 0) + 1,
//             // maxDepth: this.getMaxDepth() - 1,
//             index: index,
//             path: [...this.resource.path, this.resource.index],
//             hierarchical: this.resource.hierarchical
//           });

//           // const branch = this.getChild(index);

//           // return branch.build();

//           return {
//             tag: "li",
//             class: "arrangement-item",
//             update: li => {
//               // const isSelected = KarmaFieldsAlpha.Selection.check(...path, index);
//               // console.log(selection, li.element);
//               const isSelected = selection && !selection[selection.index] && KarmaFieldsAlpha.Segment.contain(selection, index);

//               li.element.classList.toggle("selected", Boolean(isSelected));
//               li.element.classList.toggle("empty", !child.children || child.children.length === 0);
//               li.element.classList.toggle("odd", index%2 === 0);
//             },
//             children: [
//               {
//                 tag: "ul",
//                 class: "arrangement-item-header",
//                 update: header => {
//                   header.element.classList.toggle("loading", !child.id);


//                   // if (child.id) {
//                     const row = branch.createChild({
//                       id: child.id,
//                       type: "row",
//                       children: this.resource.columns || [],
//                       index: "row",
//                       rowIndex: branch.resource.index
//                       // depth: this.resource.depth || 0
//                     });
//                     header.children = this.resource.columns.map((child, childIndex) => {
//                       return {
//                         tag: "li",
//                         init: li => {
//                           if (child.style) {
//                             li.element.style = child.style;
//                           }
//                         },
//                         child: row.createChild({
//                           ...child,
//                           index: childIndex
//                         }).build()
//                       }
//                     });
//                   // }


//                 }
//               },
//               branch.build()
//             ]
//           };
//         });


//       }
//       // complete: ul => {
//       //   this.sorter.children = [...ul.element.children];
//       // },
//       // children:
//     };

//   }

// }
