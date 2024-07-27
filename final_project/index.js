const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();

const JWT_SECRET = 'my_super_secret_key'; // Asigură-te că acesta este același în toate locurile

app.use(express.json());

app.use("/customer", session({
  secret: JWT_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Middleware pentru autentificare aplicat doar pentru rutele care necesită autentificare
app.use("/customer/auth", function auth(req, res, next) {
  // Endpoint-ul de login nu ar trebui să necesite autentificare
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  const token = req.headers['authorization']?.split(' ')[1]; // Tokenul trebuie să fie în format "Bearer <token>"
  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
});

const PORT = 3333;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
