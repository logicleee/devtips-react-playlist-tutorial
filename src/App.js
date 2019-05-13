import React, { Component, useState } from 'react';
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

let fakeServerData = {
  user: {
    name: 'Lee',
  playlists: [
    {
      name: 'my favs00',
      songs: ['song001','song002','song003', 'song004', 'song005']
    },
    {
      name: 'my favs10',
      songs: ['song101','song102','song103', 'song104', 'song105']
    },
    {
      name: 'my favs20',
      songs: ['song201','song202','song203', 'song204', 'song205']
    },
    {
      name: 'my favs30',
      songs: ['song301','song302','song303', 'song304', 'song305']
    },
    {
      name: 'my favs40',
      songs: ['song401','song402','song403', 'song404', 'song405']
    }
  ]
  }
}

class Aggregate extends React.Component {
  render () {
    return (
        <div style={defaultStyle}>
        {
          this.props.playlists &&
            <h2> {this.props.playlists.length} Playlists</h2>
        }
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

//export default function App() {
class App extends React.Component {
  constructor() {
    super();
    this.state = {serverData: {}};
  }

  componentDidMount() {
    setTimeout(() => {
    this.setState({serverData: fakeServerData});
    }, 2000);
  }

  render () {
    return (
        <div className="App">
        <header className="App-header">
        {this.state.serverData.user ?
         <div>
        <h1 style={{...defaultStyle, color: textTitleColor}}>
         {this.state.serverData.user.name}'s Playlists
            </h1>
            <div style={{...defaultStyle,
                        "grid-template-columns": 'repeat(2, 1fr)',
                        }}>
                <Aggregate playlists={this.state.serverData.user &&
                                      this.state.serverData.user.playlists}/>
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
        </div>: <h1>Loading...</h1> }
        </header>
    </div>
  );
  }
}


export default App;
