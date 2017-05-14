<?php
    class Read{
        private $query = "SELECT * FROM `student_data`";
        private $output;
        public function initialize(){
            require_once 'mysql_connect.php';
            $result = $conn->query($this->query);
            if(empty($result)) {
                $this->output['status'][] = '422 - Unprocessable Entity, Bad Query';
                $this->output['debug'][] = $conn->error;
            } else {
                if(mysqli_num_rows($result) > 0){
                    $this->output['status'] = '200 - Ok!';
                    while($row = mysqli_fetch_assoc($result)){
                        $this->output['students'][] = $row;
                    }
                } else {
                    $this->output['status'] = '404 - Not Found!';
                }
            }
            return $this->output;
        }
    }
