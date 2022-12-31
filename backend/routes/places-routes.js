const express = require("express");
const { check } = require("express-validator")
const placesController = require("../controllers/places-controller");
const router = express.Router();
const fileUpload = require("../middlewares/file-upload");
const checkToken = require("../middlewares/check-token");

router.get("/:pid", placesController.getPlaceById);
router.get("/user/:uid", placesController.getPlacesByUserId);

router.use(checkToken);

router.post(
  "/", 
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(), 
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty()
  ],
  placesController.createPlace
);
router.patch(
  "/:pid", 
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placesController.updatePlace
);
router.delete("/:pid", placesController.deletePlace);

module.exports = router;