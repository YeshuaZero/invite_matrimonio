import { Injectable } from '@angular/core';
import { Database, ref, get, child, set, push, update, remove } from '@angular/fire/database'; // Para la base de datos en tiempo real
import { Storage, ref as storageRef, uploadBytesResumable, getDownloadURL, listAll, getStorage, deleteObject } from '@angular/fire/storage'; // Para el almacenamiento
import { Observable } from 'rxjs'; // Para trabajar con streams y observables

@Injectable({
    providedIn: 'root',
})
export class PanelService {
    private storage: any = getStorage(); // Usa la API moderna de Firebase Storage

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

    saveData(path: string, data: any): Promise<void> {
        const dbRef = ref(this.dataBase, path);
        return set(dbRef, data)
            .then(() => {
                console.log('Datos guardados exitosamente.');
            })
            .catch((error) => {
                console.error('Error al guardar los datos:', error);
                throw error; // Lanza el error para que sea manejado por el componente que lo llame
            });
    }

    agregarConfirmado(path: any, invitado: any): Promise<void> {
        const dbRef = ref(this.dataBase, path);
        const nuevoUsuarioRef = push(dbRef);
        return set(nuevoUsuarioRef, invitado);
    }

    editarInvitado(path: string, idInvitado: string, datosActualizados: any): Promise<void> {
        const invitadoRef = ref(this.dataBase, `${path}/${idInvitado}`);
        return update(invitadoRef, datosActualizados);
    }

    eliminarInvitado(path: string, idInvitado: string): Promise<void> {
        const invitadoRef = ref(this.dataBase, `${path}/${idInvitado}`);
        return remove(invitadoRef);
    }

    uploadFile(filePath: string, file: File): Observable<string> {
        const fileReference = storageRef(this.storage, filePath);
        const uploadTask = uploadBytesResumable(fileReference, file);

        return new Observable<string>((observer) => {
            uploadTask.on(
                'state_changed',
                // Progreso de la subida (opcional)
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Progreso de la subida: ${progress}%`);
                },
                // Manejo de errores
                (error) => {
                    console.error('Error al subir el archivo:', error);
                    observer.error(error);
                },
                // Subida completada
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(fileReference);
                        observer.next(downloadURL); // Emite la URL de descarga
                        observer.complete();
                    } catch (error) {
                        console.error('Error al obtener la URL del archivo:', error);
                        observer.error(error);
                    }
                }
            );
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
                    Promise.all(files).then((fileList:any) => {
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

    deleteFile(filePath: string): Promise<void> {
        const storageReference: any = storageRef(this.storage, filePath);
        return deleteObject(storageReference).catch((error) => {
            console.error('Error al eliminar archivo:', error);
            throw error;
        });
    }

}