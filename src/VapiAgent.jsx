// ...inside your component...
const [waiting, setWaiting] = useState(false);

// ...in useEffect...
vapi.on("transcript", (data) => {
  setMessages((msgs) => [...msgs, { from: "user", text: data.transcript }]);
  setTyping(true);
  setWaiting(true);
});
vapi.on("speech", (data) => {
  setTyping(false);
  setWaiting(false);
  setMessages((msgs) => [...msgs, { from: "agent", text: data.transcript }]);
});

// ...in your JSX, before messagesEndRef...
{waiting && (
  <Box sx={{ textAlign: "center", my: 2 }}>
    <CircularProgress size={24} />
    <Typography variant="caption" sx={{ ml: 1 }}>Thinking...</Typography>
  </Box>
)}