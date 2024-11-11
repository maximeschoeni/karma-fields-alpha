<?php



class Karma_Fields_Alpha_Driver_Posttypes {


  /**
	 * query
	 */
  public function query($params) {

    $args = array();

    if (isset($params['ids'])) {

      $ids = explode(',', $params['ids']);

      $args['name'] = $ids[0];

    }

    if (isset($params['id'])) {

      $ids = explode(',', $params['id']);

      $args['name'] = $ids[0];

    }

    if (isset($params['public'])) {

      $args['public'] = (boolean) $params['public'];

    }

    if (isset($params['publicly_queryable'])) {

      $args['publicly_queryable'] = (boolean) $params['publicly_queryable'];

    }





    $post_type_objects = get_post_types($args, 'objects');

    $output = array_values($post_type_objects);

    $output = array_map(function($object) {
      return array(
        'id' => $object->name,
        'name' => $object->label,
        'labels' => $object->labels,
        'description' => $object->description,
        'public' => $object->public,
        'hierarchical' => $object->hierarchical,
        'menu_icon' => $object->menu_icon,
        'cap' => $object->cap,
        'taxonomies' => $object->taxonomies,
        'has_archive' => $object->has_archive,
        'query_var' => $object->query_var,
        'rewrite' => $object->rewrite
      );
    }, $output);

    // var_dump($output);

    return apply_filters('karma_fields_posttypes_driver_query_output', $output, $params);

  }

  /**
   * count
   */
  public function count($params) {

    $output = array_values(get_post_types($params, 'names'));

    return apply_filters('karma_fields_posttypes_driver_query_count', count($output), $params);

  }

}
