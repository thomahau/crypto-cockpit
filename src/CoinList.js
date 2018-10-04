import React from 'react';
import styled from 'styled-components';
import { subtleBoxShadow, lightBlueBackground, greenBoxShadow } from './Style';

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  margin-top: 40px;
`;

const CoinTile = styled.div`
  ${subtleBoxShadow};
  ${lightBlueBackground};

  padding: 10px;
  &:hover {
    cursor: pointer;
    ${greenBoxShadow};
  }
`;

const CoinTileHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const CoinSymbol = styled.div`
  justify-self: right;
`;

export default function() {
  return (
    <CoinGrid>
      {Object.keys(this.state.coinList)
        .slice(0, 20)
        .map(coin => (
          <CoinTile>
            <CoinTileHeader>
              <div>{this.state.coinList[coin].CoinName}</div>
              <CoinSymbol>{this.state.coinList[coin].Symbol}</CoinSymbol>
            </CoinTileHeader>
            <img
              style={{ height: '50px' }}
              src={`http://cryptocompare.com/${this.state.coinList[coin].ImageUrl}`}
              alt={`${this.state.coinList[coin].CoinName} logo`}
            />
          </CoinTile>
        ))}
    </CoinGrid>
  );
}
