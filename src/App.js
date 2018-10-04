import React, { Component } from 'react';
import styled from 'styled-components';
import fuzzy from 'fuzzy';
import HeaderBar from './HeaderBar';
import CoinList from './CoinList';
import Search from './Search';
import { ConfirmButton } from './Button';
import './App.css';
const cc = require('cryptocompare');
const _ = require('lodash');

const MAX_FAVOURITES = 10;

const AppLayout = styled.div`
  padding: 40px;
`;

const Content = styled.div``;

export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
`;

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
    this.setState({ firstVisit: false, page: 'dashboard' });
    localStorage.setItem('cryptoCockpit', JSON.stringify({ favourites: this.state.favourites }));
  };
  settingsContent = () => {
    return (
      <div>
        {this.firstVisitMessage()}
        <div>
          {CoinList.call(this, true)}
          <CenterDiv>
            <ConfirmButton onClick={this.confirmFavourites}>Confirm Favourites</ConfirmButton>
          </CenterDiv>
          {Search.call(this)}
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
  handleFilter = _.debounce(inputValue => {
    const coinSymbols = Object.keys(this.state.coinList);
    const coinNames = coinSymbols.map(sym => this.state.coinList[sym].CoinName);
    const allStringsToSearch = coinSymbols.concat(coinNames);
    const fuzzyResults = fuzzy
      .filter(inputValue, allStringsToSearch, {})
      .map(result => result.string);
    const filteredCoins = _.pickBy(this.state.coinList, (result, symKey) => {
      const coinName = result.CoinName;
      return _.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName);
    });

    this.setState({ filteredCoins });
  }, 500);
  filterCoins = e => {
    let inputValue = _.get(e, 'target.value');
    if (!inputValue) {
      this.setState({ filteredCoins: null });
      return;
    }
    this.handleFilter(inputValue);
  };

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
