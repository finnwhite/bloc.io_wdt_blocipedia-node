const ApplicationPolicy = require( "./ApplicationPolicy.js" );

class WikiPolicy extends ApplicationPolicy {

  constructor( user, record ) {
    super( user, record );
  }

  _isCreator() {
    return (
      this.user && this.record && ( this.record.creatorId == this.user.id )
    )
  }
  _isCollaborator() { return this._isCreator(); } // TODO: expand

  _isPrivate() { return ( this.record && this.record.private ) }
  _isPublic() { return !this._isPrivate() }

  create() { return this.standard(); }
  createPublic() { return this.standard(); }
  createPrivate() { return this.premium(); }

  read() {
    return (
      this._isPublic() || this._isCollaborator() || this._isAdmin()
    )
  }

  update() {
    return (
      ( this._isPublic() && this._isMember() )
      || this._isCollaborator() || this._isAdmin()
    )
  }
  makePublic() { return ( this._isOwner() || this._isAdmin() ) }
  makePrivate() {
    return (
      ( this._isOwner() && this.createPrivate() ) || this._isAdmin()
    )
  }

}

module.exports = WikiPolicy;
