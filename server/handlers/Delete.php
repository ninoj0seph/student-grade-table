<?php
    class Delete{
        private $studentId;
        private $output;
        private $query = "DELETE FROM `student_data` WHERE `id` = ?";
        function __construct($input){
            $this->studentId = $input;
        }

        public function initialize(){
            require_once 'mysql_connect.php';
            if (!( $stmt = $conn->prepare($this->query))){
                $this->output = "422 Unprocessible Entity - Statement failed to prepare: ".$conn->error;
                return;
            }

            if (!($stmt->bind_param('s', $this->studentId['sid']))){
                $this->output = "422 Unprocessible Entity - Parameters failed to bind: ".$stmt->error;
                return;
            }

            if (!($stmt->execute())){
                $this->output = "422 Unprocessible Entity - Statement failed to execute: ".$stmt->error;
                return;
            }

            if($conn->affected_rows === 1){
                $this->output['status'] = 200;
                $this->output['message'] = 'student id no.' . $this->studentId['sid'] . ' has been removed';
            } else {
                $this->output['status'][] = '422 Unprocessible Entity  - No student found on id ' . $this->studentId['sid'];
            }
            return $this->output;
        }
    }
