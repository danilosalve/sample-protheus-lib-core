import { PoMenuItem } from '@po-ui/ng-components';

/**
 * Constante com os menus da aplicação
 */
export const APP_MENUS: PoMenuItem[] = [
  { label: 'Página inicial', shortLabel: 'Inicio', link: './', icon: 'an an-house-line' },
  {
    label: 'Integrações ADVPL',
    shortLabel: 'Integrações',
    icon: 'an an-swap',
    link: 'advpl-integration'
  },
  {
    label: 'Funções',
    shortLabel: 'Funções',
    icon: 'an an-code',
    subItems: [
      {
        label: 'Acessos do usuário',
        subItems: [
          { label: 'Empresas', link: 'protheus-functions/user-companies' },
          { label: 'Filiais', link: 'protheus-functions/user-branches' },
          { label: 'Validar de acessos', link: 'protheus-functions/user-access' }
        ]
      },
      { label: 'Outras', link: 'protheus-functions' }
    ]
  },
  {
    label: 'Serviços',
    shortLabel: 'Serviços',
    icon: 'an an-hard-drives',
    subItems: [
      { label: 'ProUserProfileService', link: 'protheus-services/user-profile' },
      {
        label: 'ProGenericAdapterService',
        subItems: [
          { label: 'List', link: 'protheus-services/generic-adapter/list' },
          { label: 'Query', link: 'protheus-services/generic-adapter/query' }
        ]
      },
      { label: 'ProSessionInfoService', link: 'protheus-services/session-info' },
      { label: 'ProDateService', link: 'protheus-services/pro-date' }
    ]
  },
  { label: 'Sair', shortLabel: 'Sair', icon: 'an an-sign-out' }
];
