<?php



Class Karma_Fields_Alpha_Driver_Taxonomy {


  /**
	 * fetch
	 */
  public function fetch($request, $params) {

    if ($request  === 'querykey') {

      if (isset($params['key'])) {

        $taxonomy = $params['key'];

        $terms = get_terms(array(
          'taxonomy' => $taxonomy,
          'hide_empty' => false
        ));

        $results = array();
        $results['items'] = array();

        if (is_wp_error($terms)) {

          $results['error'] = $terms;
          $results['taxonomy'] = $taxonomy;

        } else if ($terms) {

          foreach ($terms as $term) {

            $results['items'][] = array(
              'key' => $term->term_id,
              'name' => $term->name
            );

          }

        }

        return $results;
      }

    }

  }




}
