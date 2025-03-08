import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Eye, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import CountdownTimer from '@/components/CountdownTimer';
import Navbar from '@/components/Navbar';
import FloatingGradients from '@/components/FloatingGradients';
import { v4 as uuidv4 } from 'uuid'; // Generates unique user IDs

const API_URL = 'http://localhost:3000/secret';

const View = () => {
  const { id } = useParams<{ id: string }>(); // `id` is `share_url`
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if userId exists in localStorage, else create one
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = uuidv4(); // Generate a unique userId
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);

    if (!id) {
      setError('Invalid message link');
      setIsLoading(false);
      return;
    }

    // Fetch the secret message from the API
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}/${storedUserId}`);
        if (!response.ok) throw new Error('Message not found or expired');

        const data = await response.json();
        console.log(data)
        setMessage(data.message);
      } catch (err) {
        console.error('Error fetching message:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const renderMessageState = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary/50" />
          </div>
          <p className="text-muted-foreground">Retrieving your secret message...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Message Not Available</h2>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
            Return Home
          </Button>
        </div>
      );
    }

    if (message) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-primary/10 rounded-full py-2 px-4 inline-flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Message revealed</span>
          </div>

          <div className="glass-card rounded-xl p-6 border-white/20 dark:border-gray-800/30">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>

          <div className="text-center space-y-2 mt-8">
            <p className="text-muted-foreground text-sm">
              You won't be able to view this message again.
            </p>
            <Button onClick={() => navigate('/create')} variant="outline" className="mt-4">
              Create Your Own Secret Message
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <FloatingGradients />
      <Navbar />
      <main className="container px-4 mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-8 -ml-2 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>

        <div className="py-8 flex flex-col items-center justify-center min-h-[50vh]">
          {renderMessageState()}
        </div>
      </main>
    </div>
  );
};

export default View;
