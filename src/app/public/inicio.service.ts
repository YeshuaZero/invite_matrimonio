import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class InicioService {
    baseUrl = environment.baseUrl

    constructor(private http: HttpClient) { }

    login(data: any) {
        return this.http.post(`${this.baseUrl}/login/validate_user.php`, data);
    }

    recuperar(data: any) {
        return this.http.post(`${this.baseUrl}/login/recuperar_pass.php`, data);
    }
}