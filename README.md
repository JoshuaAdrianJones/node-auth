# node-auth-CRUD

### Authentication with express, passport, EJS, and mongoose

### Extended to full CRUD

## usage

### Install

```
$ npm install
```

start development server at port 5000

```
$ npm run dev
```

start

```
npm start
```

## Register

- handles registering new users
- writes new user to mongoDB database
- passwords hashed with BCrypt
- detects duplicate emails
- checks login page for empty fields
- checks password and password re-type are the same

## Login

- Handles login with passport.js
- Login checks hashed password and email address for user
- Maintains session with passport.js
- Authenticated users can see page after login
- user-logged-in page retrives user name and email address from session credentials and displays to user.
- Logout button clears session data and returns user to start

## Dashboard

- Displays the data of the logged in user
- allows you to logout
- allows you to delete your account
- allows you to change your password
