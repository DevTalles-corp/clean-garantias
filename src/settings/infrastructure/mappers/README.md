# Mappers

Aquí `SettingsMapper` convierte las filas de SQLite (`SettingsRow`) en la entidad `Settings` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
