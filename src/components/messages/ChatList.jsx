import Card from "../ui/Card.jsx";

export default function ChatList({ threads, activeId, onSelect }) {
  return (
    <Card className="chat-list">
      <span className="card-kicker">Inbox</span>
      <h2 className="card-title">Conversations</h2>
      <div className="chat-thread-list">
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={`chat-thread${thread.id === activeId ? " is-active" : ""}`}
            type="button"
            onClick={() => onSelect(thread.id)}
          >
            <div className="chat-thread__top">
              <strong>{thread.name}</strong>
              <span className="status-pill">{thread.status}</span>
            </div>
            <span>{thread.role}</span>
            <span className="chat-thread__preview">{thread.preview}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
