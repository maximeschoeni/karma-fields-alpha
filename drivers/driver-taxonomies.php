<?php


Class Karma_Fields_Alpha_Driver_Taxonomies {

  /**
	 * query
	 */
  public function query($params) {

    unset($params['driver']);

    $taxonomy_names = get_taxonomies($params);

    // var_dump($params, $taxonomy_names);

    $output = array();

    foreach ($taxonomy_names as $taxonomy_name) {

      $output[] = array('id' => $taxonomy_name, 'name' => $taxonomy_name);

    }

    return $output;

  }

  /**
	 * query
	 */
  public function count($params) {

    $taxonomy_names = get_taxonomies($params);

    return count($taxonomy_names);

  }



}
