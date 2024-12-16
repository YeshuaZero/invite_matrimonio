import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, push } from '@angular/fire/database';

@Injectable({
    providedIn: 'root',
})
export class WebBodasService {
    constructor(private dataBase: Database) { }

    // Guardar datos en una ruta específica
    agregarConfirmado(familia: any, data: any): Promise<void> {
        const dbRef = ref(this.dataBase, `${familia}/usuarios`);
        const nuevoUsuarioRef = push(dbRef);
        return set(nuevoUsuarioRef, data);
    }

    agregarConfirmados(familia: string, usuarios: any[]): Promise<void[]> {
        const dbRef = ref(this.dataBase, `${familia}/usuarios`);

        const promesas = usuarios.map((usuario) => {
            const nuevoUsuarioRef = push(dbRef); // Genera un ID único para cada usuario
            return set(nuevoUsuarioRef, usuario);
        });

        return Promise.all(promesas); // Espera a que todas las operaciones se completen
    }

    // Consultar datos desde una ruta específica
    getData(path: string): Promise<any> {
        const dbRef = ref(this.dataBase);
        return get(child(dbRef, path)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Convertir el objeto en un arreglo
                const dataArray = Object.keys(data).map((key) => ({
                    id: key, // Guardamos la clave como ID
                    ...data[key], // Extraemos los valores del objeto
                }));
                return dataArray;
            } else {
                console.error('No se encontraron datos.');
                return [];
            }
        });
    }

}