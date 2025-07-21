import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="w-full py-4 px-6 mt-auto"
      style={{ backgroundColor: "#146534" }}
    >
      <div className="flex items-center text-white text-sm italic md:ml-5">
        <span>Desarrollado con amor por Cristian Risueño para Shakers</span>
        <Heart className="ml-2 h-4 w-4 fill-current" />
      </div>
    </footer>
  );
}
