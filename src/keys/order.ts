import type { InjectionKey, Ref } from 'vue';
import type { Order } from '@/types';

export const ordersKey: InjectionKey<Ref<Order[]>> = Symbol('orders');
