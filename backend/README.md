
# Vapi AI Triage Nurse Backend

A secure Node.js backend that integrates Supabase with Vapi AI to create an intelligent medical triage system. The bot verifies patient identity and retrieves appointment information before conducting medical triage.

## 🏗️ Architecture

```
backend/
├── app.js                 # Main Express server
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── routes/
│   └── vapi.js           # Vapi function endpoints
├── services/
│   └── supabase.js       # Supabase client configuration
├── utils/
│   ├── verifyIdentity.js # Patient identity verification logic
│   └── getAppointmentDetails.js # Appointment lookup logic
└── middleware/
    ├── auth.js           # API key authentication
    └── logging.js        # Request/response logging
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase project with the required tables
- Vapi account for AI bot integration

### Installation

1. **Clone and setup:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Required Environment Variables:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VAPI_API_KEY=your-vapi-api-key
PORT=3001
NODE_ENV=development
```

4. **Start the server:**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication
All `/vapi/*` endpoints require the `x-api-key` header:
```
x-api-key: your-vapi-api-key
```

### POST /vapi/verifyIdentity

Verifies patient identity using name and date of birth.

**Request:**
```json
{
  "name": "John Doe",
  "dateOfBirth": "1990-05-15"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "patientName": "John Doe"
}
```

**Response (Failed):**
```json
{
  "verified": false,
  "error": "Identity verification failed"
}
```

### POST /vapi/getAppointmentDetails

Retrieves upcoming appointment details for a verified patient.

**Request:**
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response (Success):**
```json
{
  "appointmentDate": "2024-05-26",
  "appointmentTime": "15:00",
  "doctorName": "Dr. Smith",
  "serviceType": "General Consultation",
  "status": "upcoming",
  "reason": "Annual checkup"
}
```

**Response (No appointments):**
```json
{
  "appointmentDate": null,
  "appointmentTime": null,
  "doctorName": null,
  "serviceType": null,
  "status": "no_upcoming_appointments",
  "message": "No upcoming appointments found"
}
```

### GET /vapi/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-05-24T10:30:00.000Z",
  "service": "vapi-triage-backend"
}
```

## 🧪 Testing

### Using curl

1. **Test identity verification:**
```bash
curl -X POST http://localhost:3001/vapi/verifyIdentity \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-vapi-api-key" \
  -d '{
    "name": "John Doe",
    "dateOfBirth": "1990-05-15"
  }'
```

2. **Test appointment details:**
```bash
curl -X POST http://localhost:3001/vapi/getAppointmentDetails \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-vapi-api-key" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

3. **Health check:**
```bash
curl http://localhost:3001/vapi/health \
  -H "x-api-key: your-vapi-api-key"
```

### Using Postman

1. Import the following requests into Postman
2. Set the base URL to `http://localhost:3001`
3. Add `x-api-key` header to all requests
4. Use the request bodies shown in the curl examples above

## 🔒 Security Features

- **API Key Authentication**: All endpoints protected with x-api-key header
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Protection**: Parameterized queries via Supabase
- **Secure Logging**: No sensitive data logged
- **CORS Protection**: Configurable origin restrictions
- **Helmet Security**: Standard Express security headers

## 🗄️ Database Requirements

The backend expects these Supabase tables:

### profiles
- `id` (uuid, primary key)
- `name` (text)
- `date_of_birth` (date)
- `email` (text)

### appointments
- `id` (uuid, primary key)
- `patient_id` (uuid, foreign key to profiles.id)
- `appointment_date` (date)
- `appointment_time` (text)
- `doctor_name` (text)
- `service_type` (text)
- `service_name` (text)
- `status` (text)
- `reason` (text)

## 🤖 Vapi Integration

### Bot Flow
1. **Collect Information**: Bot asks for patient name and date of birth
2. **Verify Identity**: Call `POST /vapi/verifyIdentity`
3. **Get Appointment**: If verified, call `POST /vapi/getAppointmentDetails`
4. **Proceed with Triage**: Continue with medical questions if verification successful
5. **End Call**: Politely end if verification fails

### Function Calling Setup
Configure these function calls in your Vapi bot:

**verifyIdentity Function:**
```json
{
  "name": "verifyIdentity",
  "description": "Verify patient identity using name and date of birth",
  "url": "https://your-backend-url.com/vapi/verifyIdentity",
  "method": "POST",
  "headers": {
    "x-api-key": "your-vapi-api-key"
  },
  "parameters": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Patient's full name"
      },
      "dateOfBirth": {
        "type": "string",
        "description": "Patient's date of birth in YYYY-MM-DD format"
      }
    },
    "required": ["name", "dateOfBirth"]
  }
}
```

**getAppointmentDetails Function:**
```json
{
  "name": "getAppointmentDetails",
  "description": "Get upcoming appointment details for verified patient",
  "url": "https://your-backend-url.com/vapi/getAppointmentDetails",
  "method": "POST",
  "headers": {
    "x-api-key": "your-vapi-api-key"
  },
  "parameters": {
    "type": "object",
    "properties": {
      "patientId": {
        "type": "string",
        "description": "Verified patient's unique identifier"
      }
    },
    "required": ["patientId"]
  }
}
```

## 🚢 Deployment

### Production Checklist

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use production Supabase URL and service role key
   - Configure proper CORS origins
   - Set strong API key

2. **Security:**
   - Enable HTTPS
   - Configure firewall rules
   - Set up monitoring and logging
   - Regular security updates

3. **Performance:**
   - Configure process manager (PM2)
   - Set up load balancing if needed
   - Monitor memory and CPU usage

### Example PM2 Configuration

```json
{
  "name": "vapi-triage-backend",
  "script": "app.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3001
  }
}
```

## 📊 Monitoring & Logs

The application logs:
- All API requests with timestamps
- Identity verification attempts (without sensitive data)
- Database query results
- Error conditions
- Performance metrics

Monitor these key metrics:
- Response times for verification and appointment lookups
- Success/failure rates for identity verification
- API key usage patterns
- Database connection health

## 🆘 Troubleshooting

### Common Issues

1. **"Missing API key" error:**
   - Ensure `x-api-key` header is included in all requests
   - Verify the API key matches your .env file

2. **"Identity verification failed":**
   - Check that name and date of birth exactly match database records
   - Verify patient has appointments in the appointments table
   - Ensure date format is YYYY-MM-DD

3. **Database connection errors:**
   - Verify Supabase URL and service role key
   - Check RLS policies allow service role access
   - Ensure foreign key relationships are properly set up

4. **Rate limiting:**
   - Default: 100 requests per 15 minutes per IP
   - Adjust `RATE_LIMIT_*` environment variables if needed

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and additional logging.

## 📄 License

MIT License - see LICENSE file for details.
