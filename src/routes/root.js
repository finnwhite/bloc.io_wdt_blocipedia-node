const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/root.js" );
const validation = require( "../util/validation.js" );
const auth = require( "../util/authentication.js" );

router.get( "/",
  controller.index
);
router.all( "/validate",
  validation.validate, validation.result,
  controller.index
);
router.get( "/auth/ensure",
  auth.ensureUser
);
router.get( "/auth/sign-in",
  auth.signIn
);
router.get( "/sign-out",
  auth.signOut
);
router.get( "/sign-up",
  controller.index
);
router.get( "/sign-in",
  controller.index
);

module.exports = router;
