#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=========================================="
echo "1. HEALTH CHECK"
echo "=========================================="
curl -s "${BASE_URL}/../"
echo -e "\n"

echo "=========================================="
echo "2. AUTH REGISTER & LOGIN"
echo "=========================================="
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@example.com"

echo "--> Registering User..."
REGISTER_RES=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"${TEST_EMAIL}\",\"password\":\"Pass123!\",\"role\":\"USER\"}")
echo $REGISTER_RES
echo -e "\n"

echo "--> Logging in Admin User..."
ADMIN_LOGIN_RES=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@scic.com","password":"AdminPass123!"}')
echo $ADMIN_LOGIN_RES
ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RES | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Admin Token obtained: ${ADMIN_TOKEN:0:20}..."
echo -e "\n"

echo "--> Logging in Regular User..."
USER_LOGIN_RES=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"Pass123!\"}")
USER_TOKEN=$(echo $USER_LOGIN_RES | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "User Token obtained: ${USER_TOKEN:0:20}..."
echo -e "\n"

echo "=========================================="
echo "3. CATEGORY CRUD"
echo "=========================================="
echo "--> Creating Category (Admin)..."
CAT_RES=$(curl -s -X POST "${BASE_URL}/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d "{\"name\":\"Smart Devices ${TIMESTAMP}\",\"description\":\"Test Category Description\"}")
echo $CAT_RES
CAT_ID=$(echo $CAT_RES | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
echo "Created Category ID: $CAT_ID"
echo -e "\n"

echo "--> Get All Categories..."
curl -s -X GET "${BASE_URL}/categories"
echo -e "\n"

echo "--> Get Category By ID..."
curl -s -X GET "${BASE_URL}/categories/${CAT_ID}"
echo -e "\n"

echo "--> Update Category..."
curl -s -X PUT "${BASE_URL}/categories/${CAT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d "{\"description\":\"Updated description\"}"
echo -e "\n"

echo "=========================================="
echo "4. PRODUCT CRUD"
echo "=========================================="
echo "--> Creating Product (Admin)..."
PROD_RES=$(curl -s -X POST "${BASE_URL}/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d "{\"title\":\"Smart Watch ${TIMESTAMP}\",\"description\":\"Feature rich smartwatch\",\"price\":299.99,\"stock\":15,\"status\":\"AVAILABLE\",\"categoryId\":\"${CAT_ID}\"}")
echo $PROD_RES
PROD_ID=$(echo $PROD_RES | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
echo "Created Product ID: $PROD_ID"
echo -e "\n"

echo "--> Get All Products..."
curl -s -X GET "${BASE_URL}/products"
echo -e "\n"

echo "--> Get Product By ID..."
curl -s -X GET "${BASE_URL}/products/${PROD_ID}"
echo -e "\n"

echo "--> Update Product..."
curl -s -X PUT "${BASE_URL}/products/${PROD_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{"price":249.99,"stock":25}'
echo -e "\n"

echo "=========================================="
echo "5. REVIEW CRUD"
echo "=========================================="
echo "--> Creating Review (User)..."
REV_RES=$(curl -s -X POST "${BASE_URL}/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -d "{\"rating\":5,\"comment\":\"Super impressive watch!\",\"productId\":\"${PROD_ID}\"}")
echo $REV_RES
REV_ID=$(echo $REV_RES | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
echo "Created Review ID: $REV_ID"
echo -e "\n"

echo "--> Get All Reviews..."
curl -s -X GET "${BASE_URL}/reviews?productId=${PROD_ID}"
echo -e "\n"

echo "--> Update Review..."
curl -s -X PUT "${BASE_URL}/reviews/${REV_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -d '{"rating":4,"comment":"Updated: Battery life could be better."}'
echo -e "\n"

echo "=========================================="
echo "6. ORDER CRUD"
echo "=========================================="
echo "--> Creating Order (User)..."
ORD_RES=$(curl -s -X POST "${BASE_URL}/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -d "{\"items\":[{\"productId\":\"${PROD_ID}\",\"quantity\":1,\"price\":249.99}],\"totalAmount\":249.99}")
echo $ORD_RES
ORD_ID=$(echo $ORD_RES | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
echo "Created Order ID: $ORD_ID"
echo -e "\n"

echo "--> Get User Orders..."
curl -s -X GET "${BASE_URL}/orders" \
  -H "Authorization: Bearer ${USER_TOKEN}"
echo -e "\n"

echo "--> Update Order Status (Admin)..."
curl -s -X PUT "${BASE_URL}/orders/${ORD_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{"status":"SHIPPED"}'
echo -e "\n"

echo "=========================================="
echo "7. SOFT DELETE TESTS"
echo "=========================================="
echo "--> Soft Delete Review..."
curl -s -X DELETE "${BASE_URL}/reviews/${REV_ID}" \
  -H "Authorization: Bearer ${USER_TOKEN}"
echo -e "\n"

echo "--> Soft Delete Product..."
curl -s -X DELETE "${BASE_URL}/products/${PROD_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
echo -e "\n"

echo "--> Soft Delete Category..."
curl -s -X DELETE "${BASE_URL}/categories/${CAT_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
echo -e "\n"

echo "=========================================="
echo "CRUD TESTS COMPLETE"
echo "=========================================="
