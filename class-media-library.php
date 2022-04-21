<?php



Class Karma_Fields_Alpha_Media_Library {

	public function __construct() {

    add_action('karma_fields_init', array($this, 'karma_fields_init'));

  }

	/**
	 * @hook karma_fields_init
	 */
	public function karma_fields_init($karma_fields) {

		$karma_fields->register_table(array(

			'driver' => 'media-library',
			'key' => 'media-library',
			'type' => 'table',
			'ppp' => 100,
			'index' => array(
				'title' => '#',
				'width' => 'auto'
			),
			'style' => 'flex: 1 1 0;',
			'orderby' => 'filename',
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
					'value' => 'picto'
				),
				array(
					'label' => 'Filename',
					'sortable' => true,
					'order' => 'asc',
					'width' => 'auto',
					'style' => 'max-width: 9em;',
					'key' => 'filename',
					'type' => 'input'
				),
				array(
					'label' => 'Size',
					'sortable' => true,
					'width' => 'auto',
					'value' => 'size',
					'type' => 'text'
				),
				array(
					'label' => 'Date',
					'sortable' => true,
					'width' => 'auto',
					'value' => 'date',
					'type' => 'text'
				),
				array(
					'label' => 'Dimensions',
					'sortable' => true,
					'width' => 'auto',
					'value' => 'dimensions',
					'type' => 'text'
				)
			),

			'filters' => array(
				'type' => 'group',
				'display' => 'flex',
				'children' => array(
					array(
						'type' => 'input',
						'label' => 'Recherche',
						'value' => '',
						'key' => 'search',
						'style' => 'flex:1'
					)
				)
			)


		));

	}


}

new Karma_Fields_Alpha_Media_Library;
