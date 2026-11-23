# Mappers

Aquí `ClaimMapper` convierte las filas de SQLite (`ClaimRow`) en la entidad `Claim` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
