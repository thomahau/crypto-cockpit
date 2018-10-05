import React, { Component } from 'react';
import styled from 'styled-components';
import fuzzy from 'fuzzy';
import moment from 'moment';
import HeaderBar from './HeaderBar';
import CoinList from './CoinList';
import Search from './Search';
import Dashboard from './Dashboard';
import { ConfirmButton } from './Button';
import './App.css';
const cc = require('cryptocompare');
const _ = require('lodash');

const MAX_FAVOURITES = 10;
const TIME_UNITS = 10;

const AppLayout = styled.div`
  padding: 40px;
`;

const Content = styled.div``;

export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
`;
//getInitialState
const checkFirstVisit = () => {
  const cryptoCockpitData = JSON.parse(localStorage.getItem('cryptoCockpit'));
  if (!cryptoCockpitData) {
    return {
      firstVisit: true,
      page: 'settings'
    };
  }
  const { favourites, currentFavourite } = cryptoCockpitData;
  return { favourites, currentFavourite };
};

class App extends Component {
  state = {
    page: 'dashboard',
    favourites: ['ETH', 'BTC', 'XMR', 'EOS', 'ZRX'],
    timeInterval: 'months',
    ...checkFirstVisit()
  };

  componentDidMount = () => {
    this.fetchCoins();
    this.fetchPrices();
    this.fetchHistorical();
  };
  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList });
  };
  fetchPrices = async () => {
    if (this.state.firstVisit) return;
    let prices;
    try {
      prices = await this.prices();
    } catch (e) {
      this.setState({ error: true });
    }

    this.setState({ prices });
  };
  prices = () => {
    const promises = [];
    this.state.favourites.forEach(sym => {
      promises.push(cc.priceFull(sym, 'USD'));
    });

    return Promise.all(promises);
  };
  fetchHistorical = async () => {
    if (this.state.firstVisit) return;
    const results = await this.historical();
    const historical = [
      {
        name: this.state.currentFavourite,
        data: results.map((ticker, index) => [
          moment()
            .subtract({ [this.state.timeInterval]: TIME_UNITS - index })
            .valueOf(),
          ticker.USD
        ])
      }
    ];

    this.setState({ historical });
  };
  historical = () => {
    const promises = [];
    for (let units = TIME_UNITS; units > 0; units--) {
      promises.push(
        cc.priceHistorical(
          this.state.currentFavourite,
          ['USD'],
          moment()
            .subtract({ [this.state.timeInterval]: units })
            .toDate()
        )
      );
    }
    return Promise.all(promises);
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
    const currentFavourite = this.state.favourites[0];
    this.setState(
      {
        firstVisit: false,
        page: 'dashboard',
        prices: null,
        historical: null,
        currentFavourite
      },
      () => {
        this.fetchPrices();
        this.fetchHistorical();
      }
    );
    localStorage.setItem(
      'cryptoCockpit',
      JSON.stringify({ favourites: this.state.favourites, currentFavourite })
    );
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
      return <div>Loading coins...</div>;
    }
    if (!this.state.firstVisit && !this.state.prices) {
      return <div>Loading prices...</div>;
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
          <Content>
            {this.displayingSettings() && this.settingsContent()}
            {this.displayingDashboard() && Dashboard.call(this)}
          </Content>
        )}
      </AppLayout>
    );
  }
}

export default App;
