export const ROUTES = {
    HOME: '/',
    SCOPES: '/scopes',
    SCOPE: '/scope/',
} as const;

export const ROUTE_LABELS = {
    [ROUTES.HOME]: 'Главная',
    [ROUTES.SCOPES]: 'Телескопы',
} as const;