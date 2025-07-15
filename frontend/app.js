const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const moment = require('moment');

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

// CORS (nếu cần cho API call từ FE -> BE)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Helper: API call tới backend
app.use((req, res, next) => {
  res.api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
      ...(req.session.token ? { 'Authorization': `Bearer ${req.session.token}` } : {})
    },
    withCredentials: true
  });
  next();
});

// Flash message helper
app.use((req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  res.locals.user = req.session.user;
  req.session.success = null;
  req.session.error = null;
  next();
});

// Route mẫu
app.get('/', (req, res) => {
  res.render('index', { title: 'Todo List App' });
});

// AUTH ROUTES
app.get('/auth/signin', (req, res) => {
  if (req.session.token) return res.redirect('/dashboard');
  res.render('auth/signin', { title: 'Sign In' });
});

app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await res.api.post('/auth/signin', { email, password });
    req.session.token = response.data.access_token;
    req.session.user = response.data.user || null;
    req.session.success = 'Đăng nhập thành công!';
    return res.redirect('/dashboard');
  } catch (err) {
    req.session.error = err.response?.data?.message || 'Đăng nhập thất bại!';
    return res.redirect('/auth/signin');
  }
});

app.get('/auth/signup', (req, res) => {
  if (req.session.token) return res.redirect('/dashboard');
  res.render('auth/signup', { title: 'Sign Up' });
});

app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword, otp } = req.body;
    if (password !== confirmPassword) {
      req.session.error = 'Mật khẩu xác nhận không khớp!';
      return res.redirect('/auth/signup');
    }
    await res.api.post('/auth/signup', { email, password, otp });
    req.session.success = 'Đăng ký thành công! Vui lòng xác thực email.';
    return res.redirect('/auth/verify');
  } catch (err) {
    req.session.error = err.response?.data?.message || 'Đăng ký thất bại!';
    return res.redirect('/auth/signup');
  }
});

app.get('/auth/forgot', (req, res) => {
  res.render('auth/forgot', { title: 'Forgot Password' });
});

app.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    await res.api.post('/auth/forgot-password', { email });
    req.session.success = 'Đã gửi email đặt lại mật khẩu!';
    return res.redirect('/auth/signin');
  } catch (err) {
    req.session.error = err.response?.data?.message || 'Không gửi được email!';
    return res.redirect('/auth/forgot');
  }
});

app.get('/auth/verify', (req, res) => {
  res.render('auth/verify', { title: 'Email Verification' });
});

app.post('/auth/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    await res.api.post('/auth/verify', { email, otp });
    req.session.success = 'Xác thực email thành công!';
    return res.redirect('/auth/signin');
  } catch (err) {
    req.session.error = err.response?.data?.message || 'Xác thực thất bại!';
    return res.redirect('/auth/verify');
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/signin');
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error', error: err });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
}); 