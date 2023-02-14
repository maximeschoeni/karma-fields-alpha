<?php


Class Karma_Fields_Driver_Taxonomy {


  /**
	 * get
	 */
  public function get($id, $key, $request, $karma_fields) {

    return get_terms(array(
      'object_ids' => $id,
      'taxonomy' => $key,
      'fields' => 'ids'
    ));

  }

  /**
	 * update
	 */
  public function update($data, $output, $request, $karma_fields) {

    foreach ($data as $id => $item) {

      foreach ($item as $key => $value) {

        wp_set_post_terms($id, $value, $key);

      }

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::query
	 */
  public function order(&$args, $orderby, $order = 'ASC') {

    // $args['meta_query'][$orderby] = array(
    //   'relation' => 'OR',
    //   array(
    //     'key' => $orderby,
    //     'compare' => 'EXISTS'
    //   ),
    //   array(
    //     'key' => $orderby,
    //     'compare' => 'NOT EXISTS'
    //   )
    // );
    //
    // $args['orderby'] = array(
    //   $orderby => $order,
    //   'title' => 'ASC' // -> todo: add filter to have this customizable
    // );

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::query
	 */
  public function filter(&$args, $filters) {

    foreach ($filters as $key => $value) {

      $args['tax_query'][] = array(
        'taxonomy' => $key,
        'field'    => 'term_id',
        'terms'    => $value,
      );

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::query
	 */
  public function columns_posts_query(&$posts, $key) {

    foreach ($posts as &$post) {

      $post->$key = get_terms(array(
        'object_ids' => $post->ID,
        'taxonomy' => $key,
        'fields' => 'ids'
      ));

    }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::fetch
	 */
  public function filter_fetch(&$clauses, $filters) {
    global $wpdb;

    // foreach ($filters as $key => $value) {
    //
    //   $key = esc_sql($key);
    //
    //   if (!is_array($value)) {
    //
    //     $value = array($value);
    //
    //   }
    //
    //   $value = array_map('intval', $value);
    //   $value = array_filter($value);
    //
    //   if ($value) {
    //
    //     $clauses['join']['tt'] = "INNER JOIN {$wpdb->term_taxonomy} AS tt ON (t.term_id = tt.term_id)";
    //     $clauses['join']['tr'] = "INNER JOIN {$wpdb->term_relationships} AS tr ON (tr.term_taxonomy_id = tt.term_taxonomy_id)";
    //
    //     $clauses['where'][] = "tr.object_id IN ($value)";
    //
    //   }
    //
    //
    //
    // }

  }

  /**
	 * @hook Karma_Fields_Driver_Posts::fetch
	 */
  public function init_fetch(&$clauses, $key, $alias) {
    global $wpdb;

// "    SELECT t.*, tt.*, tr.object_id
// FROM wp_terms AS t
// INNER JOIN wp_term_taxonomy AS tt
// ON t.term_id = tt.term_id
// INNER JOIN wp_term_relationships AS tr
// ON tr.term_taxonomy_id = tt.term_taxonomy_id
// WHERE tt.taxonomy IN ('member_status', 'member_activity', 'country')
// AND tr.object_id IN (12624, 12625, 12626, 12627, 12628, 12629, 12630, 12631, 12632, 12633, 12634, 12635, 12636, 12637, 12638, 12639, 12640, 12641, 12642, 12643, 12644, 12645, 12646, 12647, 12648, 12649, 12650, 12651, 12652, 12653, 12654, 12655, 12656, 12657, 12658, 12659, 12660, 12661, 12662, 12663, 12664, 12665, 12666, 12667, 12668, 12669, 12670, 12671, 12672, 12673, 12674, 12675, 12676, 12677, 12678, 12679, 12680, 12681, 12682, 12683, 12684, 12685, 12686, 12687, 12688, 12689, 12690, 12691, 12692, 12693, 12694, 12695, 12696, 12697, 12698, 12699, 12700, 12701, 12702, 12703)
// ORDER BY t.name ASC"


    // $clauses['select'] = "t.term_id AS 'key', t.name AS 'name'";
    // $clauses['join']['tt'] = "INNER JOIN {$wpdb->term_taxonomy} AS tt ON (t.term_id = tt.term_id)";
    // $clauses['join']['tr'] = "INNER JOIN {$wpdb->term_relationships} AS tr ON (tr.term_taxonomy_id = tt.term_taxonomy_id)";

    // $clauses['where'][] = "tt.taxonomy IN ('member_status', 'member_activity', 'country')"

    // $clauses['order'] = "t.name ASC";

  }



  /**
	 * fetch
	 */
  public function fetch($key, $params, $request, $karma_fields) {
    global $wpdb;

    $clauses = array();

    $taxonomy = esc_sql($key);

    // $this->init_fetch($clauses, $key);

    // if (isset($params['filters'])) {
    //
    //   foreach ($params['filters'] as $driver_name => $filters) {
    //
    //     if ($driver_name !== $this->name) {
    //
    //       $driver = $karma_fields->get_driver($driver_name);
    //
    //       if (method_exists($driver, 'filter_fetch')) {
    //
    //         $driver->filter_fetch($clauses, $filters);
    //
    //       }
    //
    //     } else {
    //
    //       if (isset($filters[$key])) {
    //
    //         unset($filters[$key]);
    //
    //       }
    //
    //       $this->filter_fetch($clauses, $filters);
    //
    //     }
    //
    //   }
    //
    // }

    // if (method_exists($this, 'filter_fetch_clauses')) {
    //
    //   $this->filter_fetch_clauses($clauses);
    //
    // }

    $clauses['join']['tt'] = "LEFT JOIN {$wpdb->term_taxonomy} AS tt ON (t.term_id = tt.term_id)";
    $clauses['join']['tr'] = "LEFT JOIN {$wpdb->term_relationships} AS tr ON (tr.term_taxonomy_id = tt.term_taxonomy_id)";
    $clauses['join']['p'] = "LEFT JOIN {$wpdb->term_relationships} AS tr ON (tr.object_id = p.ID)";
    $clauses['where'][] = "tt.taxonomy = $taxonomy";
    $clauses['group'] = "tt.term_taxonomy_id";
    $clauses['order'] = "t.name ASC";

    $select = "SELECT t.term_id AS 'key', t.name AS 'name' FROM $wpdb->terms AS t";

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
