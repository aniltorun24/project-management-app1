import React, { useState, useEffect } from 'react';
import Statistics from './Statistics';
import Filter from './Filter';
import TeamMembers from './TeamMembers';
import Column from './Column';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [theme, setTheme] = useState('light');
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { id: 'design', name: 'Tasarım', color: '#33e9e9' },
    { id: 'development', name: 'Geliştirme', color: '#3f1294' },
    { id: 'testing', name: 'Test', color: '#b09b33' },
    { id: 'documentation', name: 'Dokümantasyon', color: '#1f8645' },
    { id: 'bug', name: 'Hata Düzeltme', color: '#761b23' },
    { id: 'other', name: 'Diğer', color: '#681952' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    deadline: '',
    category: 'other',
    assignee: ''
  });

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // localStorage'dan görevleri yükle
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Görevler yüklenirken hata:', error);
        setTasks([]);
      }
    }
  }, []);

  // Görevleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // localStorage'dan tema yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Tema tercihini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Takım üyelerini localStorage'dan yükle
  useEffect(() => {
    const savedMembers = localStorage.getItem('teamMembers');
    if (savedMembers) {
      try {
        setTeamMembers(JSON.parse(savedMembers));
      } catch (error) {
        console.error('Takım üyeleri yüklenirken hata:', error);
        setTeamMembers([]);
      }
    }
  }, []);

  // Takım üyelerini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Tema değiştir
  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Takım üyesi ekle
  const handleAddMember = (name) => {
    const newMember = {
      id: Date.now(),
      name: name
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  // Takım üyesini sil
  const handleRemoveMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    setTasks(tasks.map(task =>
      task.assignee === memberId ? { ...task, assignee: '' } : task
    ));
  };

  // Yeni görev ekle
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Görev başlığını girin!');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline,
      category: formData.category,
      assignee: formData.assignee,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setFormData({ 
      title: '', 
      description: '', 
      status: 'todo', 
      priority: 'medium', 
      deadline: '', 
      category: 'other', 
      assignee: '' 
    });
    setShowModal(false);
  };

  // Görev sil
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Görev düzenle
  const handleEditTask = (taskId, updatedData) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updatedData } : task
    ));
  };

  // Görev durumunu değiştir
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Filtreleri sıfırla
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  // Kategori adını ID'den al
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Diğer';
  };

  // Kategori rengini ID'den al
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#A8D8EA';
  };

  // Üye adını ID'den al
  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => String(m.id) === String(memberId));
    return member ? member.name : '';
  };

  // Üye avatar rengini al
  const getMemberColor = (memberId) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8D8EA'];
    const memberIndex = teamMembers.findIndex(m => String(m.id) === String(memberId));
    return memberIndex >= 0 ? colors[memberIndex % colors.length] : '#ddd';
  };

  // Filtreleme işlemi
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || task.status === statusFilter;
    const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === '' || task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Filtrelenmiş görevleri duruma göre filtrele
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'inprogress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Proje Yönetimi</h1>
        <div className="header-actions">
          <button 
            className="theme-toggle-btn"
            onClick={handleToggleTheme}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            className="add-task-btn"
            onClick={() => setShowModal(true)}
          >
            ➕ Yeni Görev
          </button>
        </div>
      </header>

      <Statistics tasks={tasks} />

      <TeamMembers 
        members={teamMembers}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      <Filter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        onResetFilters={handleResetFilters}
      />

      <div className="board">
        <Column 
          id="todo"
          title="Yapılacak" 
          tasks={todoTasks}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onEditTask={handleEditTask}
          getCategoryColor={getCategoryColor}
          getCategoryName={getCategoryName}
          getMemberName={getMemberName}
          getMemberColor={getMemberColor}
          categories={categories}
          teamMembers={teamMembers}
        />

        <Column 
          id="inprogress"
          title="Devam Ediyor" 
          tasks={inProgressTasks}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onEditTask={handleEditTask}
          getCategoryColor={getCategoryColor}
          getCategoryName={getCategoryName}
          getMemberName={getMemberName}
          getMemberColor={getMemberColor}
          categories={categories}
          teamMembers={teamMembers}
        />

        <Column 
          id="done"
          title="Tamamlandı" 
          tasks={doneTasks}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onEditTask={handleEditTask}
          getCategoryColor={getCategoryColor}
          getCategoryName={getCategoryName}
          getMemberName={getMemberName}
          getMemberColor={getMemberColor}
          categories={categories}
          teamMembers={teamMembers}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Görev Ekle</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Görev Başlığı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Örn: Tasarımı tamamla"
                  required
                />
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Görev açıklaması..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Durum</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="todo">Yapılacak</option>
                    <option value="inprogress">Devam Ediyor</option>
                    <option value="done">Tamamlandı</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Öncelik</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Son Tarih (Opsiyonel)</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    min={getTodayDate()}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Atanan Kişi (Opsiyonel)</label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
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

              <div className="modal-footer">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  İptal
                </button>
                <button type="submit" className="submit-btn">
                  Görev Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;