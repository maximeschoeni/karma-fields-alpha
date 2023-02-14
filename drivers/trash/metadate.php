<?php

require_once KARMA_FIELDS_PATH.'/drivers/postmeta.php';

Class Karma_Fields_Driver_Metadate extends Karma_Fields_Driver_Postmeta {

	/**
	 * parse
	 */
  public function parse($value, $key, &$args) {

    if ($value === 'future') {
      $args['meta_query'] = array(
        array(
          'key'     => $key,
          'value'   => date('Y-m-d'),
          'compare' => '>='
        )
      );
    } else {
      $args['meta_query'] = array(
        array(
          'key'     => $key,
          'value'   => $value,
          'compare' => '>='
        ),
        array(
          'key'     => $key,
          'value'   => $value+1,
          'compare' => '<'
        )
      );
    }

  }

  /**
	 * fetch
	 */
  public function fetch($args) {
    global $wpdb;

    // $sql_parts = $karma_fields->get_other_filters_sql($request);
    //
    // $before_where = isset($sql_parts['before']['where']) ? 'WHERE '.$sql_parts['before']['where'] : '';
    // $before_join = isset($sql_parts['before']['join']) ? $sql_parts['before']['join'] : '';

    $results = $wpdb->get_results($wpdb->prepare(
      "SELECT YEAR(pm.meta_value) AS year, COUNT(pm.meta_value) AS total FROM $wpdb->posts AS p
      JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)

      GROUP BY YEAR(pm.meta_value) ORDER BY pm.meta_value DESC",
      $this->key
    ));

    $future_count = intval($wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(pm.meta_value) FROM $wpdb->posts AS p
      JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
      WHERE pm.meta_value > %s",
      $this->key,
      date('Y-m-d')
    )));

    $options = array();

    if ($future_count) {

      $options[] = array(
        'value' => 'future',
        'title' => "Future ($future_count)"
      );

    }

    foreach ($results as $result) {

      $options[] = array(
        'value' => $result->year,
        'title' => $result->year." ({$result->total})"
      );

    }

    return $options;

  }

}
