# Prisma Supabase Backend API Documentation

This REST API is built with Express.js, TypeScript, PostgreSQL (Supabase), and Prisma ORM.

## **Base URL**
`http://localhost:5000/api`

---

## **Standard API Response Format**

All API endpoints return responses in the following consistent format:

### **Success Response Format**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### **Error Response Format**
```json
{
  "success": false,
  "message": "Error description message"
}
```

---

## **1. Authentication Module (`/api/auth`)**

### **1.1 Register User**
* **Endpoint:** `/api/auth/register`
* **Method:** `POST`
* **Description:** Registers a new user account with hashed password.
* **Access:** Public
* **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "USER"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-v4-user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-08-10T14:00:00.000Z",
      "updatedAt": "2026-08-10T14:00:00.000Z"
    },
    "token": "jwt_token_string"
  }
}
```
* **Status Codes:** `201 Created`, `400 Bad Request`

---

### **1.2 Login User**
* **Endpoint:** `/api/auth/login`
* **Method:** `POST`
* **Description:** Authenticates a user and returns a JWT access token.
* **Access:** Public
* **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-v4-user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "jwt_token_string"
  }
}
```
* **Status Codes:** `200 OK`, `400 Bad Request`, `401 Unauthorized`

---

### **1.3 Get Current User Profile**
* **Endpoint:** `/api/auth/me`
* **Method:** `GET`
* **Description:** Returns profile details of the currently authenticated user.
* **Access:** Authenticated (Bearer Token)
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid-v4-user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-08-10T14:00:00.000Z",
    "updatedAt": "2026-08-10T14:00:00.000Z"
  }
}
```
* **Status Codes:** `200 OK`, `401 Unauthorized`

---

## **2. User Module (`/api/users`)**

### **2.1 Create User**
* **Endpoint:** `/api/users`
* **Method:** `POST`
* **Description:** Creates a user directly.
* **Access:** Admin (`ADMIN` role)
* **Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@scic.com",
  "password": "AdminPass123!",
  "role": "ADMIN"
}
```
* **Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

---

### **2.2 Get All Users**
* **Endpoint:** `/api/users`
* **Method:** `GET`
* **Description:** Retrieves all non-deleted users.
* **Access:** Admin (`ADMIN` role)
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid-v4-user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-08-10T14:00:00.000Z"
    }
  ]
}
```
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`

---

### **2.3 Get User by ID**
* **Endpoint:** `/api/users/:id`
* **Method:** `GET`
* **Description:** Fetches a user profile by ID.
* **Access:** Authenticated
* **Status Codes:** `200 OK`, `401 Unauthorized`, `404 Not Found`

---

### **2.4 Update User**
* **Endpoint:** `/api/users/:id`
* **Method:** `PUT`
* **Description:** Updates user details.
* **Access:** Authenticated
* **Request Body:**
```json
{
  "name": "Updated Name"
}
```
* **Status Codes:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

---

### **2.5 Delete User (Soft Delete)**
* **Endpoint:** `/api/users/:id`
* **Method:** `DELETE`
* **Description:** Performs a soft delete by setting `isDeleted = true`.
* **Access:** Admin (`ADMIN` role)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

## **3. Category Module (`/api/categories`)**

### **3.1 Get All Categories**
* **Endpoint:** `/api/categories`
* **Method:** `GET`
* **Description:** Retrieves all active categories.
* **Access:** Public
* **Status Codes:** `200 OK`

---

### **3.2 Get Category by ID**
* **Endpoint:** `/api/categories/:id`
* **Method:** `GET`
* **Description:** Retrieves category details with associated products.
* **Access:** Public
* **Status Codes:** `200 OK`, `404 Not Found`

---

### **3.3 Create Category**
* **Endpoint:** `/api/categories`
* **Method:** `POST`
* **Description:** Creates a new category.
* **Access:** Admin (`ADMIN` role)
* **Request Body:**
```json
{
  "name": "Electronics",
  "description": "Gadgets and tech items"
}
```
* **Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

---

### **3.4 Update Category**
* **Endpoint:** `/api/categories/:id`
* **Method:** `PUT`
* **Description:** Updates category details.
* **Access:** Admin (`ADMIN` role)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

### **3.5 Delete Category (Soft Delete)**
* **Endpoint:** `/api/categories/:id`
* **Method:** `DELETE`
* **Description:** Soft deletes a category.
* **Access:** Admin (`ADMIN` role)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

## **4. Product Module (`/api/products`)**

### **4.1 Get All Products**
* **Endpoint:** `/api/products`
* **Method:** `GET`
* **Query Parameters:** `categoryId`, `status`, `search`
* **Description:** Retrieves all active products with category and review data.
* **Access:** Public
* **Status Codes:** `200 OK`

---

### **4.2 Get Product by ID**
* **Endpoint:** `/api/products/:id`
* **Method:** `GET`
* **Description:** Fetches product details.
* **Access:** Public
* **Status Codes:** `200 OK`, `404 Not Found`

---

### **4.3 Create Product**
* **Endpoint:** `/api/products`
* **Method:** `POST`
* **Description:** Creates a new product.
* **Access:** Admin (`ADMIN` role)
* **Request Body:**
```json
{
  "title": "Wireless Headphones",
  "description": "High-quality ANC headphones",
  "price": 149.99,
  "stock": 30,
  "status": "AVAILABLE",
  "categoryId": "uuid-category-id"
}
```
* **Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

---

### **4.4 Update Product**
* **Endpoint:** `/api/products/:id`
* **Method:** `PUT`
* **Description:** Updates product info.
* **Access:** Admin (`ADMIN` role)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

### **4.5 Delete Product (Soft Delete)**
* **Endpoint:** `/api/products/:id`
* **Method:** `DELETE`
* **Description:** Soft deletes a product.
* **Access:** Admin (`ADMIN` role)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

## **5. Review Module (`/api/reviews`)**

### **5.1 Create Review**
* **Endpoint:** `/api/reviews`
* **Method:** `POST`
* **Description:** Adds a review for a product.
* **Access:** Authenticated
* **Request Body:**
```json
{
  "rating": 5,
  "comment": "Awesome product!",
  "productId": "uuid-product-id"
}
```
* **Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`

---

### **5.2 Get All Reviews**
* **Endpoint:** `/api/reviews`
* **Method:** `GET`
* **Query Parameters:** `productId`
* **Description:** Gets reviews.
* **Access:** Public
* **Status Codes:** `200 OK`

---

### **5.3 Update Review**
* **Endpoint:** `/api/reviews/:id`
* **Method:** `PUT`
* **Description:** Updates a user review.
* **Access:** Authenticated (Owner or Admin)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

### **5.4 Delete Review (Soft Delete)**
* **Endpoint:** `/api/reviews/:id`
* **Method:** `DELETE`
* **Description:** Soft deletes a review.
* **Access:** Authenticated (Owner or Admin)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

## **6. Order Module (`/api/orders`)**

### **6.1 Create Order**
* **Endpoint:** `/api/orders`
* **Method:** `POST`
* **Description:** Places a new order.
* **Access:** Authenticated
* **Request Body:**
```json
{
  "items": [
    { "productId": "uuid-product-id", "quantity": 2, "price": 149.99 }
  ],
  "totalAmount": 299.98
}
```
* **Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`

---

### **6.2 Get All Orders**
* **Endpoint:** `/api/orders`
* **Method:** `GET`
* **Description:** Retrieves orders (Users see their own, Admins see all).
* **Access:** Authenticated
* **Status Codes:** `200 OK`, `401 Unauthorized`

---

### **6.3 Update Order Status**
* **Endpoint:** `/api/orders/:id/status`
* **Method:** `PUT`
* **Description:** Updates the status of an order (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
* **Access:** Admin (`ADMIN` role)
* **Request Body:**
```json
{
  "status": "DELIVERED"
}
```
* **Status Codes:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

---

### **6.4 Delete Order (Soft Delete)**
* **Endpoint:** `/api/orders/:id`
* **Method:** `DELETE`
* **Description:** Soft deletes an order.
* **Access:** Authenticated (Owner or Admin)
* **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
