<?php



Class Karma_Fields_Alpha_Driver_Postdate {

  /**
	 * query
	 */
  public function query($params) {
    global $wpdb, $wp_locale;

    $where_clauses = array();

    $where_clauses[] = "post_status != 'auto-draft' AND post_status != 'trash'";

    if (isset($params['post_type'])) {

      $where_clauses[] = $wpdb->prepare("post_type = %s", $params['post_type']);

    }

    $where = implode(" AND ", $where_clauses);

    if (isset($params['groupby']) && $params['groupby'] === 'month') {

      $sql = "SELECT DISTINCT YEAR( post_date ) AS year, MONTH( post_date ) AS month
        FROM $wpdb->posts
        WHERE $where
        ORDER BY post_date DESC";

      $results = $wpdb->get_results($sql);

      $output = array();

      foreach ($results as $result) {

        $month_name = $wp_locale->get_month($result->month);

        $output[] = array(
          'id' => "{$result->year}{$result->month}",
          'name' => "{$month_name} {$result->year}",
        );

      }

    } else {

      $sql = "SELECT DISTINCT YEAR( post_date ) AS year
        FROM $wpdb->posts
        WHERE $where
        ORDER BY post_date DESC";

      $results = $wpdb->get_results($sql);

      $output = array();

      foreach ($results as $result) {

        $output[] = array(
          'id' => "$result->year",
          'name' => "$result->year",
        );

      }

    }

    return apply_filters('karma_fields_driver_postdate_output', $output, $results, $params);

  }
  //
  // /**
	//  * query
	//  */
  // public function query($params) {
  //   global $wpdb, $wp_locale;
  //
  //   $results = $this->get_results($params);
  //
  //   $output = array();
  //
  //   foreach ($results as $result) {
  //
  //     if (isset($result->month)) {
  //
  //       $month_name = $wp_locale->get_month($result->month);
  //
  //       $output[] = array(
  //         'id' => "{$result->year}{$result->month}",
  //         'name' => "{$month_name} {$result->year}",
  //       );
  //
  //     } else {
  //
  //       $output[] = array(
  //         'id' => "$result->year",
  //         'name' => "$result->year",
  //       );
  //
  //     }
  //
  //   }
  //
  //   return apply_filters('karma_fields_driver_postdate_output', $output, $results, $params);
  //
  // }
  //





}
