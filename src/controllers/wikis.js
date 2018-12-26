const Wiki = require( "../db/models" ).Wiki;
const WikiPolicy = require( "../policies/WikiPolicy.js" );

module.exports = {

  index( req, res, next ) {
    Wiki.queries.selectAllScoped( "public", ( err, wikis ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/" ) );
      }
      else {
        const permitNew = new WikiPolicy( req.user ).new();
        res.render( "wikis/index", { wikis, permitNew } );
      }
    } );
  },

  new( req, res, next ) {
    const permitNew = new WikiPolicy( req.user ).new();
    if ( permitNew ) {
      const permitPrivate = new WikiPolicy( req.user ).createPrivate();
      res.render( "wikis/new", { permitPrivate } );
    }
    else {
      req.flash( "style", "warning" );
      req.flash( "alert", "You are not authorized to do that." );
      res.redirect( ( req.headers.referer || "/wikis" ) );
    }
  },

  create( req, res, next ) { // TODO: add proposed values to policy check?
    const permitCreate = new WikiPolicy( req.user ).create();
    if ( permitCreate ) {

      const values = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        creatorId: req.user.id,
      };

      Wiki.queries.insert( values, ( err, wiki ) => {
        if ( err ) {
          req.flash( "style", "danger" );
          req.flash( "alert", err );
          res.redirect( ( req.headers.referer || "/wikis/new" ) );
        }
        else { res.redirect( `./${ wiki.id }` ); } // /wikis/:id
      } );
    }
    else {
      req.flash( "style", "warning" );
      req.flash( "alert", "You are not authorized to do that." );
      res.redirect( ( req.headers.referer || "/wikis" ) );
    }
  },

  view( req, res, next ) { // TODO: implement policy check
    Wiki.queries.select( req.params.id, ( err, wiki ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permitEdit = new WikiPolicy( req.user, wiki ).edit();
        const permitDelete = new WikiPolicy( req.user, wiki ).delete();
        res.render( "wikis/view", { wiki, permitEdit, permitDelete } );
      }
    } );
  },

  edit( req, res, next ) { // TODO: get record THEN check policy?
    const permitEdit = new WikiPolicy( req.user ).edit();
    if ( permitEdit ) {
      Wiki.queries.select( req.params.id, ( err, wiki ) => {
        if ( err ) {
          req.flash( "style", "danger" );
          req.flash( "alert", err );
          res.redirect( ( req.headers.referer || "/wikis" ) );
        }
        else {
          const permitPublic = new WikiPolicy( req.user, wiki ).makePublic();
          const permitPrivate = new WikiPolicy( req.user, wiki ).makePrivate();
          res.render( "wikis/edit", { wiki, permitPublic, permitPrivate } );
        }
      } );
    }
    else {
      req.flash( "style", "warning" );
      req.flash( "alert", "You are not authorized to do that." );
      res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
    }
  },

  update( req, res, next ) {
    Wiki.queries.select( req.params.id, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permitUpdate = new WikiPolicy( req.user, wiki ).update();
        if ( permitUpdate ) {
          Wiki.queries.update( wiki.id, req.body, ( err, wiki ) => {
            if ( err ) {
              req.flash( "style", "danger" );
              req.flash( "alert", err );
              res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
            }
            else { res.redirect( "." ); } // /wikis/:id
          } );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
        }
      }
    } );
  },

  delete( req, res, next ) {
    Wiki.queries.select( req.params.id, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permitDelete = new WikiPolicy( req.user, wiki ).delete();
        if ( permitDelete ) {
          Wiki.queries.delete( wiki.id, ( err, wiki ) => {
            if ( err ) {
              req.flash( "style", "danger" );
              req.flash( "alert", err );
              res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
            }
            else { res.redirect( "/wikis" ); }
          } );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
        }
      }
    } );
  },

};
