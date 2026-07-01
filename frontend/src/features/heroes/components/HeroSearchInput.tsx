import { Search } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'

interface HeroSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch?: () => void
}

export function HeroSearchInput({ value, onChange, onSearch }: HeroSearchInputProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite o nome do herói"
          aria-label="Buscar heróis"
          className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <Button type="button" variant="white" onClick={onSearch}>
        Buscar
      </Button>
    </div>
  )
}
