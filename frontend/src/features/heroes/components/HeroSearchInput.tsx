import { Input } from '../../../shared/ui/Input'

interface HeroSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function HeroSearchInput({ value, onChange }: HeroSearchInputProps) {
  return (
    <Input
      type="search"
      placeholder="Buscar por nome ou nome de guerra..."
      className='w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
      aria-label="Buscar heróis"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
