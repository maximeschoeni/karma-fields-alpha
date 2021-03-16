<?php

require_once KARMA_FIELDS_PATH.'/drivers/postfield.php';

Class Karma_Fields_Driver_Poststatus extends Karma_Fields_Driver_Postfield {

  /**
	 * fetch
	 */
  public function fetch($args) {
    global $wpdb;

    $where_clauses = array();

    foreach ($args as $key => $value) {

      if (in_array($key, $this->fields)) {

        $where_clauses[] = "$key = ".esc_sql($value);

      }

      // todo...
      // -> meta clauses
      // -> term clauses
      // -> search clauses

    }

    $where_sql = '';

    if ($where_clauses) {

      $where_sql = 'WHERE '.implode(' AND ', $where_clauses);

    }
// var_dump("SELECT p.post_status, COUNT(p.ID) AS total FROM $wpdb->posts AS p $where_sql GROUP BY p.status");
    $status_results = $wpdb->get_results(
      "SELECT p.post_status, COUNT(p.ID) AS total FROM $wpdb->posts AS p $where_sql GROUP BY p.post_status"
    );

    $results = array();

    $results[] = array(
      'value' => 'any',
      'title' => 'All'
    );

    foreach ($status_results as $status) {

      $results[] = array(
        'value' => $status->post_status,
        'title' => $status->post_status,
        'total' => $status->total
      );

    }

    return $results;

  }

  /**
	 * fetch
	 */
  // public function where($value, $) {
  //
  //   global $wpdb;
  //   return $wpdb->prepare("p.$key = %s", $value);
  //
  // }

}
