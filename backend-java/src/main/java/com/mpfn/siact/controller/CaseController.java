package com.mpfn.siact.controller;

import com.mpfn.siact.model.Case;
import com.mpfn.siact.model.ElementoConviccion;
import com.mpfn.siact.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cases")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CaseController {

    @Autowired
    private CaseService caseService;

    @GetMapping
    public ResponseEntity<List<Case>> getAllCases() {
        return ResponseEntity.ok(caseService.getAllCases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Case> getCaseById(@PathVariable Long id) {
        return caseService.getCaseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Case> createCase(@RequestBody Case c) {
        return ResponseEntity.ok(caseService.saveCase(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Case> updateCase(@PathVariable Long id, @RequestBody Case caseDetails) {
        return caseService.getCaseById(id).map(existingCase -> {
            existingCase.setCodCarpeta(caseDetails.getCodCarpeta());
            existingCase.setDelito(caseDetails.getDelito());
            existingCase.setImputado(caseDetails.getImputado());
            existingCase.setAgraviado(caseDetails.getAgraviado());
            existingCase.setFechaHechos(caseDetails.getFechaHechos());
            existingCase.setPenaMinima(caseDetails.getPenaMinima());
            existingCase.setPenaMaxima(caseDetails.getPenaMaxima());
            existingCase.setIsComplejo(caseDetails.getIsComplejo());
            existingCase.setIsCrimenOrganizado(caseDetails.getIsCrimenOrganizado());
            existingCase.setSuspendidoDias(caseDetails.getSuspendidoDias());
            existingCase.setResumenFactico(caseDetails.getResumenFactico());
            return ResponseEntity.ok(caseService.saveCase(existingCase));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCase(@PathVariable Long id) {
        if (caseService.getCaseById(id).isPresent()) {
            caseService.deleteCase(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/elementos")
    public ResponseEntity<ElementoConviccion> addElementoConviccion(
            @PathVariable Long id, 
            @RequestBody ElementoConviccion elemento) {
        try {
            ElementoConviccion saved = caseService.addElementoConviccion(id, elemento);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
