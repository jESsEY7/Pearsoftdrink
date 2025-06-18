import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: "all", label: "All Products" },
    { id: "energy", label: "Energy Drinks" },
    { id: "soft", label: "Soft Drinks" },
  ];

  return (
    <div className="flex flex-wrap justify-center mb-12 gap-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={
            activeCategory === category.id
              ? "bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-semibold shadow-lg"
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 px-6 py-3 font-semibold transition-all duration-300"
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
