const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatCurrency(value: number | null): string {
  if (value === null) return 'Preço indisponível';
  return formatter.format(value);
}

const UNIT_LABEL: Record<string, string> = { KG: 'kg', Pacote: 'pct', Unidade: 'un' };

export function unitLabel(unit: string | null): string {
  if (!unit) return 'un';
  return UNIT_LABEL[unit] ?? unit;
}
