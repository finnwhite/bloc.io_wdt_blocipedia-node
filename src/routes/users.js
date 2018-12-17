const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/users.js" );
const validation = require( "../util/validation.js" );
const auth = require( "../util/authentication.js" );

const base = "/users";

router.get( `${ base }/sign-up`,
  controller.renderSignUp
);
router.post( `${ base }/create`,
  validation.createUser, validation.result,
  controller.create
);

router.get( `${ base }/sign-in`,
  controller.renderSignIn
);
router.post( `${ base }/sign-in`,
  validation.signIn, validation.result,
  controller.signIn
);

router.get( `${ base }/sign-out`,
  auth.ensureUser,
  controller.signOut
);

module.exports = router;
