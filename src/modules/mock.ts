import { type Scope } from './models';

export const mockScopes: Scope[] = [
  {
    id: 1,
    name: "Hubble (Mock)",
    description: "Самый известный космический телескоп, работающий на орбите с 1990 года. Сделал множество революционных открытий в астрономии.",
    status: true,
    img_link: "",
    filter: "F775W.",
    lambda: 775,
    delta_lamb: 150,
    zero_point: 2518
  },
  {
    id: 2,
    name: "James Webb (Mock)",
    description: "Космический телескоп нового поколения, преемник «Хаббла». Работает в инфракрасном диапазоне для изучения самых далёких и древних объектов Вселенной.",
    status: true,
    img_link: "",
    filter: "F775W.",
    lambda: 775,
    delta_lamb: 150,
    zero_point: 2518
  },
  {
    id: 3,
    name: "W. M. Keck (Mock)",
    description: "Один из крупнейших оптических телескопов в мире с сегментным зеркалом. Используется для спектроскопии и получения изображений с высоким разрешением.",
    status: true,
    img_link: "",
    filter: "F775W.",
    lambda: 775,
    delta_lamb: 150,
    zero_point: 2518
  },
  {
    id: 4,
    name: "Gaia (Mock)",
    description: "Космическая обсерватория Европейского космического агентства, главная задача которой — составить сверхточную 3D-карту Млечного Пути, измерив координаты, расстояния и движения миллиардов звёзд",
    status: true,
    img_link: "",
    filter: "F775W.",
    lambda: 775,
    delta_lamb: 150,
    zero_point: 2518
  }
];