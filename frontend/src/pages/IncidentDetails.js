import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { incidentService, authService, auditService } from '../services/api';

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

const ActionBadge = ({ action }) => {
  const actionColors = {
    created: '#dbeafe',
    updated: '#fef3c7',
    title_changed: '#fef3c7',
    description_changed: '#fef3c7',
    severity_changed: '#fee2e2',
    status_changed: '#fef3c7',
    deleted: '#fee2e2',
  };

  const actionLabels = {
    created: 'Created',
    updated: 'Updated',
    title_changed: 'Title Changed',
    description_changed: 'Description Changed',
    severity_changed: 'Severity Changed',
    status_changed: 'Status Changed',
    deleted: 'Deleted',
  };

  return (
    <span
      style={{
        backgroundColor: actionColors[action] || '#e2e8f0',
        color: action === 'deleted' ? '#991b1b' : action === 'severity_changed' ? '#991b1b' : '#92400e',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-block',
      }}
    >
      {actionLabels[action] || action}
    </span>
  );
};

export default function IncidentDetails() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchIncidentAndLogs();
  }, [id, navigate]);

  const fetchIncidentAndLogs = async () => {
    try {
      setLoading(true);
      const [incidentData, logsData] = await Promise.all([
        incidentService.getById(id),
        auditService.getIncidentLogs(id),
      ]);
      setIncident(incidentData);
      setAuditLogs(logsData);
      setFormData(incidentData);
      setError('');
    } catch (err) {
      setError('Failed to load incident details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await incidentService.update(
        id,
        formData.title,
        formData.description,
        formData.severity,
        formData.status
      );
      setIncident(formData);
      setIsEditing(false);
      setError('');
      fetchIncidentAndLogs();
    } catch (err) {
      setError('Failed to update incident');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentService.delete(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete incident');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Navigation />
        <main className="container-main">
          <p style={{ color: '#64748b' }}>Loading incident details...</p>
        </main>
      </div>
    );
  }

  if (!incident) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Navigation />
        <main className="container-main">
          <p style={{ color: '#64748b' }}>Incident not found</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main className="container-main">
        <button
          onClick={() => navigate('/dashboard')}
          className="back-link"
        >
          ← Back to Dashboard
        </button>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <div className="card-large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 className="title-large">{incident.title}</h1>
              <p style={{ color: '#64748b', marginTop: '8px' }}>ID: {incident.id}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary"
              >
                {isEditing ? '✕ Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-delete"
              >
                Delete
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ marginTop: '24px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div style={{ marginTop: '24px' }}>
              <div className="details-section">
                <h3 className="details-title">Description</h3>
                <p className="details-value">{incident.description}</p>
              </div>

              <div className="details-grid">
                <div className="details-section">
                  <h3 className="details-title">Severity</h3>
                  <div style={{ marginTop: '8px' }}>
                    <SeverityBadge severity={incident.severity} />
                  </div>
                </div>
                <div className="details-section">
                  <h3 className="details-title">Status</h3>
                  <div style={{ marginTop: '8px' }}>
                    <StatusBadge status={incident.status} />
                  </div>
                </div>
              </div>

              <div className="details-grid">
                <div className="details-section">
                  <h3 className="details-title">Created Date</h3>
                  <p className="details-value">{formatDate(incident.created_at)}</p>
                </div>
                <div className="details-section">
                  <h3 className="details-title">Last Updated</h3>
                  <p className="details-value">
                    {incident.updated_at ? formatDate(incident.updated_at) : 'Not updated'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-large">
          <h2 className="title-medium">Audit Log Timeline</h2>
          <div className="timeline">
            {auditLogs.length === 0 ? (
              <p style={{ color: '#64748b', marginTop: '16px' }}>No audit logs yet</p>
            ) : (
              auditLogs.map((log, index) => (
                <div key={log.id} className="timeline-item">
                  <div className={index === 0 ? 'timeline-line' : 'timeline-line timeline-line-gray'}></div>
                  <div className="timeline-content">
                    <div style={{ marginBottom: '8px' }}>
                      <ActionBadge action={log.action} />
                    </div>
                    <p style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                      {log.performed_by_name} ({log.performed_by_email})
                    </p>
                    {log.old_value && log.new_value && (
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                        <p><strong>Before:</strong> {log.old_value}</p>
                        <p><strong>After:</strong> {log.new_value}</p>
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
