export default [
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
        ],
      },
      {
        path: '/product',
        icon: 'table',
        name: 'product',
        routes: [
          {
            path: '/product/normal',
            name: 'normal',
            hideChildrenInMenu: true,
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
            ],
          },
          {
            path: '/product/presale',
            name: 'presale',
            hideChildrenInMenu: true,
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
            ],
          },
        ],
      },
      {
        name: 'order',
        icon: 'table',
        path: '/order/list',
        component: './Order/Orders',
      },
      /* // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            component: './Forms/AdvancedForm',
          },
        ],
      }, */
      // list
      /* {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      }, */
      /* {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      }, */
      /* {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      }, */
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
        path: '/salesman/withdraw',
        component: './Salesman/Withdraw',
        hideInMenu: true,
      },
      {
        name: 'customer',
        icon: 'user',
        path: '/customer/list',
        component: './customer/List',
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
