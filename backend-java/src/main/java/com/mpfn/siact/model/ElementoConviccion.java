package com.mpfn.siact.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "elementos_conviccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElementoConviccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_elemento", nullable = false)
    private TipoElemento tipoElemento;

    // Criterios de valoración
    @Column(nullable = false)
    private Boolean pertinente = true;

    @Column(nullable = false)
    private Boolean conducente = true;

    @Column(nullable = false)
    private Boolean util = true;

    @Column(name = "analisis_justificacion", columnDefinition = "TEXT")
    private String analisisJustificacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_valoracion", nullable = false)
    private ResultadoValoracion resultadoValoracion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carpeta_id", nullable = false)
    @JsonIgnore
    private Case carpeta;
}
