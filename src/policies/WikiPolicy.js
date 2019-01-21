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
  _isCollaborator() {
    if ( this._isCreator() ) { return true; }
    if ( !this.record.collaboration ) { return false; }
    return Boolean( this.record.collaboration.find( ( collab ) => {
      return collab.userId == this.user.id;
    } ) );
  }

  _isPrivate() { return ( this.record && ( this.record.private == 1 ) ) }
  _isPublic() { return !this._isPrivate() }

  create() {
    return ( this._isPrivate() ? this.createPrivate() : this.createPublic() )
  }
  createPublic() { return this.standard(); }
  createPrivate() { return this.premium(); }

  read() {
    return ( this._isPublic() || this._isCollaborator() || this._isAdmin() )
  }

  update() {
    if ( this._isPublic() ) { return this._isMember(); }
    else { return ( this._isCollaborator() || this._isAdmin() ) }
  }
  makePublic() { return ( this._isOwner() || this._isAdmin() ) }
  makePrivate() {
    return ( ( this._isOwner() && this.createPrivate() ) || this._isAdmin() )
  }

  collaborate() {
    return ( ( this._isPrivate() && this._isOwner() ) || this._isAdmin() )
  }
  collaborators() { return this.collaborate(); }
  addCollaborator() { return this.collaborate(); }
  inviteCollaborator() { return this.addCollaborator(); }
  removeCollaborator() { return this.collaborate(); }

}

module.exports = WikiPolicy;
