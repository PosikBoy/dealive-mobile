import { instance } from '@/axios/interceptor';
import { IUpdateRouteBody } from '@/domain/orders/types';

class CourierRoutesService {
  async updateState(body: IUpdateRouteBody): Promise<void> {
    await instance.put('/courier-routes/state', body);
  }

  async deleteState(): Promise<void> {
    await instance.delete('/courier-routes/state');
  }
}

export const courierRoutesService = new CourierRoutesService();
