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
  controller.signOut
);

router.get( `${ base }/account`,
  auth.ensureUser,
  controller.account
);

router.post( `${ base }/upgrade-plan`,
  auth.ensureUser,
  validation.updatePlan, validation.result,
  controller.upgradePlan
);
router.post( `${ base }/downgrade-plan`,
  auth.ensureUser,
  validation.updatePlan, validation.result,
  controller.downgradePlan
);

module.exports = router;
