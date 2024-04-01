import { inject } from "@angular/core";
import { LoginServicesService } from "../components/login/login-services.service";
import { Router } from "@angular/router";

export const CanActivate = () => {
    const loginService = inject(LoginServicesService);
    const router = inject(Router);

    if (loginService.UserIsAuthentication()) {
        return true;
    } else {
        router.navigate(['/login']);

        return false;
    }
}