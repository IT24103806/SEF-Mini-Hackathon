import { query } from '../config/db.js';

// Helper to format DB row to API JSON schema (camelCase)
const formatSchedule = (row) => ({
  id: row.id,
  area: row.area,
  wasteType: row.waste_type,
  collectionDay: row.day,
  collectionTime: row.time,
  location: row.location,
  frequency: row.frequency,
  nextCollection: row.next_collection,
  notes: row.notes || '',
});

export const getSchedules = async (req, res, next) => {
  try {
    const { area, wasteType, day, search } = req.query;

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

    if (day && day !== 'All') {
      values.push(day);
      conditions.push(`LOWER(day) = LOWER($${values.length})`);
    }

    if (search && search.trim()) {
      values.push(`%${search.trim().toLowerCase()}%`);
      const searchIdx = values.length;
      conditions.push(`(
        LOWER(area) LIKE $${searchIdx} OR
        LOWER(waste_type) LIKE $${searchIdx} OR
        LOWER(day) LIKE $${searchIdx}
      )`);
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

export const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM schedules WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Schedule with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      data: formatSchedule(result.rows[0]),
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

export const createSchedule = async (req, res, next) => {
  try {
    const { area, wasteType, collectionDay, collectionTime, notes } = req.body;

    if (!area || !wasteType || !collectionDay || !collectionTime) {
      return res.status(400).json({
        success: false,
        message: 'Area, waste type, collection day, and collection time are required.',
      });
    }

    const newId = `SCH-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const result = await query(
      `INSERT INTO schedules (id, area, waste_type, day, time, location, frequency, next_collection, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *;`,
      [
        newId,
        area.trim(),
        wasteType.trim(),
        collectionDay.trim(),
        collectionTime.trim(),
        `${area.trim()} Municipal Zone`,
        'Weekly',
        'Next ' + collectionDay.trim(),
        notes ? notes.trim() : '',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Collection schedule created successfully!',
      data: formatSchedule(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { area, wasteType, collectionDay, collectionTime, notes } = req.body;

    const result = await query(
      `UPDATE schedules
       SET area = $1, waste_type = $2, day = $3, time = $4, notes = $5
       WHERE id = $6
       RETURNING *;`,
      [area.trim(), wasteType.trim(), collectionDay.trim(), collectionTime.trim(), notes ? notes.trim() : '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Schedule with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: 'Collection schedule updated successfully!',
      data: formatSchedule(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM schedules WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Schedule with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: 'Collection schedule deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
