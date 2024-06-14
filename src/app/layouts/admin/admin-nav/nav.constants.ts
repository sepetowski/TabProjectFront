export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: 'Add Author',
    href: '/admin/new-author',
    icon: 'pi-home',
  },
];
