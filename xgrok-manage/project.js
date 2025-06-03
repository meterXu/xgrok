window.project={
  "nameSpace": "xgrok-rearend-manage",
  "variable": {
    "baseApi": "http://localhost:11525",
    "tokenKey": "Authorization"
  },
  "redirect": {
    "403": "/error/403",
    "404": "/error/404",
    "index": "/dashboard",
    "login": "/login"
  },
  "style": {
    "theme": "vue-admin",
    "layout": "sideMenu",
    "multiPage": true,
    "fixSideMenu": false
  },
  "config": {
    "logo": "./assets/img/icon.webp",
    "sideMenu": {
      "title": "xgrok后台管理",
      "width": "300px"
    }
  }
}