import styled from 'styled-components';
import { fontSize1, greenBoxShadow } from './Style';

export const ConfirmButton = styled.div`
  margin: 20px;
  color: #31d391;
  ${fontSize1};
  font-family: Exo 2, sans-serif;
  padding: 5px;
  &:hover {
    ${greenBoxShadow};
    cursor: pointer;
  }
`;
