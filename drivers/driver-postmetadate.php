<?php


require KARMA_FIELDS_ALPHA_PATH . '/drivers/driver-postdate.php';

class Karma_Fields_Alpha_Driver_Postmetadate extends Karma_Fields_Alpha_Driver_Postdate {

  /**
	 * query
	 */
  public function get_results($params) {
    global $wpdb;

    $where_clauses = array();

    $where_clauses[] = "p.post_status != 'auto-draft' AND p.post_status != 'trash'";

    if (isset($params['post_type'])) {

      $where_clauses = $wpdb->prepare("p.post_type = %s", $params['post_type']);

    }

    if (isset($params['meta_key'])) {

      $where_clauses[] = $wpdb->prepare("pm.meta_key = %s", $params['meta_key']);

    }

    $where = implode(" AND ", $where_clauses);

    if (isset($params['type']) && $params['type'] === 'month') {

      $sql = "SELECT DISTINCT YEAR(pm.meta_value) AS year, MONTH(pm.meta_value) AS month
        FROM $wpdb->postmeta AS pm
        INNER JOIN $wpdb->posts AS p ON p.ID = pm.post_id
        WHERE $where
        ORDER BY pm.meta_value DESC"

    } else {

      $sql = "SELECT DISTINCT YEAR( p.post_date ) AS year
        FROM $wpdb->postmeta AS pm
        INNER JOIN $wpdb->posts AS p ON p.ID = pm.post_id
        WHERE $where
        ORDER BY pm.meta_value DESC"

    }

    $sql = apply_filters('karma_fields_driver_postmetadate_sql', $sql, $params);

    return $wpdb->get_results($sql);

  }


}
