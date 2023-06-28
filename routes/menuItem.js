const express = require("express");
const MenuItem = require("../models/menuItem");

const router = express.Router();

// Add a new menu item
router.post("/add/menu", async (req, res) => {
  try {
    const { menu } = req.body;

    // Check if a menu item with the same name already exists
    const existingMenuItem = await MenuItem.findOne({ menu });

    if (existingMenuItem) {
      return res
        .status(400)
        .json({ error: "Menu item with the same name already exists" });
    }

    // If a menu item with the same name doesn't exist, create a new menu item
    const menuItem = new MenuItem({ menu });
    const savedMenuItem = await menuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add sub menu
router.post("/add/submenu", async (req, res) => {
  try {
    const { menuId, subMenus } = req.body;

    // Find the menu item by id
    const menuItem = await MenuItem.findById(menuId);

    if (!menuItem) {
      return res.status(400).json({ error: "Menu item does not exist" });
    }

    // Push the new submenus to the subMenus array of the menu item
    menuItem.subMenus.push(...subMenus);
    const updatedMenuItem = await menuItem.save();
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a menu item
router.patch("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { menu } = req.body;

    // Find the menu item by id
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { menu },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a sub menu item by ID
router.patch("/submenu/:subMenuId", async (req, res) => {
  try {
    const { subMenuId } = req.params;
    const newData = req.body;

    // Find the menu item that contains the sub-menu with subMenuId
    const menuItem = await MenuItem.findOne({ "subMenus._id": subMenuId });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Find the sub-menu item by subMenuId and update its data
    const subMenuIndex = menuItem.subMenus.findIndex(
      (obj) => obj._id == subMenuId
    );

    if (subMenuIndex === -1) {
      return res.status(404).json({ error: "Sub-menu item not found" });
    }

    menuItem.subMenus[subMenuIndex] = {
      ...menuItem.subMenus[subMenuIndex],
      ...newData,
    };

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a menu item
router.delete("/menus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenuItem = await MenuItem.findByIdAndRemove(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(deletedMenuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a sub menu item by ID
router.delete("/submenu/:subMenuId", async (req, res) => {
  try {
    const { subMenuId } = req.params;

    // Find the menu item that contains the sub-menu with subMenuId
    const menuItem = await MenuItem.findOne({ "subMenus._id": subMenuId });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Find the sub-menu item by subMenuId and remove it from the subMenus array
    menuItem.subMenus = menuItem.subMenus.filter((obj) => obj._id != subMenuId);

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all menu items
router.get("/menus", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
