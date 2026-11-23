// Contrato del dominio IdGenerator: genera identificadores UUID sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a una librería de ids.

export interface IdGenerator {
  generate(): string;
}
