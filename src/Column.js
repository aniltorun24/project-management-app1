import React from 'react';
import TaskCard from './TaskCard';
import './Column.css';

const Column = ({ 
  id,
  title, 
  tasks, 
  onDeleteTask, 
  onStatusChange,
  onEditTask,
  getCategoryColor,
  getCategoryName,
  getMemberName,
  getMemberColor,
  categories,
  teamMembers
}) => {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="column-content">
        {tasks.length === 0 ? (
          <p className="empty-message">Görev yok</p>
        ) : (
          tasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task} 
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              onEditTask={onEditTask}
              getCategoryColor={getCategoryColor}
              getCategoryName={getCategoryName}
              getMemberName={getMemberName}
              getMemberColor={getMemberColor}
              categories={categories}
              teamMembers={teamMembers}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;