import { z } from 'zod'

// Schema de validação do formulário de herói
export const heroFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  nickname: z.string().min(1, 'Nome de guerra é obrigatório'),
  date_of_birth: z.string().min(1, 'Data de nascimento é obrigatória'),
  universe: z.string().min(1, 'Universo é obrigatório'),
  main_power: z.string().min(1, 'Habilidade principal é obrigatória'),
  avatar_url: z.string().url('URL do avatar inválida'),
})

export type HeroFormValues = z.infer<typeof heroFormSchema>
