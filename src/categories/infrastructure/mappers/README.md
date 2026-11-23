# Mappers

Aquí `CategoryMapper` convierte las filas de SQLite (`CategoryRow`) en la entidad `Category` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
