<?php
    class ErrorHandler{
        private $output;
        public function initialize(){
            $this->output['status'][] = '422 Unprocessable Entity - Invalid CRUD Operation!';
            return $this->output;
        }

        public static function checkUserReqeust(){
            if(isset($_SERVER['CONTENT_TYPE'])){
                return $_SERVER['CONTENT_TYPE'] == 'application/json'
                    ? json_decode(file_get_contents('php://input'), true)
                    : false;
            }
        }
    }