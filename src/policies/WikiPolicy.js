const ApplicationPolicy = require( "./ApplicationPolicy.js" );

class WikiPolicy extends ApplicationPolicy {

  constructor( user, record ) {
    super( user, record );
  }

  _isCreator() { return (
    this.user && this.record && ( this.record.creatorId == this.user.id )
  ) }

  create() { return this.standard(); }
  createPublic() { return this.standard(); }
  createPrivate() { return this.premium(); }

  update() { return this.standard(); }
  updatePrivate() { return (
    this._isAdmin() || ( this.update() && this._isOwner() )
  ) }
  makePublic() { return this.updatePrivate(); }
  makePrivate() { return ( this.updatePrivate() && this.createPrivate() ) }

  delete() { return (
    this._isAdmin() || ( this.update() && this._isOwner() )
  ) }

};

module.exports = WikiPolicy;
