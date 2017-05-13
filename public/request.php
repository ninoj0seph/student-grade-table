<?php
    spl_autoload_register(function ($class_name) {
        require_once '../server/handlers/'.$class_name . '.php';
    });
    header('Content-type: application/json');

    switch(strtolower($_GET['action'])){
        case 'create' :
            $action = new Create();
            break;
        case 'read' :
            $action = new Read();
            break;
        case 'update' :
            $action = new Update();
            break;
        case 'delete' :
            $action = new Delete();
            break;
        default :
            $action = new Error();
    }
    echo(json_encode($action->initialize()));
