import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import './App.css';

const AppLayout = styled.div`
  padding: 40px;
`;

const Bar = styled.div`
  display: grid;
  grid-template-columns: 180px auto 100px 100px;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  font-size: 1.5em;
`;

const ControlButton = styled.div`
  cursor: pointer;
  ${props =>
    props.active &&
    css`
      text-shadow: 0px 0px 60px #03ff03;
    `};
`;

const Content = styled.div``;

const checkFirstVisit = () => {
  const cryptoCockpitData = localStorage.getItem('cryptoCockpit');
  if (!cryptoCockpitData) {
    return {
      firstVisit: true,
      page: 'settings'
    };
  }
  return {};
};

class App extends Component {
  state = {
    page: 'dashboard',
    ...checkFirstVisit()
  };

  displayingDashboard = () => this.state.page === 'dashboard';
  displayingSettings = () => this.state.page === 'settings';
  firstVisitMessage = () => {
    if (this.state.firstVisit) {
      return (
        <div>Welcome to CryptoCockpit! Please select your favourite coins to get started.</div>
      );
    }
  };
  confirmFavourites = () => {
    localStorage.setItem('cryptoCockpit', 'test');
    this.setState({ firstVisit: false, page: 'dashboard' });
  };
  settingsContent = () => {
    return (
      <div>
        {this.firstVisitMessage()}
        <div onClick={this.confirmFavourites}>Confirm Favourites</div>
      </div>
    );
  };

  render() {
    return (
      <AppLayout>
        <Bar>
          <Logo>CryptoCockpit</Logo>
          <div />
          {!this.state.firstVisit && (
            <ControlButton
              onClick={() => this.setState({ page: 'dashboard' })}
              active={this.displayingDashboard()}
            >
              Dashboard
            </ControlButton>
          )}
          <ControlButton
            onClick={() => this.setState({ page: 'settings' })}
            active={this.displayingSettings()}
          >
            Settings
          </ControlButton>
        </Bar>
        <Content>{this.displayingSettings() && this.settingsContent()}</Content>
      </AppLayout>
    );
  }
}

export default App;
