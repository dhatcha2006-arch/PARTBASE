# PARTBASE REST API Reference

The PARTBASE REST API provides structured endpoints for mobile and PWA clients.

## Standard JSON Response Envelope

All API endpoints return JSON conforming to the standard envelope:

```json
{
  "ok": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

In case of error:

```json
{
  "ok": false,
  "error": "Error description or code",
  "message": "Detailed context message"
}
```

---

## Authentication Endpoints

### 1. Send OTP
* **URL:** `POST /api/auth/send-otp`
* **Headers:** `Content-Type: application/json`
* **Body:**
  ```json
  { "phone": "+919876543210" }
  ```
* **Response (200 OK):**
  ```json
  { "ok": true, "message": "OTP dispatched successfully" }
  ```

### 2. Verify OTP
* **URL:** `POST /api/auth/verify-otp`
* **Body:**
  ```json
  { "phone": "+919876543210", "code": "123456" }
  ```
* **Response (200 OK):**
  ```json
  { "ok": true, "data": { "user_id": 1, "role": "seeker" } }
  ```

---

## Job & Search Endpoints

### 3. Search & List Jobs
* **URL:** `GET /api/jobs`
* **Query Parameters:**
  * `area_id` (optional): Filter by Chennai locality ID
  * `category` (optional): Filter by category (`shop_helper`, `packing`, `cashier`, `cleaning`)
  * `day` (optional): Filter by day availability (`today`, `tomorrow`, `weekend`)
* **Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": [
      {
        "id": 1,
        "title": "Counter Sales Assistant",
        "category": "shop_helper",
        "pay_amount": 150,
        "pay_type": "hour",
        "shop_name": "Sri Murugan Tailors",
        "area_name": "OMR"
      }
    ]
  }
  ```

---

## Safety & Policy Validation

### 4. Real-time Scam Check
* **URL:** `POST /api/scam-check`
* **Body:**
  ```json
  { "text": "Registration fee Rs 200 required before interview." }
  ```
* **Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "blocked": true,
      "flagged": true,
      "reason": "Mentions upfront registration fees, violating the zero-fee guarantee."
    }
  }
  ```


## Health & Diagnostics Endpoints

### 5. Service Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Returns live service uptime status, version identifier, and ISO UTC timestamp.

**Response (200 OK):**
```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "service": "partbase",
    "version": "1.2.0",
    "timestamp": "2026-11-24T09:30:00Z"
  },
  "message": "PARTBASE micro-job API is operating nominally"
}
```
