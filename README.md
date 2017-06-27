# Student Grade Table

A Content Management System (CMS) application created for instructors / teachers / professors to manage student's grades from various different courses.

## Features
- **CREATE | READ | UPDATE | DELETE** - CRUD
    - Input form boxes to **Add** or **Create** a student from the client to the server.
        - **Form Validation** that constantly checks for incorrect or invalid input.
    - Automatically **Reads** the data from the server to the client upon load.
    - **Updates** the data from the client to the server then refreshes the client data.
    - Ability to **Delete** a student from the
        - Added a **Delete Confirmation** to avoid accidental deletes.
    - Constantly **Syncs** the data at the client from the server and vice versa.
- **Grade Point Average Inidicator** where it calculates all the students average grades, matched with color coding
    - **RED** for GPA's under **70**.
    - **YELLOW** for GPA's between **70** and **80**.
    - **GREEN** for GPA's over **80**. 
- **User Error Reporting**
    - Notifies the user if input values are invalid
    - Notifies the user if API is unavailable
    
    
## Stacks Used
-   Object Oriented Programming
-   PHP
-   MySQL
-   Javascript 
-   jQuery
-   CSS
-   Bootstrap
-   Apache
-   RESTful