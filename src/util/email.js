const email = require( "@sendgrid/mail" );
email.setApiKey( process.env.SENDGRID_API_KEY );

/* dummy service to supress sending email during testing */
function send( msg ) { console.log( "email.send(): %O", msg.to ); }
const dummy = { send }

const service = ( process.env.NODE_ENV === "test" ) ? dummy : email;

module.exports = {

  service: service,

  messages: {

    welcome( to = "" ) {
      return { to,
        from: "Blocipedia <app@blocipedia.com>",
        subject: "Welcome to Blocipedia!",
        text: "An app that lets users create wikis and share them publicly or privately with other collaborators.\r\n\r\nVisit Blocipedia at https://finnwhite--bloc--blocipedia.herokuapp.com/",
        html: "<p>An app that lets users create wikis and share them publicly or privately with other collaborators.</p><p>Visit Blocipedia at <a href='https://finnwhite--bloc--blocipedia.herokuapp.com/' target='blocipedia'>https://finnwhite--bloc--blocipedia.herokuapp.com/</a></p>",
      };
    },

  },

  logResult() {
    return ( err, result ) => {
      if ( err ) { console.log( "EMAIL ERROR!: %O", err.code ); }
      else { console.log( "EMAIL SUCCESS!: %O", result[ 0 ].statusCode ); }
    }
  },

};
