package com.forest.supia.item.repository;

import com.forest.supia.item.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpeciesRepository extends JpaRepository<Species, String> {
    Optional<Species> findByNameContaining(String name);

    Optional<Species> findById(long id);

}
