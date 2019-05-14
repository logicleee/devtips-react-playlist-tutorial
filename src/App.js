import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const defaultTextColor = '#fff';
const textTitleColor = '#61dafb';

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
      songs: [
        {name: 'song001', duration: 480},
        {name: 'song002', duration: 480},
        {name: 'song003', duration: 480},
        {name: 'song004', duration: 480},
        {name: 'song005',  duration: 480}
      ]
    },
    {
      name: 'my favs10',
      songs: [
        {name: 'song101', duration: 480},
        {name: 'song102', duration: 480},
        {name: 'song103', duration: 480},
        {name: 'song104', duration: 480},
        {name: 'song105',  duration: 480}
      ]
    },
    {
      name: 'my favs21',
      songs: [
        {name: 'song201', duration: 480},
        {name: 'song202', duration: 480},
        {name: 'song203', duration: 480},
        {name: 'song204', duration: 480},
        {name: 'song205',  duration: 480}
      ]
    },
    {
      name: 'my favs30',
      songs: [
        {name: 'song301', duration: 480},
        {name: 'song302', duration: 480},
        {name: 'song303', duration: 480},
        {name: 'song304', duration: 480},
        {name: 'song305',  duration: 480}
      ]
    },
    {
      name: 'my favs40',
      songs: [
        {name: 'song401', duration: 480},
        {name: 'song402', duration: 480},
        {name: 'song403', duration: 480},
        {name: 'song404', duration: 480},
        {name: 'song405',  duration: 480}
      ]
    }
  ]
  }
};

class HoursCounter extends Component {
  render () {
    const totalDuration = this.props.playlists.map(x => x.songs)
          .flat()
          .reduce((acc,cv) => {
            return acc + cv.duration;
          }, 0);

    return (
        <div style={defaultStyle}>
        <h2> {totalDuration} hours</h2>
        </div>
    );
  }
}

class PlaylistCounter extends Component {
  render () {
    return (
        <div style={defaultStyle}>
            <h2> {this.props.playlists.length} playlists</h2>
        </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
        <div style={{...defaultStyle, display: 'grid-row'}}>
        <img />
        <input type="text"
               onKeyUp={event => this.props.onTextChange(event.target.value)}/>
        Filter
        </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
        <div style={defaultStyle}>
        <img />
        <h3>{this.props.playlist.name}</h3>
        <ul>{this.props.playlist.songs.map((x,index) =>{
          if (index < 4)
            return <li>{x.name}</li>;
        }
        )}</ul>
        </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {serverData: {},
                  filterString: ''};
  }

  componentDidMount() {
    setTimeout(() => {
    this.setState({serverData: fakeServerData});
    }, 2000);
    /*
    setTimeout(() => {
    this.setState({filterString: '10'});
    }, 4000);
    */

  }

  render () {
    const user = this.state.serverData.user;
    const playlistsToRender = user && user.playlists.filter(x =>
                                                x.name.toLowerCase().includes(
                                                  this.state.filterString
                                                    .toLowerCase()));
    return (
        <div className="App">
        <header className="App-header">
        {user ?
         <div>
        <h1 style={{...defaultStyle, color: textTitleColor}}>
         {user.name}'s Playlists
            </h1>
            <div style={{...defaultStyle,
                        "grid-template-columns": 'repeat(2, 1fr)',
                        }}>
                <PlaylistCounter playlists={playlistsToRender}/>
                <HoursCounter playlists={playlistsToRender}/>
            </div>
            <div style={defaultStyle}>
                <Filter onTextChange={text =>
                        { return this.setState({filterString: text})}}/>
            </div>
            <div style={{...defaultStyle,
                        "grid-template-columns": 'repeat(4, 1fr)',
                        "grid-template-rows": 'repeat(2, 25vh)',
                        }}>
                {playlistsToRender.filter(x => {
                    return x.name.toLowerCase()
                        .includes(this.state.filterString.toLowerCase())})
                        .map(x => {
                        return <Playlist playlist={x}/>})
                        }
            </div>
        </div>: <h1>Loading...</h1> }
        </header>
    </div>
  );
  }
}


export default App;
