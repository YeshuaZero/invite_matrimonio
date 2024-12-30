import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, push } from '@angular/fire/database';
import { Storage, ref as storageRef, uploadBytesResumable, getDownloadURL, listAll, getStorage } from '@angular/fire/storage'; // Para el almacenamiento
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebBodasService {
    private storage: any = getStorage();

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

    getDataWeb(path: string): Promise<any> {
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

    getFiles(folderPath: string): Observable<string[]> {
        const folderRef = storageRef(this.storage, folderPath);

        return new Observable<string[]>((observer) => {
            listAll(folderRef)
                .then((res) => {
                    const files = res.items.map(async (itemRef) => {
                        const url = await getDownloadURL(itemRef);
                        return { url, path: itemRef.fullPath };
                    });

                    // Resolvemos todas las promesas y notificamos al observable
                    Promise.all(files).then((fileList: any) => {
                        observer.next(fileList);
                        observer.complete();
                    });
                })
                .catch((error) => {
                    console.error('Error al listar archivos:', error);
                    observer.error(error);
                });
        });
    }
}