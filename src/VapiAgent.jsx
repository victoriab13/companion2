import React, { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Paper, Typography, Box, IconButton, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const VapiAgent = () => {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const vapiRef = useRef(null);

  useEffect(() => {
    const vapi = new Vapi(import.meta.env.VITE_VAPI_KEY);
    vapiRef.current = vapi;

    // Agent's speech
    vapi.on("speech", (data) => {
      setMessages((msgs) => [...msgs, { from: "agent", text: data.transcript }]);
    });

    // User's speech (transcription)
    vapi.on("transcript", (data) => {
      setMessages((msgs) => [...msgs, { from: "user", text: data.transcript }]);
    });

    vapi.on("error", (e) => {
      setMessages((msgs) => [...msgs, { from: "agent", text: "Error: " + e.message }]);
    });

    return () => vapi.stop();
  }, []);

  const startConversation = () => {
    vapiRef.current.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
    setMessages((msgs) => [
      ...msgs,
      { from: "agent", text: "How can I help you today?" },
    ]);
    setListening(true);
  };

  const stopConversation = () => {
    vapiRef.current.stop();
    setMessages((msgs) => [
      ...msgs,
      { from: "agent", text: "Conversation stopped." },
    ]);
    setListening(false);
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 420, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        Coaching Assistant
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Gentle, personalized coaching support for growth and self-awareness.
      </Typography>
      <Box sx={{ minHeight: 180, mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: msg.from === "user" ? "right" : "left",
              my: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: msg.from === "user" ? "primary.main" : "grey.200",
                color: msg.from === "user" ? "primary.contrastText" : "text.primary",
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {!listening ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startConversation}
            sx={{ borderRadius: "30px", px: 4 }}
          >
            Start the Conversation
          </Button>
        ) : (
          <IconButton
            color="error"
            onClick={stopConversation}
            size="large"
            sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
          >
            <MicIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: "center" }}>
        {listening ? "Listening..." : "Click to begin"}
      </Typography>
    </Paper>
  );
};

export default VapiAgent;