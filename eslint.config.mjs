import config from 'eslint-config-standard'

export default [...[].concat(config), { extends: ['prettier'] }]
