import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';

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
    const totalDurationHours = Math.round(totalDuration / 60);

    return (
        <div style={defaultStyle}>
        <h2> {totalDurationHours} hours</h2>
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
        <img
            src={this.props.playlist.imageUrl}
      style={{width: '120px'}} />
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

    const token = queryString.parse(window.location.search)['access_token'];
    if (! token)
      return;

    const apiEndpoint = 'https://api.spotify.com/v1/me';
    const apiPlaylistsEndpoint = apiEndpoint + '/playlists';
    const headers = { headers: {'Authorization': 'Bearer ' + token}};

    fetch(apiEndpoint, headers)
      .then((response) => response.json())
      .then((data) => {
        this.setState({serverData: {'user': {'name': data.display_name}}});
      })
      .catch(error => console.log(error));

    fetch(apiPlaylistsEndpoint, headers)
      .then((response) => response.json())
      .then(playlistData => {
        if (! playlistData)
          return
        const playlists = playlistData.items
        const trackDataPromises = playlists.map(playlist => {
          const responsePromise = fetch(playlist.tracks.href, headers)
          const trackDataPromise = responsePromise
                .then(response => response.json())
                .catch(error => console.log(error));
          return trackDataPromise
        });
        const allTracksDataPromises = Promise.all(trackDataPromises)
        const playlistsPromise = allTracksDataPromises.then(tracksDatas => {
          tracksDatas.forEach((tracksData, i) => {
            playlists[i].tracksDatas = tracksData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }));
          });
          return playlists;
        });
        return playlistsPromise;
      })
      .then((data) => {
        this.setState({serverData: {'user': {
          ...this.state.serverData.user,
          'playlists': data.map((item) => ({
            'name': item.name,
            'imageUrl': item.images[0].url,
            'songs': item.tracksDatas.slice(0,3)
          }))
         }}
        });
      })
      .catch(error => console.log(error));
  }

  render () {
    const user = this.state.serverData.user;
    const playlistsToRender =
          user &&
          user.playlists &&
          user.playlists.filter(playlist => {
          const matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase());
          const matchesSong = playlist.songs.find(song =>
                  song.name.toLowerCase()
                      .includes(this.state.filterString.toLowerCase()));
            return matchesPlaylist || matchesSong;
          });

    return (
        <div className="App">
        <header className="App-header">
        { playlistsToRender ?
         <div>
        <h1 style={{...defaultStyle, color: textTitleColor}}>
         {user.name}'s Playlists
            </h1>
        {user.playlists ?
            <div>
                <div style={{...defaultStyle,
                            "grid-template-columns": 'repeat(2, 1fr)'}}>
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
                    {playlistsToRender.map(x =>
                        {return <Playlist playlist={x}/>})}

                </div>
            </div>: <h2>No playlist data</h2> }
        </div>: <button
    onClick={() => {
        window.location =  window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://ex-sptfy-better-plylsts-oauth.herokuapp.com/login'
        }}
    style={{
            padding: '20px',
            'font-size': '50px',
            'margin-top': '20px'
            }}>Sign in to Spotify</button> }
        </header>
    </div>
  );
  }
}


export default App;
