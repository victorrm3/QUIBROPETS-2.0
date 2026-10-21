export type ProductVariant = {
  id: number;
  codigo: string;
  label: string;
  tipo: "talla" | "color" | string | null;
  stock: number;
  precio: number;
  precio_base: number;
  descuento: number;
  imagen: string | null;
  nombre: string;
};

export type Product = {
  id: number;
  codigo: string;
  nombre: string;
  proveedor: string;
  denominacion: string | null;
  stock: number;
  precio: number;
  precio_base: number;
  descuento: number;
  imagen: string | null;
  medidas: string | null;
  grupo?: string | null;
  variante_tipo?: "talla" | "color" | string | null;
  variantes?: ProductVariant[];
  selected_id?: number;
};

export const COLOR_SWATCHES: Record<string, string> = {
  negro: "#111111",
  negra: "#111111",
  gris: "#9ca3af",
  rosa: "#f9a8d4",
  azul: "#3b82f6",
  verde: "#22c55e",
  "verde manzana": "#84cc16",
  manzana: "#84cc16",
  rojo: "#ef4444",
  roja: "#ef4444",
  blanco: "#f5f5f5",
  blanca: "#f5f5f5",
  amarillo: "#eab308",
  amarilla: "#eab308",
  naranja: "#f97316",
  marron: "#92400e",
  marrón: "#92400e",
  beige: "#d6d3d1",
  lila: "#c084fc",
  morado: "#7c3aed",
  morada: "#7c3aed",
  celeste: "#7dd3fc",
  turquesa: "#14b8a6",
  fucsia: "#e879f9",
  crema: "#f5f5dc",
  dorado: "#ca8a04",
  dorada: "#ca8a04",
  plateado: "#a1a1aa",
  plateada: "#a1a1aa",
};

export function swatchForLabel(label: string): string | null {
  const key = label.trim().toLowerCase();
  return COLOR_SWATCHES[key] ?? null;
}

export function productVariants(product: Product): ProductVariant[] {
  if (product.variantes && product.variantes.length > 0) {
    return product.variantes;
  }

  return [
    {
      id: product.id,
      codigo: product.codigo,
      label: product.codigo,
      tipo: product.variante_tipo ?? null,
      stock: product.stock,
      precio: product.precio,
      precio_base: product.precio_base,
      descuento: product.descuento,
      imagen: product.imagen,
      nombre: product.nombre,
    },
  ];
}
