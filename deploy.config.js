module.exports = {
  "options": {
    "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/var/www/apps/noodoo",
    "dst": "/Users/mmekhanov/tmp/koala-sss",
    "link_shared": {
      "type": "symlink"
    }
  },
  "shared": {
    "dst": "/Users/mmekhanov/tmp/koala-sss/shared",
    "modules": {
      "nd-html": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/logistics/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/nd-html",
          "/var/www/apps/noodoo/noodoo/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/logistics/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/koala/node_modules/nd-html",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/nd-html",
          "/var/www/apps/noodoo/current/node_modules/nd-html",
          "/var/www/apps/noodoo/shared/koala/node_modules/nd-html"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-html"
      },
      "nd-plugin-erouter": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/logistics/node_modules/nd-plugin-erouter",
          "/var/www/apps/noodoo/current/organizers/logistics/node_modules/nd-plugin-erouter",
          "/var/www/apps/noodoo/node_modules/nd-plugin-sso/node_modules/nd-plugin-erouter"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-plugin-erouter"
      },
      "nd-plugin-sso": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/logistics/node_modules/nd-plugin-sso",
          "/var/www/apps/noodoo/current/organizers/logistics/node_modules/nd-plugin-sso"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-plugin-sso"
      },
      "nd-utils": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/logistics/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/node_modules/nd-utils",
          "/var/www/apps/noodoo/noodoo/node_modules/nd-sphinx/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/logistics/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/koala/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/node_modules/nd-utils",
          "/var/www/apps/noodoo/current/node_modules/nd-sphinx/node_modules/nd-utils",
          "/var/www/apps/noodoo/node_modules/nd-html/node_modules/nd-utils",
          "/var/www/apps/noodoo/node_modules/nd-sphinx/node_modules/nd-utils",
          "/var/www/apps/noodoo/node_modules/nd-query/node_modules/nd-utils",
          "/var/www/apps/noodoo/node_modules/nd-plugin-erouter/node_modules/nd-utils",
          "/var/www/apps/noodoo/node_modules/nd-plugin-workflow/node_modules/nd-utils",
          "/var/www/apps/noodoo/node_modules/nd-aux/node_modules/nd-utils",
          "/var/www/apps/noodoo/shared/koala/node_modules/nd-utils"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-utils"
      },
      "koala": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/koala",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/koala",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/koala",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/koala",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/koala",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/koala",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/koala",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/koala",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/koala",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/koala",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/koala",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/koala"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/koala"
      },
      "nd-seq": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/nd-seq",
          "/var/www/apps/noodoo/noodoo/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/koala/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/nd-seq",
          "/var/www/apps/noodoo/current/node_modules/nd-seq",
          "/var/www/apps/noodoo/node_modules/nd-plugin-workflow/node_modules/nd-seq",
          "/var/www/apps/noodoo/shared/koala/node_modules/nd-seq"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-seq"
      },
      "nd-aux": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/nd-aux",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/nd-aux",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/nd-aux",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/nd-aux",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/nd-aux",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/nd-aux",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/nd-aux",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/nd-aux",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/nd-aux",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/nd-aux",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/nd-aux",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/nd-aux"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-aux"
      },
      "nd-format": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/organizers/contracts/node_modules/nd-format",
          "/var/www/apps/noodoo/noodoo/organizers/specifications/node_modules/nd-format",
          "/var/www/apps/noodoo/noodoo/organizers/acts/node_modules/nd-format",
          "/var/www/apps/noodoo/noodoo/organizers/railcars/node_modules/nd-format",
          "/var/www/apps/noodoo/noodoo/organizers/attorneys/node_modules/nd-format",
          "/var/www/apps/noodoo/noodoo/organizers/companies/node_modules/nd-format",
          "/var/www/apps/noodoo/current/organizers/contracts/node_modules/nd-format",
          "/var/www/apps/noodoo/current/organizers/specifications/node_modules/nd-format",
          "/var/www/apps/noodoo/current/organizers/acts/node_modules/nd-format",
          "/var/www/apps/noodoo/current/organizers/railcars/node_modules/nd-format",
          "/var/www/apps/noodoo/current/organizers/attorneys/node_modules/nd-format",
          "/var/www/apps/noodoo/current/organizers/companies/node_modules/nd-format"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-format"
      },
      "nd-napa": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/node_modules/nd-napa",
          "/var/www/apps/noodoo/current/node_modules/nd-napa"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-napa"
      },
      "nd-sphinx": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/node_modules/nd-sphinx",
          "/var/www/apps/noodoo/current/node_modules/nd-sphinx"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-sphinx"
      },
      "nd-db": {
        "linked": [
          "/var/www/apps/noodoo/noodoo/node_modules/nd-sphinx/node_modules/nd-db",
          "/var/www/apps/noodoo/current/node_modules/nd-sphinx/node_modules/nd-db",
          "/var/www/apps/noodoo/node_modules/nd-sphinx/node_modules/nd-db"
        ],
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/usr/local/lib/node_modules/nd-db"
      }
    }
  },
  "app": {
    "dirs": [
      {
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/var/www/apps/noodoo/bin",
        "dst": "/Users/mmekhanov/tmp/koala-sss/bin"
      },
      {
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/var/www/apps/noodoo/current",
        "dst": "/Users/mmekhanov/tmp/koala-sss/current"
      },
      {
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/var/www/apps/noodoo/node_modules",
        "dst": "/Users/mmekhanov/tmp/koala-sss/node_modules"
      },
      {
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/var/www/apps/noodoo/noodoo",
        "dst": "/Users/mmekhanov/tmp/koala-sss/noodoo"
      },
      {
        "src": "mmekhanov@uds-koala-dev.moscow.eurochem.ru:/var/www/apps/noodoo/shared",
        "dst": "/Users/mmekhanov/tmp/koala-sss/shared"
      }
    ]
  }
};