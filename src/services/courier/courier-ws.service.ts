import { io, Socket } from 'socket.io-client';

import { SERVER_URL } from '@/constants/urls';
import { COURIER_EVENTS, COURIER_MESSAGES, IOrderOfferPayload } from '@/domain/orders/types';

type OfferHandler = (payload: IOrderOfferPayload) => void;
type CancelHandler = () => void;

class CourierWsService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(`${SERVER_URL}/couriers`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      this.socket?.emit(COURIER_MESSAGES.IDENTIFY);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onOrderOffer(handler: OfferHandler): void {
    this.socket?.on(COURIER_EVENTS.ORDER_OFFER, handler);
  }

  onOrderOfferCancelled(handler: CancelHandler): void {
    this.socket?.on(COURIER_EVENTS.ORDER_OFFER_CANCELLED, handler);
  }

  offOrderOffer(handler: OfferHandler): void {
    this.socket?.off(COURIER_EVENTS.ORDER_OFFER, handler);
  }

  offOrderOfferCancelled(handler: CancelHandler): void {
    this.socket?.off(COURIER_EVENTS.ORDER_OFFER_CANCELLED, handler);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const courierWsService = new CourierWsService();
