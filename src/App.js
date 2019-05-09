import React from 'react';
import logo from './logo.svg';
import './App.css';

let defaultTextColor = '#fff';
// defaultTextColor = '#61dafb';

let defaultStyle = {
  color: defaultTextColor,
};

class Aggregate extends React.Component {
  render () {
    return (
        <div style={{...defaultStyle, width: "40%",
                     display: "inline-block"}}>
        <h2>Number Text</h2>
        </div>
    );
  }
}

class Filter extends React.Component {
  render() {
    return (
        <div style={defaultStyle}>
        <img />
        <input type="text" />
        Filter
        </div>
    );
  }
}

class Playlist extends React.Component {
  render() {
    return (
        <div style={{...defaultStyle, width: "25%", display: 'inline-block'}}>
        <img />
        <h3>Playlist Name</h3>
        <ul><li>Song Title</li><li>Song Title</li><li>Song Title</li></ul>
        </div>
    );
  }
}
export default function App() {
  const myName = 'Lee';
  return (
    <div className="App">
        <header className="App-header">
      <h1 style={{...defaultStyle, color: '#61dafb'}}>Lee's Playlists</h1>
            <Aggregate/>
            <Aggregate/>
            <Filter/>
            <Playlist/>
            <Playlist/>
            <Playlist/>
            <Playlist/>
        </header>
    </div>
  );
}
