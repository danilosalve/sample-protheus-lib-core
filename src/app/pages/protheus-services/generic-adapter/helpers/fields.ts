export type FieldAlias = 'SA1' | 'SA2' | 'SA3' | 'SA6';

export const FIELDS: Record<FieldAlias, string> = {
  SA1: 'a1_cod, a1_loja, a1_nreduz, a1_nome',
  SA2: 'a2_cod, a2_loja, a2_nreduz, a2_nome',
  SA3: 'a3_cod, a3_nome, a3_nreduz',
  SA6: 'a6_cod, a6_agencia, a6_numcon, a6_nome, a6_nreduz'
};
