import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const menuItems = [
    {
      title: 'Alunos',
      description: 'Gerenciar cadastro de alunos',
      path: '/alunos'
    },
    {
      title: 'Professores',
      description: 'Gerenciar cadastro de professores',
      path: '/professores'
    },
    {
      title: 'Disciplinas',
      description: 'Gerenciar cadastro de disciplinas',
      path: '/disciplinas'
    },
    {
      title: 'Turmas',
      description: 'Gerenciar cadastro de turmas',
      path: '/turmas'
    },
    {
      title: 'Locais',
      description: 'Gerenciar cadastro de locais',
      path: '/locais'
    },
    {
      title: 'Pesquisa',
      description: 'Pesquisar e filtrar registros',
      path: '/pesquisa'
    }
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">SEUG</h1>
      
      {/* Menu de Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {menuItems.map((item, index) => (
          <div className="col" key={index}>
            <div className="card h-100 menu-card">
              <div className="card-body text-center">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <Link to={item.path} className="btn btn-primary">Acessar</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; 