package com.forest.supia.background.repository;

import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.entity.OwnBgm;
import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BgiRepository extends JpaRepository<Bgi, Long> {

}
