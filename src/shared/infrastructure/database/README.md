# Base de datos

Aquí se abre la base de datos SQLite (`openSqliteDatabase`), se aplican sus migraciones y se comparte la operación de guardar filas (`upsertRow`).

Las migraciones son una lista ordenada: una publicada no se edita, se agrega otra al final.

Las llaves foráneas no borran en cascada: protegen contra filas huérfanas. La capa de aplicación debe guardar primero el padre y borrar primero los hijos. Los adjuntos no tienen llave foránea porque su dueño puede ser de tres tipos.
