import React from 'react';
import { Link } from 'react-router-dom';

const SeverityBadge = ({ severity }) => {
  const classes = {
    low: 'badge badge-severity-low',
    high: 'badge badge-severity-high',
    critical: 'badge badge-severity-critical',
  };

  return (
    <span className={classes[severity] || 'badge'}>
      {severity?.toUpperCase()}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const classes = {
    pending: 'badge badge-status-pending',
    completed: 'badge badge-status-completed',
    investigating: 'badge badge-status-investigating',
  };

  return (
    <span className={classes[status] || 'badge'}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default function IncidentTable({ incidents, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td colSpan="5" className="table-empty">
                No incidents found. Create one to get started.
              </td>
            </tr>
          ) : (
            incidents.map((incident) => (
              <tr key={incident.id}>
                <td style={{ fontWeight: 500 }}>{incident.title}</td>
                <td>
                  <SeverityBadge severity={incident.severity} />
                </td>
                <td>
                  <StatusBadge status={incident.status} />
                </td>
                <td>{formatDate(incident.created_at)}</td>
                <td>
                  <div className="table-actions">
                    <Link
                      to={`/incident/${incident.id}`}
                      className="table-action-link"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => onDelete(incident.id)}
                      className="table-action-delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
