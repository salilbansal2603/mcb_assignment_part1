export interface Login {
    userName: string;
    password: string;
}

export interface User {
    userId: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface MenuItem {
    label: string;
    showOnMobile: boolean;
    showOnTablet: boolean;
    showOnDesktop: boolean;
    rLink: string;
}

export interface CustomerInfo {
    cNumber: string;
    cName: string;
    cAddress: string;
    cPhoneNumber: number;
}

export interface Transaction {
    transferAmount: number;
    transferCurrency: string;
    reference: string;
    custInfo: CustomerInfo;
}

export interface TransCustomer {
    transferAmount: number;
    transferCurrency: string;
    reference: string;
    cName: string;
}