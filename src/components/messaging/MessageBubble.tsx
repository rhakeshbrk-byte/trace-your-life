import { Message } from "@/data/messaging";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isUser
            ? "bg-primary/20 border border-primary/30 rounded-br-md"
            : "bg-muted/60 border border-border/50 rounded-bl-md"
        }`}
      >
        <p className="text-sm font-body text-foreground">{message.content}</p>
        <p
          className={`text-[10px] mt-1 font-heading ${
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
