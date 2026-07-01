import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

export const heroesPageRoute: RouteObject = {
  path: '/',
  Component: lazy(() => import('./HeroesPage').then((module) => ({ default: module.HeroesPage }))),
}
