package com.mpfn.siact.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carpetas_fiscales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cod_carpeta", nullable = false, unique = true)
    private String codCarpeta;

    @Column(nullable = false)
    private String delito;

    private String imputado;
    private String agraviado;

    @Column(name = "fecha_hechos")
    private LocalDate fechaHechos;

    @Column(name = "pena_minima")
    private Integer penaMinima;

    @Column(name = "pena_maxima")
    private Integer penaMaxima;

    @Column(name = "is_complejo")
    private Boolean isComplejo = false;

    @Column(name = "is_crimen_organizado")
    private Boolean isCrimenOrganizado = false;

    @Column(name = "suspendido_dias")
    private Integer suspendidoDias = 0;

    @Column(name = "resumen_fáctico", columnDefinition = "TEXT")
    private String resumenFactico;

    @OneToMany(mappedBy = "carpeta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ElementoConviccion> elementosConviccion = new ArrayList<>();
}
