<?php


Class Karma_Fields_Driver {

  public $resource;
  public $key;


  // public function fetch($query, $request) {
  //
  // }
  //
  // public function filter($value, $query, $request) {
  //
  // }
  //
  // public function search($value, $query, $request) {
  //
  // }
  //
  // public function sort($sort, $query, $request) {
  //
  // }
  //
  // public function limit($ppp, $page, $query, $request) {
  //
  // }

  /**
	 * create_query
	 */
  public function create_query() {

		return new Karma_Fields_Query();

	}

	/**
	 * create_query
	 */
  public function exec($request) {

		$query = $this->create_query();

		foreach ($this->middleware->keys as $key => $resource) {

      if ($key === $this->key) {

        continue;

      }

			$driver = $this->middleware->get_driver($key);

			if ($request->has_param($key)) {

				$value = $request->get_param($key);

				$driver->filter($value, $query, $request);

			}

			if ($request->has_param('search') && isset($resource['search']) && $resource['search']) {

				$value = $request->get_param('search');

				$driver->search($value, $query, $request);

			}

			if ($request->get_param('orderby') === $key) {

				$order = $request->get_param('order');

				if ($order) {

					$order = strtoupper($order);

				}

				if ($order !== 'ASC' && $order !== 'DESC') {

					$order = null;

				}

				$driver->sort($order, $query, $request);

			}

		}

    if ($request->has_param('ppp')) {

      $ppp = $request->get_param('ppp');

      $ppp = intval($ppp);

      if ($ppp > 0) {

        $page = $request->get_param('page');

        if ($page) {

          $page = intval($page);

        }

        if (!$page) {

          $page = 1;

        }

        $offset = $page-1;

        $this->limit($ppp, $offset, $query, $request);

      }

    }

		return $this->fetch($query, $request);

	}




  //
  public function get_cache() {

    if (!isset($this->resource['cache']) || $this->resource['cache'] === true) {

      if (isset($this->resource['type']) && $this->resource['type'] === 'json') {

        return $this->key.'.json';

      } else {

        return $this->key.'.txt';

      }

    } else if ($this->resource['cache']) {

      return $this->resource['cache'];

    }

  }

	// /**
	//  * get
	//  */
  // public function get($uri, $key) {
  //
  //   $id = apply_filters("karma_fields_posts_uri", $uri);
  //
	// 	return get_post($id)->$key;
  //
  // }
  //
	// /**
	//  * update
	//  */
  // public function update($uri, $key, $value, &$args) {
  //
	// 	$args[$key] = $value;
  //
  // }
  //
	// /**
	//  * sort
	//  */
  // public function sort($key, $order, &$args) {
  //
	// 	if ($key === 'post_title') {
  //
	// 		$args['orderby'] = 'title';
  //
	// 	} else if ($key === 'post_date') {
  //
	// 		$args['orderby'] = 'date';
  //
	// 	} else if ($key === 'menu_order') {
  //
	// 		$args['orderby'] = 'menu_order';
  //
	// 	}
  //
	// 	// $args['order'] = $order;
  //
  // }



}
