import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'stat-card stat-card-blue',
    green: 'stat-card stat-card-green',
    yellow: 'stat-card stat-card-yellow',
    red: 'stat-card stat-card-red',
  };

  return (
    <div className={colorClasses[color]}>
      <div className="stat-card-content">
        <div className="stat-card-text">
          <p>{title}</p>
          <p>{value}</p>
        </div>
        <div className="stat-card-icon">{icon}</div>
      </div>
    </div>
  );
};

export default function StatisticsCards({ incidents }) {
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status === 'pending').length;
  const investigating = incidents.filter(i => i.status === 'investigating').length;
  const resolved = incidents.filter(i => i.status === 'completed').length;

  return (
    <div className="stats-grid">
      <StatCard title="Total Incidents" value={totalIncidents} icon="📊" color="blue" />
      <StatCard title="Open Incidents" value={openIncidents} icon="🔴" color="red" />
      <StatCard title="Investigating" value={investigating} icon="🔍" color="yellow" />
      <StatCard title="Resolved" value={resolved} icon="✓" color="green" />
    </div>
  );
}
