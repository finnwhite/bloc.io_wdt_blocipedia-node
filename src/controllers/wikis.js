const User = require( "../db/models" ).User;
const Wiki = require( "../db/models" ).Wiki;
const WikiPolicy = require( "../policies/WikiPolicy.js" );
const Collaborator = require( "../db/models" ).Collaborator;

module.exports = {

  index( req, res, next ) {
    Wiki.queries.scope( "public" ).selectAll( ( err, wikis ) => {
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
    const permit = new WikiPolicy( req.user );
    if ( permit.new() ) {
      const showPrivate = permit.createPrivate();
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

    const permit = new WikiPolicy( req.user, values );
    if ( permit.create() ) {
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

  view( req, res, next ) {
    Wiki.queries.select( req.params.id, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permit = new WikiPolicy( req.user, wiki );
        if ( permit.view() ) {
          const showEdit = permit.edit();
          const showDelete = permit.delete();
          const showCollaborators = permit.collaborators();
          const showActions = ( showEdit || showDelete || showCollaborators );
          res.render( "wikis/view",
            { wiki, showActions, showEdit, showDelete, showCollaborators }
          );
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
        const permit = new WikiPolicy( req.user, wiki );
        if ( permit.edit() ) {
          const enablePublic = permit.makePublic();
          const enablePrivate = permit.makePrivate();
          res.render( "wikis/edit", { wiki, enablePublic, enablePrivate } );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
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
        const permit = new WikiPolicy( req.user, wiki );
        if ( permit.update() ) {
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
        const permit = new WikiPolicy( req.user, wiki );
        if ( permit.delete() ) {
          Wiki.queries.delete( wiki.id, ( err, wiki ) => {
            if ( err ) {
              req.flash( "style", "danger" );
              req.flash( "alert", err );
              res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
            }
            else { res.redirect( "/users/dashboard" ); } // TODO: contextual
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

  collaborators( req, res, next ) {
    Wiki.queries.select( req.params.wikiId, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || "/wikis" ) );
      }
      else {
        const permit = new WikiPolicy( req.user, wiki );
        if ( permit.collaborators() ) {

          /* force sort collabs in order created, TODO: via query */
          const createdAtAsc = function( a, b ) {
            const aValue = a.createdAt;
            const bValue = b.createdAt;
            if ( aValue < bValue ) { return -1; }
            if ( aValue > bValue ) { return 1; }
            return 0;
          }
          wiki.collaboration.sort( createdAtAsc );

          const showInvite = permit.inviteCollaborator();
          const showRemove = permit.removeCollaborator();
          res.render( "wikis/collaborators",
            { wiki, showInvite, showRemove }
          );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || "." ) ); // /wikis/:id
        }
      }
    } );
  },

  createCollaborator( req, res, next ) {
    const email = req.body.email;
    User.queries.selectWhere( { email }, ( err, user ) => {
      if ( err || !user ) {
        req.flash( "style", "warning" );
        req.flash( "alert",  `No user with email <${ email }> found.` );
        res.redirect( ( req.headers.referer || "." ) ); // ...collabs
      }
      else {
        Wiki.queries.select( req.params.wikiId, ( err, wiki ) => {
          if ( err || !wiki ) {
            req.flash( "style", "danger" );
            req.flash( "alert", ( err || "404 Not Found" ) );
            res.redirect( ( req.headers.referer || "." ) ); // ...collabs
          }
          else {
            const permit = new WikiPolicy( req.user, wiki );
            if ( permit.addCollaborator() ) {
              const values = {
                contentType: "wiki",
                contentId: wiki.id,
                userId: user.id,
              };

              Collaborator.queries.insert( values, ( err, collab ) => {
                if ( err ) {
                  req.flash( "style", "danger" );
                  req.flash( "alert", err );
                  res.redirect( ( req.headers.referer || "." ) ); // ...collabs
                }
                else { // TODO: send invite email?
                  res.redirect( "." ); // /wikis/:wikiId/collaborators
                }
              } );
            }
            else {
              req.flash( "style", "warning" );
              req.flash( "alert", "You are not authorized to do that." );
              res.redirect( ( req.headers.referer || "." ) ); // ...collabs
            }
          }
        } );
      }
    } );
  },

  deleteCollaborator( req, res, next ) {
    Wiki.queries.select( req.params.wikiId, ( err, wiki ) => {
      if ( err || !wiki ) {
        req.flash( "style", "danger" );
        req.flash( "alert", ( err || "404 Not Found" ) );
        res.redirect( ( req.headers.referer || ".." ) ); // ...collabs
      }
      else {
        const permit = new WikiPolicy( req.user, wiki );
        if ( permit.removeCollaborator() ) {
          const where = {
            contentType: "wiki",
            contentId: wiki.id,
            userId: req.params.userId,
          };

          Collaborator.queries.deleteWhere( where, ( err, collab ) => {
            if ( err ) {
              req.flash( "style", "danger" );
              req.flash( "alert", err );
              res.redirect( ( req.headers.referer || ".." ) ); // ...collabs
            }
            else { res.redirect( ".." ); } // /wikis/:wikiId/collaborators
          } );
        }
        else {
          req.flash( "style", "warning" );
          req.flash( "alert", "You are not authorized to do that." );
          res.redirect( ( req.headers.referer || ".." ) ); // ...collabs
        }
      }
    } );
  },

};
