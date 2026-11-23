# Mappers

Aquí `WarrantyMapper` convierte las filas de SQLite (`WarrantyRow`) en la entidad `Warranty` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
