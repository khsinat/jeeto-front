import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { Clock, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { functions, storage } from '@/lib/appwrite';

interface Game {
  $id: string;
  imageFileId: string;
  answer: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'ended';
  totalBets: number;
  totalAmount: number;
}

const GameStatus: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    fetchCurrentGame();
    const interval = setInterval(fetchCurrentGame, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentGame) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(currentGame.endTime).getTime();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          // Game has ended, refresh
          fetchCurrentGame();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentGame]);

  const fetchCurrentGame = async () => {
    try {
      setIsLoading(true);
      const response = await functions.createExecution('getCurrentGame', '');
      const result = JSON.parse(response.responseBody);

      if (result.success) {
        setCurrentGame(result.data);
      } else {
        setCurrentGame(null);
      }
    } catch (error) {
      console.error('Error fetching current game:', error);
      setCurrentGame(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewGame = async () => {
    try {
      const response = await functions.createExecution('createGame', JSON.stringify({}));
      const result = JSON.parse(response.responseBody);

      if (result.success) {
        toast.success('New game created successfully!');
        fetchCurrentGame();
      } else {
        toast.error(result.error || 'Failed to create new game');
      }
    } catch (error) {
      console.error('Error creating new game:', error);
      toast.error('Failed to create new game');
    }
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getImageUrl = (fileId: string) => {
    return storage.getFileView('images', fileId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentGame) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Status</CardTitle>
          <CardDescription>No active game available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              No games are currently available. Please wait for the admin to upload new images or check back later.
            </p>
          </div>
          <Button 
            onClick={createNewGame} 
            className="mt-4"
            disabled={isLoading}
          >
            Try to Create New Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = ((3 * 60 * 60 * 1000 - timeRemaining) / (3 * 60 * 60 * 1000)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Game</CardTitle>
        <CardDescription>
          Game #{currentGame.$id.slice(-8)} - Active
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
          <img
            src={getImageUrl(currentGame.imageFileId)}
            alt="Current game image"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Time Remaining</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Bets:</span>
            <p className="text-muted-foreground">{currentGame.totalBets}</p>
          </div>
          <div>
            <span className="font-medium">Total Amount:</span>
            <p className="text-muted-foreground">₹{currentGame.totalAmount}</p>
          </div>
          <div>
            <span className="font-medium">Started:</span>
            <p className="text-muted-foreground">
              {new Date(currentGame.startTime).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="font-medium">Ends:</span>
            <p className="text-muted-foreground">
              {new Date(currentGame.endTime).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
          <span className="text-xs text-muted-foreground">
            Game will automatically end in {formatTime(timeRemaining)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStatus; 