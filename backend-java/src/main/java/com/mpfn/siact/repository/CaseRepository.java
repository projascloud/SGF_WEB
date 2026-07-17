package com.mpfn.siact.repository;

import com.mpfn.siact.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {
    Optional<Case> findByCodCarpeta(String codCarpeta);
}
