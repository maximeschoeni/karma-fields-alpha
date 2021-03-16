<?php


Class Karma_Fields_Driver_Postmeta {


  /**
	 * get
	 */
  public function get($id, $key, $request, $karma_fields) {

    return get_post_meta($id, $key, true);
  }

  /**
	 * update
	 */
  public function update($data, $output, $request, $karma_fields) {

    foreach ($data as $id => $item) {

      foreach ($item as $key => $value) {
        //
        // var_dump($key, $value);
        // die();

        update_post_meta($id, $key, $value);

      }

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::query
	 */
  public function order(&$args, $orderby, $order = 'ASC') {

    $args['meta_query'][$orderby] = array(
      'relation' => 'OR',
      array(
        'key' => $orderby,
        'compare' => 'EXISTS'
      ),
      array(
        'key' => $orderby,
        'compare' => 'NOT EXISTS'
      )
    );

    $args['orderby'] = array(
      $orderby => $order,
      'title' => 'ASC' // -> todo: add filter to have this customizable
    );

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::query
	 */
  public function filter(&$args, $filters) {

    foreach ($filters as $key => $value) {

      $args['meta_query'][] = array(
        'key' => $key,
        'value' => $value
      );

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::query
	 */
  public function columns_posts_query(&$posts, $key) {

    foreach ($posts as &$post) {

      $post->$key = get_post_meta($post->ID, $key, true);

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::fetch
	 */
  public function filter_fetch(&$clauses, $filters) {
    global $wpdb;

    foreach ($filters as $key => $value) {

      $key = esc_sql($key);
      $value = esc_sql($value);

      $alias = 'pm_'.preg_replace('#[^a-z]#', '', $key);

      $clauses['where'][] = "$alias.meta_value = $value";
      $clauses['join'][$alias] = "INNER JOIN {$wpdb->postmeta} AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = '$key')";

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::fetch
	 */
  public function init_fetch(&$clauses, $key, $alias) {
    global $wpdb;

    $clauses['select'] = "$alias.meta_value AS 'key', $alias.meta_value AS 'name'";
    $clauses['join'][$alias] = "INNER JOIN {$wpdb->postmeta} AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = '$key')";
    $clauses['group'] = "$alias.meta_value";
    $clauses['order'] = "$alias.meta_value ASC";

  }



  /**
	 * fetch spectacles
	 */
  public function fetch($key, $params, $request, $karma_fields) {
    global $wpdb;

    $clauses = array();

    $key = esc_sql($key);
    $alias = 'pm_'.preg_replace('#[^a-z]#', '', $key);

    $this->init_fetch($clauses, $key, $alias);

    // $key = esc_sql($key);
    // $alias = 'pm_'.preg_replace('#[^a-z]#', '', $key);
    //
    // $clauses['select'] = "$alias.meta_value AS 'key', $alias.meta_value AS 'name'";
    // $clauses['join'][$alias] = "INNER JOIN {$wpdb->postmeta} AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = '$key')";
    // $clauses['group'] = "$alias.meta_value";
    // $clauses['order'] = "$alias.meta_value ASC";

    if (isset($params['filters'])) {

      foreach ($params['filters'] as $driver_name => $filters) {

        if ($driver_name !== $this->name) {

          $driver = $karma_fields->get_driver($driver_name);

          if (method_exists($driver, 'filter_fetch')) {

            $driver->filter_fetch($clauses, $filters);

          }

        } else {

          if (isset($filters[$key])) {

            unset($filters[$key]);

          }

          $this->filter_fetch($clauses, $filters);

        }

      }

    }

    if (method_exists($this, 'filter_fetch_clauses')) {

      $this->filter_fetch_clauses($clauses);

    }

    if (isset($clauses['select'])) {

      $select = "SELECT {$clauses['select']} FROM $wpdb->posts AS p";

    } else {

      $select = "SELECT * FROM $wpdb->posts AS p";

    }

    if (isset($clauses['where'])) {

      $where = "WHERE ".implode(" AND ", $clauses['where']);

    } else {

      $where = '';

    }

    if (isset($clauses['join'])) {

      $join = implode(" ", $clauses['join']);

    } else {

      $join = '';

    }

    if (isset($clauses['group'])) {

      $group = "GROUP BY {$clauses['group']}";

    } else {

      $group = '';

    }

    if (isset($clauses['order'])) {

      $order = "ORDER BY {$clauses['order']}";

    } else {

      $order = '';

    }

    $sql = "$select $join $where $group $order";

    $output = array();
    $output['sql'] = $sql;
    $output['items'] = $wpdb->get_results($sql);

    return $output;

  }




}
