import { useEffect, useRef } from 'react';
import type { Message } from 'types/chat.ts';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message-bubble ${msg.fromMe ? 'outgoing' : 'incoming'}`}>
          {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}