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

# Installation Instructions
- Clone this repository
  ```
  git clone https://github.com/pgm-githumbi/expenses_tracker.git
  cd expenses_tracker/expenses_tracker_backend
  ```
- You need to have node installed on your system.
- Install dependencies
  ```
  npm install
  ```
- Create a .env in the directory you just cd'ed into.
  ```
  node -e "require('fs').writeFileSync('.env', '');"
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
# API video



https://github.com/pgm-githumbi/expenses_tracker/assets/85244060/83b0d143-46df-4a9e-b251-79e67a441a1c


