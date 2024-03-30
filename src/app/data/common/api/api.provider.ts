import { Injectable, inject } from '@angular/core';
import { Firestore, QueryConstraint, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';

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

  private getUrlSegments(url: string): string[] {
    return url.split('/');
  }

  private convertQueryParamsToConstraints(queryParams: QueryParams): QueryConstraint[] {
    return Object.entries(queryParams).map(([key, value]) => {
      return where(key, '==', value);
    });
  }
}
