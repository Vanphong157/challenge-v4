# Challenge v4


# Getting started
- Clone the repository
```
git clone  <git lab template url> <project_name>
```
- Install dependencies
```
cd frontend
npm install
cd backend
npm install
```
- Build and run the project
- Frontend: 
```
npm start
```
- Backend:
```
nodemon index.js
```
  Navigate to `http://localhost:3000`

## Project Structure
The folder structure of this app is devived into 2 parts:
For frontend
| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **configuration**        | Application configuration including environment-specific configs 
| **src/components**       | Directory is typically used to organize React components in a structured way within a project
| **src/pages**            | Directory is typically used to organize the main pages of your application
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **Apps.js**              | Contain all express routes, allows to navigate between different components or pages in app.   |                  
| **firebaseconfig.js**    | Connect to database for verify OTP by phonenumber                                                |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   |  

For backend
| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **index.js**             | Set up the backend with a server using Node.js, Express, and Socket.IO   |                  
| **config.js**            | Contains all firebase config allow to connect firebase                                                 |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   |  

## Routes
- "localhost/" for Admin login
- "localhost/login" for User login
- "localhost/dashboard" to handle and display the relevant data
