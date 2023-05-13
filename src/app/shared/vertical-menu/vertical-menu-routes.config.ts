import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard', title: 'แดชบอร์ด', icon: 'ft-home', class: 'dropdown nav-item', isExternalLink: false, submenu: []
  },
  {
    path: 'seals', title: 'จัดการซีล', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/seals/sealin', title: 'รายการนำซีลเข้าระบบ', icon: 'ft-arrow-down submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/seals/sealout', title: 'การจ่ายซีล', icon: 'ft-arrow-up submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/seals/sealoutlist', title: 'รายการจ่ายซีล', icon: 'ft-list submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '/trucks', title: 'ทะเบียนรถ', icon: 'ft-truck', class: 'dropdown nav-item', isExternalLink: false, submenu: []
  },
  {
    path: '/users', title: 'ผู้ใช้งาน', icon: 'ft-users', class: 'dropdown nav-item', isExternalLink: false, submenu: []
  },
  {
    path: 'settings', title: 'การตั้งค่า', icon: 'ft-settings', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      { path: '/settings/qrcode', title: 'คิวอาร์โค้ด', icon: 'ft-file-text submenu-icon', class: '', isExternalLink: false, submenu: [] },
    ]
  },

];
