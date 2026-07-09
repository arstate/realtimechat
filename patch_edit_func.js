const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const editFuncs = `
  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingMessageContent(msg.message);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingMessageContent('');
  };

  const handleSaveEdit = async (msgId: string) => {
    const trimmed = editingMessageContent.trim();
    if (!trimmed) return;
    if (trimmed.length > 1000) {
      alert("Pesan terlalu panjang (maksimum 1000 karakter)");
      return;
    }

    try {
      const filteredMsg = isFilterEnabled ? filterChatMessage(trimmed) : trimmed;
      await update(ref(db, \`global_messages/\${msgId}\`), {
        message: filteredMsg,
        isEdited: true
      });
      setEditingMessageId(null);
      setEditingMessageContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'global_messages');
    }
  };
`;

code = code.replace(
  "  const handleSendMessage = async (e: React.FormEvent) => {",
  editFuncs + "\n  const handleSendMessage = async (e: React.FormEvent) => {"
);

fs.writeFileSync('app/chat-app.tsx', code);
