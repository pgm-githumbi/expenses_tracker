# Expenses Tracker
Node RESTful api with jwt token-based authentication

## Routes
**Public**
- POST /api/user/register 
- POST /api/user/login 

**Private**
- GET /api/expenses
- GET /api/expenses/:id
- POST /api/expenses 
- PUT /api/expense/:id
- DELETE /api/expense/:id

The user_id is passed in the req.body

## Installation Instructions
 - Clone this repository
  ```
  git clone https://github.com/pgm-githumbi/expenses_tracker.git
  cd expenses_tracker/expenses_tracker_backend
  ```
- Install dependencies
  ```
  npm install
  ```
- Define your own .env (environment variable file)
  ```
  #inside .env in the current folder (expenses_tracker/expenses_tracker_backend)
  DEBUG=*
  PORT=3000
  ACCESS_TOKEN_SECRET='your own access token secret'
  CONNECTION_STRING='a connection string to your own mongodb database'
  ```
- Install an api client of your choice
- Run the application
  ```
  node index.js
  ```

- First register as a user using the /api/register endpoint
- Then login using the /api/login endpoint and copy the access token to your clipboard
- Access any other apis passing the access token in the Bearer section in the http header

