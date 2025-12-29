package com.medee.service;

import com.medee.model.*;
import com.medee.repository.PostRepository;
import com.medee.repository.SalaryRecordRepository;
import com.medee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaryCalculationService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final SalaryRecordRepository salaryRecordRepository;

    private static final double BASE_AMOUNT = 100000.0; // 100,000₮

    // Run on the first day of each month at midnight
    @Scheduled(cron = "0 0 0 1 * ?")
    public void calculateMonthlySalaries() {
        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        calculateSalariesForMonth(lastMonth);
    }

    public void calculateSalariesForMonth(YearMonth month) {
        List<User> authors = userRepository.findByRole(UserRole.AUTHOR);

        for (User author : authors) {
            // Check if salary already calculated
            if (salaryRecordRepository.findByAuthorIdAndMonth(author.getId(), month).isPresent()) {
                continue;
            }

            List<Post> authorPosts = postRepository.findByAuthorIdAndStatus(author.getId(), PostStatus.APPROVED);

            int totalViews = authorPosts.stream().mapToInt(Post::getViews).sum();
            int totalLikes = authorPosts.stream().mapToInt(Post::getLikes).sum();

            double multiplier = getReputationMultiplier(author.getReputationPoints());
            double calculatedAmount = BASE_AMOUNT * multiplier;

            SalaryRecord record = SalaryRecord.builder()
                    .authorId(author.getId())
                    .month(month)
                    .reputationPoints(author.getReputationPoints())
                    .totalViews(totalViews)
                    .totalLikes(totalLikes)
                    .calculatedAmount(calculatedAmount)
                    .status(SalaryStatus.CALCULATED)
                    .build();

            salaryRecordRepository.save(record);
        }
    }

    private double getReputationMultiplier(int reputationPoints) {
        if (reputationPoints >= 1000) {
            return 3.0; // Platinum
        } else if (reputationPoints >= 501) {
            return 2.0; // Gold
        } else if (reputationPoints >= 101) {
            return 1.5; // Silver
        } else {
            return 1.0; // Bronze
        }
    }

    public List<SalaryRecord> getSalariesForMonth(YearMonth month) {
        return salaryRecordRepository.findByMonth(month);
    }

    public List<SalaryRecord> getAuthorSalaries(String authorId) {
        return salaryRecordRepository.findByAuthorId(authorId);
    }
}

