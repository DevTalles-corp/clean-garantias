# Mappers

Aquí `StoreMapper` convierte las filas de SQLite (`StoreRow`) en la entidad `Store` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
