#  E-Commerce Frontend

A responsive E-Commerce frontend built using **React.js, Redux Toolkit, Axios,Fetch, Bootstrap, React Hook Form, and Yup**.

The frontend communicates with an ASP.NET Core Web API backend to provide a complete online shopping experience.

---

##  Technologies Used

* React.js
* React Router DOM
* Redux Toolkit
* Axios
* Fetch
* Bootstrap
* React Hook Form
* Yup
* @hookform/resolvers
* SweetAlert2
* CSS

---

##  Features

###  User Authentication

* User registration
* User login
* JWT token handling
* Logout
* Protected routes
* Role-based navigation

###  Products

* View products
* Search products
* Filter products
* View product information
* Add products to cart

###  Shopping Cart

* View cart
* Add products
* Increase quantity
* Decrease quantity
* Remove individual items
* Clear cart
* View total amount

###  Checkout

* Enter shipping details
* Review cart items
* View order totals
* Place an order

###  Orders

* View orders
* View order details
* View order status

###  Profile

* View logged-in user information

###  Admin
Administrators can:

* Add products
* Edit products
* Delete products
* Manage categories
* View products
* Manage orders



##  Frontend Architecture

The application uses React components together with Redux Toolkit for state management.

React Page / Component
        ↓
Redux Slice
        ↓
Axios API Request
        ↓
ASP.NET Core Web API
        ↓
Response
        ↓
Redux Store
        ↓
React UI




##  Authentication Flow


User Login
     ↓
Login API
     ↓
Backend validates credentials
     ↓
JWT Token returned
     ↓
Token stored in localStorage
     ↓
Axios sends token with requests
     ↓
Protected API access


The frontend uses the JWT token to access protected backend endpoints.



##  Redux State Management

Redux Toolkit is used to manage application-wide state.

Main slices include:

Redux Store
    │
    ├── Auth Slice
    │
    ├── Product Slice
    │
    ├── Cart Slice
    │
    └── Order Slice


This allows different pages and components to access shared application state.



##  API Communication

Axios is used to communicate with the backend API.

The API base URL is configured through an environment variable.

Example:

```env
REACT_APP_API_URL=https://localhost:YOUR_PORT/api
```

The frontend sends the JWT token with protected requests.



##  Form Validation

Forms use:

* React Hook Form
* Yup
* @hookform/resolvers

Validation is implemented for forms such as:

* Login
* Registration
* Product creation
* Product editing
* Category forms
* Checkout

Validation errors are displayed to the user when form submission fails.



##  UI & Styling

The application uses:

* Bootstrap for responsive layouts
* Custom CSS for page-specific styling
* Responsive navigation
* Responsive product cards
* Responsive forms
* Modal dialogs
* SweetAlert notifications

CSS is maintained in separate files rather than using inline styles.



##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HarshavardhanN2004/E-Commerce-Backend.git
```

Navigate to the frontend:

```bash
cd E-Commerce-Backend/e-commerce-frontend
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_URL=https://localhost:YOUR_PORT/api
```

Replace `YOUR_PORT` with the port used by the backend API.

---

### 4. Start the Application

```bash
npm start
```

The React application will normally run at:

```text
http://localhost:3000
```

---

##  Backend Requirement

The frontend requires the **E-Commerce ASP.NET Core Web API** to be running.

The complete application works as:

```text
React Frontend
       ↓
ASP.NET Core Web API
       ↓
Entity Framework Core
       ↓
SQL Server
```

---

##  Testing

The frontend can be tested by running:

```bash
npm start
```

Then test the following application flows:

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Add to Cart
   ↓
Update Cart
   ↓
Checkout
   ↓
Place Order
   ↓
View Orders
```

Admin flow:

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Manage Products
     ↓
Manage Categories
     ↓
Manage Orders
```

---

##  Responsive Design

The frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

Bootstrap's responsive grid system and custom CSS are used to maintain a consistent user experience across screen sizes.

---

##  Security

The frontend implements:

* JWT-based authentication
* Protected routes
* Role-based navigation
* Token-based API requests
* Client-side form validation
* Secure handling of authentication state


---

##  Future Enhancements

Possible improvements include:

* Online payment integration
* Wishlist
* Product reviews
* Product ratings
* Coupon system
* Advanced filtering
* Order tracking
* Improved admin dashboard
* Cloud deployment


