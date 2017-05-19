<?php
    spl_autoload_register(function ($class_name) {
        require_once 'server/handlers/'.$class_name . '.php';
    });
    header('Content-type: application/json');

    switch(strtolower($_GET['action'])){
        case 'read' :
            $action = new Read();
            break;
        case 'create' :
            $action = new Create(ErrorHandler::checkUserReqeust());
            break;
        case 'update' :
            $action = new Update(ErrorHandler::checkUserReqeust());
            break;
        case 'delete' :
            $action = new Delete(ErrorHandler::checkUserReqeust());
            break;
        default :
            $action = new ErrorHandler();
    }
    echo(json_encode($action->initialize()));
