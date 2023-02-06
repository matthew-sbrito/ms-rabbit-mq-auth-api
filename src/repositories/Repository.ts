export interface Repository<Domain, ID, Body> {
    create(data: Body): Promise<Domain>;
    update(id: ID, data: Partial<Body>): Promise<Domain>;
    findById(id: ID): Promise<Domain | null>;
    findAll(): Promise<Domain[]>;
}