<?php
class Update{
    private $credentials;
    private $output;
    private $query = "UPDATE `student_data` SET name = ?, grade = ?, course = ? WHERE id = ?";
    function __construct($input){
        $this->credentials = $input;
    }

    public function initialize(){
        require_once 'mysql_connect.php';
        if (!( $stmt = $conn->prepare($this->query))){
            $this->output['status'][] = "422 Unprocessible Entity - Statement failed to prepare: ".$conn->error;
            return $this->output;
        }

        if (!($stmt->bind_param('sisi', $this->credentials['student']['name'],intval($this->credentials['student']['grade']),$this->credentials['student']['course'],intval($this->credentials['student']['id'])))){
            $this->output['status'][] = "422 Unprocessible Entity - Parameters failed to bind: ".$stmt->error;
            return $this->output;
        }

        if (!($stmt->execute())){
            $this->output['status'][] = "422 Unprocessible Entity - Statement failed to execute: ".$stmt->error;
            return $this->output;
        }

        if($conn->affected_rows === 1){
            $this->output['status'] = 200;
            $this->output['message'] = 'student ' . $this->credentials['student']['id'] . ' has been updated';
        } else {
            $this->output['status'][] = 200;
            $this->output['message'][] = 'nothing was changed';
        }
        return $this->output;
    }
}
