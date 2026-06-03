import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import StatisticsCards from '../components/StatisticsCards';
import IncidentTable from '../components/IncidentTable';
import { incidentService, authService } from '../services/api';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'low',
    status: 'pending',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchIncidents();
  }, [navigate]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentService.getAll();
      setIncidents(data);
      setError('');
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      await incidentService.create(
        formData.title,
        formData.description,
        formData.severity,
        formData.status
      );
      setFormData({ title: '', description: '', severity: 'low', status: 'pending' });
      setShowForm(false);
      fetchIncidents();
    } catch (err) {
      setError('Failed to create incident');
    }
  };

  const handleDeleteIncident = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentService.delete(id);
        fetchIncidents();
      } catch (err) {
        setError('Failed to delete incident');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main className="container-main">
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <div className="dashboard-header">
          <h2 className="title-medium" style={{ marginBottom: 0 }}>Incident Dashboard</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-new"
          >
            {showForm ? '✕ Cancel' : '+ New Incident'}
          </button>
        </div>

        {showForm && (
          <div className="card-large">
            <h3 className="title-small">Create New Incident</h3>
            <form onSubmit={handleCreateIncident} style={{ marginTop: '24px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Incident title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="form-textarea"
                  placeholder="Detailed description"
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
                Create Incident
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#64748b' }}>Loading incidents...</p>
          </div>
        ) : (
          <>
            <StatisticsCards incidents={incidents} />
            <div>
              <h3 className="title-small" style={{ marginBottom: '16px' }}>All Incidents</h3>
              <IncidentTable incidents={incidents} onDelete={handleDeleteIncident} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
