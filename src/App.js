import React from 'react';
import logo from './logo.svg';
import './App.css';

const defaultTextColor = '#fff';
const textTitleColor = '#61dafb';
// defaultTextColor = '#61dafb';

let defaultStyle = {
  color: defaultTextColor,
  display: 'grid',
  'grid-gap': '2rem'
};

class Aggregate extends React.Component {
  render () {
    return (
        <div style={defaultStyle}>
        <h2>Number Text</h2>
        </div>
    );
  }
}

class Filter extends React.Component {
  render() {
    return (
        // <div style={{...defaultStyle,
        //              "grid-template-columns": 'repeat(2, 1fr)'}}>
        <div style={{...defaultStyle, display: 'grid-row'}}>
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
        <div style={defaultStyle}>
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
            <h1 style={{...defaultStyle, color: textTitleColor}}>Lee's Playlists
            </h1>
            <div style={{...defaultStyle,
                        "grid-template-columns": 'repeat(2, 1fr)',
                        }}>
                <Aggregate/>
                <Aggregate/>
            </div>
            <div style={defaultStyle}>
                <Filter/>
            </div>
            <div style={{...defaultStyle,
                        "grid-template-columns": 'repeat(4, 1fr)',
                        "grid-template-rows": 'repeat(2, 25vh)',
                        }}>
                <Playlist/>
                <Playlist/>
                <Playlist/>
                <Playlist/>
            </div>
        </header>
    </div>
  );
}
