const pool = require('../config/db');

const createAuditLog = async (incident_id, action, old_value, new_value, performed_by) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (incident_id, action, old_value, new_value, performed_by) VALUES ($1, $2, $3, $4, $5)',
      [incident_id, action, old_value, new_value, performed_by]
    );
  } catch (err) {
    console.error('Error creating audit log:', err);
  }
};

module.exports = { createAuditLog };
