# Mappers

Aquí `AttachmentMapper` convierte las filas de SQLite (`AttachmentRow`) en la entidad `Attachment` (`toDomain`) y viceversa (`toRow`).

Existe para que la forma de la tabla no se filtre al dominio. No contiene reglas de negocio.
