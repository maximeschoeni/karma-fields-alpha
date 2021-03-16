<table>
  <?php foreach ($fields as $field) {
    $meta_key = isset($field['meta_key']) ? $field['meta_key'] : $this->generate_key();
    if (!isset($args['id'])) {
      $field['id'] = 'karma_field-'.$meta_key;
    }
    ?>
    <tr>
      <th style="padding-right:20px">
        <label for="<?php echo $field['id']; ?>"><?php echo $field['label']; ?></label>
      </th>
      <td>
        <?php $this->print_field($post, $field); ?>
      </td>
    </tr>
  <?php } ?>
</table>
