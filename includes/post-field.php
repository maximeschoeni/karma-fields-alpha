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
 </style>
<script>
	document.addEventListener("karmaFieldsAlpha", function() {

		let container = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>");

		let resource = <?php echo json_encode($args); ?>;
		let id = "<?php echo $post_id; ?>";

		class MetaField extends KarmaFieldsAlpha.field {

			static form = class extends KarmaFieldsAlpha.field.form {

        static row = class extends KarmaFieldsAlpha.field {

          async request(subject, content, ...path) {

            switch (subject) {

              case "index":
                return this.index;

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
						joins: ["postmeta", "taxonomy"],
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

				}

				// async request(subject, object, ...path) {


        //   console.log(subject, object, ...path);

				// 	// return super.request(subject, object, id, ...path);
        //   return super.request(subject, object, ...path);

				// }

			}

			async request(subject, object, ...path) {
				switch (subject) {
					case "render":
					case "edit":
						await this.render();
						break;
				}
			}

			build() {
				return {
					init: async div => {
						this.render = div.render;
						const form = this.createChild("form");
						// await form.query(form.resource.params);
						div.child = form.build()
					}
				}
			}

		}

		const metaField = new MetaField();

		KarmaFieldsAlpha.build(metaField.build(), container);
	});
</script>
