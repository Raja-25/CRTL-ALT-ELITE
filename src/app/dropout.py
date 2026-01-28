DROPOUT_SQL = """
WITH session_gaps AS (
    SELECT
        student_id,
        login_time,
        LAG(login_time) OVER (PARTITION BY student_id ORDER BY login_time) AS prev_login_time,
        duration_minutes,
        lessons_accessed,
        quizzes_attempted
    FROM user_sessions
),
gap_metrics AS (
    SELECT
        student_id,
        COUNT(*) AS total_sessions,
        AVG(julianday(login_time) - julianday(prev_login_time)) AS avg_gap_days,
        MAX(login_time) AS last_login_time,
        AVG(duration_minutes) AS avg_duration,
        AVG(lessons_accessed) AS avg_lessons,
        AVG(quizzes_attempted) AS avg_quizzes
    FROM session_gaps
    WHERE prev_login_time IS NOT NULL
    GROUP BY student_id
),
recent_activity AS (
    SELECT
        student_id,
        AVG(duration_minutes) AS recent_avg_duration
    FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY login_time DESC) AS rn
        FROM user_sessions
    ) t
    WHERE rn <= 3
    GROUP BY student_id
)

SELECT
    std.student_id,
    std.display_name,
    std.phone,
    std.age,
    std.grade,
    gm.total_sessions,
    ROUND(gm.avg_gap_days, 2) AS avg_gap_days,
    gm.avg_duration,
    ra.recent_avg_duration,
    gm.avg_lessons,
    gm.avg_quizzes,
    ROUND(julianday('now') - julianday(gm.last_login_time), 1) AS days_since_last_login,

    (
        CASE WHEN gm.total_sessions < 5 THEN 25 ELSE 0 END +
        CASE WHEN gm.avg_gap_days > 5 THEN 20 ELSE 0 END +
        CASE WHEN ra.recent_avg_duration < gm.avg_duration * 0.5 THEN 25 ELSE 0 END +
        CASE WHEN gm.avg_lessons < 1 THEN 15 ELSE 0 END +
        CASE WHEN gm.avg_quizzes < 1 THEN 15 ELSE 0 END
    ) AS dropout_risk_score

FROM students std
LEFT JOIN gap_metrics gm ON std.student_id = gm.student_id
LEFT JOIN recent_activity ra ON std.student_id = ra.student_id
where dropout_risk_score>=45
ORDER BY dropout_risk_score DESC;
"""
