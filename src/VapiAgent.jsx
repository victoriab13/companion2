import React, { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Paper, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { keyframes } from "@mui/system";

const listeningPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
`;

const VapiAgent = () => {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const vapiRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const vapi = new Vapi(import.meta.env.VITE_VAPI_KEY);
    vapiRef.current = vapi;

    vapi.on("speech", (data) => {
      setTyping(false);
      setWaiting(false);
      setMessages((msgs) => [...msgs, { from: "agent", text: data.transcript }]);
    });

    vapi.on("transcript", (data) => {
      setMessages((msgs) => [...msgs, { from: "user", text: data.transcript }]);
      setTyping(true);
      setWaiting(true);
    });

    vapi.on("error", (e) => {
      setTyping(false);
      setWaiting(false);
      setMessages((msgs) => [...msgs, { from: "agent", text: "Error: " + e.message }]);
    });

    return () => vapi.stop();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, waiting]);

  const startConversation = () => {
    vapiRef.current.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
    setMessages((msgs) => [
      ...msgs,
      { from: "agent", text: "How can I help you today?" },
    ]);
    setListening(true);
    setWaiting(false);
  };

  const stopConversation = () => {
    vapiRef.current.stop();
    setMessages((msgs) => [
      ...msgs,
      { from: "agent", text: "Conversation stopped." },
    ]);
    setListening(false);
    setTyping(false);
    setWaiting(false);
  };

  return (
    <Paper elevation={3} sx={{
      maxWidth: 500,
      mx: "auto",
      mt: 4,
      p: 0,
      display: "flex",
      flexDirection: "column",
      height: 600,
      borderRadius: 4,
      overflow: "hidden"
    }}>
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Coaching Assistant
        </Typography>
        <Typography variant="subtitle2" sx={{ textAlign: "center", opacity: 0.8 }}>
          Gentle, personalized coaching support for growth and self-awareness.
        </Typography>
      </Box>
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: "#f7f7f8",
        px: 2,
        py: 2,
        display: "flex",
        flexDirection: "column"
      }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "75%",
                bgcolor: msg.from === "user" ? "primary.main" : "grey.200",
                color: msg.from === "user" ? "primary.contrastText" : "text.primary",
                boxShadow: 1,
                fontSize: 16,
                animation: `${fadeIn} 0.3s`,
                wordBreak: "break-word"
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
        {waiting && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="caption" sx={{ ml: 1 }}>Thinking...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{
        p: 2,
        borderTop: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fafbfc"
      }}>
        {!listening ? (
          <IconButton
            color="primary"
            onClick={startConversation}
            sx={{
              borderRadius: "50%",
              bgcolor: "primary.light",
              width: 64,
              height: 64,
              fontSize: 40
            }}
          >
            <MicIcon sx={{ fontSize: 40 }} />
          </IconButton>
        ) : (
          <IconButton
            color="error"
            onClick={stopConversation}
            sx={{
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "white",
              width: 64,
              height: 64,
              animation: `${listeningPulse} 1.2s infinite`,
              fontSize: 40
            }}
          >
            <StopIcon sx={{ fontSize: 40 }} />
          </IconButton>
        )}
      </Box>
      {listening && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Typography variant="caption" sx={{ color: "primary.main", fontWeight: "bold" }}>
            Listening...
          </Typography>
        </Box>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </Paper>
  );
};

export default VapiAgent;