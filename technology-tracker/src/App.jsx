import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import { useState } from "react";

function App() {
  const [technologies, setTechnologies] = useState([
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
  ]);

  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;

  const updateStatus = (id) => {
    setTechnologies(prev =>
      prev.map(t =>
        t.id === id ? {
          ...t,
          status: nextStatus(t.status)
        }
          : t
      )
    );
  };

  const nextStatus = (current) => ({
    'not-started': 'in-progress',
    'in-progress': 'completed',
    'completed': 'not-started'
  }[current]);

  // функция для QuickActions
  // Отметить все как выполненные
  const allCompleted = () => {
    setTechnologies(prev =>
      prev.map(t => ({
        ...t,
        status: 'completed'
      }))
    );
  };

  // Сбросить статусы всех
  const allDeleted = () => {
    setTechnologies(prev =>
      prev.map(t => ({
        ...t,
        status: 'not-started'
      }))
    );
  };

  // Выбрать случайную не начатую технологию
  const randomTech = () => {
    const notStartedList = technologies.filter(t => t.status === 'not-started');

    if (notStartedList.length == 0) {
      alert("Невозможно выбрать новую технологию для изучения");
      return;
    }

    const index = Math.floor(Math.random() * (notStartedList.length))

    const selectedTechnology = notStartedList[index];

    setTechnologies(prev =>
      prev.map(t =>
        t.id === selectedTechnology.id ? {
          ...t,
          status: 'in-progress'
        }
          : t
      )
    );
  };

  // Фильтрация
  const [filter, setFilter] = useState('all');

  // Смена статуса
  const showAll = () => {
    setFilter('all');
  }
  const showNotStarted = () => {
    setFilter('not-started');
  }
  const showInProgress = () => {
    setFilter('in-progress');
  }
  const showCompleted = () => {
    setFilter('completed');
  }
  const visibleTechnologies =
    filter === 'all' ? technologies :
      filter === 'not-started' ? technologies.filter(t => t.status === 'not-started') :
        filter === 'in-progress' ? technologies.filter(t => t.status === 'in-progress') :
          technologies.filter(t => t.status === 'completed');


  return (
    <div className="App">
      <ProgressHeader
        total={total}
        completed={completed}
        inProgress={inProgress}
        notStarted={notStarted} />

      <div className="title-row">
        <h2>Дорожная карта изучения технологий</h2>
        <QuickActions
          filter={filter}
          onClickCompleted={allCompleted}
          onClickDeleted={allDeleted}
          onClickRandom={randomTech}
          onClickShowAll={showAll}
          onClickShowNotStarted={showNotStarted}
          onClickShowInProgress={showInProgress}
          onClickShowCompleted={showCompleted}
        />
      </div>

      {visibleTechnologies.map(tech => (
        <TechnologyCard
          key={tech.id}
          title={tech.title}
          description={tech.description}
          status={tech.status}
          onSwitch={() => updateStatus(tech.id)}
        />
      ))}
    </div>
  );
}

export default App;