import { useState } from "react";
import { PageContainer } from "../../shared/layouts/PageContainer";
import { Button } from "../../shared/ui/Button";
import { Spinner } from "../../shared/ui/Spinner";
import { EmptyState } from "../../shared/ui/EmptyState";
import { Pagination } from "../../shared/ui/Pagination";
import { useDebounce } from "../../shared/hooks/useDebounce";
import {
  useHeroes,
  HeroList,
  HeroSearchInput,
  HeroFormModal,
  HeroDetailModal,
  HeroConfirmationModal,
  HeroActionsContext,
} from "../../features/heroes";
import type { Hero, HeroConfirmationAction } from "../../features/heroes";

// Excluir e ativar usam o mesmo HeroConfirmationModal (só muda a "action"),
// então guardam um estado só em vez de um par isOpen/hero pra cada um.
interface PendingLifecycleAction {
  type: HeroConfirmationAction;
  hero: Hero;
}

export function HeroesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  // Estado para abrir modal de edição de hérois
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [heroBeingEdited, setHeroBeingEdited] = useState<Hero | undefined>(undefined);

  // Estado para abrir modal de detalhes do herói
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [heroBeingViewed, setHeroBeingViewed] = useState<Hero | undefined>(undefined);

  // Estado para confirmar exclusão (soft delete) ou ativação do herói
  const [pendingAction, setPendingAction] = useState<PendingLifecycleAction | null>(null);

  const { data, isPending, isError } = useHeroes({ page, search: debouncedSearch || undefined });

  function openCreateForm() {
    setHeroBeingEdited(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(hero: Hero) {
    setHeroBeingEdited(hero);
    setIsFormOpen(true);
  }

  function openDetail(hero: Hero) {
    setHeroBeingViewed(hero);
    setIsDetailOpen(true);
  }

  function openDelete(hero: Hero) {
    setPendingAction({ type: "delete", hero });
  }

  function openActivate(hero: Hero) {
    setPendingAction({ type: "activate", hero });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="order-2 sm:order-1">
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto"
            onClick={openCreateForm}
          >
            Criar
          </Button>
        </div>
        <div className="order-1 sm:order-2 sm:flex-1">
          <HeroSearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onSearch={() => setPage(1)}
          />
        </div>
      </div>

      {isPending && (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      )}

      {isError && (
        <EmptyState
          title="Não foi possível carregar os heróis"
          description="Tente novamente em instantes."
        />
      )}

      {!isPending && !isError && data && data.data.length === 0 && (
        <EmptyState title="Nenhum herói encontrado" description="Tente ajustar sua busca." />
      )}

      {!isPending && !isError && data && data.data.length > 0 && (
        <>
          {/* Context para remover prop drilling de Editar/Excluir/Ativar por HeroList/HeroCard */}
          <HeroActionsContext.Provider value={{ openEdit: openEditForm, openDelete, openActivate }}>
            <HeroList heroes={data.data} onSelectHero={openDetail} />
          </HeroActionsContext.Provider>
          <div className="mt-6">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      <HeroFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        hero={heroBeingEdited}
      />

      <HeroDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        hero={heroBeingViewed}
      />

      <HeroConfirmationModal
        isOpen={pendingAction !== null}
        action={pendingAction?.type ?? "delete"}
        hero={pendingAction?.hero}
        onClose={() => setPendingAction(null)}
      />
    </PageContainer>
  );
}
