import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Switch } from "../../../shared/ui/Switch";
import type { Hero } from "../types/hero.types";
import { useHeroActions } from "../context/HeroActionsContext";

interface HeroActionsMenuProps {
  hero: Hero;
  isActive: boolean;
}

// Ativar substitui Excluir/Editar do menu de tres pontinhos quando o herói está inativo
export function HeroActionsMenu({ hero, isActive }: HeroActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // funções de abrir modal Editar/Excluir/Ativar vêm do Context
  const { openEdit, openDelete, openActivate } = useHeroActions();

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="absolute right-0 top-1">
      <button
        type="button"
        aria-label="Ações"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((current) => !current);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-200"
      >
        <MoreVertical size={22} />
      </button>

      {isOpen && (
        <div
          role="menu"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-0 top-10 z-10 flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg"
        >
          {isActive ? (
            <>
              <button
                type="button"
                aria-label="Excluir"
                onClick={() => {
                  openDelete(hero);
                  setIsOpen(false);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
              <button
                type="button"
                aria-label="Editar"
                onClick={() => {
                  openEdit(hero);
                  setIsOpen(false);
                }}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Pencil size={20} />
              </button>
              <Switch
                checked={true}
                label="Desativar héroi"
                onChange={() => {
                  openDelete(hero);
                  setIsOpen(false);
                }}
              />
            </>
          ) : (
            <Switch
              checked={false}
              label="Ativar herói"
              onChange={() => {
                openActivate(hero);
                setIsOpen(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
