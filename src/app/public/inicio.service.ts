import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, push } from '@angular/fire/database';

@Injectable({
    providedIn: 'root',
})
export class InicioService {
    constructor(private dataBase: Database) { }

    getData(path: string): Promise<any> {
        const dbRef = ref(this.dataBase);
        return get(child(dbRef, path))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Retornar el objeto directamente
                    return data;
                } else {
                    console.error('No se encontraron datos.');
                    return null; // Retornar null si no existen datos
                }
            })
            .catch((error) => {
                console.error('Error al obtener datos:', error);
                return null; // Retornar null en caso de error
            });
    }

}