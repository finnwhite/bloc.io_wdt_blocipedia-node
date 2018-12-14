const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/users.js" );
const validation = require( "../util/validation.js" );
const auth = require( "../util/authentication.js" );

const base = "/users";

router.get( `${ base }/sign-up`,
  controller.signUp
);
router.post( `${ base }/create`,
  validation.createUser, validation.result,
  controller.create
);

router.get( `${ base }/sign-in`,
  controller.signUp
);
router.post( `${ base }/sign-in`,
  controller.signUp
);

router.get( `${ base }/sign-out`,
  auth.signOut
);

module.exports = router;
