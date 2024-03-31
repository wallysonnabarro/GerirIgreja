export interface SignInResultado {
    succeeded: boolean;
    isLockedOut: boolean;
    isNotAllowed: boolean;
    requiresTwoFactor: boolean;
    requeredEmailConfirm: boolean;
}
