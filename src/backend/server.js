const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const app = express();
const { nanoid } = require('nanoid');
const port = process.env.PORT || 5000;
// const { createProxyMiddleware } = require("http-proxy-middleware");

// app.use(
//   "/api/v1/uploadFile",
//   createProxyMiddleware({
//     target: "http://34.192.150.36", // Insecure API endpoint
//     changeOrigin: true,
//     pathRewrite: {
//       "^/api/v1/uploadFile": "/api/v1/uploadFile", // Keep the same path
//     },
//   })
// );
// Enable CORS for all routes
app.use(cors());

// Add body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = nanoid(12); // You can change the length if needed
    const ext = path.extname(file.originalname); // Keep original extension
    cb(null, `${uniqueId}${ext}`);
  }
  
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Image upload endpoint
app.post('/api/v1/uploadFile', upload.single('file'), (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file
    const fileBuffer = fs.readFileSync(req.file.path);
    console.log('File read successfully, size:', fileBuffer.length);
    
    // Return the file ID and image data
    const response = {
      fileId: req.file.filename,
      croppedImage: `data:image/jpeg;base64,${fileBuffer.toString('base64')}`
    };
    console.log('Sending response');
    res.json(response);

    // Clean up the uploaded file after sending response
    // fs.unlinkSync(req.file.path);
    console.log('Temporary file cleaned up');
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      error: 'Error processing upload',
      details: error.message 
    });
  }
});

// Helper to read/write users
function readUsers() {
  return JSON.parse(fs.readFileSync('users.json', 'utf8'));
}
function writeUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

// Signup
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });
  writeUsers(users);
  res.json({ success: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, 'your_secret_key');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});
const allowedOrigins = [
  'https://algonomic-ai.vercel.app',
  'http://localhost:300', // For local testing
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// New endpoint for generating image variations
app.get('/api/v1/generate/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        
        // Here you would typically:
        // 1. Retrieve the original image using fileId
        // 2. Process it to create variations
        // 3. Return the array of variations

        // For now, we'll return a mock response structure
        const variations = [];
        
        // Generate 49 variations with different brightness and contrast values
        for (let b = 0.2; b <= 1.0; b += 0.2) {
            for (let c = 0.2; c <= 1.0; c += 0.2) {
                variations.push({
                    fileName: `output_b${b.toFixed(2)}_c${c.toFixed(2)}.jpg`,
                    settings: {
                        b: parseFloat(b.toFixed(2)),
                        c: parseFloat(c.toFixed(2))
                    },
                    imageData: `data:image/jpeg;base64,MOCK_IMAGE_DATA_${b.toFixed(2)}_${c.toFixed(2)}`
                });
            }
        }

        res.json({
            success: true,
            variations: variations
        });
    } catch (error) {
        console.error('Error generating variations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate image variations'
        });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit http://localhost:${port} to check if server is running`);
});
