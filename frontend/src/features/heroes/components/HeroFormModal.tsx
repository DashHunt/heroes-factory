import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../shared/ui/Modal'
import { Input } from '../../../shared/ui/Input'
import { Button } from '../../../shared/ui/Button'
import { useCreateHero } from '../hooks/useCreateHero'
import { useUpdateHero } from '../hooks/useUpdateHero'
import { heroFormSchema, type HeroFormValues } from '../services/hero.schema'
import type { Hero } from '../types/hero.types'

interface HeroFormModalProps {
  isOpen: boolean
  onClose: () => void
  hero?: Hero
}

// O input type="date" espera "YYYY-MM-DD"; o backend devolve "YYYY-MM-DD HH:mm:ss"
function toDateInputValue(dateOfBirth: string): string {
  return dateOfBirth.slice(0, 10)
}

function buildDefaultValues(hero?: Hero): HeroFormValues {
  return {
    name: hero?.name ?? '',
    nickname: hero?.nickname ?? '',
    date_of_birth: hero ? toDateInputValue(hero.date_of_birth) : '',
    universe: hero?.universe ?? '',
    main_power: hero?.main_power ?? '',
    avatar_url: hero?.avatar_url ?? '',
  }
}

export function HeroFormModal({ isOpen, onClose, hero }: HeroFormModalProps) {
  const isEditMode = Boolean(hero)
  // Defesa em profundidade: o menu de ações já esconde "Editar" pra herói inativo,
  // mas o modal também bloqueia — mesma regra de negócio do backend (HeroInactiveError).
  const canEdit = !hero || hero.is_active

  const createHero = useCreateHero()
  const updateHero = useUpdateHero()
  const isSubmitting = createHero.isPending || updateHero.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: buildDefaultValues(hero),
  })

  useEffect(() => {
    if (isOpen) reset(buildDefaultValues(hero))
  }, [isOpen, hero, reset])

  function onSubmit(values: HeroFormValues) {
    if (isEditMode && hero) {
      updateHero.mutate({ id: hero.id, data: values }, { onSuccess: onClose })
      return
    }

    createHero.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={isEditMode ? 'Editar herói' : 'Criar herói'}>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        {isEditMode ? 'Editar herói' : 'Criar herói'}
      </h2>

      {!canEdit ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">Não é possível editar um herói inativo.</p>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input id="name" label="Nome completo" {...register('name')} error={errors.name?.message} />
          <Input
            id="nickname"
            label="Nome de guerra"
            {...register('nickname')}
            error={errors.nickname?.message}
          />
          <Input
            id="date_of_birth"
            type="date"
            label="Data de nascimento"
            {...register('date_of_birth')}
            error={errors.date_of_birth?.message}
          />
          <Input id="universe" label="Universo" {...register('universe')} error={errors.universe?.message} />
          <Input
            id="main_power"
            label="Habilidade"
            {...register('main_power')}
            error={errors.main_power?.message}
          />
          <Input
            id="avatar_url"
            label="Avatar (URL)"
            {...register('avatar_url')}
            error={errors.avatar_url?.message}
          />

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditMode ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
