import { IOrderActionType } from '@/domain/orders/types';

// src/constants/texts.ts
export const TEXTS = {
  tabs: {
    addresses: 'Адреса',
    actions: 'Действия',
    route: 'Маршрут',
  },
  buttons: {
    takeOrder: 'Взять заказ',
  },
  header: (orderId: number) => `Заказ № ${orderId}`,
  actionSnippets: {
    [IOrderActionType.GO_TO]: '✅ Выезжаю на адрес',
    [IOrderActionType.ARRIVED_AT]: '📍 Я на месте',
    [IOrderActionType.PICKUP]: '📦 Посылка получена',
    [IOrderActionType.DELIVER]: '🏁 Доставлено',
    [IOrderActionType.COLLECT_PAYMENT]: '💵 Получена оплата',
    [IOrderActionType.PAY_COMMISION]: '📝 Оплатить комиссию',
    [IOrderActionType.COMPLETE_ORDER]: '🎉 Завершить заказ',
  },
  orderInfo: (price: number, weight: string, parcelType: string) =>
    `${price}₽ · ${weight} · ${parcelType}`,
};
