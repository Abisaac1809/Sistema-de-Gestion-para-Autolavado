import { Mail } from "lucide-react";

export function EmptyContactState() {
  return(
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Mail className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-700">
      No hay contactos de notificacion configurados.
      </p>
      <p className="mt-1 text-xs text-gray-400">
      Agrega tu primer contacto usando el boton de arriba.
      </p>
    </div>
  );
}