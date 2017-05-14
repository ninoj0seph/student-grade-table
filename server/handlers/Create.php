<?php
    class Create{
        private $credentials;
        private $output;
        private $query = "INSERT INTO `student_data`(`name`, `grade`, `course`) VALUES( ? , ? , ? )";
        function __construct($input){
            $this->credentials = $input;
        }

        public function initialize(){
            require_once 'mysql_connect.php';

            if (!( $stmt = $conn->prepare($this->query))){
                $this->output = "422 Unprocessible Entity - Statement failed to prepare: ".$conn->error;
                return;
            }

            if (!($stmt->bind_param('sis', $this->credentials['student']['name'],$this->credentials['student']['grade'],$this->credentials['student']['course']))){
                $this->output = "422 Unprocessible Entity - Parameters failed to bind: ".$stmt->error;
                return;
            }

            if (!($stmt->execute())){
                $this->output = "422 Unprocessible Entity - Statement failed to execute: ".$stmt->error;
                return;
            }

            if($conn->affected_rows === 1){
                $this->output['status'] = 200;
                $this->output['studentId'] = $conn->insert_id;
            } else {
                $this->output['status'][] = '503 Service unavailable  - Insert Error';
            }
            return $this->output;
        }
    }
