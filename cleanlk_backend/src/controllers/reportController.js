import { query } from '../config/db.js';

// Helper to format DB row to API JSON schema (camelCase)
const formatReport = (row) => ({
  id: row.id,
  fullName: row.full_name,
  area: row.area,
  issueType: row.issue_type,
  description: row.description,
  severity: row.severity,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getAllReports = async (req, res, next) => {
  try {
    const { area, status, severity, search } = req.query;

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

    if (severity && severity !== 'All') {
      values.push(severity);
      conditions.push(`LOWER(severity) = LOWER($${values.length})`);
    }

    if (search && search.trim()) {
      values.push(`%${search.trim().toLowerCase()}%`);
      const searchIdx = values.length;
      conditions.push(`(
        LOWER(area) LIKE $${searchIdx} OR
        LOWER(description) LIKE $${searchIdx} OR
        LOWER(full_name) LIKE $${searchIdx} OR
        LOWER(issue_type) LIKE $${searchIdx}
      )`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM reports ${whereClause} ORDER BY created_at DESC;`;

    const result = await query(sql, values);
    const reports = result.rows.map(formatReport);

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM reports WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Report with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      data: formatReport(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { fullName, area, issueType, description, severity } = req.body;
    const newId = `REP-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const result = await query(
      `INSERT INTO reports (id, full_name, area, issue_type, description, severity, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'Reported', NOW())
       RETURNING *;`,
      [newId, fullName.trim(), area, issueType, description.trim(), severity]
    );

    const createdReport = formatReport(result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully!',
      data: createdReport,
    });
  } catch (err) {
    next(err);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ['Reported', 'In Progress', 'Resolved'];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const result = await query(
      `UPDATE reports
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Report with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: `Report status updated to '${status}'.`,
      data: formatReport(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const getReportStats = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'Resolved') as resolved,
        COUNT(*) FILTER (WHERE status = 'Reported') as reported
      FROM reports;
    `);

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        total: parseInt(row.total, 10),
        inProgress: parseInt(row.in_progress, 10),
        resolved: parseInt(row.resolved, 10),
        reported: parseInt(row.reported, 10),
      },
    });
  } catch (err) {
    next(err);
  }
};
