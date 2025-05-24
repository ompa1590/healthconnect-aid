
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  // Log request (without sensitive data)
  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);
  
  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - Response: ${statusCode}`);
    
    // Log error responses (but not sensitive data)
    if (statusCode >= 400) {
      console.log(`[${timestamp}] Error Response: ${statusCode} - ${url}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = { requestLogger };
