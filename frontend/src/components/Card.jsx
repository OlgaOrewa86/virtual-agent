// src/components/Card.jsx
export default function Card({ card, onClick }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm max-w-[75%] animate-fadeIn">
      
      {/* Title */}
      {card.title && (
        <h3 className="font-semibold text-gray-800 mb-1">
          {card.title}
        </h3>
      )}

      {/* Answer / message */}
      {card.answer && (
        <p className="text-gray-700 text-sm mb-2">
          {card.answer}
        </p>
      )}

      {card.message && (
        <p className="text-gray-700 text-sm mb-2">
          {card.message}
        </p>
      )}

      {/* Status (for order cards) */}
      {card.status && (
        <p className="text-blue-600 font-medium text-sm mb-2">
          Status: {card.status}
        </p>
      )}

      {/* Link */}
      {card.link && (
        <a
          href={card.link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View details
        </a>
      )}

      {/* Related FAQs */}
      {card.related && card.related.length > 0 && (
        <div className="mt-3">
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
