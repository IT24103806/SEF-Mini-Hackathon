import { query } from '../config/db.js';

// Helper to format DB row to API JSON schema (camelCase)
const formatSchedule = (row) => ({
  id: row.id,
  area: row.area,
  wasteType: row.waste_type,
  day: row.day,
  time: row.time,
  location: row.location,
  frequency: row.frequency,
  nextCollection: row.next_collection,
});

export const getSchedules = async (req, res, next) => {
  try {
    const { area, wasteType } = req.query;

    const conditions = [];
    const values = [];

    if (area && area !== 'All') {
      values.push(area);
      conditions.push(`LOWER(area) = LOWER($${values.length})`);
    }

    if (wasteType && wasteType !== 'All') {
      values.push(`%${wasteType.trim().toLowerCase()}%`);
      conditions.push(`LOWER(waste_type) LIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM schedules ${whereClause} ORDER BY id ASC;`;

    const result = await query(sql, values);
    const schedules = result.rows.map(formatSchedule);

    res.json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

export const getScheduleByArea = async (req, res, next) => {
  try {
    const { area } = req.params;
    const result = await query('SELECT * FROM schedules WHERE LOWER(area) = LOWER($1) ORDER BY id ASC;', [area]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No collection schedules found for area '${area}'.`,
      });
    }

    res.json({
      success: true,
      data: result.rows.map(formatSchedule),
    });
  } catch (err) {
    next(err);
  }
};
