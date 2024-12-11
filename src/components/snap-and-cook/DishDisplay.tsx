interface DishDisplayProps {
    dish: string | null;
    ingredients: Array<{ name: string; quantity: number }>;
  }
  
  export default function DishDisplay({ dish, ingredients }: DishDisplayProps) {
    return (
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Plat détecté :</h2>
          <p className="text-lg text-gray-500 mt-2">{dish || "Aucun plat détecté"}</p>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Ingrédients détectés :</h2>
          {ingredients.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {ingredients.map((ing, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-lg text-gray-600"
                >
                  <span>{ing.name}</span>
                  <span className="font-medium text-gray-800">{ing.quantity}g</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Aucun ingrédient détecté pour le moment.</p>
          )}
        </div>
      </div>
    );
  }