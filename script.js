/**
 * Define all global variables here
 */
var clicked = new clickedConstructor();
var student = new studentConstructor();
var update = new updateConstructor();
var display = new displayConstructor();
var server = new serverConstructor();

/**
 * Listen for the document to load and reset the data to the initial state
 *
 */
$(document).ready(function () {
    display.reset();
});

/**
 * addClicked - Event Handler when user clicks the add button
 */
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 *
 */
function clickedConstructor() {
    this.addBtn = function () {
      student.addStudent();
    };

    this.cancelBtn = function () {
        display.clearAddStudentForm();
    };

    this.removeBtn = function (element) {
        student.remove(element);
    };

    this.syncBtn = function () {
        server.syncData();
    };
}
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */

function studentConstructor() {
    this.array = [];
    this.inputIds = ['studentName', 'course', 'studentGrade'];
    this.addStudent = function () {
        this.studentObj = {
            name : null,
            course : null,
            grade : null
        };
        var index = 0;
        for(var key in this.studentObj){
            this.studentObj[key] = key !== "grade" ? $('#' + this.inputIds[index]).val() : $('#' + this.inputIds[index]).val() > 100 ? 100 : $('#' + this.inputIds[index]).val();
            if(this.studentObj[key] === ""){
                console.log('Invalid input: Student ' + key);
                return;
            }
            index++;
        }
        this.array.unshift(this.studentObj);
        //server.createData(this.studentObj);
        update.data();
        return;
    };

    this.calculateAverage = function () {
        var total = 0;
        for(var i = 0; i  < this.array.length; i++){
            total += this.array[i].grade === parseInt(this.array[i].grade);
        }
        return ~~(total / this.array.length);
    };

    this.remove = function (removeBtnElement) {
        var removeIndex = parseInt(removeBtnElement.getAttribute('index'));
        if(student.array[removeIndex].id !== undefined){
            server.deleteData(student.array[removeIndex].id);
            console.log('item deleted on the server');
        }
        student.array.splice(removeIndex,1);
        update.data();
    };
}

/**
 * updateData - centralized function to update the average and call student list update
 */

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

function updateConstructor() {
    this.data = function () {
        display.gradeAverage(student.calculateAverage());
        this.studentList();
    };
    
    this.studentList = function () {
        $('.student-list tbody').html('');
        for(var i = 0; i  < student.array.length; i++){
            display.addStudentToDom(student.array[i],i);
        }
    }
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

function displayConstructor() {

    this.addStudentToDom = function (passedStudentObj,index) {
        var element = {
            name : "<td>"+passedStudentObj.name +"</td>",
            course : "<td>"+passedStudentObj.course+"</td>",
            grade : "<td>"+passedStudentObj.grade+"</td>",
            removeButton : "<td><button type ='button' class ='btn btn-danger' index ='" + index + "' onclick ='clicked.removeBtn(this)'>Remove</button></td>"
        };
        $('.student-list tbody').append('<tr>'+ element.name + element.course + element.grade + element.removeButton + '</tr>');
        this.clearAddStudentForm();
    };

    this.reset = function () {
        student.array = [];
        this.clearAddStudentForm();
    };

    this.clearAddStudentForm = function () {
        for(var i = 0; i  < student.inputIds.length; i++){
            $('#' + student.inputIds[i]).val("");
        }
    };

    this.gradeAverage = function (value) {
        $('.avgGrade').removeClass('label-default').addClass(value >= 80 ? 'label-success' : value >= 70 ? 'label-warning' : 'label-danger');
        $('.avgGrade').text(value);
    };

    this.disableLetters = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    this.modal = function (messageToShow) {
        $("#message").text(messageToShow);
        $("#displayMsgModal").modal('toggle');
    }

    this.errorModal = function () {
        var exitButton = '<button type="button" class="btn-lg btn-danger" data-dismiss="modal">Close</button>';
        $('.modal-title').text("Failed Response");
        $('#message').text("Something went wrong :(");
        $('.modal-footer').append(exitButton);
        $("#displayMsgModal").modal('toggle');
    }
}

function serverConstructor() {
    this.failed = false;
    this.syncData = function () {
        display.modal("Fetching Data From the Friendly Skies!");
        if(student.array.length >= 1){
            for(var i = 0; i  < student.array.length; i++){
                if(student.array[i].id === undefined){
                    this.createData(student.array[i]);
                }
            }
        }
        this.getData();
    };

    this.getData = function () {
        setTimeout(display.modal,1000);
        $.ajax({
            'dataType' : 'json',
            'method' : 'POST',
            'data' : {'api_key' : 'wgJ98cHF1h'},
            'url' : 'http://s-apis.learningfuze.com/sgt/get',
            "success" : function(serverObj) {
                student.array = serverObj.data.slice().reverse();
                update.data();
            },
            error: function(response) {
                console.log("response failed");
            }
        });
    };
    
    this.createData = function (objectToAdd) {
        console.log('sending you data');
        $.ajax({
            'dataType' : 'json',
            'method' : 'post',
            'data' : {
                'api_key' : 'wgJ98cHF1h',
                'name' : objectToAdd.name,
                'course' : objectToAdd.course,
                'grade' : objectToAdd.grade
            },
            'url' : 'http://s-apis.learningfuze.com/sgt/create',
            "success" : function(returnConformation) {
                console.log("success!");
                objectToAdd.new_id = returnConformation.new_id;
            },
            error: function(response) {
                console.log("response failed");
            }
        });
    };

    this.deleteData = function (id) {
        display.modal("Abolishing Data From the Friendly Skies!");
        setTimeout(display.modal,1000);
        $.ajax({
            'dataType' : 'json',
            'method' : 'post',
            'data' : {
                'api_key' : 'wgJ98cHF1h',
                'student_id' : id
            },
            'url' : 'http://s-apis.learningfuze.com/sgt/delete',
            "success" : function(serverObj) {
                console.log(serverObj);
            },
            error: function(response) {
                console.log("response failed");
            }
        });
    };
}
