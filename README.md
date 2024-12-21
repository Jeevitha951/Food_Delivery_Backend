# Food Delivery System

# Testing the APIs with Postman: 
1. AddMenuItem (POST /menu)
- URL: http://localhost:3000/menu
- Method: POST
- Body (JSON):
- json
{
  "name": "Pizza",
  "price": 200,
  "category": "Main Course"
}

- Output:
{
    "message": "Menu item added/updated",
    "menu": [
        {
            "id": 1,
            "name": "Pizza",
            "price": 200,
            "category": "Main Course"
        }
    ]
}


2. Get Menu (GET /menu):
- URL: http://localhost:3000/menu
- Method: GET
- Output:
[
    {
        "id": 1,
        "name": "Pizza",
        "price": 200,
        "category": "Main Course"
    }
]


3. Place Order (POST /orders):
- URL: http://localhost:3000/orders
- Method: POST
- Body (JSON):
- json
{
  "items": [1]  
}
- Output:
{
    "message": "Order placed",
    "order": {
        "id": 1,
        "items": [
            1
        ],
        "status": "Preparing"
    }
}

4. Get Order Details (GET /orders/:id)
- URL: http://localhost:3000/orders/1
- Method: GET
- Output:
{
    "id": 1,
    "items": [
        1
    ],
    "status": "Out for Delivery"
}

- {
    "id": 1,
    "items": [
        1
    ],
    "status": "Delivered"
}
