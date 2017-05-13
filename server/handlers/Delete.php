<?php
    class Delete{
        private $id;
        function __construct($inputId){
            $this->id = $inputId;
        }

        public function initialize(){



            $id = $_GET['id'];
            if (empty($id)) {
                $output['errors'][] = 'invalid id';
            }
            $query = "DELETE FROM `student_data` WHERE `id` = '$id'";
            $result = mysqli_query($conn, $query);
            if (empty($result)) {
                $output['errors'][] = 'database error';
            } else {
                if (mysqli_affected_rows($conn) === 1) {
                    $output['success'] = true;
                } else {
                    $output['errors'][] = 'delete error';
                }
            }
        }
    }
