module.exports = {

  init() {
    /* report on required environment variables */
    console.log( "NODE_ENV=%O", process.env.NODE_ENV );
    console.log( "COOKIE_SECRET=%O", process.env.COOKIE_SECRET );
    console.log( "SENDGRID_API_KEY=%O", process.env.SENDGRID_API_KEY );
  },

};
