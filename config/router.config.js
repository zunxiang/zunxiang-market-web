export default [
  // admin user
  {
    path: '/admin-user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/admin-user', redirect: '/admin/user/login' },
      { path: '/admin-user/login', component: './Admin/User/Login' },
    ],
  },
  // admin app
  {
    path: '/admin',
    component: '../layouts/AdminLayout',
    Routes: ['src/pages/AdminAuthorized'],
    authority: ['defualt'],
    routes: [
      // dashboard
      { path: '/admin', redirect: '/admin/dashboard/workplace' },
      {
        path: '/admin/dashboard/workplace',
        name: 'workplace',
        icon: 'dashboard',
        component: './Dashboard/Analysis',
      },
      {
        path: '/admin/wemall/list',
        name: 'admin-wemall-list',
        icon: 'table',
        component: './Admin/WeMall/List',
      },
      {
        path: '/admin/account/list',
        name: 'admin-account-list',
        icon: 'user',
        component: './Admin/WeMall/Child',
      },
      {
        icon: 'team',
        name: 'salesman-list',
        path: '/admin/salesman/list',
        component: './Admin/Salesman/List',
      },
      {
        name: 'withdraw',
        icon: 'pay-circle',
        path: '/admin/salesman/withdraw',
        component: './Admin/Salesman/Withdraw',
      },
      {
        name: 'admin-announcement',
        icon: 'sound',
        path: '/admin/announcement/list',
        component: './Admin/Announcement/List',
      },
      {
        name: 'admin-log',
        icon: 'info-circle',
        path: '/admin/log/list',
        component: './Admin/Log/List',
      },
      {
        icon: 'setting',
        path: '/admin/setting/password',
        name: 'admin-setting-password',
        component: './Admin/User/Setting',
      },
      {
        name: 'exception',
        icon: 'warnning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
    ],
  },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['defualt'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workplace' },
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        icon: 'dashboard',
        component: './Dashboard/WorkerData',
      },
      /*
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/WorkerData',
          },
        ],
      },
      */
      {
        path: '/mall',
        icon: 'table',
        name: 'mall',
        routes: [
          {
            path: '/mall/recommend',
            name: 'recommend',
            component: './Mall/Recommend',
          },
          {
            path: '/mall/banner',
            name: 'banner',
            component: './Mall/Banner',
          },
          {
            path: '/mall/type',
            name: 'type',
            component: './Mall/Type',
          },
          {
            path: '/mall/info',
            name: 'info',
            component: './Mall/Info',
          },
          {
            path: '/mall/mini-code',
            name: 'minicode',
            component: './Mall/MiniCode',
          },
        ],
      },
      {
        path: '/product',
        icon: 'table',
        name: 'product',
        routes: [
          {
            path: '/product',
            redirect: '/product/normal/list',
          },
          {
            path: '/product/sku',
            name: 'sku',
            component: './Product/Sku/Sku.js',
            hideInMenu: true,
          },
          {
            path: '/product/normal',
            name: 'normal',
            hideInMenu: true,
            routes: [
              {
                path: '/product/normal',
                redirect: '/product/normal/list',
              },
              {
                path: '/product/normal/list',
                name: 'normal-list',
                component: './Product/Normal',
              },
              {
                path: '/product/normal/detail',
                name: 'normal-detail',
                component: './Product/NormalDetail',
              },
              {
                path: '/product/normal/create',
                name: 'normal-create',
                component: './Product/Form/Normal',
              },
            ],
          },
          {
            path: '/product/presale',
            name: 'presale',
            hideInMenu: true,
            routes: [
              {
                path: '/product/presale',
                redirect: '/product/presale/list',
              },
              {
                path: '/product/presale/list',
                name: 'presale-list',
                component: './Product/Presale',
              },
              {
                path: '/product/presale/sort',
                name: 'presale-sort',
                component: './Product/PresaleSortList',
              },
              {
                path: '/product/presale/detail',
                name: 'presale-detail',
                component: './Product/PresaleDetail',
              },
              {
                path: '/product/presale/create',
                name: 'presale-create',
                component: './Product/Form/Presale',
              },
            ],
          },
        ],
      },
      {
        name: 'order',
        icon: 'table',
        path: '/order',
        routes: [
          {
            path: '/order',
            redirect: '/order/list',
          },
          {
            path: '/order/list',
            name: 'order-list',
            component: './Order/Orders',
            hideInMenu: true,
          },
          {
            path: '/order/detail',
            name: 'order-detail',
            component: './Order/OrderDetail',
            hideInMenu: true,
          },
        ],
      },
      {
        name: 'finance',
        icon: 'table',
        path: '/finance',
        hideInMenu: true,
        routes: [
          {
            path: '/finance',
            redirect: '/finance/bill',
          },
          {
            path: '/finance/bill',
            name: 'finance-bill',
            component: './Finance/bill',
            hideInMenu: true,
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        icon: 'team',
        name: 'salesman-list',
        path: '/salesman/list',
        component: './Salesman/List',
      },
      {
        name: 'withdraw',
        icon: 'team',
        path: '/salesman/withdraw',
        component: './Salesman/Withdraw',
      },
      {
        name: 'customer',
        icon: 'user',
        path: '/customer/list',
        component: './customer/List',
      },
      {
        name: 'subscript',
        icon: 'wechat',
        path: '/subscript/bind',
        component: './User/SubscriptList',
        hideInMenu: true,
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/child/list',
            authority: ['app_account'],
            name: 'child-list',
            component: './Account/Child',
            hideInMenu: true,
          },
          {
            path: '/account/setting/password',
            name: 'setting-password',
            component: './User/Setting',
          },
          /* {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          }, */
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
