interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Paginação">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md px-3 py-1.5 text-sm hover:bg-neutral-100 disabled:opacity-40"
      >
        Anterior
      </button>
      <span className="text-sm text-neutral-600">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md px-3 py-1.5 text-sm hover:bg-neutral-100 disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  )
}
