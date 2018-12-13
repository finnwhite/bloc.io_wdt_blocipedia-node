class ApplicationPolicy {

  constructor( user, record ) {
    this.user = user;
    this.record = record;
  }

  _isSignedIn() { return Boolean( this.user ); }
  _isGuest() { return !this._isSignedIn(); }
  _isMember() { return this._isSignedIn(); }
  _isAdmin() { return ( this.user && ( this.user.role === "admin" ) ) }
  _isOwner() { return (
    this.user && this.record && ( this.record.userId == this.user.id )
  ) }

  create() { return this._isSignedIn(); }
  new() { return this.create(); }
  add() { return this.create(); }

  read() { return true; }
  view() { return this.read(); }
  show() { return this.read(); }

  update() { return (
    this._isAdmin() || ( this.create() && this.record && this._isOwner() )
  ) }
  edit() { return this.update(); }

  delete() { return this.update(); }
  destroy() { return this.delete(); }

}

module.exports = ApplicationPolicy;
