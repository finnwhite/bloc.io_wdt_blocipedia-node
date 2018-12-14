const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/root.js" );
const validation = require( "../util/validation.js" );
const auth = require( "../util/authentication.js" );

router.get( "/",
  controller.index
);

module.exports = router;
