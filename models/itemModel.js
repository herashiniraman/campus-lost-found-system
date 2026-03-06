const pool = require("../config/db");

async function getAllItems() {
  const [rows] = await pool.execute(
    "SELECT * FROM items ORDER BY created_at DESC"
  );
  return rows;
}

async function getItemsByCategory(category) {
  const [rows] = await pool.execute(
    "SELECT * FROM items WHERE category = ? ORDER BY created_at DESC",
    [category]
  );
  return rows;
}

async function getItemById(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM items WHERE id = ?",
    [id]
  );
  return rows[0];
}

async function createItem(item) {
  const { title, description, category, location, item_date, contact_info, status } = item;

  const [result] = await pool.execute(
    `INSERT INTO items 
      (title, description, category, location, item_date, contact_info, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, category, location, item_date, contact_info, status]
  );

  return result.insertId;
}

async function updateItem(id, item) {
  const { title, description, category, location, item_date, contact_info, status } = item;

  const [result] = await pool.execute(
    `UPDATE items
     SET title = ?, description = ?, category = ?, location = ?, item_date = ?, contact_info = ?, status = ?
     WHERE id = ?`,
    [title, description, category, location, item_date, contact_info, status, id]
  );

  return result.affectedRows;
}

async function updateItemStatus(id, status) {
  const [result] = await pool.execute(
    "UPDATE items SET status = ? WHERE id = ?",
    [status, id]
  );
  return result.affectedRows;
}

async function deleteItem(id) {
  const [result] = await pool.execute(
    "DELETE FROM items WHERE id = ?",
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllItems,
  getItemsByCategory,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem
};
