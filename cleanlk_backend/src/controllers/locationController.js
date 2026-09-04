import { query } from '../config/db.js';

// Helper to format DB row to API JSON schema
const formatLocation = (row) => ({
  id: row.id,
  name: row.name,
  area: row.area,
  category: row.category,
  address: row.address,
  contact: row.contact,
  openHours: row.open_hours,
  acceptedWaste: row.accepted_waste
    ? row.accepted_waste.split(',').map((w) => w.trim())
    : [],
  coordinates: row.coordinates,
  notes: row.notes,
  createdAt: row.created_at,
});

export const getAllLocations = async (req, res, next) => {
  try {
    const { area, category, search } = req.query;

    const conditions = [];
    const values = [];

    if (area && area !== 'All') {
      values.push(area);
      conditions.push(`LOWER(area) = LOWER($${values.length})`);
    }

    if (category && category !== 'All') {
      values.push(category);
      conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (search && search.trim()) {
      values.push(`%${search.trim().toLowerCase()}%`);
      const searchIdx = values.length;
      conditions.push(`(
        LOWER(name) LIKE $${searchIdx} OR
        LOWER(area) LIKE $${searchIdx} OR
        LOWER(category) LIKE $${searchIdx} OR
        LOWER(address) LIKE $${searchIdx} OR
        LOWER(accepted_waste) LIKE $${searchIdx}
      )`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM locations ${whereClause} ORDER BY id ASC;`;

    const result = await query(sql, values);
    const locations = result.rows.map(formatLocation);

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (err) {
    next(err);
  }
};

export const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM locations WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Location with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      data: formatLocation(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const createLocation = async (req, res, next) => {
  try {
    const { name, area, category, address, contact, openHours, acceptedWaste, coordinates, notes } =
      req.body;

    if (!name || !area || !category || !address || !openHours) {
      return res.status(400).json({
        success: false,
        message: 'Name, area, category, address, and operational hours are required.',
      });
    }

    const newId = `LOC-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;
    const wasteStr = Array.isArray(acceptedWaste) ? acceptedWaste.join(', ') : acceptedWaste || '';

    const result = await query(
      `INSERT INTO locations (id, name, area, category, address, contact, open_hours, accepted_waste, coordinates, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *;`,
      [
        newId,
        name.trim(),
        area.trim(),
        category.trim(),
        address.trim(),
        contact ? contact.trim() : '',
        openHours.trim(),
        wasteStr,
        coordinates ? coordinates.trim() : '',
        notes ? notes.trim() : '',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Waste disposal location added successfully!',
      data: formatLocation(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, area, category, address, contact, openHours, acceptedWaste, coordinates, notes } =
      req.body;

    const wasteStr = Array.isArray(acceptedWaste) ? acceptedWaste.join(', ') : acceptedWaste || '';

    const result = await query(
      `UPDATE locations
       SET name = $1, area = $2, category = $3, address = $4, contact = $5, open_hours = $6, accepted_waste = $7, coordinates = $8, notes = $9
       WHERE id = $10
       RETURNING *;`,
      [
        name.trim(),
        area.trim(),
        category.trim(),
        address.trim(),
        contact ? contact.trim() : '',
        openHours.trim(),
        wasteStr,
        coordinates ? coordinates.trim() : '',
        notes ? notes.trim() : '',
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Location with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: 'Waste disposal location updated successfully!',
      data: formatLocation(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM locations WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Location with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: 'Waste disposal location deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
