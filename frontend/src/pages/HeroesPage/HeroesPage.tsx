import { useState } from 'react'
import { PageContainer } from '../../shared/layouts/PageContainer'
import { Button } from '../../shared/ui/Button'
import { Spinner } from '../../shared/ui/Spinner'
import { EmptyState } from '../../shared/ui/EmptyState'
import { Pagination } from '../../shared/ui/Pagination'
import { useDebounce } from '../../shared/hooks/useDebounce'
import { useHeroes, HeroList, HeroSearchInput, HeroFormModal } from '../../features/heroes'
import type { Hero } from '../../features/heroes'

export function HeroesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [heroBeingEdited, setHeroBeingEdited] = useState<Hero | undefined>(undefined)

  const { data, isPending, isError } = useHeroes({ page, search: debouncedSearch || undefined })

  function openCreateForm() {
    setHeroBeingEdited(undefined)
    setIsFormOpen(true)
  }

  function openEditForm(hero: Hero) {
    setHeroBeingEdited(hero)
    setIsFormOpen(true)
  }

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="order-2 sm:order-1">
          <Button type="button" variant="primary" className="w-full sm:w-auto" onClick={openCreateForm}>
            Criar
          </Button>
        </div>
        <div className="order-1 sm:order-2 sm:flex-1">
          <HeroSearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
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
          <HeroList heroes={data.data} onEditHero={openEditForm} />
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
    </PageContainer>
  )
}
