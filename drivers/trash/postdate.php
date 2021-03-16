<?php

require_once KARMA_FIELDS_PATH.'/drivers/postfield.php';

Class Karma_Fields_Driver_Postdate extends Karma_Fields_Driver_Postfield {

	/**
	 * parse
	 */
  public function parse($value, &$args) {

    $values = explode('-', $value);

    $args['date_query'] = array(
      'year' => $values[0],
      'month' => $values[1]
    );

  }

  /**
	 * fetch
	 */
  public function fetch($args) {
    global $wpdb; //, $wp_locale;

    // $sql_parts = $karma_fields->get_other_filters_sql($request);
    //
    // $before_where = isset($sql_parts['before']['where']) ? 'WHERE '.$sql_parts['before']['where'] : '';
    // $before_join = isset($sql_parts['before']['join']) ? $sql_parts['before']['join'] : '';


    $before_join = '';
    $before_where = '';

    $results = $wpdb->get_results(
      "SELECT CONCAT(YEAR(p.{$this->key}), '-', MONTH(p.{$this->key})) AS {$this->key}, COUNT(p.{$this->key}) AS total FROM $wpdb->posts AS p
      $before_join $before_where GROUP BY YEAR(p.{$this->key}), MONTH(p.{$this->key}) ORDER BY p.{$this->key} DESC"
    );

    // $after_where = isset($sql_parts['after']['where']) ? $sql_parts['after']['where'] : '';
    // $after_join = isset($sql_parts['after']['join']) ? $sql_parts['after']['join'] : '';
    //
    // if ($after_where || $after_join) {
    //
    // 	$after_results = $wpdb->get_results(
    // 		"SELECT CONCAT(YEAR(p.$key), '-', MONTH(p.$key)) AS $key, COUNT(p.$key) AS total FROM $wpdb->posts AS p
    // 		$after_join $before_where AND $after_where GROUP BY YEAR(p.$key), MONTH(p.$key) ORDER BY p.$key DESC"
    // 	);
    //
    // 	$results = $this->merge_results($key, $results, $after_results);
    //
    // }

    $options = array();

    foreach ($results as $result) {

      $t = strtotime($result->{$this->key});

      $options[] = array(
        'value' => date('Y-m', $t),
        'title' => date_i18n('F Y', $t),
        // 'count' => isset($result->count) ? $result->count : $result->total,
        'total' => $result->total
      );

    }

    return $options;

  }

}
