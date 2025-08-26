import DataClientType, { MdevCloudType, TestConnectionType } from "../types";

async function useFetch<T>(config: {
    url: string;
    method: 'POST' | 'GET' | 'DELETE' | 'PUT';
    body?: object;
    showRequest?: boolean;
}): Promise<{ res: Response; json: T }> {
    const options: RequestInit = {
        method: config.method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (config.body && config.method !== 'GET') {
        options.body = JSON.stringify(config.body);
    }

    const res = await fetch(config.url, options);
    const json = await res.json() as T;

    if (config.showRequest) console.log(json);

    return { res, json };
}

export class MdevCloudClient {
    private config: MdevCloudType;
    private baseUrl: string;
    private isConnectionAuthorized: boolean = false;
    private dataClients: DataClientType[] = [];
    private debug: boolean = false;
    private showRequest: boolean = false;

    constructor(config: MdevCloudType) {
        this.config = config;
        this.baseUrl = `${this.config.host}/api/data-cloud`;
    }

    async init({ debug = true, showRequest = false }: { debug: boolean, showRequest: boolean }): Promise<void> {
        const res = await this.onTestConnection();
        this.debug = debug;
        this.showRequest = showRequest;
        if (debug) {
            console.warn({ MDevCloudInitialDebug: res });
        }
        if (res.wasConnected) {
            this.dataClients = await this.onGetAllClients(); // Carrega cache inicial
        }
    }

    private AuthErrorVerificator() {
        if (!this.isConnectionAuthorized) {
            throw new Error(
                'Autorização de acesso Mdev-Cloud negada. Verifique sua DB_Key e inicialize corretamente o MdevCloudClient.'
            );
        }
    }

    async onTestConnection(): Promise<TestConnectionType> {
        const url = `${this.baseUrl}/connection?db_key=${this.config.db_key}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erro na conexão: ${res.status} ${res.statusText}`);
        }

        const json = (await res.json()) as TestConnectionType;
        if (this.debug) console.log(json);
        
        this.isConnectionAuthorized = json.wasConnected;
        return json;
    }

    /** Métodos que acessam apenas cache local */
    getAllClients() {
        return this.dataClients;
    }

    getClient(jid: string) {
        return this.dataClients.find(c => c.jid === jid) || null;
    }

    /** Métodos que fazem requests reais */
    async onGetClient(jid: string): Promise<DataClientType | null> {
        this.AuthErrorVerificator();

        const url = `${this.baseUrl}/clients?db_key=${this.config.db_key}&jid=${jid}`;
        const { res, json } = await useFetch<any>({ url, method: 'GET', showRequest: this.showRequest });

        if (!res.ok) {
            if (this.debug) console.log(`Erro ao buscar cliente: ${res.status} ${res.statusText}`);
            return null;
        }

        const client = json as DataClientType;
        return client;
    }

    async onGetAllClients(): Promise<DataClientType[]> {
        this.AuthErrorVerificator();

        const url = `${this.baseUrl}/clients?db_key=${this.config.db_key}`;
        const { res, json } = await useFetch<any>({ url, method: 'GET', showRequest: this.showRequest });

        if (!res.ok) {
            throw new Error(`Erro ao buscar clientes: ${res.status} ${res.statusText}`);
        }

        this.dataClients = json as DataClientType[];
        return this.dataClients;
    }

    async onCreateClient(jid: string, username?: string): Promise<DataClientType | null> {
        this.AuthErrorVerificator();

        const url = `${this.baseUrl}/clients`;
        const { res, json } = await useFetch<any>({
            url,
            method: 'POST',
            body: { jid, db_key: this.config.db_key, username },
            showRequest: this.showRequest
        });

        if (!res.ok) {
            if (this.debug) console.error(`Erro ao criar cliente: ${res.status} ${res.statusText}`);
            return null;
        }

        const client = json as DataClientType;
        this.dataClients.push(client);
        return client;
    }

    async onUpdateClient(jid: string, updates: Partial<DataClientType>): Promise<DataClientType> {
        this.AuthErrorVerificator();

        const url = `${this.baseUrl}/clients`;
        const { res, json } = await useFetch<any>({
            url,
            method: 'PUT',
            body: { jid, db_key: this.config.db_key, updates },
            showRequest: this.showRequest
        });

        if (!res.ok) {
            throw new Error(`Erro ao atualizar cliente: ${res.status} ${res.statusText}`);
        }

        const updatedClient = json.client as DataClientType;
        const idx = this.dataClients.findIndex(c => c.jid === jid);
        if (idx >= 0) {
            this.dataClients[idx] = updatedClient;
        } else {
            this.dataClients.push(updatedClient);
        }

        return updatedClient;
    }

    async onDeleteClient(jid: string): Promise<boolean> {
        this.AuthErrorVerificator();

        const url = `${this.baseUrl}/clients?db_key=${this.config.db_key}&jid=${jid}`;
        const { res } = await useFetch<any>({ url, method: 'DELETE', showRequest: this.showRequest });

        if (!res.ok) {
            throw new Error(`Erro ao deletar cliente: ${res.status} ${res.statusText}`);
        }

        this.dataClients = this.dataClients.filter(c => c.jid !== jid);
        return true;
    }
}
