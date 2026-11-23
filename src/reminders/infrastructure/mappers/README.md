# Mappers

Aquí `ReminderMapper` convierte las filas de SQLite (`ReminderRow`) en la entidad `Reminder` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
