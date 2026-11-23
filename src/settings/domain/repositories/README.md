# Repositorios

Aquí se define el contrato `SettingsRepository`: las operaciones para consultar y guardar la configuración, sin decir cómo se almacenan.

La configuración es única: no tiene id, no se lista ni se borra.

Solo contiene abstracciones; las implementaciones pertenecen a `infrastructure`.
