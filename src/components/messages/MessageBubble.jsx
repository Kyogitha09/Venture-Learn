export default function MessageBubble({ message }) {
  return (
    <div className={`message-bubble ${message.sender === "me" ? "is-me" : ""}`}>
      <p>{message.text}</p>
      <span className="message-bubble__time">{message.time}</span>
    </div>
  );
}
