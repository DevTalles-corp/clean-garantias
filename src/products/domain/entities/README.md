# Entidades

Aquí se define el producto (`Product`), raíz de agregado: categoría obligatoria, tienda opcional y precio no negativo en centavos.

Borrar un producto borra en cascada sus garantías, recordatorios, reclamos y adjuntos; esa coordinación corresponde a la capa de aplicación.

Existe para que esas garantías vivan en un solo lugar.
