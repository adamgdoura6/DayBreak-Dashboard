import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSkipBack, FiSkipForward, FiPause, FiPlay } from 'react-icons/fi';
import Card from './card';
import { SpotifyTrack, SpotifyResponse } from '../types';

const SpotifyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NowPlaying = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const AlbumArt = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #333;
  margin-right: 15px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackName = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

interface ProgressFillProps {
  progress: string;
}

const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  background-color: #eee;
  border-radius: 2px;
  position: relative;
`;

const ProgressFill = styled.div<ProgressFillProps>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.progress};
  background-color: #1DB954;
  border-radius: 2px;
`;

const Times = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 5px;
`;

interface ControlButtonProps {
  primary?: boolean;
}

const ControlButton = styled.button<ControlButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  border: none;
  color: ${props => props.primary ? 'white' : '#444'};
  background-color: ${props => props.primary ? '#1DB954' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#1DB954' : '#f0f0f0'};
    transform: ${props => props.primary ? 'scale(1.05)' : 'none'};
  }
`;

const SpotifyPlayer: React.FC = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [track, setTrack] = useState<SpotifyTrack>({
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: '',
    progress: 35,
    progressMs: 84000,
    durationMs: 240000
  });

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const res = await fetch('/api/spotify/current');
        const data: SpotifyResponse = await res.json();
        
        if (data && !data.error) {
          if (data.is_playing && data.track_name && data.duration_ms && data.progress_ms) {
            setPlaying(true);
            setTrack({
              name: data.track_name,
              artist: data.artist || 'Unknown Artist',
              albumArt: data.album_art,
              progress: (data.progress_ms / data.duration_ms) * 100,
              progressMs: data.progress_ms,
              durationMs: data.duration_ms
            });
          } else {
            setPlaying(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch current track:', error);
      }
    };

    fetchCurrentTrack();
    
    // Poll for updates if playing
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setTrack(prev => {
          const newProgressMs = prev.progressMs + 1000;
          if (newProgressMs >= prev.durationMs) {
            fetchCurrentTrack(); // Fetch new track
            return prev;
          }
          
          return {
            ...prev,
            progressMs: newProgressMs,
            progress: (newProgressMs / prev.durationMs) * 100
          };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    try {
      const action = playing ? 'pause' : 'play';
      const res = await fetch(`/api/spotify/control/${action}`);
      const data = await res.json();
      
      if (data && !data.error) {
        setPlaying(!playing);
      }
    } catch (error) {
      console.error('Failed to control playback:', error);
    }
  };

  const handleNext = async () => {
    try {
      const res = await fetch('/api/spotify/control/next');
      const data = await res.json();
      
      if (data && !data.error) {
        // Fetch updated track data
        const trackRes = await fetch('/api/spotify/current');
        const trackData: SpotifyResponse = await trackRes.json();
        
        if (trackData && !trackData.error && trackData.is_playing && 
            trackData.track_name && trackData.duration_ms) {
          setTrack({
            name: trackData.track_name,
            artist: trackData.artist || 'Unknown Artist',
            albumArt: trackData.album_art,
            progress: 0,
            progressMs: 0,
            durationMs: trackData.duration_ms
          });
        }
      }
    } catch (error) {
      console.error('Failed to skip to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      const res = await fetch('/api/spotify/control/previous');
      await res.json();
      // Similar handling as next
    } catch (error) {
      console.error('Failed to go to previous track:', error);
    }
  };

  return (
    <Card title="Spotify">
      <SpotifyContainer>
        <NowPlaying>
          <AlbumArt>
            {track.albumArt ? (
              <img src={track.albumArt} alt="Album Art" />
            ) : (
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#333"/>
                <circle cx="50" cy="50" r="30" fill="#1DB954"/>
                <path d="M40,45 L40,55 L55,50 Z" fill="white"/>
              </svg>
            )}
          </AlbumArt>
          <TrackInfo>
            <TrackName>{track.name}</TrackName>
            <Artist>{track.artist}</Artist>
          </TrackInfo>
        </NowPlaying>
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={`${track.progress}%`} />
          </ProgressBar>
          <Times>
            <span>{formatTime(track.progressMs)}</span>
            <span>{formatTime(track.durationMs)}</span>
          </Times>
        </ProgressContainer>
        <Controls>
          <ControlButton onClick={handlePrevious}>
            <FiSkipBack />
          </ControlButton>
          <ControlButton primary onClick={handlePlayPause}>
            {playing ? <FiPause /> : <FiPlay />}
          </ControlButton>
          <ControlButton onClick={handleNext}>
            <FiSkipForward />
          </ControlButton>
        </Controls>
      </SpotifyContainer>
    </Card>
  );
};

export default SpotifyPlayer;