class ApplicationPolicy {

  constructor( user, record ) {
    this.user = user;
    this.record = record;
  }

  _isSignedIn() { return Boolean( this.user ); }
  _isGuest() { return !this._isSignedIn(); }
  _isMember() { return this._isSignedIn(); }
  _isAdmin() { return ( this.user && ( this.user.role === "admin" ) ) }
  _isOwner() { return this._isCreator(); }
  _isCreator() { return (
    this.user && this.record && ( this.record.userId == this.user.id )
  ) }

  premium() { return (
    this._isAdmin() || ( this.user && ( this.user.role === "premium" ) )
  ) }
  standard() { return (
    this.premium() || ( this.user && ( this.user.role === "standard" ) )
  ) }

  create() { return this._isMember(); }
  new() { return this.create(); }
  add() { return this.create(); }

  read() { return true; }
  view() { return this.read(); }
  show() { return this.read(); }

  update() { return (
    this._isAdmin() || ( this.create() && this._isOwner() )
  ) }
  edit() { return this.update(); }

  delete() { return this.update(); }
  destroy() { return this.delete(); }

}

module.exports = ApplicationPolicy;
