// Estado de carga del segmento (Historia 5-3 / FR-30): spinner con tokens del DS.
export default function Loading() {
  return (
    <div
      className="mx-auto flex min-h-[60vh] max-w-page items-center justify-center px-6"
      aria-busy="true"
      aria-label="Cargando"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary" />
    </div>
  );
}
