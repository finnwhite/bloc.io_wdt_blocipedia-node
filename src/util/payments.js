const stripe = require( "stripe" )( process.env.STRIPE_API_SECRET );

module.exports = {

  service: stripe,

  charges: {

    premium( user = {}, token = "" ) {
      return {
        amount: 1499,
        currency: "usd",
        source: token,
        description: `Blocipedia Premium Plan fee for ${ user.username }`,
        metadata: { userId: user.id },
        receipt_email: user.email,
        statement_descriptor: "Blocipedia Premium",
      };
    },

  },

  logResult() {
    return ( err, result ) => {
      if ( err ) { console.log( "PAYMENT ERROR!: %O", err.message ); }
      else { console.log( "PAYMENT SUCCESS!: %O", result.status ); }
    }
  },

};
