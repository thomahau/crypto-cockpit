import React from 'react';
import styled, { css } from 'styled-components';
import { CoinGrid, CoinTile, CoinTileHeader, CoinSymbol } from './CoinList';
import {
  fontSizeBig,
  fontSize2,
  fontSize3,
  subtleBoxShadow,
  darkBackground,
  backgroundColor2
} from './Style';
import highchartsConfig from './HighchartsConfig';
import theme from './HighchartsTheme';

const ReactHighcharts = require('react-highcharts');
ReactHighcharts.Highcharts.setOptions(theme());

const formatNumber = number => number.toFixed(2);

const ChartSelect = styled.select`
  ${backgroundColor2};
  color: white;
  border: 1px solid;
  ${fontSize2};
  margin: 5px;
  height: 25px;
  float: right;
`;

const ChangePct = styled.div`
  color: green;
  ${props =>
    props.red &&
    css`
      color: red;
    `};
`;

const TickerPrice = styled.div`
  ${fontSizeBig};
`;

const CoinTileCompact = CoinTile.extend`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  justify-items: right;
  ${fontSize3};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 15px;
  margin-top: 20px;
`;

const PaddingBlue = styled.div`
  ${subtleBoxShadow};
  ${darkBackground};
  padding: 5px;
`;

export default function() {
  return [
    <CoinGrid key={'coingrid'}>
      {this.state.prices.map((price, index) => {
        const sym = Object.keys(price)[0];
        const data = price[sym]['USD'];
        const tileProps = {
          key: sym,
          dashboardFavourite: sym === this.state.currentFavourite,
          onClick: () => {
            this.setState({ currentFavourite: sym, historical: null }, this.fetchHistorical);
            localStorage.setItem(
              'cryptoCockpit',
              JSON.stringify({
                ...JSON.parse(localStorage.getItem('cryptoCockpit')),
                currentFavourite: sym
              })
            );
          }
        };
        return index < 5 ? (
          <CoinTile {...tileProps}>
            <CoinTileHeader>
              <div>{sym}</div>
              <CoinSymbol>
                <ChangePct red={data.CHANGEPCT24HOUR < 0}>
                  {formatNumber(data.CHANGEPCT24HOUR)}%
                </ChangePct>
              </CoinSymbol>
            </CoinTileHeader>
            <TickerPrice>${formatNumber(data.PRICE)}</TickerPrice>
          </CoinTile>
        ) : (
          <CoinTileCompact key={index} {...tileProps}>
            <div style={{ justifySelf: 'left' }}>{sym}</div>
            <CoinSymbol>
              <ChangePct red={data.CHANGEPCT24HOUR < 0}>
                {formatNumber(data.CHANGEPCT24HOUR)}%
              </ChangePct>
            </CoinSymbol>
            <div>${formatNumber(data.PRICE)}</div>
          </CoinTileCompact>
        );
      })}
    </CoinGrid>,
    <ChartGrid key={'chartgrid'}>
      <PaddingBlue>
        <h2 style={{ textAlign: 'center' }}>
          {this.state.coinList[this.state.currentFavourite].CoinName}
        </h2>
        <img
          style={{ height: '200px', display: 'block', margin: 'auto' }}
          src={`http://cryptocompare.com/${
            this.state.coinList[this.state.currentFavourite].ImageUrl
          }`}
          alt={`${this.state.currentFavourite} logo`}
        />
      </PaddingBlue>
      <PaddingBlue>
        <ChartSelect
          defaultValue={'months'}
          onChange={e => {
            this.setState({ timeInterval: e.target.value, historical: null }, this.fetchHistorical);
          }}
        >
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </ChartSelect>
        {this.state.historical ? (
          <ReactHighcharts config={highchartsConfig.call(this)} />
        ) : (
          <div>Loading historical data...</div>
        )}
      </PaddingBlue>
    </ChartGrid>
  ];
}
