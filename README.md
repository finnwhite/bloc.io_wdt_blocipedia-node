# bloc.io_wdt_blocipedia-node
Bloc > WDT > M04-S04 Blocipedia


## Blocipedia

An app that lets users create wikis and share them publicly or privately with other collaborators.

**On Heroku:** [finnwhite-blocipedia](https://finnwhite--bloc--blocipedia.herokuapp.com/)

---

### Wireframes

---
#### navbar, mobile:
```
+------------------------------------------------+
| Blocipedia                                 [=] |
+------------------------------------------------+
```
#### navbar, signed out:
```
+------------------------------------------------+
| Blocipedia             Wikis  Sign Up  Sign In |
+------------------------------------------------+
```
#### navbar, signed in:
```
+------------------------------------------------+
| Blocipedia            Wikis  Profile  Sign Out |
+------------------------------------------------+
```
---
#### Home:
```
+----------------------------------------------------------------------+
| Blocipedia                                   Wikis  Sign Up  Sign In |
+----------------------------------------------------------------------+
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |               BLOCIPEDIA: SOCIAL, MARKDOWN WIKIS               |  |
|  |                                                                |  |
|  |                Create and share Markdown Wikis                 |  |
|  |                           [Sign Up]                            |  |
|  +----------------------------------------------------------------+  |
|  +------------------------------+  +------------------------------+  |
|  |           Standard           |  |           Premium            |  |
|  |  - Unlimited public wikis    |  |  - All Standard features     |  |
|  |  - Unlimited collaborators   |  |  - Unlimited private wikis   |  |
|  |            (FREE)            |  |         ($4.99/mo.)          |  |
|  |        [Try Standard]        |  |        [Try Premium]         |  |
|  +------------------------------+  +------------------------------+  |
+----------------------------------------------------------------------+
```
---
#### Sign Up:
```
+----------------------------------------------------------------------+
| Blocipedia                                   Wikis  Sign Up  Sign In |
+----------------------------------------------------------------------+
|  SIGN UP                                                             |
|                                                                      |
|  Username: [____________________]                                    |
|  Email:    [____________________]                                    |
|  Password: [____________________]                                    |
|  Confirm:  [____________________]                                    |
|                                                                      |
|  Select a plan:                                                      |
|  +------------------------------+  +------------------------------+  |
|  | [x]   Standard (FREE)        |  | [ ]       Premium            |  |
|  |  - Unlimited public wikis    |  |  - All Standard features     |  |
|  |  - Unlimited collaborators   |  |  - Unlimited private wikis   |  |
|  |            (FREE)            |  |         ($4.99/mo.)          |  |
|  +------------------------------+  +------------------------------+  |
|                                                                      |
|  [Cancel] [Sign Up]                                                  |
+----------------------------------------------------------------------+
```
---
#### Sign In:
```
+------------------------------------------------+
| Blocipedia             Wikis  Sign Up  Sign In |
+------------------------------------------------+
|  SIGN IN                                       |
|                                                |
|  Username: [____________________]              |
|  Password: [____________________]              |
|                                                |
|  [Cancel] [Sign In]                            |
+------------------------------------------------+
```
---
#### Upgrade:
```
+----------------------------------------------------------------------+
| Blocipedia                                   Wikis  Sign Up  Sign In |
+----------------------------------------------------------------------+
|  UPGRADE TO PREMIUM                                                  |
|  +------------------------------+  +------------------------------+  |
|  |           Standard           |  |           Premium            |  |
|  |  - Unlimited public wikis    |  |  - All Standard features     |  |
|  |  - Unlimited collaborators   |  |  - Unlimited private wikis   |  |
|  |            (FREE)            |  |         ($4.99/mo.)          |  |
|  +------------------------------+  +------------------------------+  |
|                                                                      |
|  Payment Method  [Visa][MC][AMEX][Disc]                              |
|                                                                      |
|  Name On Card:    [____________________]                             |
|  Card Number:     [____________________]                             |
|  Expiration:      [ MM / YY ]                                        |
|  Security Code:   [____]                                             |
|  Zip/Postal Code: [__________]                                       |
|                                                                      |
|  [No Thanks] [Upgrade Plan]                                          |
+----------------------------------------------------------------------+
```
---
#### Wikis, Standard:
```
+----------------------------------------------------------------------+
| Blocipedia                                  Wikis  Profile  Sign Out |
+----------------------------------------------------------------------+
|  MY WIKIS                                      |  PUBLIC WIKIS       |
|  New: [Public Wiki]                            |                     |
|                                                |                     |
|  Programming          Editors | Edit | Delete  |  Wildfires          |
|  Preview text, first 50 characters...          |  Preview text...    |
|                                                |                     |
|  Sports               Editors | Edit | Delete  |  Earthquakes        |
|  Preview text, first 50 characters...          |  Preview text...    |
|                                                |                     |
|  Dogs                 Editors | Edit |         |                     |
|  Preview text, first 50 characters...          |                     |
|                                                |                     |
+----------------------------------------------------------------------+
```
#### Wikis, Premium:
```
|  MY WIKIS                                      |  PUBLIC WIKIS       |
|  New: [Public Wiki] [Private Wiki]             |                     |
|                                                |                     |
|  Work (Private)       Editors | Edit | Delete  |                     |
|  Preview text, first 50 characters...          |                     |
```
#### Wikis, guest:
```
|  PUBLIC WIKIS                                  |
|                                                |
|  Programming                                   |
|  Preview text, first 50 characters...          |
```
---
#### Create/Edit Wiki, Standard:
```
+----------------------------------------------------------------------+
| Blocipedia                                  Wikis  Profile  Sign Out |
+----------------------------------------------------------------------+
|  CREATE/EDIT WIKI                                                    |
|                                                                      |
|  Title: [____________________]  (Public)                             |
|                                                                      |
|                     +------------+----------+                        |
|  Editor:            | Plain Text | Markdown |     Preview:           |
|  +-------------------------------+          |                        |
|  | # Programming                            |     PROGRAMMING        |
|  |                                          |                        |
|  | Lorem ipsum...                           |     Lorem ipsum...     |
|  |                                          |                        |
|  +------------------------------------------+                        |
|                                                                      |
|  [Cancel] [Revert] [Save]                                            |
+----------------------------------------------------------------------+
```
#### Create/Edit Wiki, Premium:
```
|  CREATE/EDIT WIKI                                                    |
|                                                                      |
|  Title: [____________________]  [x] Public  [ ] Private              |
```
---
#### View Wiki, editor:
```
+------------------------------------------------+
| Blocipedia            Wikis  Profile  Sign Out |
+------------------------------------------------+
|  PROGRAMMING                                   |
|  [Share]                                       |
|                       Editors | Edit | Delete  |
|  +------------------------------------------+  |
|  |  PROGRAMMING                             |  |
|  |                                          |  |
|  |  Lorem ipsum...                          |  |
|  |                                          |  |
|  +------------------------------------------+  |
+------------------------------------------------+
```
#### View Wiki, viewer:
```
+------------------------------------------------+
| Blocipedia            Wikis  Profile  Sign Out |
+------------------------------------------------+
|  PROGRAMMING                                   |
|  [Share]                                       |
|                                                |
|  +------------------------------------------+  |
|  |  PROGRAMMING                             |  |
```
---
#### Editors:
```
+----------------------------------------------------------------------+
| Blocipedia                                  Wikis  Profile  Sign Out |
+----------------------------------------------------------------------+
|  EDITORS                                                             |
|                                                                      |
|  Wiki Title                                                          |
|  Preview text, first 50 characters...                                |
|                                                                      |
|  Username  Email          Accepted  View Invite Edit Delete          |
|  admin     a@example.com     Y      [x]   [x]   [x]   [x]    Remove  |
|  editor    e@example.com     Y      [x]   [x]   [x]   [ ]    Remove  |
|  viewer    v@example.com     N      [x]   [ ]   [ ]   [ ]    Remove  |
|                                                                      |
|  [Invite Editor]                                                     |
+----------------------------------------------------------------------+
```
---
#### Invite Editor:
```
+------------------------------------------------+
| Blocipedia            Wikis  Profile  Sign Out |
+------------------------------------------------+
|  INVITE EDITOR                                 |
|                                                |
|  Email: [____________________]                 |
|                                                |
|  Permissions:                                  |
|  View:   [x] can view wiki                     |
|  Invite: [x] can invite editors                |
|  Edit:   [x] can edit wiki                     |
|  Delete: [x] can delete wiki                   |
|                                                |
|  [Cancel] [Send Invite]                        |
+------------------------------------------------+
```
---
#### Profile, Standard:
```
+------------------------------------------------+
| Blocipedia            Wikis  Profile  Sign Out |
+------------------------------------------------+
|  USERNAME'S PROFILE (Standard)                 |
|  [Upgrade Plan]                                |
|                                                |
|  MY WIKIS                                      |
|  New: [Public Wiki]                            |
|                                                |
|  Programming          Editors | Edit | Delete  |
|  Preview text, first 50 characters...          |
|                                                |
+------------------------------------------------+
```
#### Profile, Premium:
```
|  USERNAME'S PROFILE (Premium)                  |
|                                                |
|  MY WIKIS                                      |
|  New: [Public Wiki] [Private Wiki]             |
|                                                |
|  Work (Private)       Editors | Edit | Delete  |
|  Preview text, first 50 characters...          |
```
