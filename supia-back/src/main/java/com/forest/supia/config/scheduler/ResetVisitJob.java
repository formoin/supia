package com.forest.supia.config.scheduler;

import com.forest.supia.member.repository.MemberRepository;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ResetVisitJob implements Job {

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        memberRepository.resetVisitCount();
    }
}
