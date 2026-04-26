-- Categorias
INSERT INTO categorias (nombre, descripcion) VALUES
('gorras', 'Gorras de diferentes marcas y estilos'),
('lociones', 'Fragancias y perfumes de diferentes marcas'),
('relojes', 'Relojes casuales y de lujo');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, marca, stock, imagen_url, categoria_id) VALUES
('Gorra Nike Air', 'Gorra deportiva color negro', 45000, 'Nike', 10, null, 1),
('Loción Armani Code', 'Fragancia masculina intensa', 180000, 'Armani', 5, null, 2),
('Reloj Casio Vintage', 'Reloj clásico digital', 120000, 'Casio', 8, null, 3),
('Locion Gucci', '100% original no fake', 1000000, 'Gucci', 10, null, 2),
('Gorra Puma BMW', 'Gorra deportiva Puma edicion BMW', 55000, 'Puma', 4, null, 1);