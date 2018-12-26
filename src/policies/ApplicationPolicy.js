class ApplicationPolicy {

  constructor( user, record ) {
    this.user = user;
    this.record = record;
  }

  _isSignedIn() { return Boolean( this.user ); }
  _isMember() { return this._isSignedIn(); }
  _isGuest() { return !this._isSignedIn(); }

  _hasRole( role ) { return ( this.user && ( this.user.role === role ) ) }

  _isAdmin() { return this._hasRole( "admin" ); }
  _isOwner() { return this._isCreator(); }
  _isCreator() {
    return (
      this.user && this.record && ( this.record.userId == this.user.id )
    )
  }

  standard() { return ( this._hasRole( "standard" ) || this.premium() ) }
  premium() { return ( this._hasRole( "premium" ) || this._isAdmin() ) }

  create() { return this._isMember(); }
  new() { return this.create(); }
  add() { return this.create(); }

  read() { return true; }
  view() { return this.read(); }
  show() { return this.read(); }

  update() { return ( this._isOwner() || this._isAdmin() ) }
  edit() { return this.update(); }

  delete() { return ( this._isOwner() || this._isAdmin() ) }
  destroy() { return this.delete(); }

}

module.exports = ApplicationPolicy;
