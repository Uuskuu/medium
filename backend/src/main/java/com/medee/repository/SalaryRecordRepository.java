package com.medee.repository;

import com.medee.model.SalaryRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRecordRepository extends MongoRepository<SalaryRecord, String> {
    Optional<SalaryRecord> findByAuthorIdAndMonth(String authorId, YearMonth month);
    List<SalaryRecord> findByMonth(YearMonth month);
    List<SalaryRecord> findByAuthorId(String authorId);
}

