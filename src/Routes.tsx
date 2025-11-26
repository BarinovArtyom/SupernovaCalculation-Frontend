export const ROUTES = {
    HOME: '/',
    SCOPES: '/scopes',
    SCOPE: '/scope',
    LOGIN: '/login',
    STARS: '/stars',
    STAR: '/star',
    REGISTER: '/register',
    PROFILE: '/profile'
} as const;

export const ROUTE_LABELS = {
    [ROUTES.HOME]: 'Главная',
    [ROUTES.SCOPES]: 'Телескопы',
    [ROUTES.LOGIN]: 'Авторизация',
    [ROUTES.STARS]: 'Список Звезд',
    [ROUTES.STAR]: 'Звезда',
    [ROUTES.REGISTER]: 'Регистрация',
    [ROUTES.PROFILE]: 'Личный Кабинет',
} as const;