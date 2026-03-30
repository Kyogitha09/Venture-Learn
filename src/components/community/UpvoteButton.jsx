export default function UpvoteButton({ count, active, onClick }) {
  return (
    <button
      className={`button ${active ? "button--primary" : "button--ghost"} feed-card__action`}
      type="button"
      onClick={onClick}
    >
      {active ? "Liked" : "Like"} {count}
    </button>
  );
}
