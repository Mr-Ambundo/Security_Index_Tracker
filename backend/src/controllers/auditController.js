const pool = require('../config/db');

const getIncidentAuditLogs = async (req, res) => {
  const { incident_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        a.id,
        a.incident_id,
        a.action,
        a.old_value,
        a.new_value,
        a.performed_by,
        a.timestamp,
        u.name as performed_by_name,
        u.email as performed_by_email
      FROM audit_logs a
      JOIN users u ON a.performed_by = u.id
      WHERE a.incident_id = $1
      ORDER BY a.timestamp DESC`,
      [incident_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

module.exports = { getIncidentAuditLogs };
