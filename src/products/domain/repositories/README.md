# Repositorios

Aquí se define el contrato `ProductRepository`: las operaciones para consultar, guardar y borrar los productos, sin decir cómo se almacenan.

`delete` solo borra el producto: la cascada la coordina la capa de aplicación.

Solo contiene abstracciones; las implementaciones pertenecen a `infrastructure`.
