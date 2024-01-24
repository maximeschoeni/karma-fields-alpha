<?php

class Karma_Fields_Alpha_Driver_Postdate {

  /**
	 * query
	 */
  public function query($params) {
    global $wpdb, $wp_locale;

    $where_clauses = array();
    $join_clauses = array();

    if (isset($params['key']) && $params['key']) {

      $key = $params['key'];

    } else {

      $key = 'post_date';

    }

    if ($key === 'post_date' || $key === 'post_date_gmt') {

      $select_key = "p.{$key}";

    } else {

      $key = esc_sql($key);
      $join_clauses[$key] = "INNER JOIN {$wpdb->postmeta} AS pm_{$key} ON (pm_{$key}.post_id = p.ID)";

      $select_key = "pm_{$key}.meta_value";

    }

    $where_clauses[] = "p.post_status != 'auto-draft' AND p.post_status != 'trash'";

    foreach ($params as $key => $value) {

      switch ($key) {

        case 'post_status':
        case 'key':
        case 'groupby':
          break;

        case 'post_type':
          $values = explode(',', $value);
          $values = array_map('esc_sql', $values);
          $in = implode("','", $values);
          $where_clauses[] = "p.post_type IN ('$in')";
          break;

        case 'search':

          $query = new WP_Query(array(
            's' => $value,
            'posts_per_page' => 100,
            'fields' => 'ids',
            'cache_results' => false
          ));

          if ($query->posts) {
            $ids = array_map('intval', $query->posts);
            $in = implode(',', $ids);
            $where_clauses[] = "p.ID IN ($in)";
            break;
          } else {
            return array();
          }

        default:

          if (taxonomy_exists($key)) { // -> taxonomy

            $join_clauses[$key] = "INNER JOIN {$wpdb->term_relationships} AS tr_{$key} ON (tr_{$key}.object_id = p.ID)
              INNER JOIN {$wpdb->term_taxonomy} AS tt_{$key} ON (tt_{$key}.term_taxonomy_id = tr_{$key}.term_taxonomy_id)";
            $where_clauses[] = $wpdb->prepare("tt_{$key}.taxonomy = %s", $value);

          } else {

            $key = esc_sql($key);

            $join_clauses[$key] = "INNER JOIN {$wpdb->postmeta} AS pm_{$key} ON (pm_{$key}.post_id = p.ID) ";
            $where_clauses[] = $wpdb->prepare("pm{$key}.meta_value = %s", $value);

          }

      }

    }

    if ($where_clauses) {

      $where = implode(" AND ", $where_clauses);

    } else {

      $where = '';

    }

    if ($join_clauses) {

      $join = implode(" ", $join_clauses);

    } else {

      $join = '';

    }

    if (isset($params['groupby']) && $params['groupby'] === 'month') {

      $sql = "SELECT DISTINCT YEAR($select_key) AS year, MONTH($select_key) AS month
        FROM $wpdb->posts AS p
        $join
        WHERE $where
        ORDER BY $select_key DESC";

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

      $sql = "SELECT DISTINCT YEAR($select_key) AS year
        $join
        FROM $wpdb->posts AS p
        WHERE $where
        ORDER BY $select_key DESC";

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

}

//
// Class Karma_Fields_Alpha_Driver_Postdate {
//
//   /**
// 	 * query
// 	 */
//   public function query($params) {
//     global $wpdb, $wp_locale;
//
//     $where_clauses = array();
//
//     $where_clauses[] = "post_status != 'auto-draft' AND post_status != 'trash'";
//
//     if (isset($params['post_type'])) {
//
//       $where_clauses[] = $wpdb->prepare("post_type = %s", $params['post_type']);
//
//     }
//
//     $where = implode(" AND ", $where_clauses);
//
//     if (isset($params['groupby']) && $params['groupby'] === 'month') {
//
//       $sql = "SELECT DISTINCT YEAR( post_date ) AS year, MONTH( post_date ) AS month
//         FROM $wpdb->posts
//         WHERE $where
//         ORDER BY post_date DESC";
//
//       $results = $wpdb->get_results($sql);
//
//       $output = array();
//
//       foreach ($results as $result) {
//
//         $month_name = $wp_locale->get_month($result->month);
//
//         $output[] = array(
//           'id' => "{$result->year}{$result->month}",
//           'name' => "{$month_name} {$result->year}",
//         );
//
//       }
//
//     } else {
//
//       $sql = "SELECT DISTINCT YEAR( post_date ) AS year
//         FROM $wpdb->posts
//         WHERE $where
//         ORDER BY post_date DESC";
//
//       $results = $wpdb->get_results($sql);
//
//       $output = array();
//
//       foreach ($results as $result) {
//
//         $output[] = array(
//           'id' => "$result->year",
//           'name' => "$result->year",
//         );
//
//       }
//
//     }
//
//     return apply_filters('karma_fields_driver_postdate_output', $output, $results, $params);
//
//   }
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
