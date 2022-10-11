<?php


require_once dirname(__FILE__).'/class-group.php';




class Karma_Field_text extends Karma_Field_group {

  public $extension = '.txt';

  public function get_value($key, $post) {

    return get_post_meta($post->ID, $key, true);

  }

}
