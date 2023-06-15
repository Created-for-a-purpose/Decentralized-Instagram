import React from 'react';
import './styles.css';

const Navbar = (props) => {
  const {account} = props;
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item"><h1>Decentralized Instagram</h1></li>
      </ul>
        <div className="nav-item-right">Connected Account: {account}</div>
    </nav>
  );
};

export default Navbar;
