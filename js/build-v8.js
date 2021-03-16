 /**
  * build (V8)
  */
KarmaFields.buildCounter = 0;
KarmaFields.build = function(args, parentElement, parentItem, index, hard) {
 	if (args) {
 		var item = parentItem && parentItem.childrenItems[index || 0] || {};
 		var tag = args.tag || "div";
 		var state = args.state || tag;
 		if (args.init) {
 			item.init = args.init;
 		}
 		if (args.update) {
 			item.update = args.update;
 		}
 		if (args.children) {
 			item.children = args.children;
 		}
 		if (args.child) {
 			item.child = args.child;
 		}
 		if (item.state !== state || hard) {
 			var newElement = document.createElement(tag);
 			if (args.class) {
 				newElement.className = args.class;
 			}
 			if (item.element) {
 				parentElement.replaceChild(newElement, item.element);
 			} else {
 				parentElement.appendChild(newElement);
 			}
 			item.element = newElement;
      item.path = (parentItem && parentItem.path || "/")+"/"+tag;
 			item.state = state;
 			item.childrenItems = {};
 			item.length = 0;
 			item.render = function(hard) {

        // KarmaFields.buildCounter++
        // var timerId = item.path+"-"+KarmaFields.buildCounter;
        // console.time(timerId);

 				var children = [];
 				if (item.child) {
 					children = [item.child];
 				} else if (item.children) {
 					children = item.children;
 				}
 				item.length = Math.max(item.length, children.length);
 				for (var i = 0; i < item.length; i++) {
 					item.childrenItems[i] = KarmaFields.build(children[i], newElement, item, i, hard);
 				}
 				item.length = Math.min(item.length, children.length);

        // console.timeEnd(timerId);

 			}
			item.data = {};
 			if (item.init) {
 				item.init(item);
 			}
 		}
 		if (item.update) {
      // var timerId = item.path;
      // console.time(timerId);
 			item.update(item);
      // console.timeEnd(timerId);
 		}
 		if (item.render) {
 			item.render();
 		}
 		return item;
 	} else if (parentItem && parentItem.childrenItems[index]) {
 		var item = parentItem.childrenItems[index];
 		if (item.remove) {
 			item.remove(item);
 		}
 		parentElement.removeChild(item.element);
 	}
 };
