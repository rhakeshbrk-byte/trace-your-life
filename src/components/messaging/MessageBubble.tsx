import { Message } from "@/data/messaging";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} message-bubble-enter`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 transition-all duration-300 ${
          isUser
            ? "rounded-2xl rounded-br-md text-foreground"
            : "glass-card rounded-2xl rounded-bl-md"
        }`}
        style={isUser ? {
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.2))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)',
        } : undefined}
      >
        <p className="text-sm text-foreground">{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isUser ? "text-primary/60 text-right" : "text-muted-foreground"
          }`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
