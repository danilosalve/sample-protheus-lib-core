import { PoTableColumn } from '@po-ui/ng-components';
import { FieldAlias } from './fields';

const COLUMNS_SA1: PoTableColumn[] = [
  {
    label: 'Código',
    property: 'a1_cod',
    type: 'string',
  },
  {
    label: 'Loja',
    property: 'a1_loja',
    type: 'string',
  },
  {
    label: 'Razão Social',
    property: 'a1_nome',
    type: 'string',
  },
  {
    label: 'Nome Fantasia',
    property: 'a1_nreduz',
    type: 'string',
  },
];

const COLUMNS_SA2: PoTableColumn[] = [
  {
    label: 'Código',
    property: 'a2_cod',
    type: 'string',
  },
  {
    label: 'Loja',
    property: 'a2_loja',
    type: 'string',
  },
  {
    label: 'Razão Social',
    property: 'a2_nome',
    type: 'string',
  },
  {
    label: 'Nome Fantasia',
    property: 'a2_nreduz',
    type: 'string',
  },
];

const COLUMNS_SA3: PoTableColumn[] = [
  {
    label: 'Código',
    property: 'a3_cod',
    type: 'string',
  },
  {
    label: 'Razão Social',
    property: 'a3_nome',
    type: 'string',
  },
  {
    label: 'Nome Fantasia',
    property: 'a3_nreduz',
    type: 'string',
  },
];

const COLUMNS_SA6: PoTableColumn[] = [
  {
    label: 'Código',
    property: 'a6_cod',
    type: 'string',
  },
  {
    label: 'Nro Agencia ',
    property: 'a6_agencia',
    type: 'string',
  },
  {
    label: 'Nro Conta',
    property: 'a6_numcon',
    type: 'string',
  },
  {
    label: 'Razão Social',
    property: 'a6_nome',
    type: 'string',
  },
  {
    label: 'Nome Fantasia',
    property: 'a6_nreduz',
    type: 'string',
  },
];

export const COLUMNS: Record<FieldAlias, PoTableColumn[]> = {
  SA1: COLUMNS_SA1,
  SA2: COLUMNS_SA2,
  SA3: COLUMNS_SA3,
  SA6: COLUMNS_SA6,
};

export const COLUMNS_QUERY: PoTableColumn[] = [
  {
    label: 'Filial',
    property: 'c5_filial',
    type: 'string',
  },
  {
    label: 'Núm. Pedido',
    property: 'c5_num',
    type: 'string',
  },
  {
    label: 'Código',
    property: 'a1_cod',
    type: 'string',
  },
  {
    label: 'Loja',
    property: 'a1_loja',
    type: 'string',
  },
  {
    label: 'Razão Social',
    property: 'a1_nome',
    type: 'string',
  },
];
