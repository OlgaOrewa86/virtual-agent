export default function List({ list, onClick }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
      {list.map((item, i) => (
        <button
          key={i}
          onClick={() => onClick(item.value)}
          className="text-left px-3 py-2 bg-white rounded-lg border hover:bg-gray-100 transition"
        >
          <div className="font-medium text-gray-800">{item.title}</div>
        </button>
      ))}
    </div>
  );
}
