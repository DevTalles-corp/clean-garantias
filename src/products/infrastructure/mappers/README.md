# Mappers

Aquí `ProductMapper` convierte las filas de SQLite (`ProductRow`) en la entidad `Product` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
