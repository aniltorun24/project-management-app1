import React from 'react';
import './Statistics.css';

const Statistics = ({ tasks }) => {
  // İstatistikleri hesapla
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  // Tamamlanma yüzdesi
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Yüksek öncelik görev sayısı
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  // Geçmiş deadline'ı olan görevler
  const overdueTasks = tasks.filter(task => {
    if (!task.deadline || task.status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  }).length;

  return (
    <div className="statistics-container">
      <div className="statistics-grid">
        {/* Toplam Görev */}
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{totalTasks}</h3>
            <p>Toplam Görev</p>
          </div>
        </div>

        {/* Tamamlanan Görevler */}
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{completedTasks}</h3>
            <p>Tamamlanan</p>
          </div>
        </div>

        {/* Devam Eden Görevler */}
        <div className="stat-card stat-progress">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{inProgressTasks}</h3>
            <p>Devam Ediyor</p>
          </div>
        </div>

        {/* Yapılacak Görevler */}
        <div className="stat-card stat-todo">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{todoTasks}</h3>
            <p>Yapılacak</p>
          </div>
        </div>

        {/* Yüksek Öncelik */}
        <div className="stat-card stat-high-priority">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>{highPriorityTasks}</h3>
            <p>Yüksek Öncelik</p>
          </div>
        </div>

        {/* Geçmiş Deadline */}
        <div className="stat-card stat-overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{overdueTasks}</h3>
            <p>Geçmiş Deadline</p>
          </div>
        </div>
      </div>

      {/* Tamamlanma Çubuğu */}
      <div className="completion-section">
        <div className="completion-header">
          <h3>Proje İlerlemesi</h3>
          <span className="completion-percentage">{completionPercentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="progress-text">
          {completedTasks} / {totalTasks} görev tamamlandı
        </p>
      </div>
    </div>
  );
};

export default Statistics;