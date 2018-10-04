import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';

const AppLayout = styled.div`
  padding: 40px;
  display: grid;
  grid-template-columns: 180px auto 100px 100px;
`;

const Logo = styled.div`
  font-size: 1.5em;
`;

const ControlButton = styled.div``;

class App extends Component {
  render() {
    return (
      <AppLayout>
        <Logo>CryptoCockpit</Logo>
        <div />
        <ControlButton>Dashboard</ControlButton>
        <ControlButton>Settings</ControlButton>
      </AppLayout>
    );
  }
}

export default App;
