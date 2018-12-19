const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/wikis.js" );
const validation = require( "../util/validation.js" );
const auth = require( "../util/authentication.js" );

const base = "/wikis";

router.get( base,
  controller.index
);

router.get( `${ base }/new`,
  auth.ensureUser,
  controller.new
);
router.post( `${ base }/create`,
  auth.ensureUser,
  validation.createWiki, validation.result,
  controller.create
);

router.get( `${ base }/:id`,
  controller.view
);

router.get( `${ base }/:id/edit`,
  auth.ensureUser,
  controller.edit
);
router.post( `${ base }/:id/update`,
  auth.ensureUser,
  validation.createWiki, validation.result,
  controller.update
);

router.get( `${ base }/:id/delete`,
  auth.ensureUser,
  controller.delete
);

module.exports = router;
