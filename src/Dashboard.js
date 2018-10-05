import React from 'react';
import styled, { css } from 'styled-components';
import { CoinGrid, CoinTile, CoinTileHeader, CoinSymbol } from './CoinList';
import { fontSizeBig, fontSize3, subtleBoxShadow, darkBackground } from './Style';

const formatNumber = number => number.toFixed(2);

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
  let self = this;
  return [
    <CoinGrid>
      {this.state.prices.map((price, index) => {
        const sym = Object.keys(price)[0];
        const data = price[sym]['USD'];
        const tileProps = {
          dashboardFavourite: sym === self.state.currentFavourite,
          onClick: () => {
            self.setState({ currentFavourite: sym });
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
          <CoinTileCompact {...tileProps}>
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
      <PaddingBlue>Chart goes here</PaddingBlue>
    </ChartGrid>
  ];
}
