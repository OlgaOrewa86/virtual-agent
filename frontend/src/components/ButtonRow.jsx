// src/components/ButtonRow.jsx
export default function ButtonRow({ buttons, onClick }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 animate-fadeIn">
      {buttons.map((btn, i) => (
        <button
          key={i}
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium 
                     hover:bg-blue-200 transition shadow-sm"
          onClick={() => onClick(btn.value)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
