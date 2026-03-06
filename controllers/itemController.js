const { validationResult } = require("express-validator");
const itemModel = require("../models/itemModel");
const { sanitizeText } = require("../utils/sanitize");

function hasValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
    return true;
  }
  return false;
}

function sanitizeItemInput(body) {
  return {
    title: sanitizeText(body.title),
    description: sanitizeText(body.description),
    category: sanitizeText(body.category),
    location: sanitizeText(body.location),
    item_date: body.item_date,
    contact_info: sanitizeText(body.contact_info),
    status: sanitizeText(body.status || "Active")
  };
}

async function getAllItems(req, res, next) {
  try {
    const { category } = req.query;

    let items;
    if (category && (category === "Lost" || category === "Found")) {
      items = await itemModel.getItemsByCategory(category);
    } else {
      items = await itemModel.getAllItems();
    }

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
}

async function getItemById(req, res, next) {
  try {
    if (hasValidationErrors(req, res)) return;

    const item = await itemModel.getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}

async function createItem(req, res, next) {
  try {
    if (hasValidationErrors(req, res)) return;

    const itemData = sanitizeItemInput(req.body);
    const newId = await itemModel.createItem(itemData);
    const newItem = await itemModel.getItemById(newId);

    res.status(201).json({
      success: true,
      message: "Item report created successfully",
      data: newItem
    });
  } catch (error) {
    next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    if (hasValidationErrors(req, res)) return;

    const existingItem = await itemModel.getItemById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    const itemData = sanitizeItemInput(req.body);
    await itemModel.updateItem(req.params.id, itemData);
    const updatedItem = await itemModel.getItemById(req.params.id);

    res.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
}

async function updateItemStatus(req, res, next) {
  try {
    if (hasValidationErrors(req, res)) return;

    const status = sanitizeText(req.body.status);

    const existingItem = await itemModel.getItemById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    await itemModel.updateItemStatus(req.params.id, status);
    const updatedItem = await itemModel.getItemById(req.params.id);

    res.json({
      success: true,
      message: "Status updated successfully",
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
}

async function deleteItem(req, res, next) {
  try {
    if (hasValidationErrors(req, res)) return;

    const existingItem = await itemModel.getItemById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    await itemModel.deleteItem(req.params.id);

    res.json({
      success: true,
      message: "Item deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem
};
