<?php


class Karma_Fields_Alpha_History {

	/**
	 *	constructor
	 */
	public function __construct() {

		// register_activation_hook(__FILE__, [$this, 'activate']);
		// register_deactivation_hook(__FILE__, [$this, 'deactivate']);

		add_action('rest_api_init', array($this, 'rest_api_init'));

	}


	/**
	 *	@hook 'rest_api_init'
	 */
	public function rest_api_init() {

		register_rest_route('karma-fields-alpha/v1', '/history/session/(?P<session>.+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get_history_session'),
			'permission_callback' => '__return_true'
		));

		register_rest_route('karma-fields-alpha/v1', '/history/update?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'permission_callback' => '__return_true',
			// 'args' => array(
			// 	'session' => array(
			// 		'required' => true
			// 	),
			// 	'states' => array(
			// 		'required' => true
			// 	)
	  //   )
		));

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/history/session/{session}'
	 */
	public function rest_get_history_session($request) {
		global $wpdb;

		$session = (int) $request->get_param('session');
		$user_id = get_current_user_id();//(int) $request->get_param('user_id');

		$states = [];

		$vars_results = $wpdb->get_results("SELECT `index`, `driver`, `object`, `key`, `value` FROM {$wpdb->prefix}history_vars WHERE `session` = $session AND `user_id` = $user_id");

		foreach ($vars_results as $result) {

			$states[$result->index]['vars'][$result->driver][$result->object][$result->key] = json_decode($result->value, true);

		}

		$ids_results = $wpdb->get_results("SELECT `index`, `driver`, `paramstring`, `value` FROM {$wpdb->prefix}history_ids WHERE `session` = $session AND `user_id` = $user_id");

		foreach ($ids_results as $result) {

			$states[$result->index]['ids'][$result->driver][$result->paramstring] = json_decode($result->value, true);

		}

		$attributes_results = $wpdb->get_results("SELECT `index`, `field`, `key`, `value` FROM {$wpdb->prefix}history_attributes WHERE `session` = $session AND `user_id` = $user_id");

		foreach ($attributes_results as $result) {

			$states[$result->index]['attributes'][$result->field][$result->key] = json_decode($result->value, true);

		}

		if (!$states) {

			$states = (object) $states;

		}

		return $states;

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/history/vars/{driver}/{id}/{key}'
	 */
	public function rest_get_history_vars($request) {
		global $wpdb;

		$driver = $request->get_param('driver');
		$id = $request->get_param('id');
		$key = $request->get_param('key');

		// /!\ when 2 users edits the same value or in multiple session
		//     -> same state will appear twice in history

		// grouped or not? (if grouped -> cannot find user)
		//
		// $wpdb->get_results($wpdb->prepare(
		// 	"SELECT MIN(time), driver, object AS id, key, value FROM {$wpdb->prefix}history_vars
		// 	WHERE `driver` = '%s' AND `object` = '%d' AND `key` = '%s'
		// 	GROUP BY driver, object, key, value
		// "), $driver, $id, $key);


		$results = $wpdb->get_results($wpdb->prepare(
			"SELECT user_id, time, driver, object AS id, key, value FROM {$wpdb->prefix}history_vars
			WHERE `driver` = '%s' AND `object` = '%d' AND `key` = '%s'
			ORDER BY time DESC"
		), $driver, $id, $key);

		return $results;

	}

	public function delete_at($user_id, $session, $index) {
		global $wpdb;

		$user_id = (int) $user_id;
		$session = (int) $session;
		$index = (int) $index;

		$tables = ['history_vars', 'history_ids', 'history_attributes'];

		foreach ($tables as $table_name) {

			$history_ids = $wpdb->get_col("SELECT id FROM {$wpdb->prefix}$table_name WHERE `user_id` = $user_id AND `session` = $session AND `index` = $index");

			if ($history_ids) {

				$history_ids = array_map('intval', $history_ids);
				$history_ids = implode(',', $history_ids);

				$wpdb->query("DELETE FROM {$wpdb->prefix}$table_name WHERE id IN ($history_ids)");

			}

		}

	}

	public function insert_vars($user_id, $session, $index, $states) {
		global $wpdb;

		foreach ($states as $driver => $ids) {

			foreach ($ids as $id => $keys) {

				foreach ($keys as $key => $values) {

					$wpdb->insert("{$wpdb->prefix}history_vars", [
						'user_id' => $user_id,
						'session' => $session,
						'index' => $index,
						'driver' => $driver,
						'object' => $id,
						'key' => $key,
						'value' => json_encode($values)
					], ['%d', '%d', '%d','%s', '%d','%s','%s']);

				}

			}

		}

	}

	public function insert_ids($user_id, $session, $index, $states) {
		global $wpdb;

		foreach ($states as $driver => $paramstrings) {

			foreach ($paramstrings as $paramstring => $values) {

				$wpdb->insert("{$wpdb->prefix}history_ids", [
					'user_id' => $user_id,
					'session' => $session,
					'index' => $index,
					'driver' => $driver,
					'paramstring' => $paramstring,
					'value' => json_encode($values)
				], ['%d', '%d', '%d','%s', '%s','%s']);

			}

		}

	}

	public function insert_attributes($user_id, $session, $index, $states) {
		global $wpdb;

		foreach ($states as $field => $fields) {

			foreach ($fields as $key => $values) {

				$wpdb->insert("{$wpdb->prefix}history_attributes", [
					'user_id' => $user_id,
					'session' => $session,
					'index' => $index,
					'field' => $field,
					'key' => $key,
					'value' => json_encode($values)
				], ['%d', '%d', '%d','%s', '%s','%s']);

			}

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/history/session/{session}'
	 */
	public function rest_update($request) {

		$user_id = get_current_user_id(); //(int) $request->get_param('user_id');

		if (!$user_id) {

			return false;

		}

		$session = (int) $request->get_param('session');
		$states = $request->get_param('states');

		foreach ($states as $index => $tables) {

			$this->delete_at($user_id, $session, $index);

			foreach ($tables as $table => $data) {

				if ($table === 'vars') {

					$this->insert_vars($user_id, $session, $index, $data);

				} else if ($table === 'ids') {

					$this->insert_ids($user_id, $session, $index, $data);

				} else if ($table === 'attributes') {

					$this->insert_attributes($user_id, $session, $index, $data);

				}

			}

		}

		return true;

	}


  /**
	 * activate
	 */
	public static function activate() {

		self::create_vars_table();
		self::create_ids_table();
		self::create_attributes_table();

	}

	/**
	 * deactivate
	 */
	public static function deactivate() {

	}

	/**
	 * create history vars table
	 */
	public static function create_vars_table() {
		global $wpdb;

		$charset_collate = '';

		if (!empty($wpdb->charset)){
			$charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
		}

		if (!empty($wpdb->collate)){
			$charset_collate .= " COLLATE $wpdb->collate";
		}

		$mysql = "CREATE TABLE {$wpdb->prefix}history_vars (
			`id` bigint(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			`time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`user_id` bigint(12) NOT NULL,
			`session` bigint(12) NOT NULL,
			`index` int(10) NOT NULL,
			`driver` varchar(255) NOT NULL,
			`object` bigint(12) NOT NULL,
			`key` varchar(255) NOT NULL,
			`value` LONGTEXT NOT NULL,
			KEY `user_id` (`user_id`),
			KEY `session` (`session`),
			KEY `driver` (`driver`),
			KEY `object` (`object`),
			KEY `key` (`key`)
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($mysql);

	}

	/**
	 * create history ids table
	 */
	public static function create_ids_table() {
		global $wpdb;

		$charset_collate = '';

		if (!empty($wpdb->charset)){
			$charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
		}

		if (!empty($wpdb->collate)){
			$charset_collate .= " COLLATE $wpdb->collate";
		}

		$mysql = "CREATE TABLE {$wpdb->prefix}history_ids (
			`id` bigint(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			`time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`user_id` bigint(12) NOT NULL,
			`session` bigint(12) NOT NULL,
			`index` int(10) NOT NULL,
			`driver` varchar(255) NOT NULL,
			`paramstring` varchar(255) NOT NULL,
			`value` LONGTEXT NOT NULL,
			KEY `user_id` (`user_id`),
			KEY `session` (`session`),
			KEY `driver` (`driver`),
			KEY `paramstring` (`paramstring`)
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($mysql);

	}

	/**
	 * create history attributes table
	 */
	public static function create_attributes_table() {
		global $wpdb;

		$charset_collate = '';

		if (!empty($wpdb->charset)){
			$charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
		}

		if (!empty($wpdb->collate)){
			$charset_collate .= " COLLATE $wpdb->collate";
		}

		$mysql = "CREATE TABLE {$wpdb->prefix}history_attributes (
			`id` bigint(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			`time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`user_id` bigint(12) NOT NULL,
			`session` bigint(12) NOT NULL,
			`index` int(10) NOT NULL,
			`field` varchar(255) NOT NULL,
			`key` varchar(255) NOT NULL,
			`value` LONGTEXT NOT NULL,
			KEY `user_id` (`user_id`),
			KEY `session` (`session`)
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($mysql);

	}


}

new Karma_Fields_Alpha_History;
