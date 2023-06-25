## SoftwareMind Task

The goal of this project was to create a server in Java to support the REST API and a simple GUI in React to present the data.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Java 17 or above
- Maven installed
- Node.js installed
- npm installed
- Docker installed

### Installing

1. Clone the repository:

   ```
   git clone https://github.com/adamly6/SoftwareMind-Task.git
   ```
   
2. Build the Java project:

	 ```
	 cd projectDirectory/backend
	 mvn clean install
	 ```
  

4. Run the application:

   Mysql base:
   
   ```
   cd projectDirectory/backend
	 docker-compose up
   ```

   Java

   ```
   java -jar target/SoftwareMindTask-1.0.jar
   ```

   Frontend:

   ```
   cd projectDirectory/frontend/sofware-mind-task-front
	 npm install
   npm run build
   npm run preview
   ```
	
## Usage

  When you build all, now u can open front http://localhost:5173 on browser.
  You can add new tasks, filter them by title and type. Tasks can be edited and deleted. It is possible to sort by each column by clicking on its name.

  On http://localhost:8999 on browser you can see and manage data in MySQL trought light GUI called Adminer. Just type the "root" for user and pass, in base name type "todo_list".

  Reaquests from front are performed at the address: http://localhost:8080/tasks with diffrent request methods and params.

  At the address: http://localhost:8080/actuator/metrics/http.server.requests on the browser or Postman you can see in JSON format number of requests and their types under different uri.


