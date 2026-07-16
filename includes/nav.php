<style>
	.saucer {
    /* color: var(--theme-color); */
    /* --border-width: 1px; */
		--border-radius: 3px;
  }
	.karma-fields .karma-field-table h1 {
		/* color: var(--text-color); */
	}
</style>
<div id="board" class="karma-fields"></div>

<script>


	document.addEventListener("DOMContentLoaded", async event => {

		// var container = document.getElementById("karma-fields-field-nav");
		// var container = document.getElementById("wp-admin-bar-karma-fields-in-admin-bar");
		// var resource = <?php // echo json_encode($this->resource) ?>;
		// var index = <?php // echo $this->index; ?>;
		// var field = new KarmaFieldsAlpha.field.saucer(resource, "karma-fields-field-nav");

		// field.uid = "saucer";
		// field.id = "saucer";

		// KarmaFieldsAlpha.embeds.push({
		// 	...resource,
		// 	index: "board",
		// 	type: "board"
		// });

		// KarmaFieldsAlpha.embeds["board"] = {type: "board"};

		KarmaFieldsAlpha.instances.push({
			element: document.getElementById("board"),
			resource: {type: "board"}
		});



		// field.renderPromise = KarmaFieldsAlpha.build(field.build(), container);
		// KarmaFieldsAlpha.saucer = field;



		// sessionStorage.clear();
		// KarmaFieldsAlpha.Session.init(); // -> create a session id if there isn't
		// KarmaFieldsAlpha.History.init(); // -> replaceState index to 0


		// const [navigation] = performance.getEntriesByType("navigation") || [];

		// if (navigation.type === "reload") { // page was reloaded -> drop history

		// 	console.log("reload");

		// 	history.replaceState({ karmaHistoryIndex: 0 }, "");

		// 	KarmaFieldsAlpha.History.current = 0;
		// 	await KarmaFieldsAlpha.Store.history.clear();

		// } else {

			// const currentSession = KarmaFieldsAlpha.Session.getId();
			// await KarmaFieldsAlpha.Store.history.delete(object => object.session !== currentSession);

		// }




		await KarmaFieldsAlpha.saucer.render();

		// document.dispatchEvent(new CustomEvent('karmaFieldsAlpha'));
	});
</script>
