export interface IDatabaseConfig {
	path: string;
	synchronize: boolean;
}

export interface IConfig {
    database: IDatabaseConfig;
}