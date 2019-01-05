const Wiki = require( "../db/models" ).Wiki;
const WikiPolicy = require( "../policies/WikiPolicy.js" );

module.exports = {

  index( req, res, next ) {
    const scope = "public";
    Wiki.queries.selectAllScoped( scope, ( err, wikis ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/" ) );
      }
      else {
        const showNew = new WikiPolicy( req.user ).new();
        res.render( "wikis/index", { wikis, showNew } );
      }
    } );
  },

  new( req, res, next ) {
    const permitNew = new WikiPolicy( req.user ).new();
    if ( permitNew ) {
      const showPrivate = new WikiPolicy( req.user ).createPrivate();
      res.render( "wikis/new", { showPrivate } );
    }
    else {
      req.flash( "style", "warning" );
      req.flash( "alert", "You are not authorized to do that." );
      res.redirect( ( req.headers.referer || "/wikis" ) );
    }
  },

  create( req, res, next ) {

    const values = {
      title: req.body.title,
      body: req.body.body,
      private: req.body.private,
      creatorId: req.user.id,
    };

    const permitCreate = new WikiPolicy( req.user, values ).create();
    if ( permitCreate ) {
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

  dashboard( req, res, next ) {
    const scope = { method: [ "byCreatorId", req.user.id ] };
    Wiki.queries.selectAllScoped( scope, ( err, wikis ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/" ) );
      }
      else {
        const channel = "My Wikis";
        const showNew = new WikiPolicy( req.user ).new();
        res.render( "wikis/dashboard", { wikis, channel, showNew } );
      }
    } );
  },

  view( req, res, next ) {
    Wiki.queries.select( req.params.id, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permitView = new WikiPolicy( req.user, wiki ).view();
        if ( permitView ) {
          const showEdit = new WikiPolicy( req.user, wiki ).edit();
          const showDelete = new WikiPolicy( req.user, wiki ).delete();
          res.render( "wikis/view", { wiki, showEdit, showDelete } );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || "/wikis" ) );
        }
      }
    } );
  },

  edit( req, res, next ) {
    Wiki.queries.select( req.params.id, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permitEdit = new WikiPolicy( req.user, wiki ).edit();
        if ( permitEdit ) {
          const enablePublic = new WikiPolicy( req.user, wiki ).makePublic();
          const enablePrivate = new WikiPolicy( req.user, wiki ).makePrivate();
          res.render( "wikis/edit", { wiki, enablePublic, enablePrivate } );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || "/wikis" ) );
        }
      }
    } );
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
            else { res.redirect( "/wikis/dashboard" ); } // TODO: contextual
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
