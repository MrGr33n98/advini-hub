// pages/VideoConferenceRoom.tsx
import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { VideoConference } from "@/components/VideoConference";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Phone, 
  Volume2, 
  Users, 
  MessageSquare,
  Settings
} from "lucide-react";

export default function VideoConferenceRoom() {
  const { appointmentId } = useParams();
  const [roomId, setRoomId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState(2);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Dr. Carlos Silva', message: 'Bom dia! Tudo bem?', timestamp: '10:00' },
    { id: 2, sender: 'Maria Oliveira', message: 'Bom dia! Tudo ótimo!', timestamp: '10:01' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Generate room ID based on appointment
    setRoomId(`VC-${appointmentId}-${Math.random().toString(36).substr(2, 5)}`);
    
    // Simulate connection
    setIsConnected(true);
    
    // Simulate call timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [appointmentId]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'Você',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Videoconferência</h1>
          <p className="text-gray-600">Consulta #{appointmentId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Conference */}
          <div className="lg:col-span-3">
            <VideoConference 
              appointmentId={appointmentId || ''}
              participantName="Maria Oliveira"
              startTime={new Date().toISOString()}
              endTime={new Date(Date.now() + 60 * 60 * 1000).toISOString()}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Room Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Sala</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ID da Sala:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{roomId}</code>
                      <Button size="sm" variant="outline" onClick={copyRoomId}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duração:</span>
                    <span className="text-sm font-medium">{formatTime(callDuration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Participantes:</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{participants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Conectado" : "Desconectado"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Controles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Config
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Áudio
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle>Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 h-64 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{msg.sender}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm bg-gray-100 p-2 rounded">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-2 border rounded-md text-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button size="sm" onClick={sendMessage}>
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}