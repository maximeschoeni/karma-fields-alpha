
KarmaFieldsAlpha.DeepObject = class {};
KarmaFieldsAlpha.FlatObject = class {};

/**
 * KarmaFieldsAlpha.DeepObject.assignFromPath({"a": 2}, ["b", "c"], 3); // -> {"a": 2, "b": {"c":3}}
 */
KarmaFieldsAlpha.DeepObject.assign = function(object, pathKeys, value) {
  let key = pathKeys.shift();
  if (!object[key] || typeof object[key] !== "object") {
    object[key] = {};
  }
  if (pathKeys && pathKeys.length > 0) {
    this.assign(object[key], pathKeys, value);
  } else {
    object[key] = value;
  }
}

/**
 * KarmaFieldsAlpha.DeepObject.get({"a": {"b": 5}}, ["a", "b"]); // -> 5
 */
KarmaFieldsAlpha.DeepObject.get = function(object, pathKeys) {
	if (pathKeys && pathKeys.length) {
    let key = pathKeys.shift();
		if (object && typeof object === "object") {
			return this.get(object[key], pathKeys);
		}
	} else {
		return object;
	}
};

/**
 * KarmaFieldsAlpha.FlatObject.fromDeep({"a": {"b": 5, "c":6}}); // -> {"a/b": 5, "a/c": 6}
 */
KarmaFieldsAlpha.FlatObject.fromDeep = function(deepObject, path) {
  const flatObject = {};
  if (deepObject && typeof deepObject === "object") {
    for (let key in deepObject) {
      Object.assign(flatObject, this.fromDeep(deepObject[key], (path && path+"/" || "")+key));
    }
  } else {
    flatObject[path] = deepObject;
  }
  return flatObject;
}

/**
 * KarmaFieldsAlpha.FlatObject.toObject({"a/b": 5, "a/c": 6}); // -> {"a": {"b": 5, "c":6}}
 */
KarmaFieldsAlpha.FlatObject.toObject = function(flatObject) {
	let deepObject;
	for (let path in flatObject) {
		if (!deepObject) {
			deepObject = {};
		}
		KarmaFieldsAlpha.DeepObject.assign(deepObject, path.split("/"), flatObject[path]);
	}
	return deepObject;
}

/**
 * KarmaFieldsAlpha.FlatObject.toDeep({"a/b": 5, "a/c": 6}); // -> {"a": {"b": 5, "c":6}};
 * KarmaFieldsAlpha.FlatObject.toDeep({"a/b": 5, "a/c": 6}, "a"); // -> {"b": 5, "c":6};
 */
KarmaFieldsAlpha.FlatObject.toDeep = function(flatObject, dirPath) {
	let deepObject;
	if (dirPath) {
		flatObject = this.slice(flatObject, dirPath+"/");
	}
	for (let path in flatObject) {
		if (!deepObject) {
			deepObject = {};
		}
		KarmaFieldsAlpha.DeepObject.assign(deepObject, path.split("/"), flatObject[path]);
	}
	return deepObject;
}


/**
 * KarmaFieldsAlpha.FlatObject.slice({"a/b": 5, "a/c": 6, "d": 7}, "a/"); // -> {"b": 5, "c":6}
 */
KarmaFieldsAlpha.FlatObject.slice = function(flatObject, dirPath) {
	const subFlatObj = {};
	for (let path in flatObject) {
		if (path.startsWith(dirPath)) {
			const subpath = path.slice(dirPath.length);
			subFlatObj[subpath] = flatObject[path];
		}
	}
	return subFlatObj;
}

/**
 * KarmaFieldsAlpha.FlatObject.count({"a/b": 5, "a/c": 6, "d": 7}, "a/"); // -> 2
 */
KarmaFieldsAlpha.FlatObject.count = function(flatObject, dirPath) {
	let num = 0;
	for (let path in flatObject) {
		if (path.startsWith(dirPath)) {
			num++;
		}
	}
	return num;
}

/**
 * KarmaFieldsAlpha.FlatObject.count({"a/b": 5, "a/c": 6, "d": 7}, "a/"); // -> 2
 */
KarmaFieldsAlpha.FlatObject.has = function(flatObject, dirPath) {
	for (let path in flatObject) {
		if (path.startsWith(dirPath)) {
			return true;
		}
	}
	return false;
}

/**
 * KarmaFieldsAlpha.FlatObject.assign({"a": 5, "b/c": 6}, {"d": {"e": 7}}); // -> {"a": 5, "b/c": 6, "d/e": 7}
 */
KarmaFieldsAlpha.FlatObject.assign = function(flatObject, deepObject, dirPath) {
	Object.assign(flatObject, this.fromDeep(deepObject, dirPath));
}
