import React, { Component, useState } from 'react';
import logo from './logo.svg';
import reset from 'reset-css';
import './App.css';
import queryString from 'query-string';

const defaultTextColor = '#fff';
const textTitleColor = '#61dafb';
const textGreyColor = 'slategrey';

const defaultStyle = {
  color: defaultTextColor,
  'font-family': '-apple-system, BlinkMacSystemFont,                      \
                 "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",   \
                 "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  display: 'grid',
  'font-weight': '700',
  'font-size': 'calc(10px + 1vmin)',
  'grid-gap': '1rem'
};

const statsStyle = {
  ...defaultStyle,
  width: '40%',
  'margin-top': 'calc(10px)',
  'margin-bottom': 'calc(10px)',
  'font-size': 'calc(10px + .8vmin)',
  'line-height': 'calc(10px + 1vmin)',
  color: textGreyColor
};

const titleStyle = {
  ...defaultStyle,
  'font-size': 'calc(10px + 1.8vmin)',
  color: textTitleColor
}


class HoursCounter extends Component {
  render () {
    const totalDuration = this.props.playlists.map(x => x.songs)
          .flat()
          .reduce((acc,cv) => {
            return acc + cv.duration;
          }, 0);
    const totalDurationHours = (totalDuration / 3600 ).toFixed(1);

    return (
        <div style={statsStyle}>
        <h2> {totalDurationHours} hours</h2>
        </div>
    );
  }
}

class PlaylistCounter extends Component {
  render () {
    return (
        <div style={statsStyle}>
            <h2> {this.props.playlists.length} playlists</h2>
        </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
        <div style={{...statsStyle, display: 'grid-row'}}>
        <input type="text"
               onKeyUp={event => this.props.onTextChange(event.target.value)}/>
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
        <h3 style={{'font-weight': '900'}}>{this.props.playlist.name}</h3>
        <ul style={{'font-weight': '300'}}>{this.props.playlist.songs
                                            .map((x,index) =>{
          if (index < 4)
            return <li style={{'margin-top': '6px'}}>{x.name}</li>;
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
        <h1 style={titleStyle}>
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
            'margin-top': '20px',
            'font-size': 'calc(20px + 1vmin)'
            }}>Sign in to Spotify</button> }
        </header>
    </div>
  );
  }
}

export default App;
