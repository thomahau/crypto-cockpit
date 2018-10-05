import React from 'react';
import styled, { css } from 'styled-components';
import { CoinGrid, CoinTile, CoinTileHeader, CoinSymbol } from './CoinList';
import { fontSizeBig, fontSize3 } from './Style';

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

export default function() {
  return (
    <CoinGrid>
      {this.state.prices.map((price, index) => {
        let sym = Object.keys(price)[0];
        let data = price[sym]['USD'];
        return index < 5 ? (
          <CoinTile>
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
          <CoinTileCompact>
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
    </CoinGrid>
  );
}
