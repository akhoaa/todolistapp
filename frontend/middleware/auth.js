const jwt = require('jsonwebtoken');

// Middleware: require user login
function requireLogin(req, res, next) {
  const token = req.session.token;
  if (!token) {
    req.session.error = 'Bạn cần đăng nhập.';
    return res.redirect('/auth/signin');
  }
  try {
    const user = jwt.decode(token);
    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    req.session.error = 'Phiên đăng nhập không hợp lệ.';
    return res.redirect('/auth/signin');
  }
}

// Middleware: require admin role
function requireAdmin(req, res, next) {
  const user = req.user || res.locals.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Access Denied' });
  }
  next();
}

module.exports = {
  requireLogin,
  requireAdmin
}; 