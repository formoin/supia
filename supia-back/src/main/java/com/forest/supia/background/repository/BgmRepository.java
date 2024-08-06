package com.forest.supia.background.repository;

import com.forest.supia.background.entity.Bgm;
import com.forest.supia.background.entity.OwnBgm;
import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BgmRepository extends JpaRepository<Bgm, Long> {

}
