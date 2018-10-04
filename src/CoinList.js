import React from 'react';
import styled, { css } from 'styled-components';
import { subtleBoxShadow, darkBackground, greenBoxShadow, redBoxShadow } from './Style';

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  margin-top: 40px;
`;

const CoinTile = styled.div`
  ${subtleBoxShadow};
  ${darkBackground};
  padding: 10px;
  &:hover {
    cursor: pointer;
    ${greenBoxShadow};
  }
  ${props =>
    props.favourite &&
    css`
      &:hover {
        ${redBoxShadow};
      }
    `};
  ${props =>
    props.chosen &&
    !props.favourite &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `};
`;

const CoinTileHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const CoinSymbol = styled.div`
  justify-self: right;
`;

const DeleteIcon = styled.div`
  justify-self: right;
  display: none;
  ${CoinTile}:hover & {
    display: block;
    color: #f97a7c;
  }
`;

export default function(favourites = false) {
  let coinKeys = favourites ? this.state.favourites : Object.keys(this.state.coinList).slice(0, 20);
  return (
    <CoinGrid>
      {coinKeys.map(coinKey => (
        <CoinTile
          chosen={this.isInFavourites(coinKey)}
          favourite={favourites}
          onClick={
            favourites
              ? () => {
                  this.removeCoinFromFavourites(coinKey);
                }
              : () => {
                  this.addCoinToFavourites(coinKey);
                }
          }
        >
          <CoinTileHeader>
            <div>{this.state.coinList[coinKey].CoinName}</div>
            {favourites ? (
              <DeleteIcon>X</DeleteIcon>
            ) : (
              <CoinSymbol>{this.state.coinList[coinKey].Symbol}</CoinSymbol>
            )}
          </CoinTileHeader>
          <img
            style={{ height: '50px' }}
            src={`http://cryptocompare.com/${this.state.coinList[coinKey].ImageUrl}`}
            alt={`${this.state.coinList[coinKey].CoinName} logo`}
          />
        </CoinTile>
      ))}
    </CoinGrid>
  );
}
