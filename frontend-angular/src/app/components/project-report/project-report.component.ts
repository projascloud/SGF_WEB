import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService, Case, ElementoConviccion } from '../../services/case.service';

@Component({
  selector: 'app-project-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-report.component.html'
})
export class ProjectReportComponent implements OnInit {
  cases: Case[] = [];
  selectedCase: Case | null = null;
  
  // Form Model for a new Elemento de Convicción
  nuevaDescripcion: string = '';
  nuevoTipo: 'DOCUMENTALES' | 'TESTIMONIALES' | 'PERICIALES' | 'ACTAS' | 'INFORMES_TECNICOS' = 'DOCUMENTALES';
  pertinente: boolean = true;
  conducente: boolean = true;
  util: boolean = true;
  analisisJustificacion: string = '';

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    // Attempt load from Spring Boot Backend. Fallback to client mock if offline.
    this.caseService.getAllCases().subscribe({
      next: (data) => {
        this.cases = data;
        if (this.cases.length > 0) {
          this.selectedCase = this.cases[0];
        }
      },
      error: (err) => {
        console.warn('Backend offline, running in offline demo mode:', err);
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    this.cases = [
      {
        id: 1,
        codCarpeta: 'Carpeta Fiscal N° 456-2024',
        delito: 'Cohecho Activo Genérico (Art. 397 CP)',
        imputado: 'Juan Carlos Pérez Alva',
        agraviado: 'El Estado (Ministerio del Interior)',
        fechaHechos: '2024-01-15',
        penaMinima: 4,
        penaMaxima: 6,
        isComplejo: false,
        isCrimenOrganizado: false,
        suspendidoDias: 0,
        resumenFactico: 'El imputado habría ofrecido una dádiva de S/. 500.00 soles a un efectivo policial de tránsito con el propósito de evitar la imposición de una infracción grave.',
        elementosConviccion: [
          {
            id: 101,
            descripcion: 'Acta de intervención policial que detalla el hallazgo del dinero.',
            tipoElemento: 'ACTAS',
            pertinente: true,
            conducente: true,
            util: true,
            analisisJustificacion: 'Acredita de forma directa la materialidad del dinero ofrecido y las circunstancias de flagrancia.',
            resultadoValoracion: 'SUFICIENTE'
          },
          {
            id: 102,
            descripcion: 'Declaración testimonial del oficial de tránsito interviniente.',
            tipoElemento: 'TESTIMONIALES',
            pertinente: true,
            conducente: true,
            util: true,
            analisisJustificacion: 'Testimonio directo del ofrecimiento verbal efectuado por el investigado.',
            resultadoValoracion: 'SUFICIENTE'
          }
        ]
      },
      {
        id: 2,
        codCarpeta: 'Carpeta Fiscal N° 1024-2023',
        delito: 'Peculado Doloso (Art. 387 CP)',
        imputado: 'María Elena Solís Prado (Ex Alcaldesa)',
        agraviado: 'Municipalidad Distrital de Bellavista',
        fechaHechos: '2023-05-20',
        penaMinima: 8,
        penaMaxima: 15,
        isComplejo: true,
        isCrimenOrganizado: false,
        suspendidoDias: 120,
        resumenFactico: 'Presunta apropiación de fondos públicos destinados a la obra de remodelación del parque central de Bellavista mediante firmas de entregas de servicios fantasmas.',
        elementosConviccion: [
          {
            id: 103,
            descripcion: 'Informe Técnico pericial contable de auditoría.',
            tipoElemento: 'PERICIALES',
            pertinente: true,
            conducente: true,
            util: true,
            analisisJustificacion: 'Determina fehacientemente un desfalco financiero de S/. 240,000.00 en las arcas municipales.',
            resultadoValoracion: 'SUFICIENTE'
          }
        ]
      }
    ];
    this.selectedCase = this.cases[0];
  }

  onSelectCase(c: Case) {
    this.selectedCase = c;
  }

  // Predict classification based on keywords in description (automated classification)
  onDescripcionChange() {
    const desc = this.nuevaDescripcion.toLowerCase();
    if (desc.includes('declaracion') || desc.includes('testigo') || desc.includes('manifestacion') || desc.includes('declaró')) {
      this.nuevoTipo = 'TESTIMONIALES';
    } else if (desc.includes('informe pericial') || desc.includes('pericia') || desc.includes('dictamen') || desc.includes('perito')) {
      this.nuevoTipo = 'PERICIALES';
    } else if (desc.includes('acta de') || desc.includes('registro') || desc.includes('incautacion') || desc.includes('allanamiento')) {
      this.nuevoTipo = 'ACTAS';
    } else if (desc.includes('informe tecnico') || desc.includes('auditoria') || desc.includes('contraloria') || desc.includes('sbs')) {
      this.nuevoTipo = 'INFORMES_TECNICOS';
    } else if (desc.includes('contrato') || desc.includes('factura') || desc.includes('boleta') || desc.includes('documento') || desc.includes('escritura')) {
      this.nuevoTipo = 'DOCUMENTALES';
    }
  }

  agregarElemento() {
    if (!this.nuevaDescripcion || !this.selectedCase) return;

    const elemento: ElementoConviccion = {
      descripcion: this.nuevaDescripcion,
      tipoElemento: this.nuevoTipo,
      pertinente: this.pertinente,
      conducente: this.conducente,
      util: this.util,
      analisisJustificacion: this.analisisJustificacion || 'Evaluación estándar del despacho fiscal.',
      resultadoValoracion: this.evaluateSuficiencia(this.pertinente, this.conducente, this.util)
    };

    if (this.selectedCase.id && this.selectedCase.id < 100) {
      // Connect to Spring Boot backend
      this.caseService.addElemento(this.selectedCase.id, elemento).subscribe({
        next: (saved) => {
          if (!this.selectedCase!.elementosConviccion) {
            this.selectedCase!.elementosConviccion = [];
          }
          this.selectedCase!.elementosConviccion.push(saved);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error guardando en backend, agregando localmente:', err);
          this.agregarLocalmente(elemento);
        }
      });
    } else {
      this.agregarLocalmente(elemento);
    }
  }

  agregarLocalmente(elemento: ElementoConviccion) {
    if (!this.selectedCase!.elementosConviccion) {
      this.selectedCase!.elementosConviccion = [];
    }
    this.selectedCase!.elementosConviccion.push({
      ...elemento,
      id: Math.floor(Math.random() * 1000)
    });
    this.resetForm();
  }

  evaluateSuficiencia(pertinente: boolean, conducente: boolean, util: boolean): 'SUFICIENTE' | 'INSUFICIENTE' | 'INVESTIGACION_ADICIONAL' {
    if (!pertinente || !util) {
      return 'INSUFICIENTE';
    } else if (!conducente) {
      return 'INVESTIGACION_ADICIONAL';
    }
    return 'SUFICIENTE';
  }

  resetForm() {
    this.nuevaDescripcion = '';
    this.nuevoTipo = 'DOCUMENTALES';
    this.pertinente = true;
    this.conducente = true;
    this.util = true;
    this.analisisJustificacion = '';
  }
}
