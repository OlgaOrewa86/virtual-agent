// src/components/MessageBubble.jsx
export default function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`group flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      
      {/* Bubble */}
      <div
        className={`px-4 py-2 rounded-2xl shadow-sm max-w-[75%] text-sm leading-relaxed animate-slideUp
          ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
      >
        {msg.text}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-gray-400 mt-1 opacity-80">
        {msg.time}
      </span>
    </div>
  );
}
