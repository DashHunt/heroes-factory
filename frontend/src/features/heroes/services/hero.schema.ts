import { z } from 'zod'

// Mesmo schema usado no formulário (react-hook-form + zodResolver) e na criação/edição —
// os campos editáveis são os mesmos nos dois casos (ver README: modal de edição mostra
// os mesmos 6 campos do modal de criação).
export const heroFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  nickname: z.string().min(1, 'Nome de guerra é obrigatório'),
  date_of_birth: z.string().min(1, 'Data de nascimento é obrigatória'),
  universe: z.string().min(1, 'Universo é obrigatório'),
  main_power: z.string().min(1, 'Habilidade principal é obrigatória'),
  avatar_url: z.string().url('URL do avatar inválida'),
})

export type HeroFormValues = z.infer<typeof heroFormSchema>
