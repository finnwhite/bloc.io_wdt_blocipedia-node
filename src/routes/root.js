const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/root.js" );
const validation = require( "../util/validation.js" );
const auth = require( "../util/authentication.js" );

router.get( "/",
  controller.index
);

router.get( "/wikis",
  controller.index
);
router.get( "/profile",
  controller.index
);
router.get( "/sign-up",
  controller.index
);
router.get( "/sign-in",
  controller.index
);
router.get( "/sign-out",
  auth.signOut
);

router.all( "/validate",
  validation.validate, validation.result,
  controller.index
);
router.get( "/auth/sign-in",
  auth.signIn
);
router.get( "/auth/ensure",
  auth.ensureUser
);

module.exports = router;
