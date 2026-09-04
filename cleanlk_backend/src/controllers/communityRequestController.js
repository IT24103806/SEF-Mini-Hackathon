import { query } from '../config/db.js';

// Helper to format DB row to API JSON schema (camelCase)
const formatRequest = (row) => ({
  id: row.id,
  name: row.name,
  area: row.area,
  requestType: row.request_type,
  priority: row.priority,
  status: row.status,
  description: row.description,
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
  updatedAt: row.updated_at,
});

export const getAllCommunityRequests = async (req, res, next) => {
  try {
    const { area, status, priority, search } = req.query;

    const conditions = [];
    const values = [];

    if (area && area !== 'All') {
      values.push(area);
      conditions.push(`LOWER(area) = LOWER($${values.length})`);
    }

    if (status && status !== 'All') {
      values.push(status);
      conditions.push(`LOWER(status) = LOWER($${values.length})`);
    }

    if (priority && priority !== 'All') {
      values.push(priority);
      conditions.push(`LOWER(priority) = LOWER($${values.length})`);
    }

    if (search && search.trim()) {
      values.push(`%${search.trim().toLowerCase()}%`);
      const searchIdx = values.length;
      conditions.push(`(
        LOWER(area) LIKE $${searchIdx} OR
        LOWER(description) LIKE $${searchIdx} OR
        LOWER(name) LIKE $${searchIdx} OR
        LOWER(request_type) LIKE $${searchIdx}
      )`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM community_requests ${whereClause} ORDER BY created_at DESC;`;

    const result = await query(sql, values);
    const list = result.rows.map(formatRequest);

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const getCommunityRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM community_requests WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Community request with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      data: formatRequest(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const createCommunityRequest = async (req, res, next) => {
  try {
    const { name, area, requestType, priority, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Description must be at least 10 characters long.' });
    }

    const newId = `CR-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const result = await query(
      `INSERT INTO community_requests (id, name, area, request_type, priority, status, description, created_at)
       VALUES ($1, $2, $3, $4, $5, 'Pending', $6, NOW())
       RETURNING *;`,
      [
        newId,
        name.trim(),
        area || 'Colombo',
        requestType || 'New Waste Bin',
        priority || 'Medium',
        description.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Community request submitted successfully!',
      data: formatRequest(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const updateCommunityRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, area, requestType, priority, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Description must be at least 10 characters long.' });
    }

    const result = await query(
      `UPDATE community_requests
       SET name = $1, area = $2, request_type = $3, priority = $4, description = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *;`,
      [name.trim(), area, requestType, priority, description.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Community request with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: 'Community request updated successfully!',
      data: formatRequest(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const updateCommunityRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED = ['Pending', 'Under Review', 'Approved', 'Completed'];
    if (!status || !ALLOWED.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED.join(', ')}`,
      });
    }

    const result = await query(
      `UPDATE community_requests
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Community request with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: `Status updated to '${status}'.`,
      data: formatRequest(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCommunityRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM community_requests WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Community request with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: 'Community request deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
