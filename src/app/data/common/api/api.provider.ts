import { Injectable, inject } from '@angular/core';
import { Firestore, QueryConstraint, addDoc, collection, doc, getDoc, getDocs, query, where, writeBatch } from '@angular/fire/firestore';

type QueryParams = Record<string, string>;

@Injectable()
export class ApiProvider {
  private readonly firestore = inject(Firestore);

  async get<T>(url: string): Promise<T> {
    const [path, ...pathSegments] = this.getUrlSegments(url);
    const ref = doc(this.firestore, path, ...pathSegments);
    const snapshot = await getDoc(ref);
    const id = snapshot.id;

    if (!snapshot.exists()) {
      throw new Error('Not found');
    }

    return { ...snapshot.data(), id } as T;
  }

  async getCollection<T>(url: string, queryParams: QueryParams = {}): Promise<T[]> {
    const [path, ...pathSegments] = this.getUrlSegments(url);
    const ref = collection(this.firestore, path, ...pathSegments);
    const constraints = query(ref, ...this.convertQueryParamsToConstraints(queryParams));
    const snapshot = await getDocs(constraints);

    return snapshot.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
  }

  /**
   * Создать документ
   * @param {string} url - путь до коллекции
   * @param {P} payload - Payload данных
   * @returns {P} - модель документа с внедренным ID
   */
  async create<P extends { [x: string]: any; }>(url: string, payload: Omit<P, 'id'>): Promise<P> {
    const [path, ...pathSegments] = this.getUrlSegments(url);
    const collectionRef = collection(this.firestore, path, ...pathSegments);
    const snapshot = await addDoc(collectionRef, payload);

    return { ...payload, id: snapshot.id } as unknown as P;
  }

  /**
   * Создать коллекцию документов
   * @param {string} url - путь до коллекции
   * @param {Array<P>} payload - Payload коллекции данных
   * @returns {Array<Id>} - коллекция документов с внедренными ID
   */
  async createCollection<P extends { [x: string]: any; }>(url: string, payload: Omit<P, 'id'>[]): Promise<P[]> {
    const [path, ...pathSegments] = this.getUrlSegments(url);
    const collectionRef = collection(this.firestore, path, ...pathSegments);
    const batch = writeBatch(this.firestore);
    const dataList: P[] = [];

    for (const data of payload) {
      const docRef = doc(collectionRef);

      batch.set(docRef, data);
      dataList.push({ ...data, id: docRef.id } as unknown as P);
    }

    return batch.commit().then(() => dataList);
  }

  private getUrlSegments(url: string): string[] {
    return url.split('/');
  }

  private convertQueryParamsToConstraints(queryParams: QueryParams): QueryConstraint[] {
    return Object.entries(queryParams).map(([key, value]) => {
      return where(key, '==', value);
    });
  }
}
