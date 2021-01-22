export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-ts-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '1q2w3e4r5t!#2020'
}
