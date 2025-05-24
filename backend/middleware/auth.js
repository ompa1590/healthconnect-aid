
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Missing API key',
      message: 'x-api-key header is required'
    });
  }
  
  if (apiKey !== process.env.VAPI_API_KEY) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  next();
};

module.exports = { authenticate };
