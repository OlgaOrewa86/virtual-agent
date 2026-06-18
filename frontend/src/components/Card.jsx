// src/components/Card.jsx
export default function Card({ card, onClick }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm max-w-[75%] animate-fadeIn">

      {/* Title */}
      {card.title && (
        <h3 className="font-semibold text-gray-800 mb-2">
          {card.title}
        </h3>
      )}

      {/* Answer / message */}
      {card.answer && (
        <p className="text-gray-700 text-sm mb-3">
          {card.answer}
        </p>
      )}

      {card.message && (
        <p className="text-gray-700 text-sm mb-3">
          {card.message}
        </p>
      )}

      {/* Status (order tracking) */}
      {card.status && (
        <p className="text-blue-600 font-medium text-sm mb-3">
          Status: {card.status}
        </p>
      )}

      {/* Link */}
      {card.link && (
        <a
          href={card.link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline text-sm mb-3 block"
        >
          View details
        </a>
      )}

      {/* Generic list items (Help card, menu card, etc.) */}
      {card.items && card.items.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {card.items.map((item, i) => (
            <button
              key={i}
              onClick={() => onClick(item.value)}
              className="text-left px-3 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
            >
              <span className="text-gray-800 text-sm font-medium">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Related FAQs */}
      {card.related && card.related.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Related questions:</p>

          <ul className="flex flex-col gap-1">
            {card.related.map((item, i) => (
              <li
                key={i}
                className="text-blue-600 text-sm underline cursor-pointer hover:text-blue-800 transition"
                onClick={() => onClick(item.value)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
