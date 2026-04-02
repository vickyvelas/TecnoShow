export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin mb-4" />
      <p className="text-gray-400 text-sm">Cargando productos...</p>
    </div>
  );
}
