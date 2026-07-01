import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalHeader, ModalActions } from "../../../shared/ui/Modal";
import { Input } from "../../../shared/ui/Input";
import { useCreateHero } from "../hooks/useCreateHero";
import { useUpdateHero } from "../hooks/useUpdateHero";
import { heroFormSchema, type HeroFormValues } from "../services/hero.schema";
import type { Hero } from "../types/hero.types";

interface HeroFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero?: Hero;
}

// O input type="date" espera "YYYY-MM-DD"; o backend devolve "YYYY-MM-DD HH:mm:ss"
function toDateInputValue(dateOfBirth: string): string {
  return dateOfBirth.slice(0, 10);
}

function buildDefaultValues(hero?: Hero): HeroFormValues {
  return {
    name: hero?.name ?? "",
    nickname: hero?.nickname ?? "",
    date_of_birth: hero ? toDateInputValue(hero.date_of_birth) : "",
    universe: hero?.universe ?? "",
    main_power: hero?.main_power ?? "",
    avatar_url: hero?.avatar_url ?? "",
  };
}

export function HeroFormModal({ isOpen, onClose, hero }: HeroFormModalProps) {
  const isEditMode = Boolean(hero);

  // Verifica se o herói é ativo para permitir edição
  const canEdit = !hero || hero.is_active;

  const { isPending: submittingHero, mutate: createHeroMutation } = useCreateHero();
  const { isPending: submittingUpdate, mutate: updateHero } = useUpdateHero();
  const isSubmitting = submittingHero || submittingUpdate;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: buildDefaultValues(hero),
  });

  useEffect(() => {
    if (isOpen) reset(buildDefaultValues(hero));
  }, [isOpen, hero, reset]);

  function onSubmit(values: HeroFormValues) {
    if (isEditMode && hero) {
      updateHero({ id: hero.id, data: values }, { onSuccess: onClose });
      return;
    }

    createHeroMutation(values, { onSuccess: onClose });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={isEditMode ? "Editar herói" : "Criar herói"}
    >
      <ModalHeader
        title={isEditMode ? "Editar herói" : "Criar herói"}
        onClose={onClose}
        closeAriaLabel="Fechar formulário"
      />

      {!canEdit ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">Não é possível editar um herói inativo.</p>
          <ModalActions onClose={onClose} />
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            label="Nome completo"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            id="nickname"
            label="Nome de guerra"
            {...register("nickname")}
            error={errors.nickname?.message}
          />
          <div className='grid grid-cols-2 gap-4'>

          <Input
            id="date_of_birth"
            type="date"
            label="Data de nascimento"
            {...register("date_of_birth")}
            error={errors.date_of_birth?.message}
          />
          <Input
            id="universe"
            label="Universo"
            {...register("universe")}
            error={errors.universe?.message}
          />
          <Input
            id="main_power"
            label="Habilidade"
            {...register("main_power")}
            error={errors.main_power?.message}
          />
          <Input
            id="avatar_url"
            label="Avatar (URL)"
            {...register("avatar_url")}
            error={errors.avatar_url?.message}
          />
          </div>
          
          <ModalActions
            onClose={onClose}
            showSave
            saveLabel={isEditMode ? "Salvar" : "Criar"}
            isSaving={isSubmitting}
          />
        </form>
      )}
    </Modal>
  );
}
