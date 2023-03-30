<div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-post"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>">

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
</style>
<script>
	document.addEventListener("karmaFieldsAlpha", function() {

    const metaboxIndex = "<?php echo $index; ?>";
		let container = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>");

		let resource = <?php echo json_encode($args); ?>;
		let id = "<?php echo $post_id; ?>";

		class MetaField extends KarmaFieldsAlpha.field {

			static form = class extends KarmaFieldsAlpha.field.form {

        static row = class extends KarmaFieldsAlpha.field {

          // async expect(action, object) {

          //   switch (action) {

          //     // case "gather": {

          //     //   if (this.resource.children) {

          //     //     for (let resource of this.resource.children) {

          //     //       const child = this.createChild(resource);

          //     //       return child.expect(action, object);

          //     //     }

          //     //   }

          //     // }

          //     default: {

          //       if (this.resource.children) {

          //         for (let resource of this.resource.children) {

          //           const child = this.createChild(resource);

          //           await child.expect(action, object);

          //         }

          //       }

          //     }

          //   }

          // }

          request(subject, content, ...path) {

            switch (subject) {

              case "index":
                return this.index;


                // case "cachefiles": {

                //   const cache = new KarmaFieldsAlpha.Buffer("cache", "metabox", metaboxIndex, "attachments");

                //   let promise = cache.get();

                //   if (!promise) {

                //     promise = new Promise(async resolve => {

                //       // debugger;

                //       const idSet = new Set();

                //       await this.expect("gather", {type: "medias", set: idSet});

                //       // console.log(idSet);

                //       // console.log("idSet", idSet);

                //       // const galleries = this.getDescendants().filter(field => field instanceof KarmaFieldsAlpha.field.gallery);

                //       // console.log("galleries", galleries);


                //       // // console.log(galleries);

                //       // const id = this.getKey();
                //       // const set = new Set();

                //       const mediaTable = this.createChild({
                //         type: "form",
                //         driver: "posts"
                //       });

                //       // for (let gallery of galleries) {

                        

                //       //   const mediaIds = await mediaTable.getInitial(id, gallery.resource.key) || [];

                //       //   // console.log("mediaIds", gallery.resource.key, mediaIds);

                //       //   for (let mediaId of mediaIds) {

                //       //     if (mediaId && mediaId !== "0") {

                //       //       set.add(mediaId);

                //       //     }

                //       //   }

                //       // }

                //       const mediaIds = [...idSet];

                //       if (mediaIds.length) {

                //         await mediaTable.query(`ids=${mediaIds.join(",")}`);
                //         await mediaTable.queryRelations("meta", mediaIds);
                //         await mediaTable.queryRelations("filemeta", mediaIds);

                //       }
                      
                //       resolve();

                //     });

                //     cache.set(promise);

                //   }

                //   return promise;
                // }



              default:
                return this.parent.request(subject, content, this.getKey(), ...path);
                break;
            }

          }

          build() {

            return {
              children: this.resource.children.map(resource => {
                return this.createChild(resource).build();
              })
            }

          }

        }

				constructor() {
					super({
						driver: "posts",
						// joins: ["postmeta", "taxonomy"],
            relations: ["meta", "taxonomy"],
						params: {
							ids: id
						},
						children: [
              {
                type: "row",
                key: id,
                children: [resource]
              }
            ]
					});

					this.buffer.getObject = function() {
						return {
							data: {
								posts: {
									[id]: JSON.parse(input.value || "{}")
								}
							}
						};
					};

					this.buffer.setObject = function(delta) {
						input.value = JSON.stringify(delta.data.posts[id]);
					}


          this.delta.getObject = function() {
						return {
							data: {
								posts: {
									[id]: JSON.parse(input.value || "{}")
								}
							}
						};
					};

					this.delta.setObject = function(delta) {
						input.value = JSON.stringify(delta.data.posts[id]);
					}

				}

				// async request(subject, object, ...path) {


        //   console.log(subject, object, ...path);

				// 	// return super.request(subject, object, id, ...path);
        //   return super.request(subject, object, ...path);

				// }

			}

			request(subject, object, ...path) {
				switch (subject) {
					case "render":
					case "edit":
						this.render();
						break;

				}
			}

			build() {
				return {
					init: async div => {
						

            // addEventListener("keyup", event => {
            //   form.expect("keyup", {key: event.key});
            // });

            // await form.request("query");
            


						// await form.query(form.resource.params);
						

					},
          update: div => {
            this.render = div.render;
            div.child = this.createChild("form").build();
          },
          complete: async div => {
            // const form = this.createChild("form");
            // const ready = await form.loadMore();

            const process = await KarmaFieldsAlpha.Query.process();


            console.log("complete", process);


            this.count ||= 0;

            if (process && this.count < 100) {

              div.render();

            }

            this.count++

            // 
          }
				}
			}

		}

		const metaField = new MetaField();

		KarmaFieldsAlpha.build(metaField.build(), container);
	});
</script>
