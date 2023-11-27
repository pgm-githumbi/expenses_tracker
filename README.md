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

