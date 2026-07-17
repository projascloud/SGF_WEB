import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ElementoConviccion {
  id?: number;
  descripcion: string;
  tipoElemento: 'DOCUMENTALES' | 'TESTIMONIALES' | 'PERICIALES' | 'ACTAS' | 'INFORMES_TECNICOS';
  pertinente: boolean;
  conducente: boolean;
  util: boolean;
  analisisJustificacion?: string;
  resultadoValoracion?: 'SUFICIENTE' | 'INSUFICIENTE' | 'INVESTIGACION_ADICIONAL';
}

export interface Case {
  id?: number;
  codCarpeta: string;
  delito: string;
  imputado: string;
  agraviado: string;
  fechaHechos: string;
  penaMinima: number;
  penaMaxima: number;
  isComplejo: boolean;
  isCrimenOrganizado: boolean;
  suspendidoDias: number;
  resumenFactico?: string;
  elementosConviccion?: ElementoConviccion[];
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private apiUrl = 'http://localhost:8080/api/cases';

  constructor(private http: HttpClient) {}

  getAllCases(): Observable<Case[]> {
    return this.http.get<Case[]>(this.apiUrl);
  }

  getCaseById(id: number): Observable<Case> {
    return this.http.get<Case>(`${this.apiUrl}/${id}`);
  }

  createCase(c: Case): Observable<Case> {
    return this.http.post<Case>(this.apiUrl, c);
  }

  updateCase(id: number, c: Case): Observable<Case> {
    return this.http.put<Case>(`${this.apiUrl}/${id}`, c);
  }

  deleteCase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addElemento(caseId: number, elemento: ElementoConviccion): Observable<ElementoConviccion> {
    return this.http.post<ElementoConviccion>(`${this.apiUrl}/${caseId}/elementos`, elemento);
  }
}
