export class HeroNotFoundError extends Error {
  constructor(id: string) {
    super(`Herói com id "${id}" não encontrado`)
    this.name = 'HeroNotFoundError'
  }
}

export class HeroInactiveError extends Error {
  constructor() {
    super('Herói inativo não pode ser editado')
    this.name = 'HeroInactiveError'
  }
}

export class HeroValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HeroValidationError'
  }
}
