import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, push } from '@angular/fire/database';

@Injectable({
    providedIn: 'root',
})
export class InicioService {
    constructor(private dataBase: Database) { }

    // Guardar datos en una ruta específica
    agregarConfirmado(data: any): Promise<void> {
        const dbRef = ref(this.dataBase, 'usuarios');
        const nuevoUsuarioRef = push(dbRef);
        return set(nuevoUsuarioRef, data);
    }

    // Guardar datos en una ruta específica
    saveData(path: string, data: any): Promise<void> {
        const dbRef = ref(this.dataBase, path);
        return set(dbRef, data);
    }

    // Consultar datos desde una ruta específica
    getData(path: string): Promise<any> {
        const dbRef = ref(this.dataBase);
        return get(child(dbRef, path)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error('No data available');
            }
        });
    }
}