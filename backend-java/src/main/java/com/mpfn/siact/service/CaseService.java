package com.mpfn.siact.service;

import com.mpfn.siact.model.*;
import com.mpfn.siact.repository.CaseRepository;
import com.mpfn.siact.repository.ElementoConviccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CaseService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private ElementoConviccionRepository elementoRepository;

    public List<Case> getAllCases() {
        List<Case> cases = caseRepository.findAll();
        if (cases.isEmpty()) {
            seedInitialData();
            return caseRepository.findAll();
        }
        return cases;
    }

    public Optional<Case> getCaseById(Long id) {
        return caseRepository.findById(id);
    }

    public Case saveCase(Case c) {
        return caseRepository.save(c);
    }

    public void deleteCase(Long id) {
        caseRepository.deleteById(id);
    }

    public ElementoConviccion addElementoConviccion(Long caseId, ElementoConviccion elemento) {
        Case c = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Carpeta no encontrada con ID: " + caseId));
        
        // Ponderación y valoración fáctica automatizada (Módulo D)
        elemento.setResultadoValoracion(evaluateSuficiencia(elemento));
        
        elemento.setCarpeta(c);
        return elementoRepository.save(elemento);
    }

    private ResultadoValoracion evaluateSuficiencia(ElementoConviccion elemento) {
        // Reglas de negocio del Ministerio Público:
        // Si no cumple pertinencia ni utilidad -> Insuficiente
        // Si cumple pero hay dudas o es pertinente pero no concluyente -> Adicional
        // Si cumple plenamente pertinencia, conducencia y utilidad -> Suficiente
        if (!elemento.getPertinente() || !elemento.getUtil()) {
            return ResultadoValoracion.INSUFICIENTE;
        } else if (!elemento.getConducente()) {
            return ResultadoValoracion.INVESTIGACION_ADICIONAL;
        }
        return ResultadoValoracion.SUFICIENTE;
    }

    private void seedInitialData() {
        // Carpeta 1: Delito de Cohecho Activo
        Case case1 = new Case();
        case1.setCodCarpeta("Carpeta Fiscal N° 456-2024");
        case1.setDelito("Cohecho Activo Genérico (Art. 397 CP)");
        case1.setImputado("Juan Carlos Pérez Alva");
        case1.setAgraviado("El Estado (Ministerio del Interior)");
        case1.setFechaHechos(LocalDate.of(2024, 1, 15));
        case1.setPenaMinima(4);
        case1.setPenaMaxima(6);
        case1.setIsComplejo(false);
        case1.setIsCrimenOrganizado(false);
        case1.setSuspendidoDias(0);
        case1.setResumenFactico("El imputado habría ofrecido una dádiva de S/. 500.00 soles a un efectivo policial de tránsito con el propósito de evitar la imposición de una infracción grave.");
        caseRepository.save(case1);

        // Elementos de convicción para la carpeta 1
        ElementoConviccion ec1 = new ElementoConviccion();
        ec1.setDescripcion("Acta de intervención policial que detalla el hallazgo del dinero.");
        ec1.setTipoElemento(TipoElemento.ACTAS);
        ec1.setPertinente(true);
        ec1.setConducente(true);
        ec1.setUtil(true);
        ec1.setAnalisisJustificacion("Acredita de forma directa la materialidad del dinero ofrecido y las circunstancias de flagrancia.");
        ec1.setResultadoValoracion(ResultadoValoracion.SUFICIENTE);
        ec1.setCarpeta(case1);
        elementoRepository.save(ec1);

        ElementoConviccion ec2 = new ElementoConviccion();
        ec2.setDescripcion("Declaración testimonial del oficial de tránsito interviniente.");
        ec2.setTipoElemento(TipoElemento.TESTIMONIALES);
        ec2.setPertinente(true);
        ec2.setConducente(true);
        ec2.setUtil(true);
        ec2.setAnalisisJustificacion("Testimonio directo del ofrecimiento verbal efectuado por el investigado.");
        ec2.setResultadoValoracion(ResultadoValoracion.SUFICIENTE);
        ec2.setCarpeta(case1);
        elementoRepository.save(ec2);

        // Carpeta 2: Compleja
        Case case2 = new Case();
        case2.setCodCarpeta("Carpeta Fiscal N° 1024-2023");
        case2.setDelito("Peculado Doloso (Art. 387 CP)");
        case2.setImputado("María Elena Solís Prado (Ex Alcaldesa)");
        case2.setAgraviado("Municipalidad Distrital de Bellavista");
        case2.setFechaHechos(LocalDate.of(2023, 5, 20));
        case2.setPenaMinima(8);
        case2.setPenaMaxima(15);
        case2.setIsComplejo(true);
        case2.setIsCrimenOrganizado(false);
        case2.setSuspendidoDias(120);
        case2.setResumenFactico("Presunta apropiación de fondos públicos destinados a la obra de remodelación del parque central de Bellavista mediante firmas de entregas de servicios fantasmas.");
        caseRepository.save(case2);

        ElementoConviccion ec3 = new ElementoConviccion();
        ec3.setDescripcion("Informe Técnico pericial contable de auditoría.");
        ec3.setTipoElemento(TipoElemento.PERICIALES);
        ec3.setPertinente(true);
        ec3.setConducente(true);
        ec3.setUtil(true);
        ec3.setAnalisisJustificacion("Determina fehacientemente un desfalco financiero de S/. 240,000.00 en las arcas municipales.");
        ec3.setResultadoValoracion(ResultadoValoracion.SUFICIENTE);
        ec3.setCarpeta(case2);
        elementoRepository.save(ec3);
    }
}
