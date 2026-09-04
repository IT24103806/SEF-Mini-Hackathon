import pool from '../config/db.js';

// In-memory fallback array (DB connection එකක් නොමැති විට වැඩ කිරීමට)
let memoryRequests = [
  { id: 1, name: "Kasun Perera", area: "Kegalle", request_type: "New Waste Bin", priority: "High", status: "Pending", description: "Requesting a public bin near the central bus stand.", created_at: "2026-09-01" },
  { id: 2, name: "Nimali Silva", area: "Colombo", request_type: "Extra Collection", priority: "Medium", status: "Approved", description: "Need an additional recycling pickup on weekend.", created_at: "2026-09-02" }
];

export const getCommunityRequests = async (req, res) => {
  try {
    const query = 'SELECT * FROM community_requests ORDER BY id DESC';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.json(memoryRequests);
  }
};

export const createCommunityRequest = async (req, res) => {
  const { name, area, requestType, priority, description } = req.body;
  const createdAt = new Date().toISOString().split('T')[0];
  const status = "Pending";

  try {
    const query = `INSERT INTO community_requests (name, area, request_type, priority, status, description, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [name, area, requestType, priority, status, description, createdAt];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    const newEntry = { id: Date.now(), name, area, request_type: requestType, priority, status, description, created_at: createdAt };
    memoryRequests.unshift(newEntry);
    res.status(201).json(newEntry);
  }
};

export const updateCommunityRequest = async (req, res) => {
  const { id } = req.params;
  const { name, area, requestType, priority, status, description } = req.body;

  try {
    const query = `UPDATE community_requests SET name=$1, area=$2, request_type=$3, priority=$4, status=$5, description=$6 
                   WHERE id=$7 RETURNING *`;
    const values = [name, area, requestType, priority, status, description, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    memoryRequests = memoryRequests.map(item => item.id == id ? { ...item, name, area, request_type: requestType, priority, status, description } : item);
    res.json({ id, name, area, request_type: requestType, priority, status, description });
  }
};

export const deleteCommunityRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM community_requests WHERE id = $1', [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    memoryRequests = memoryRequests.filter(item => item.id != id);
    res.json({ message: "Deleted successfully from memory" });
  }
};