interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Sempre 2 páginas consecutivas visíveis, menor à esquerda e maior à direita —
  // a posição dos botões nunca muda, só a janela desliza conforme a página atual.
  const firsButton = page >= totalPages ? totalPages - 1 : page;
  const secondButton = firsButton + 1;

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
    <nav className="flex items-center justify-center gap-2" aria-label="Paginação">
      {renderPageButton(firsButton)}
      {renderPageButton(secondButton)}
    </nav>
  );
}
