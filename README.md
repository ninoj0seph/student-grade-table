# Version 2.0

## Description
Version 3.0 adds BE functionality.   
- This version will 
  - Create a database schema to hold your student data
  - Create a backend file to READ data

## Getting Started
> - Checkout your Latest Changes
        - `git checkout v2.0`
> - Create the new feature branch
    - `git checkout -b v3.0`
> - Work on the scope defined <a href="https://github.com/Learning-Fuze/SGT/tree/v2.0#scope">Below</a>
> - Add files to git
    - `git add .`
> - Commit files (Group files together)
    - `git commit -m "SGT v3.0 - Your Name"`
    - **Replace "Your Name" with your first and last name**
> - Send to gitHub (Push)
    - `git push origin v3.0`
> - Create pull request
    - Pull request should be made from v3.0 to **your repository's/teams** master branch


## Scope
> - Create database schema
  - On a drawing or database schema creation program, sketch out your overall database design with the following properties
    - students
      - ID - bigint, unsigned, auto incrementing
      - name - varchar, length 100
      - created - datetime
      - modified - timestamp
    - courses
      - ID - bigint, unsigned, auto incrementing
      - name - varchar, length 100
      - instructor_id - bigint, unsigned, relates to the ID in instructors
    - instructors
      - ID - bigint, unsigned, auto incrementing
      - name - varchar, length 100
    - grades
      - ID - bigint, unsigned, auto incrementing
      - student_id - bigint, unsigned, relates to the ID in students
      - course_id - bigint, unsigned, relates to the ID in course
      - grade - tinyint, unsigned
      - created - datetime
      - modified - timestamp
      
> - Grab data from existing LFZ SGT. 
  - Get a data dump from LFZ's SGT Read operation
  - put it into a file called read.php
  - point your existing SGT front end at this new file and make sure it works

> - Modify read.php to output the data programmatically.
  - pair the data down to its simplest form.  1 data piece inside the main data (ie 1 student)
  - create the PHP version of this data.  
    - IE an associative array with 
      - a boolean, success, 
      - and an array, data, with 1 student inside it, 
        - an associative array with 
          - ID, 
          - name, 
          - course, 
          - and grade
  - json encode the data
  - print the data
  - test your front end to ensure it works
> - Connect to your DB in your read.php
> - Create queries and php handlers to read the data from the DB
> - construct your output object with this data
  
        



    
