package com.medee.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.YearMonth;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "salary_records")
public class SalaryRecord {
    
    @Id
    private String id;
    
    private String authorId;
    
    private YearMonth month;
    
    private Integer reputationPoints;
    
    private Integer totalViews;
    
    private Integer totalLikes;
    
    private Double calculatedAmount;
    
    @Builder.Default
    private SalaryStatus status = SalaryStatus.PENDING;
}

