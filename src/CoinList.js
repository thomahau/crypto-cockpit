import React from 'react';
import styled, { css } from 'styled-components';
import { subtleBoxShadow, darkBackground, greenBoxShadow, redBoxShadow } from './Style';

export const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  ${props =>
    props.count &&
    css`
      grid-template-columns: repeat(${props.count > 5 ? props.count : 5}, 1fr);
    `} grid-gap: 15px;
  margin-top: 40px;
`;

export const CoinTile = styled.div`
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
    props.dashboardFavourite &&
    css`
      ${greenBoxShadow};
      &:hover {
        pointer-events: none;
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

export const CoinTileHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const CoinSymbol = styled.div`
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
  const coinKeys = favourites
    ? this.state.favourites
    : (this.state.filteredCoins && Object.keys(this.state.filteredCoins)) ||
      Object.keys(this.state.coinList).slice(0, 20);
  return (
    <CoinGrid count={favourites && this.state.favourites.length}>
      {coinKeys.map(coinKey => (
        <CoinTile
          key={coinKey}
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
