import { useMemo, useState } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Product } from '../../../types/product';
import type { ProductCategory } from '../constants/categories';

const FUSE_OPTIONS: IFuseOptions<Product> = {
  keys: ['name', 'category'],
  threshold: 0.4,
  ignoreLocation: true,
};

/**
 * Busca fuzzy 100% client-side: o catálogo inteiro já está em memória (poucas
 * centenas de itens), então rodar Fuse.js localmente dá resultado instantâneo
 * a cada tecla, sem round-trip de rede — troque por busca no servidor se o
 * catálogo crescer para milhares de itens.
 */
export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const fuse = useMemo(() => new Fuse(products, FUSE_OPTIONS), [products]);

  const results = useMemo(() => {
    let base = query.trim() ? fuse.search(query.trim()).map((r) => r.item) : products;
    if (category) base = base.filter((p) => p.category === category);
    if (favoritesOnly) base = base.filter((p) => p.isFavorite);
    return base;
  }, [fuse, products, query, category, favoritesOnly]);

  return { query, setQuery, category, setCategory, favoritesOnly, setFavoritesOnly, results };
}
