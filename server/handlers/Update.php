<?php
    class Update{
        public function initialize(){
            $id = $_POST['id'];

            $updateFields = [
                'name' => 'name',
                'course' => 'course_name',
                'grade' => 'grade'
            ];

            if(empty($id)){
                $output['errors'][] = 'Missing ID';
            } else {
                $query = 'UPDATE `student_data` SET';
                foreach ($updateFields as $externalField => $internalField){
                    if(!empty($_POST[$externalField])){
                        $query.="`$internalField`='{$_POST[$externalField]}', ";
                    }
                }

                $query = substr($query,0,-2);
                $query.="WHERE id='$id'";
            }

            print $query;
            $result = mysqli_query($conn,$query);


            if(empty($result)){
                $output['errors'][] = 'Database Error!';
            } else {
                if(mysqli_affected_rows($conn) === 1){
                    $output['success'] = true;
                } else {
                    $output['errors'][] = 'insert error';
                }
            }
        }
    }

