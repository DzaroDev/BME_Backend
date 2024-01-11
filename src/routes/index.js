const express = require('express');
const { expressjwt } = require('express-jwt');

const config = require('../config');

// routes
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const serviceRoutes = require('./service.routes');
const blogRoutes = require('./blog.routes');
const notificationRoutes = require('./notification.routes');
const fileRoutes = require('./file.routes');
const jobPostingRoutes = require('./jobPosting.routes');
const pageContentRoutes = require('./pageContent.routes');
const subscriptionRoutes = require('./subscription.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/oauth', authRoutes);

// Validating all the APIs with jwt token.
router.use(
  expressjwt({
    secret: config.jwtSecret,
    algorithms: ['HS256'],
    credentialsRequired: true,
    getToken: function fromHeaderOrQuerystring(req) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
        return authHeader.split(' ')[1];
      }
      if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
  }).unless({ // bypass routes
    path: [
      '/api/user/create'
    ]
  }),
);

router.use('/user', userRoutes);
router.use('/company', companyRoutes);
router.use('/service', serviceRoutes);
router.use('/blog', blogRoutes);
router.use('/notification', notificationRoutes);
router.use('/files', fileRoutes);
router.use('/job-posting', jobPostingRoutes);
router.use('/page-content', pageContentRoutes);
router.use('/subscription', subscriptionRoutes);

module.exports = router;
