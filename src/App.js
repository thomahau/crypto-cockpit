import React, { Component } from 'react';
import styled from 'styled-components';
import HeaderBar from './HeaderBar';
import CoinList from './CoinList';
import './App.css';
const cc = require('cryptocompare');
const _ = require('lodash');

const MAX_FAVOURITES = 10;

const AppLayout = styled.div`
  padding: 40px;
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
    page: 'settings',
    favourites: ['ETH', 'BTC', 'XMR', 'EOS', 'ZRX'],
    ...checkFirstVisit()
  };

  componentDidMount = () => {
    this.fetchCoins();
  };
  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList });
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
        <div>
          {CoinList.call(this, true)}
          {CoinList.call(this)}
        </div>
      </div>
    );
  };
  loadingContent = () => {
    if (!this.state.coinList) {
      return <div>Loading data...</div>;
    }
  };
  addCoinToFavourites = coinKey => {
    let favourites = [...this.state.favourites];
    if (favourites.length < MAX_FAVOURITES) {
      favourites.push(coinKey);
      this.setState({ favourites });
    }
  };
  removeCoinFromFavourites = coinKey => {
    let favourites = [...this.state.favourites];
    this.setState({ favourites: _.pull(favourites, coinKey) });
  };
  isInFavourites = coinKey => _.includes(this.state.favourites, coinKey);
  render() {
    return (
      <AppLayout>
        {HeaderBar.call(this)}
        {this.loadingContent() || (
          <Content>{this.displayingSettings() && this.settingsContent()}</Content>
        )}
      </AppLayout>
    );
  }
}

export default App;
