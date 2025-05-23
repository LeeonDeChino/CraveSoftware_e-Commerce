
# Modelo Entidad-Relación — CraveSoftware Merch Store

##  Entidades y Atributos

### **Producto**
- `ID_Producto` (PK)
- `Nombre`
- `Descripción`
- `Precio`
- `Stock`
- `Categoría`
- `Variante`

---

### **Cliente**
- `ID_Cliente` (PK)
- `Nombre`
- `Correo`
- `Teléfono`
- `Dirección`

---

### **Pedido**
- `ID_Pedido` (PK)
- `Fecha`
- `Total`
- `Estado`
- `ID_Cliente` (FK)

---

### **DetallePedido**
*(Relaciona Productos con Pedidos)*
- `ID_Detalle` (PK)
- `ID_Pedido` (FK)
- `ID_Producto` (FK)
- `Cantidad`
- `PrecioUnitario`
- `VarianteSeleccionada`

---

### **MétodoPago**
- `ID_MetodoPago` (PK)
- `Tipo` (Ej: Tarjeta, PayPal)
- `Detalles`

---

### **Pago**
- `ID_Pago` (PK)
- `ID_Pedido` (FK)
- `ID_MetodoPago` (FK)
- `FechaPago`
- `Monto`
- `EstadoPago`

---

##  Relaciones

- Un **Cliente** puede hacer **muchos Pedidos**
- Un **Pedido** pertenece a **un Cliente**
- Un **Pedido** puede tener **muchos DetallePedido**
- Un **DetallePedido** está asociado a **un Producto**
- Un **Pedido** puede tener **un Pago**
- Un **Pago** utiliza **un MétodoPago**

---

## Diagrama Relacional 

![DiagramaER](/docs/practica-11/assets/DiagramaER.png)

---

## Reglas de Negocio

### Producto
- No puede existir un producto sin un nombre, precio y stock definidos.

- El precio debe ser un número mayor a cero.

- El stock no puede ser negativo.

- Cada producto puede pertenecer a una sola categoría.

- La combinación de nombre y variante debe ser única para evitar duplicados.

### Cliente
- El correo electrónico debe tener un formato válido y debe ser único en la base de datos.

- El número de teléfono debe contener solo caracteres numéricos y tener al menos 10 dígitos.

- La dirección es obligatoria para realizar pedidos.

### Pedido
- Un pedido solo puede crearse si hay al menos un producto agregado a su detalle.

- El estado de un pedido debe pertenecer a un conjunto definido: Pendiente, Enviado, Entregado, Cancelado.

- El total del pedido debe ser igual a la suma del precio por cantidad de cada producto del detalle.

- Un pedido no puede cambiar de cliente una vez creado.

### DetallePedido
- La cantidad debe ser mayor a cero.

- El precio unitario debe coincidir con el del producto al momento del pedido.

- No puede existir más de un registro con el mismo ID_Pedido + ID_Producto (clave compuesta lógica).

- Si un producto no tiene variantes, el campo VarianteSeleccionada debe quedar vacío o nulo.

### MétodoPago
- El tipo de método debe ser uno de los aceptados: Tarjeta, PayPal, Transferencia.

- Los detalles del método de pago deben ser opcionales, pero si se especifican, deben seguir el formato correspondiente.

### Pago
- No puede existir más de un pago por pedido.

- El monto del pago debe ser igual al total del pedido.

- El estado del pago debe ser uno de los siguientes: Completado, Pendiente, Fallido.

- La fecha de pago no puede ser anterior a la fecha del pedido.

---

## Database - Schema Visualizer

![DiagramaER](/docs/practica-11/assets/SchemaVisualizer.png)

---