package com.forest.supia.member.repository;

import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;



public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByEmail(String email);
    Member findByMemberId(Long id);
}
