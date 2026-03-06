const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem
} = require("../controllers/itemController");

const router = express.Router();

const itemValidationRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 5, max: 1000 }).withMessage("Description must be between 5 and 1000 characters"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(["Lost", "Found"]).withMessage("Category must be Lost or Found"),

  body("location")
    .trim()
    .notEmpty().withMessage("Location is required")
    .isLength({ min: 2, max: 100 }).withMessage("Location must be between 2 and 100 characters"),

  body("item_date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be valid"),

  body("contact_info")
    .trim()
    .notEmpty().withMessage("Contact information is required")
    .isLength({ min: 5, max: 100 }).withMessage("Contact information must be between 5 and 100 characters"),

  body("status")
    .optional()
    .isIn(["Active", "Claimed", "Resolved"]).withMessage("Invalid status")
];

router.get("/", getAllItems);

router.get(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid item ID")],
  getItemById
);

router.post("/", itemValidationRules, createItem);

router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid item ID"),
    ...itemValidationRules
  ],
  updateItem
);

router.patch(
  "/:id/status",
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid item ID"),
    body("status")
      .notEmpty().withMessage("Status is required")
      .isIn(["Active", "Claimed", "Resolved"]).withMessage("Invalid status")
  ],
  updateItemStatus
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid item ID")],
  deleteItem
);

module.exports = router;
