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
		var resource = <?php echo json_encode($this->resource) ?>;
		var index = <?php echo $this->index; ?>;
		var field = new KarmaFieldsAlpha.field.saucer(resource, "karma-fields-field-nav");

		field.uid = "saucer";
		field.id = "saucer";

		// KarmaFieldsAlpha.embeds.push({
		// 	...resource,
		// 	index: "board",
		// 	type: "board"
		// });

		KarmaFieldsAlpha.embeds["board"] = {type: "board"};



		// field.renderPromise = KarmaFieldsAlpha.build(field.build(), container);
		KarmaFieldsAlpha.saucer = field;

		KarmaFieldsAlpha.tables = resource.tables || {};


		sessionStorage.clear();
		KarmaFieldsAlpha.History.setIndex(0);



		await KarmaFieldsAlpha.Database.States.clear();
		await KarmaFieldsAlpha.Database.Vars.clear();
		await KarmaFieldsAlpha.Database.Queries.clear();
		await KarmaFieldsAlpha.Database.History.clear();

		console.log("clear db");

		await field.render();

		// document.dispatchEvent(new CustomEvent('karmaFieldsAlpha'));
	});
</script>
