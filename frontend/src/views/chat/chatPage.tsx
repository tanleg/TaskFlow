import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Box, TextField, IconButton, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const ws = import.meta.env.VITE_WS;

const getColorForUser = (name:any) => {
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'teal'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface LocationState {
    projectName?: string;
}

const ChatPage = () => {
  const { projectId } = useParams();
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);
  const [nomUtilisateur, setNomUtilisateur] = useState<string | null>(null);
  const [senderId, setUtilisateurId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation() as unknown as { state?: LocationState };
  const projectName = location.state?.projectName || "Nom inconnu";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const { data } = await axios.get(`${apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNomUtilisateur(`${data.prenom} ${data.nom}`);
        setUtilisateurId(data.id);
      } catch {
        setNomUtilisateur(null);
        setUtilisateurId(null);
      }
    };
    fetchUserProfile();
  }, []);


  useEffect(() => {
    const socketInstance = io(ws);
    setSocket(socketInstance);
    socketInstance.emit('joinProject', projectId);
  
    // Récupérer les messages précédents
    socketInstance.emit('getMessages', projectId);
  
    socketInstance.on('receiveMessages', (existingMessages) => {
      // Trier les messages du plus ancien au plus récent
      const sortedMessages = existingMessages.sort((a: { date_envoi: string }, b: { date_envoi: string }) => 
        new Date(a.date_envoi).getTime() - new Date(b.date_envoi).getTime()
      );
  
      // Récupérer l'ID de l'utilisateur actuel
      const currentUserId = senderId;
      setMessages(sortedMessages.map((msg: any) => ({
        text: msg.texte,
        senderName: `${msg.utilisateur.prenom} ${msg.utilisateur.nom}`,
        timestamp: msg.date_envoi,
        isMine: msg.utilisateur.id === currentUserId,
      })));
    });
  
    socketInstance.on('receiveMessage', (newMessage) => {
      console.log('Nouveau message reçu:', newMessage);
      setMessages((prev: any) => [...prev, { ...newMessage, isMine: newMessage.senderId === senderId }]);
    });
  
    return () => {
      socketInstance.disconnect();
    };
  }, [projectId, senderId]);

  
  // Scrolling vers le bas après la mise à jour des messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!nomUtilisateur || !message.trim() ||!senderId || !socket) return;
    const newMessage = { text: message, senderName: nomUtilisateur,senderId, timestamp: new Date().toISOString(), isMine: true };
    setMessages((prev:any) => [...prev, newMessage]);
    socket.emit('sendMessage', { projectId, message, senderName: nomUtilisateur,senderId });
    setMessage('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F0F2F5', marginLeft: '290px', padding: '20px' }}>
      <Typography variant="h6" sx={{ textAlign: 'center', padding: 2, background: '#007A5E', color: 'white', borderRadius: '8px' }}>
        Chat du projet : {projectName}
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        {messages.map((msg:any, index:any) => (
          <Paper key={index} sx={{ maxWidth: '70%', marginBottom: 1, padding: 1.5, backgroundColor: msg.isMine ? '#DCF8C6' : '#FFF', alignSelf: msg.isMine ? 'flex-end' : 'flex-start', borderRadius: '12px', wordWrap: 'break-word', marginLeft: msg.isMine ? 'auto' : '0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: getColorForUser(msg.senderName) }}>{msg.senderName}</Typography>
            <Typography variant="body1">{msg.text}</Typography>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', marginTop: 0.5, color: 'gray' }}>{new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })}</Typography>
          </Paper>
        ))}
         {/* Référence pour faire défiler vers le bas */}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, background: 'white', borderRadius: '8px' }}>
        <TextField fullWidth variant="outlined" placeholder="Écrire un message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} sx={{ flexGrow: 1 }} />
        <IconButton onClick={sendMessage} color="primary" sx={{ marginLeft: 1 }}><SendIcon /></IconButton>
      </Box>
    </Box>
  );
};

export default ChatPage;