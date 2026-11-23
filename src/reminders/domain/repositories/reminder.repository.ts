// Contrato del dominio ReminderRepository: define cómo consultar, guardar y borrar los recordatorios sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.

import type {
  Reminder,
  ReminderStatus,
} from '@/reminders/domain/entities/reminder.entity';

export interface ReminderRepository {
  findById(id: string): Promise<Reminder | undefined>;
  findByWarrantyId(warrantyId: string): Promise<Reminder[]>;
  findByStatus(status: ReminderStatus): Promise<Reminder[]>;
  save(reminder: Reminder): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
