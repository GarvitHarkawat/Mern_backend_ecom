const ROLES = { USER: 'user', SELLER: 'seller', ADMIN: 'admin' };

const ROLE_LIST = Object.values(ROLES);

const SIGNUP_ROLES = [ROLES.USER, ROLES.SELLER];

module.exports = { ROLES, ROLE_LIST, SIGNUP_ROLES };
