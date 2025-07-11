import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Clock } from 'lucide-react';

type Player = {
  id: number;
  playerName: string;
  score: number;
  country: string;
  lastPlayed: string;
};

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [previousRankings, setPreviousRankings] = useState<Record<number, number>>({});

  // Simulate real-time data updates
  const generateRandomScore = () => Math.floor(Math.random() * 10000) + 1000;
  
  const initialData = [
    { id: 1, playerName: 'AlexGamer', score: 8540, country: 'US', lastPlayed: '2 min ago' },
    { id: 2, playerName: 'ProPlayer99', score: 7890, country: 'UK', lastPlayed: '5 min ago' },
    { id: 3, playerName: 'NinjaKid', score: 7234, country: 'CA', lastPlayed: '1 min ago' },
    { id: 4, playerName: 'GameMaster', score: 6890, country: 'DE', lastPlayed: '3 min ago' },
    { id: 5, playerName: 'PixelHero', score: 6234, country: 'FR', lastPlayed: '7 min ago' },
    { id: 6, playerName: 'CyberNinja', score: 5890, country: 'JP', lastPlayed: '4 min ago' },
    { id: 7, playerName: 'RetroGamer', score: 5456, country: 'AU', lastPlayed: '6 min ago' },
    { id: 8, playerName: 'SpeedRunner', score: 5123, country: 'BR', lastPlayed: '8 min ago' },
  ];

  useEffect(() => {
    setLeaderboard(initialData);
    
    // Store initial rankings
    const initialRankings:Record<number,number> = {};
    initialData.forEach((player, index) => {
      initialRankings[player.id] = index + 1;
    });
    setPreviousRankings(initialRankings);
  }, []);

  // Simulate frequent updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        setLeaderboard(prev => {
          const newData = [...prev];
          
          // Store current rankings before update
          const currentRankings:Record<number,number> = {};
          newData.forEach((player, index) => {
            currentRankings[player.id] = index + 1;
          });
          
          // Randomly update 1-3 players
          const playersToUpdate = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < playersToUpdate; i++) {
            const randomIndex = Math.floor(Math.random() * newData.length);
            const scoreChange = Math.floor(Math.random() * 1000) - 500;
            newData[randomIndex] = {
              ...newData[randomIndex],
              score: Math.max(0, newData[randomIndex].score + scoreChange),
              lastPlayed: 'Just now'
            };
          }
          
          // Sort by score and update rankings
          const sortedData = [...newData].sort((a, b) => b.score - a.score);
          
          // Update previous rankings for trend indicators
          setPreviousRankings(currentRankings);
          
          return sortedData;
        });
        
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 500);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankTrend = (playerId: number, currentRank: number) => {
    const previousRank = previousRankings[playerId];
    if (!previousRank || previousRank === currentRank) return null;
    
    if (previousRank > currentRank) {
      return <TrendingUp className="w-4 h-4 text-green-500 ml-2" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-500 ml-2" />;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'CA': '🇨🇦',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'JP': '🇯🇵',
      'AU': '🇦🇺',
      'BR': '🇧🇷'
    };
    return flags[country as keyof typeof flags] || '🌍';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Live Leaderboard
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
            {isLoading && <Badge variant="secondary" className="ml-2">Updating...</Badge>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Last Played</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((player, index) => {
                  const rank = index + 1;
                  return (
                    <TableRow 
                      key={player.id} 
                      className={`transition-all duration-500 ${
                        player.lastPlayed === 'Just now' ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getRankIcon(rank)}
                          {getRankTrend(player.id, rank)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {player.playerName}
                          {player.lastPlayed === 'Just now' && (
                            <Badge variant="secondary" className="text-xs">
                              Updated
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCountryFlag(player.country)}</span>
                          <span className="text-sm text-gray-600">{player.country}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {player.score.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {player.lastPlayed}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.length > 0 ? leaderboard[0].score.toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.filter(p => p.lastPlayed === 'Just now').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardTable;