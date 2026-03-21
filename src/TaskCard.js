import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ 
  task, 
  onDelete, 
  onStatusChange,
  onEditTask,
  getCategoryColor, 
  getCategoryName,
  getMemberName,
  getMemberColor,
  categories,
  teamMembers
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    deadline: task.deadline,
    assignee: task.assignee
  });

  const statuses = [
    { value: 'todo', label: 'Yapılacak' },
    { value: 'inprogress', label: 'Devam Ediyor' },
    { value: 'done', label: 'Tamamlandı' }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd43b';
      case 'low': return '#51cf66';
      default: return '#ddd';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return '';
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysRemaining: diffDays,
      isOverdue: diffDays < 0,
      isToday: diffDays === 0,
      isSoon: diffDays > 0 && diffDays <= 3
    };
  };

  const deadlineStatus = getDeadlineStatus(task.deadline);

  const getDeadlineColor = () => {
    if (!deadlineStatus) return 'inherit';
    if (deadlineStatus.isOverdue) return '#ff6b6b';
    if (deadlineStatus.isToday) return '#ff9800';
    if (deadlineStatus.isSoon) return '#ffc107';
    return '#4CAF50';
  };

  const getDeadlineText = () => {
    if (!deadlineStatus) return '';
    if (deadlineStatus.isOverdue) return `⚠️ ${Math.abs(deadlineStatus.daysRemaining)} gün geçti`;
    if (deadlineStatus.isToday) return '📌 Bugün';
    if (deadlineStatus.isSoon) return `📅 ${deadlineStatus.daysRemaining} gün kaldı`;
    return `📅 ${deadlineStatus.daysRemaining} gün`;
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOpenEdit = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      deadline: task.deadline,
      assignee: task.assignee
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editData.title.trim()) {
      alert('Görev başlığı boş olamaz!');
      return;
    }
    onEditTask(task.id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      deadline: task.deadline,
      assignee: task.assignee
    });
  };

  return (
    <>
      <div className="task-card">
        <div className="task-header">
          <div className="task-title-priority">
            <h4>{task.title}</h4>
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {getPriorityLabel(task.priority)}
            </span>
          </div>
          <div className="task-actions">
            <button 
              className="edit-btn" 
              onClick={handleOpenEdit}
              title="Düzenle"
            >
              ⚙️
            </button>
            <button 
              className="delete-btn" 
              onClick={() => onDelete(task.id)}
              title="Sil"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="task-category-badge"
          style={{ backgroundColor: getCategoryColor(task.category) }}>
          🏷️ {getCategoryName(task.category)}
        </div>

        <p>{task.description}</p>

        {task.deadline && (
          <div 
            className="deadline-badge"
            style={{ color: getDeadlineColor() }}
          >
            {getDeadlineText()}
          </div>
        )}

        {task.assignee && (
          <div className="assignee-badge">
            <div 
              className="assignee-avatar"
              style={{ backgroundColor: getMemberColor(task.assignee) }}
            >
              {getInitials(getMemberName(task.assignee))}
            </div>
            <span className="assignee-name">{getMemberName(task.assignee)}</span>
          </div>
        )}

        <div className="task-footer">
          <select 
            className="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <small className="task-date">
            {new Date(task.createdAt).toLocaleDateString('tr-TR')}
          </small>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      {isEditing && (
        <div className="edit-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>✏️ Görevi Düzenle</h2>
              <button className="edit-close-btn" onClick={handleCancelEdit}>
                ✕
              </button>
            </div>

            <div className="edit-modal-body">
              <div className="edit-form-group">
                <label>Görev Başlığı *</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  placeholder="Görev başlığı..."
                />
              </div>

              <div className="edit-form-group">
                <label>Açıklama</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  placeholder="Görev açıklaması..."
                  rows="4"
                />
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label>Öncelik</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Kategori</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({...editData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label>Son Tarih</label>
                  <input
                    type="date"
                    value={editData.deadline}
                    onChange={(e) => setEditData({...editData, deadline: e.target.value})}
                  />
                </div>

                <div className="edit-form-group">
                  <label>Atanan Kişi</label>
                  <select
                    value={editData.assignee}
                    onChange={(e) => setEditData({...editData, assignee: e.target.value})}
                  >
                    <option value="">Kimse</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button className="edit-cancel-btn" onClick={handleCancelEdit}>
                İptal
              </button>
              <button className="edit-save-btn" onClick={handleSaveEdit}>
                💾 Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;