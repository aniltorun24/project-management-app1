import React, { useState } from 'react';
import './TeamMembers.css';

const TeamMembers = ({ members, onAddMember, onRemoveMember }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      alert('Takım üyesi adını girin!');
      return;
    }

    onAddMember(newMemberName);
    setNewMemberName('');
    setShowAddForm(false);
  };

  // YENİ: Avatar renkleri
  const getAvatarColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8D8EA'];
    return colors[index % colors.length];
  };

  // YENİ: Avatar için kısaltma
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="team-members-container">
      <div className="team-header">
        <h3>👥 Takım Üyeleri</h3>
        <button
          className="add-member-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕' : '➕'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-member-form">
          <input
            type="text"
            placeholder="Takım üyesi adı..."
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
          />
          <button onClick={handleAddMember}>Ekle</button>
        </div>
      )}

      <div className="members-list">
        {members.length === 0 ? (
          <p className="no-members">Takım üyesi ekleyin</p>
        ) : (
          members.map((member, index) => (
            <div key={member.id} className="member-item">
              <div
                className="member-avatar"
                style={{ backgroundColor: getAvatarColor(index) }}
              >
                {getInitials(member.name)}
              </div>
              <span className="member-name">{member.name}</span>
              <button
                className="remove-member-btn"
                onClick={() => onRemoveMember(member.id)}
                title="Sil"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamMembers;