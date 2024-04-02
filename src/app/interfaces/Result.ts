import { Erros } from "./Erros";

export interface Result<T> {
    dados: T;
    errors: Erros[];
    succeeded: T;
}