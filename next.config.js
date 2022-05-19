/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages/', 'components/', 'client/']
  },
  env: {
    APP_NAME: "js_front2",
    COOKIE_KEY_USER_ID: "next2022uid",
    CSRF_SECRET: "secret1234",
    API_URI : "http://localhost:4000",
    /* firebase */
    REACT_APP_FIREBASE_API_KEY: "",
    REACT_APP_FIREBASE_AUTH_DOMAIN: "",
    REACT_APP_FIREBASE_PROJECT_ID: "",
    REACT_APP_FIREBASE_STORAGE_BUCKET: "",
    REACT_APP_FIREBASE_MESSAGE_SENDER_ID: "",
    REACT_APP_FIREBASE_APP_ID: "",
  },  
}
