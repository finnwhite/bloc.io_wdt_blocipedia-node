require( "dotenv" ).config();
require( "../config/env-config.js" ).init();

const email = require( "./email.js" );

email.service.send(
  email.messages.welcome( "test <test@blocipedia.com>" ), email.logResult()
);
