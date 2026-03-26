// components/VideoConference.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  ScreenShare, 
  Users,
  Volume2
} from "lucide-react";

interface VideoConferenceProps {
  appointmentId: string;
  participantName: string;
  startTime: string;
  endTime: string;
}

export function VideoConference({ 
  appointmentId, 
  participantName, 
  startTime, 
  endTime 
}: VideoConferenceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState(2); // Including current user
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor'>('good');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate connection quality
    const qualityInterval = setInterval(() => {
      const qualities: Array<'good' | 'fair' | 'poor'> = ['good', 'fair'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 10000);

    // Start call timer
    intervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(qualityInterval);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = () => {
    setIsSharingScreen(!isSharingScreen);
  };

  const endCall = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // In a real app, this would end the WebRTC connection
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Videoconferência - Consulta #{appointmentId}</CardTitle>
          <Badge variant={connectionQuality === 'good' ? 'default' : connectionQuality === 'fair' ? 'secondary' : 'destructive'}>
            {connectionQuality === 'good' ? 'Boa conexão' : connectionQuality === 'fair' ? 'Conexão moderada' : 'Conexão ruim'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Video Container */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {/* Simulated video feed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-700 rounded-full w-32 h-32 flex items-center justify-center">
                <span className="text-white text-lg">{participantName.split(' ')[0]}</span>
              </div>
            </div>
            
            {/* Participant info */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Você • {isVideoOn ? 'Câmera ligada' : 'Câmera desligada'}
            </div>
            
            {/* Call timer */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {formatTime(callDuration)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isVideoOn ? "default" : "secondary"}
              size="lg"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isAudioOn ? "default" : "secondary"}
              size="lg"
              onClick={toggleAudio}
            >
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isSharingScreen ? "default" : "secondary"}
              size="lg"
              onClick={toggleScreenShare}
            >
              <ScreenShare className="h-5 w-5" />
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
            >
              <Phone className="h-5 w-5" />
            </Button>
          </div>

          {/* Participants and Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{participants} participantes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span>Áudio: {isAudioOn ? 'Ligado' : 'Desligado'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}