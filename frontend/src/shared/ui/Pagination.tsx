interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Sempre 2 páginas consecutivas visíveis, menor à esquerda e maior à direita
  const firstButton = page >= totalPages ? totalPages - 1 : page; // Botão a esquerda
  const secondButton = firstButton + 1; // Botão a direita

  function renderPageButton(pageNumber: number) {
    const isActive = pageNumber === page;

    return (
      <button
        key={pageNumber}
        type="button"
        disabled={isActive}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => onPageChange(pageNumber)}
        className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold ${
          isActive
            ? 'bg-blue-700 text-white disabled:opacity-100'
            : 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'
        }`}
      >
        {pageNumber}
      </button>
    );
  }

  return (
    <nav className="flex items-center justify-end gap-2 mt-10" aria-label="Paginação">
      {renderPageButton(firstButton)}
      {renderPageButton(secondButton)}
    </nav>
  );
}
