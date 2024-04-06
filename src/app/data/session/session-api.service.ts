import { Injectable, inject } from '@angular/core';
import { OriginalSessionCol, OriginalSession, OriginalSessionRow, OriginalSessionCell } from './session.types';
import { ApiProvider } from '@data/common/api/api.provider';
import { Id } from '@data/common/types';
import { ExtendedSession, Session } from './session.models';

@Injectable()
export class SessionApiService {
  private readonly api = inject(ApiProvider);

  async getSessions(userId: Id): Promise<Session[]> {
    return (await this.api.getCollection<OriginalSession>('sessions/', { ownerId: userId })).map(s => new Session(s));
  }

  async getSession(id: Id): Promise<ExtendedSession> {
    const baseSession = await this.getBaseSession(id);
    const [cols, rows, cells] = await Promise.all([this.getSessionCols(id), this.getSessionRows(id), this.getSessionCells(id)]);

    return new ExtendedSession(baseSession, { cols, rows, cells });
  }

  async createSession(payload: ExtendedSession): Promise<ExtendedSession> {
    const session = await this.api.create('sessions/', payload.getCreatePayload());

    const [cols, rows] = await Promise.all([
      this.api.createCollection<OriginalSessionCol>(`sessions/${session.id}/cols`, payload.getCreateColsPayload()),
      this.api.createCollection<OriginalSessionRow>(`sessions/${session.id}/rows`, payload.getCreateRowsPayload()),
    ]);

    const cells = await this.api.createCollection(`sessions/${session.id}/cells`, payload.getCreateCellsPayload(cols, rows));

    return new ExtendedSession(session, { cols, rows, cells });
  }

  private async getBaseSession(id: Id): Promise<OriginalSession> {
    return this.api.get<OriginalSession>(`sessions/${id}/`);
  }

  private async getSessionCols(id: Id): Promise<OriginalSessionCol[]> {
    return this.api.getCollection<OriginalSessionCol>(`sessions/${id}/cols/`);
  }

  private async getSessionRows(id: Id): Promise<OriginalSessionRow[]> {
    return this.api.getCollection<OriginalSessionRow>(`sessions/${id}/rows/`);
  }

  private async getSessionCells(id: Id): Promise<OriginalSessionCell[]> {
    return this.api.getCollection<OriginalSessionCell>(`sessions/${id}/cells/`);
  }
}