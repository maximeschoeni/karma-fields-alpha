<?php

$editor_args = array();

if (isset($args['args'])) {

  $editor_args = $args['args'];

}

wp_editor($value, 'karma_field-'.$meta_key, $editor_args);

?>
