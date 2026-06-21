// src/components/ProductCard.jsx
export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm max-w-xs">
      <img
        src={product.image}
        alt={product.title}
        className="w-20 h-20 object-contain"
      />

      <div className="flex flex-col">
        <h4 className="text-sm font-semibold text-gray-900">
          {product.title}
        </h4>

        <p className="text-base font-bold text-green-600 mt-1">
          ${product.price}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {product.category}
        </p>

        {product.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-3">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}
