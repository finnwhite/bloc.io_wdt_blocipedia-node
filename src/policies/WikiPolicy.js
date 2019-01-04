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

  _isPrivate() { return ( this.record && ( this.record.private == 1 ) ) }
  _isPublic() { return !this._isPrivate() }

  create() {
    if ( this._isPrivate() ) { return this.createPrivate(); }
    else { return this.createPublic(); }
  }
  createPublic() { return this.standard(); }
  createPrivate() { return this.premium(); }

  read() {
    return (
      this._isPublic() || this._isCollaborator() || this._isAdmin()
    )
  }

  update() {
    if ( this._isPublic() ) { return this._isMember(); }
    else { return ( this._isCollaborator() || this._isAdmin() ) }
  }
  makePublic() { return ( this._isOwner() || this._isAdmin() ) }
  makePrivate() {
    return (
      ( this._isOwner() && this.createPrivate() ) || this._isAdmin()
    )
  }

}

module.exports = WikiPolicy;
