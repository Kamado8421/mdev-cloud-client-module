export type MdevCloudType = {
    host: string;
    db_key: string;
}

export type TestConnectionType = {
    wasConnected: boolean;
    message: ''
}

export default interface DataClientType {
    id: number;
    createdAt: Date;
    name: string;
    jid: string;
    isPremium: boolean;
    isWoner: boolean;
    isBaned: boolean;
    level: string | null;
    xp: number | null;
    money: number | null;
}
