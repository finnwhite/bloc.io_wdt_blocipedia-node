require( "dotenv" ).config();

const email = require( "./email.js" );
const to = "test <test@blocipedia.com>";

email.service.send( email.messages.welcome( to ), email.logResult() );
