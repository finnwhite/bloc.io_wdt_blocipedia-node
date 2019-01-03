require( "dotenv" ).config();

const payments = require( "./payments.js" );
const user = { id: 1, username: "test", email: "test@blocipedia.com" };
const token = "tok_visa";

payments.service.charges.create(
  payments.charges.premium( user, token ), payments.logResult()
);
