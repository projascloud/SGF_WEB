package com.mpfn.siact.repository;

import com.mpfn.siact.model.ElementoConviccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElementoConviccionRepository extends JpaRepository<ElementoConviccion, Long> {
    List<ElementoConviccion> findByCarpetaId(Long carpetaId);
}
