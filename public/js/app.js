const apiBase = "/api/items";

const itemForm = document.getElementById("itemForm");
const itemIdInput = document.getElementById("itemId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const locationInput = document.getElementById("location");
const itemDateInput = document.getElementById("item_date");
const contactInfoInput = document.getElementById("contact_info");
const statusInput = document.getElementById("status");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const messageBox = document.getElementById("messageBox");
const lostItemsContainer = document.getElementById("lostItems");
const foundItemsContainer = document.getElementById("foundItems");
const itemDetails = document.getElementById("itemDetails");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function showMessage(message, type = "success") {
  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message";
}

function resetForm() {
  itemForm.reset();
  itemIdInput.value = "";
  statusInput.value = "Active";
  formTitle.textContent = "Submit Item Report";
  cancelEditBtn.classList.add("hidden");
  clearMessage();
}

function validateForm() {
  if (!titleInput.value.trim()) return "Title is required.";
  if (!descriptionInput.value.trim()) return "Description is required.";
  if (!categoryInput.value) return "Category is required.";
  if (!locationInput.value.trim()) return "Location is required.";
  if (!itemDateInput.value) return "Date is required.";
  if (!contactInfoInput.value.trim()) return "Contact information is required.";
  return null;
}

function getStatusBadgeClass(status) {
  const lower = status.toLowerCase();
  if (lower === "active") return "badge active";
  if (lower === "claimed") return "badge claimed";
  return "badge resolved";
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function renderItems(items, container) {
  if (!items.length) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="item-card">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="item-meta">
        <div><strong>Location:</strong> ${escapeHtml(item.location)}</div>
        <div><strong>Date:</strong> ${escapeHtml(item.item_date?.split("T")[0] || item.item_date)}</div>
        <div><strong>Category:</strong> ${escapeHtml(item.category)}</div>
        <div><strong>Status:</strong> <span class="${getStatusBadgeClass(item.status)}">${escapeHtml(item.status)}</span></div>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline" onclick="viewItem(${item.id})">View Details</button>
        <button class="btn btn-warning" onclick="editItem(${item.id})">Edit</button>
        <button class="btn btn-success" onclick="quickUpdateStatus(${item.id})">Update Status</button>
        <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

async function loadItems(category) {
  try {
    const data = await fetchJson(`${apiBase}?category=${encodeURIComponent(category)}`);
    if (category === "Lost") {
      renderItems(data.data, lostItemsContainer);
    } else {
      renderItems(data.data, foundItemsContainer);
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function loadAllLists() {
  await loadItems("Lost");
  await loadItems("Found");
}

async function viewItem(id) {
  try {
    const data = await fetchJson(`${apiBase}/${id}`);
    const item = data.data;

    itemDetails.innerHTML = `
      <h3>${escapeHtml(item.title)}</h3>
      <p><strong>Description:</strong> ${escapeHtml(item.description)}</p>
      <p><strong>Category:</strong> ${escapeHtml(item.category)}</p>
      <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>
      <p><strong>Date:</strong> ${escapeHtml(item.item_date?.split("T")[0] || item.item_date)}</p>
      <p><strong>Contact Information:</strong> ${escapeHtml(item.contact_info)}</p>
      <p><strong>Status:</strong> <span class="${getStatusBadgeClass(item.status)}">${escapeHtml(item.status)}</span></p>
    `;
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function editItem(id) {
  try {
    const data = await fetchJson(`${apiBase}/${id}`);
    const item = data.data;

    itemIdInput.value = item.id;
    titleInput.value = item.title;
    descriptionInput.value = item.description;
    categoryInput.value = item.category;
    locationInput.value = item.location;
    itemDateInput.value = item.item_date?.split("T")[0] || item.item_date;
    contactInfoInput.value = item.contact_info;
    statusInput.value = item.status;

    formTitle.textContent = "Edit Item Report";
    cancelEditBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function quickUpdateStatus(id) {
  const newStatus = prompt("Enter new status: Active, Claimed, or Resolved");
  if (!newStatus) return;

  try {
    await fetchJson(`${apiBase}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    });

    showMessage("Status updated successfully.");
    await loadAllLists();
    await viewItem(id);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function deleteItem(id) {
  const confirmed = confirm("Are you sure you want to delete this item report?");
  if (!confirmed) return;

  try {
    await fetchJson(`${apiBase}/${id}`, {
      method: "DELETE"
    });
    showMessage("Item deleted successfully.");
    itemDetails.innerHTML = `<p>Select <strong>View Details</strong> on any item to display full information here.</p>`;
    await loadAllLists();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

itemForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const validationError = validateForm();
  if (validationError) {
    showMessage(validationError, "error");
    return;
  }

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value,
    location: locationInput.value.trim(),
    item_date: itemDateInput.value,
    contact_info: contactInfoInput.value.trim(),
    status: statusInput.value
  };

  try {
    const itemId = itemIdInput.value.trim();

    if (itemId) {
      await fetchJson(`${apiBase}/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      showMessage("Item updated successfully.");
    } else {
      await fetchJson(apiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      showMessage("Item report created successfully.");
    }

    resetForm();
    await loadAllLists();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

cancelEditBtn.addEventListener("click", resetForm);

document.addEventListener("DOMContentLoaded", () => {
  loadAllLists();
});