# Repositorios

Aquí se define el contrato `WarrantyRepository`: las operaciones para consultar, guardar y borrar las garantías, sin decir cómo se almacenan.

El estado es derivado, así que no se consulta por él: se calcula con `getWarrantyStatus`.

Solo contiene abstracciones; las implementaciones pertenecen a `infrastructure`.
