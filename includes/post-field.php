<?php /*
<!-- <div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-post"></div> -->
<!-- <input type="hidden" name="karma-fields-items[]" id="karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>"> -->
*/ ?>

<div id="karma-fields-container-<?php echo $index; ?>" class="karma-fields karma-fields-post"></div>

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
 <style>
  .karma-fields .array .td.selected,
  .karma-fields .array .td.selecting,
  .karma-fields .array .td.selected .td,
  .karma-fields .array .td.selecting .td,
  .karma-fields .array .td.selected .th,
  .karma-fields .array .td.selecting .th {
    background-color: #f0f0f1;
  }
  .karma-field-group {
    min-width: 0;
  }

  .karma-field-tinymce .tinymce {
    /* max-height: 66.66vh;
    overflow: auto; */
  }
  .karma-tinymce .editor-header .toolbar {
    top: 3em;
  }
</style>
<script>
  
	// document.addEventListener("karmaFieldsAlpha", function() {

  addEventListener("DOMContentLoaded", () => {
    const index = <?php echo $index; ?>;
		// let container = document.getElementById("karma-fields-post-<?php //echo $post_id; ?>-field-<?php //echo $index; ?>-container");
		// let input = document.getElementById("karma-fields-post-<?php //echo $post_id; ?>-input-<?php //echo $index; ?>");

    let container = document.getElementById("karma-fields-container-<?php echo $index; ?>");


		let resource = <?php echo json_encode($args); ?>;
		let id = "<?php echo $post_id; ?>";
    let driver = "posts";

		// class MetaField extends KarmaFieldsAlpha.field {

		// 	static form = class extends KarmaFieldsAlpha.field.form {

    //     static row = class extends KarmaFieldsAlpha.field {

    //       getValue(key) {

    //         return this.parent.getValue(this.resource.id, key);

    //       }

    //       setValue(value, key) {

    //         this.parent.setValue(value, this.resource.id, key);

    //       }

    //       modified(...path) {

    //         return this.parent.modified(this.resource.id, ...path);

    //       }

    //       getIndex() {

    //         return this.resource.index;

    //       }

    //       getId() {
    //         return this.resource.id;
    //       }

    //       // request(subject, content, ...path) {

    //       //   switch (subject) {

    //       //     case "index":
    //       //       return this.index;


    //       //     default:
    //       //       return this.parent.request(subject, content, this.getKey(), ...path);
    //       //       break;
    //       //   }

    //       // }

    //       build() {

    //         return {
    //           children: this.resource.children.map((resource, index) => {
    //             return this.createChild({
    //               id: index,
    //               ...resource,
    //               uid: `${this.resource.uid}-${index}`,
    //               index: index
    //             }).build();
    //           })
    //         }

    //       }

    //     }

		// 		constructor() {
		// 			super({
		// 				driver: "posts",
		// 				// joins: ["postmeta", "taxonomy"],
    //         relations: ["meta", "taxonomy"],
		// 				params: {
		// 					ids: id
		// 				},
		// 				children: [
    //           {
    //             type: "row",
    //             id: id,
    //             index: 0,
    //             key: id,
    //             children: [resource]
    //           }
    //         ]
		// 			});

		// 			this.buffer.getObject = function() {
		// 				return {
		// 					data: {
		// 						posts: {
		// 							[id]: JSON.parse(input.value || "{}")
		// 						}
		// 					}
		// 				};
		// 			};

		// 			this.buffer.setObject = function(delta) {
		// 				input.value = JSON.stringify(delta.data.posts[id]);
		// 			}


    //       this.delta.getObject = function() {
		// 				return {
		// 					data: {
		// 						posts: {
		// 							[id]: JSON.parse(input.value || "{}")
		// 						}
		// 					}
		// 				};
		// 			};

		// 			this.delta.setObject = function(delta) {
		// 				input.value = JSON.stringify(delta.data.posts[id]);
		// 			}

		// 		}

		// 	}

    //   edit() {
    //     this.render();
    //   }

		// 	// request(subject, object, ...path) {
		// 	// 	switch (subject) {
		// 	// 		case "render":
		// 	// 		case "edit":
		// 	// 			this.render();
		// 	// 			break;

		// 	// 	}
		// 	// }

		// 	build() {
		// 		return {
		// 			init: async div => {
						
    //         const clipboard = KarmaFieldsAlpha.Clipboard.getElement();

    //         clipboard.onblur = event => {
    //           this.createChild("form").clearSelection();
    //           div.render();
    //         }
    //         // clipboard.oninput = event => {
    //         //   debugger;
    //         //   const json = KarmaFieldsAlpha.Clipboard.read();
    //         //   this.createChild("form").paste(json);
    //         //   div.render();
    //         // }
            

    //         clipboard.onpaste = event => {
    //           event.preventDefault();
    //           const string = event.clipboardData.getData("text/plain").normalize();
    //           clipboard.value = string;
    //           this.createChild("form").paste(string);
    //           div.render();
    //         }

    //         clipboard.oncut = event => {
    //           event.preventDefault();
    //           event.clipboardData.setData("text/plain", clipboard.value);
    //           clipboard.value = "";
    //           this.createChild("form").paste("");
    //           div.render();
    //         }

    //         clipboard.onkeyup = event => {
    //           if (event.key === "Delete" || event.key === "Backspace") {
    //             clipboard.value = "";
    //             this.createChild("form").paste("");
    //             div.render();
    //           }
    //         }

    //         // addEventListener("keyup", event => {
    //         //   form.expect("keyup", {key: event.key});
    //         // });

    //         // await form.request("query");
            


		// 				// await form.query(form.resource.params);
						

		// 			},
    //       update: div => {
    //         this.render = div.render;
    //         div.child = this.createChild("form").build();
    //       },
    //       complete: async div => {
    //         // const form = this.createChild("form");
    //         // const ready = await form.loadMore();

    //         const process = await KarmaFieldsAlpha.Query.process();


    //         console.log("complete", process);


    //         this.count ||= 0;

    //         if (process && this.count < 100) {

    //           div.render();

    //         }

    //         this.count++

    //         // 
    //       }
		// 		}
		// 	}

		// }

		// const metaField = new MetaField();

		// KarmaFieldsAlpha.build(metaField.build(), container);

    const postform = new KarmaFieldsAlpha.field.postform({
      driver: driver,
      id: id,
      ...resource,
      index: index,
      type: "postform"
    });

		KarmaFieldsAlpha.build(postform.build(), container);
	});
</script>
