// src/components/TypingIndicator.jsx
export default function TypingIndicator() {
  return (
    <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-600 self-start shadow-sm animate-fadeIn">
      <span className="inline-flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
      </span>
    </div>
  );
}
