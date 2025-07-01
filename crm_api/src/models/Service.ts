export class Service {
    service_id?: number;
    name!: string;
    type!: 'Development' | 'Design' | 'Marketing' | 'Security';
    price?: number;
}
