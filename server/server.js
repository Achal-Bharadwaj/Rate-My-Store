require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./index");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || "rate_my_store_12345";

// Middleware to verify JWT and restrict routes
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  };
};

// User Signup
app.post("/api/v1/signup", async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    // Validate inputs
    if (!name || !email || !password || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: "Name must be 20-60 characters" });
    }
    if (address.length > 400) {
      return res.status(400).json({ error: "Address must be under 400 characters" });
    }
    if (password.length < 8 || password.length > 16 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ error: "Password must be 8-16 characters, include one uppercase and one special character" });
    }

    // Insert user (default role: user)
    const result = await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, 'user') RETURNING id, name, email, address, role",
      [name, email, password, address]
    );

    // Generate JWT
    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      status: "Success",
      data: { user: result.rows[0], token },
    });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// Login
app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("Query result:", result.rows);
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      console.log("Invalid credentials for user:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    console.log("User found:", user);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      status: "Success",
      data: { user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role }, token },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Password Update
app.put("/api/v1/users/password", authenticate, restrictTo("admin", "user", "owner"), async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const result = await db.query("SELECT password FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0 || result.rows[0].password !== oldPassword) {
      return res.status(401).json({ error: "Invalid old password" });
    }
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [newPassword, req.user.id]);
    res.status(200).json({ status: "Success", message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Stores
app.get("/api/v1/stores", authenticate, async (req, res) => {
  const { name, address } = req.query; // For search/filter
  try {
    let query = `
      SELECT 
        stores.*, 
        users.name as owner_name,
        ratings.rating as user_rating
      FROM stores 
      LEFT JOIN users ON stores.owner_id = users.id
      LEFT JOIN ratings ON stores.id = ratings.store_id AND ratings.user_id = $1
    `;
    let params = [req.user.id];
    let conditions = [];

    if (name) {
      conditions.push(`stores.name ILIKE $${params.length + 1}`);
      params.push(`%${name}%`);
    }
    if (address) {
      conditions.push(`stores.address ILIKE $${params.length + 1}`);
      params.push(`%${address}%`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY stores.name ASC`;

    const results = await db.query(query, params);
    res.status(200).json({
      status: "Success",
      results: results.rows.length,
      data: { stores: results.rows },
    });
  } catch (err) {
    console.error("Get stores error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a Specific Store
app.get("/api/v1/stores/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid store ID" });
  }
  try {
    const store = await db.query(
      `SELECT stores.*, users.name as owner_name FROM stores LEFT JOIN users ON stores.owner_id = users.id WHERE stores.id = $1`,
      [id]
    );
    const ratings = await db.query(
      `SELECT ratings.*, users.name as user_name FROM ratings JOIN users ON ratings.user_id = users.id WHERE store_id = $1`,
      [id]
    );

    if (store.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.status(200).json({
      status: "Success",
      data: {
        store: store.rows[0],
        ratings: ratings.rows,
      },
    });
  } catch (err) {
    console.error("Get store error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a Store (Admin or Owner)
app.post("/api/v1/stores", authenticate, restrictTo("admin", "owner"), async (req, res) => {
  const { name, email, address } = req.body;
  try {
    // Validate inputs
    if (!name || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: "Name must be 20-60 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (address.length > 400) {
      return res.status(400).json({ error: "Address must be under 400 characters" });
    }

    const owner_id = req.user.role === "admin" ? req.body.owner_id || req.user.id : req.user.id;
    const result = await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, owner_id]
    );

    res.status(201).json({
      status: "Success",
      data: { store: result.rows[0] },
    });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Store email already exists" });
    } else if (err.code === "23503") {
      res.status(400).json({ error: "Invalid owner ID" });
    } else {
      console.error("Add store error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// Update a Store (Admin or Owner)
app.put("/api/v1/stores/:id", authenticate, restrictTo("admin", "owner"), async (req, res) => {
  const { name, email, address } = req.body;
  const { id } = req.params;
  try {
    // Validate inputs
    if (!name || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: "Name must be 20-60 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (address.length > 400) {
      return res.status(400).json({ error: "Address must be under 400 characters" });
    }

    // Check ownership
    const store = await db.query("SELECT owner_id FROM stores WHERE id = $1", [id]);
    if (store.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    if (req.user.role !== "admin" && store.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this store" });
    }

    const result = await db.query(
      "UPDATE stores SET name = $1, email = $2, address = $3 WHERE id = $4 RETURNING *",
      [name, email, address, id]
    );

    res.status(200).json({
      status: "Success",
      data: { store: result.rows[0] },
    });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Store email already exists" });
    } else {
      console.error("Update store error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// Delete a Store (Admin or Owner)
app.delete("/api/v1/stores/:id", authenticate, restrictTo("admin", "owner"), async (req, res) => {
  const { id } = req.params;
  try {
    const store = await db.query("SELECT owner_id FROM stores WHERE id = $1", [id]);
    if (store.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    if (req.user.role !== "admin" && store.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this store" });
    }

    await db.query("DELETE FROM ratings WHERE store_id = $1", [id]);
    await db.query("DELETE FROM stores WHERE id = $1", [id]);

    res.status(204).json({ status: "Success" });
  } catch (err) {
    console.error("Delete store error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add or Update Rating (User)
app.post("/api/v1/stores/:id/ratings", authenticate, restrictTo("user"), async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;
  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if rating exists
    const existing = await db.query(
      "SELECT id FROM ratings WHERE store_id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing rating
      result = await db.query(
        "UPDATE ratings SET rating = $1, comment = $2 WHERE store_id = $3 AND user_id = $4 RETURNING *",
        [rating, comment || null, id, req.user.id]
      );
    } else {
      // Insert new rating
      result = await db.query(
        "INSERT INTO ratings (store_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
        [id, req.user.id, rating, comment || null]
      );
    }

    // Update store average rating
    await db.query(
      `UPDATE stores SET average_rating = (
        SELECT AVG(rating) FROM ratings WHERE store_id = $1
      ) WHERE id = $1`,
      [id]
    );

    res.status(existing.rows.length > 0 ? 200 : 201).json({
      status: "Success",
      data: { rating: result.rows[0] },
    });
  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get All Users
app.get("/api/v1/admin/users", authenticate, restrictTo("admin"), async (req, res) => {
  const { name, email, role } = req.query;
  try {
    let query = `SELECT id, name, email, address, role FROM users`;
    let params = [];
    let conditions = [];

    if (name) {
      conditions.push(`name ILIKE $${params.length + 1}`);
      params.push(`%${name}%`);
    }
    if (email) {
      conditions.push(`email ILIKE $${params.length + 1}`);
      params.push(`%${email}%`);
    }
    if (role) {
      conditions.push(`role = $${params.length + 1}`);
      params.push(role);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY name ASC`;

    const results = await db.query(query, params);
    res.status(200).json({
      status: "Success",
      results: results.rows.length,
      data: { users: results.rows },
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin Add User
app.post("/api/v1/admin/users", authenticate, restrictTo("admin"), async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    // Validate inputs
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: "Name must be 20-60 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (address.length > 400) {
      return res.status(400).json({ error: "Address must be under 400 characters" });
    }
    if (!["admin", "user", "owner"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const result = await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role",
      [name, email, password, address, role]
    );
    res.status(201).json({
      status: "Success",
      data: { user: result.rows[0] },
    });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Add user error:", err);
      res.status(400).json({ error: "Invalid data" });
    }
  }
});

// Admin: Get Dashboard Stats
app.get("/api/v1/admin/stats", authenticate, restrictTo("admin"), async (req, res) => {
  try {
    const usersCount = await db.query("SELECT COUNT(*) FROM users");
    const storesCount = await db.query("SELECT COUNT(*) FROM stores");
    const ratingsCount = await db.query("SELECT COUNT(*) FROM ratings");

    res.status(200).json({
      status: "Success",
      data: {
        total_users: parseInt(usersCount.rows[0].count),
        total_stores: parseInt(storesCount.rows[0].count),
        total_ratings: parseInt(ratingsCount.rows[0].count),
      },
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Owner: Get Store Ratings
app.get("/api/v1/owner/stores/ratings", authenticate, restrictTo("owner"), async (req, res) => {
  try {
    const ratings = await db.query(
      `SELECT ratings.*, stores.name as store_name, users.name as user_name
       FROM ratings
       JOIN stores ON ratings.store_id = stores.id
       JOIN users ON ratings.user_id = users.id
       WHERE stores.owner_id = $1
       ORDER BY ratings.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      status: "Success",
      results: ratings.rows.length,
      data: { ratings: ratings.rows },
    });
  } catch (err) {
    console.error("Get owner ratings error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});