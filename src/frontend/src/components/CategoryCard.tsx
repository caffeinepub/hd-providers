import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  image: string;
  color: string;
  onClick: () => void;
}

export default function CategoryCard({ name, icon: Icon, image, color, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-xl border-2 border-gray-200 hover:border-green-600 transition-all overflow-hidden shadow-sm hover:shadow-md"
    >
      <div className={`${color} p-6 flex justify-center items-center h-48`}>
        <img src={image} alt={name} className="w-32 h-32 object-cover rounded-lg" />
      </div>
      <div className="p-4 flex items-center justify-center gap-2">
        <Icon className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-gray-900 text-lg">{name}</span>
      </div>
    </button>
  );
}
