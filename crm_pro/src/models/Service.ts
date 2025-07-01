export interface Service {
    service_id?: number;
    name: string;
    type: 'Development' | 'Design' | 'Marketing' | 'Security'
    price?: number;
    description?: string;
    duration?: string;
}
