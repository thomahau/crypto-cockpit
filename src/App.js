import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';

const CustomElement = styled.div`
  color: green;
`;

class App extends Component {
  render() {
    return <CustomElement>Hello</CustomElement>;
  }
}

export default App;
