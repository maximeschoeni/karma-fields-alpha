<?php



Class Karma_Fields_Alpha_Media_Library {

	public function __construct() {

    add_action('karma_fields_init', array($this, 'karma_fields_init'));

  }

	/**
	 * @hook karma_fields_init
	 */
	public function karma_fields_init($karma_fields) {

		$karma_fields->register_driver(
			'medias',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-medias.php',
			'Karma_Fields_Alpha_Driver_Medias'
		);

		$karma_fields->register_driver(
			'files',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-files.php',
			'Karma_Fields_Alpha_Driver_Files'
		);


		$karma_fields->register_menu_item('karma=medias', 'upload.php');

		$karma_fields->register_table(array(

			'driver' => 'posts?post_type=attachment&post_status=inherit',
			'id' => 'medias',
			'type' => 'table',
			'joins' => array(
				'files'
			),
			'ppp' => 100,
			'index' => array(
				'title' => '#',
				'width' => 'auto'
			),
			'style' => 'flex: 1 1 0;',
			// 'orderby' => 'filename',
			'autosave' => false,
			'title' => 'Media Library',
			'header' => array(
				'children' => array(
					'title',
					'count',
					'pagination',
					'close'
				)
			),

			'children' => array(

				array(
					'label' => 'Thumb',
					'sortable' => false,
					'width' => 'auto',
					'type' => 'text',
					// 'value' => '{{image::id::thumbnail}}',
					// 'value' => array('<img src="<>">', 'thumb_src'),
					'value' => array('replace', '<img src="#">', '#', array('get', 'thumb_src')),
					'tag' => 'figure'
				),
				array(
					'label' => 'Filename',
					'sortable' => true,
					'order' => 'asc',
					'width' => '1fr',
					// 'key' => 'filename',
					'key' => 'post_title',
					'type' => 'input'
				),
				array(
					'label' => 'Size',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{size}}',
					// 'value' => array('<> KB', array('size', '/', '1000')),
					// 'value' => array('<> KB', array(array('size', '/', '1000'), 'toFixed')),
					'value' => array('replace', '# KB', '#', array('toFixed', array('/', array('get', 'size'), '1000'))),
					'type' => 'text'
				),
				array(
					'label' => 'Date',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{date::post_date::DD/MM/YYYY}}',
					'value' => array('date', array('get', 'post_date'), 'DD/MM/YYYY'),
					'type' => 'text'
				),
				array(
					'label' => 'Dimensions',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{width}} x {{height}}',
					'value' => array('replace', '# x #', '#', array('get', 'width'), array('get', 'height')),
					'type' => 'text'
				)
			),

			'filters' => array(
				'type' => 'group',
				'display' => 'flex',
				'children' => array(
					array(
						'label' => 'Dates',
						'type' => 'dropdown',
						'key' => 'post_date',
						'options' => array(
							array('id' => '', 'name' => 'All dates')
						),
						'driver' => 'postdate?post_type=attachment&groupby=month',
						'style' => 'flex:1'
					),
					array(
						'label' => 'All media items',
						'type' => 'dropdown',
						'key' => 'post_mime_type',
						'options' => array(
							array('id' => '', 'name' => '–'),
							array('id' => 'image', 'name' => 'Image'),
							array('id' => 'video', 'name' => 'Video'),
							array('id' => 'application', 'name' => 'Document')
						),
						'style' => 'flex:1'
					),
					array(
						'type' => 'input',
						'label' => 'Recherche',
						'key' => 'search',
						'style' => 'flex:1'
					)
				)
			)


		));

	}


}

new Karma_Fields_Alpha_Media_Library;
