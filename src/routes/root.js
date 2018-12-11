const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/root.js" );
const validation = require( "../middleware/validation.js" );

router.get( "/",
  controller.index
);
router.post( "/validation",
  validation.checks, validation.result,
  controller.index
);

module.exports = router;
