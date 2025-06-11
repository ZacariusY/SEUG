import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">SEUG</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/alunos">Alunos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/professores">Professores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/disciplinas">Disciplinas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/turmas">Turmas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/locais">Locais</Link>
            </li>
          </ul>
          <div className="d-flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 