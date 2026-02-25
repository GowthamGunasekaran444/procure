export const MOCK_DATA = {
  "1h": {
    "time_range": "1h",
    "hours": 1,
    "computed_at": "2025-11-06 15:52:16",
    "analytics": {
      "failed_conversations": {
        "total_conversations": 7,
        "failed_conversations": 0,
        "success_rate": 100,
        "failed_details": []
      },
      "turn_failures": {
        "total_turns": 6,
        "failed_turns": 0,
        "failure_rate": 0,
        "failures_by_mode": {
          "AGENT_MODE": 0,
          "UNIGPT_MODE": 0
        },
        "failures_by_type": {
          "ERROR_PLAN_EXECUTION_FAILURE": 0,
          "ERROR_UNIGPT_RESPONSE_FAILURE": 0,
          "TIMEOUT_AGENT_MODE": 0,
          "TIMEOUT_UNIGPT_MODE": 0,
          "NO_PLAN_CREATED": 0
        },
        "failed_turn_details": []
      },
      "plan_complexity": {
        "total_plans": 6,
        "avg_subqueries": 1.5,
        "max_subqueries": 2,
        "most_complex_conversation": {
          "conversation_id": "690cf8f1bffe309093b8b53e",
          "num_subqueries": 2,
          "created_at": "2025-11-06 20:08:16.344000"
        },
        "distribution": {
          "simple": {
            "label": "Simple (1-2 queries)",
            "count": 6,
            "percentage": 100
          },
          "moderate": {
            "label": "Moderate (3-5 queries)",
            "count": 0,
            "percentage": 0
          },
          "complex": {
            "label": "Complex (6+ queries)",
            "count": 0,
            "percentage": 0
          }
        }
      },
      "query_topics": {
        "total_conversations": 7,
        "total_queries": 9,
        "total_plans": 6,
        "categories": [
          {
            "category": "Tariff Information",
            "count": 3,
            "percentage": 33.3
          },
          {
            "category": "Competitor Intelligence",
            "count": 3,
            "percentage": 33.3
          },
          {
            "category": "Spend Analysis",
            "count": 2,
            "percentage": 22.2
          },
          {
            "category": "OKR Tracking",
            "count": 1,
            "percentage": 11.1
          }
        ],
        "top_keywords": [
          { "keyword": "sugar", "count": 4 },
          { "keyword": "top", "count": 3 },
          { "keyword": "line", "count": 3 },
          { "keyword": "revenue", "count": 3 },
          { "keyword": "spend", "count": 2 },
          { "keyword": "indonesia", "count": 2 }
        ],
        "top_materials": [
          { "material": "Sugar", "count": 4 },
          { "material": "Tin", "count": 2 }
        ],
        "top_geographies": [
          { "country": "Indonesia", "count": 2 },
          { "country": "Uk", "count": 1 }
        ],
        "top_organizations": [
          { "company": "P&G", "count": 3 }
        ],
        "top_time_periods": [
          { "period": "2022", "count": 1 },
          { "period": "2024", "count": 1 }
        ]
      },
      "time_trends": {
        "total_queries": 9,
        "peak_usage": {
          "peak_hour": { "hour": 20, "count": 9 },
          "peak_day": { "day": "Thursday", "count": 9 }
        },
        "hourly_distribution": { "20": 9 },
        "day_of_week_distribution": { "Thursday": 9 },
        "daily_volume": [{ "date": "2025-11-06", "count": 9 }],
        "topic_trends": []
      },
      "agent_routing": {
        "total_plans": 6,
        "total_agents": 4,
        "routing_patterns": [
          { "query_pattern": "Spend Analysis", "agent": "spend", "usage_count": 2 },
          { "query_pattern": "Tariff Information", "agent": "tariff360", "usage_count": 2 },
          { "query_pattern": "General", "agent": "competitor_360", "usage_count": 3 }
        ],
        "agent_performance": [
          { "agent": "tariff360", "total_invocations": 3, "success_rate": 0, "avg_latency_seconds": 0 },
          { "agent": "competitor_360", "total_invocations": 3, "success_rate": 100, "avg_latency_seconds": 14.86 },
          { "agent": "spend", "total_invocations": 2, "success_rate": 0, "avg_latency_seconds": 0 },
          { "agent": "okr360", "total_invocations": 1, "success_rate": 0, "avg_latency_seconds": 0 }
        ],
        "agent_combinations": [
          { "agents": ["spend", "tariff360"], "count": 2 },
          { "agents": ["competitor_360"], "count": 1 }
        ],
        "utilization_insights": {
          "underutilized": [
            { "agent": "spend", "invocations": 2 },
            { "agent": "tariff360", "invocations": 3 }
          ]
        }
      },
      "user_behavior": {
        "total_active_users": 4,
        "segmentation": {
          "power_users": { "count": 0 },
          "regular_users": { "count": 1 },
          "casual_users": { "count": 3 }
        },
        "user_journey": {},
        "enhanced_satisfaction": {}
      },
      "system_health": {
        "overall_health": "healthy",
        "slo_summary": { "total": 3, "met": 3, "at_risk": 0, "violated": 0, "compliance_rate": 100 },
        "slos": [
          { "name": "Plan Generation Success Rate", "target": 80, "actual": 100, "status": "met" },
          { "name": "Response Time P95", "target": 90, "actual": 95, "status": "met" },
          { "name": "System Availability", "target": 99, "actual": 99.5, "status": "met" }
        ],
        "metrics": { "volume_change_pct": 0, "success_rate": 100, "total_plans": 6, "failed_plans": 0 }
      }
    },
    "dashboard_metrics": {
      "timestamp": "2025-11-06T15:52:21Z",
      "time_range": { "preset": "1h", "hours": 1 },
      "planning": {
        "plans_generated": 6,
        "plans_revised": 2,
        "plans_failed": 0,
        "plan_revision_rate": 33.33,
        "avg_latency_ms": 16089.5,
        "latency_percentiles": { "p50": 13212, "p90": 35567, "p95": 35567, "p99": 35567 },
        "trend_percentage": 0,
        "trend_direction": "neutral"
      },
      "execution": {
        "active_executions": 6,
        "executions_completed": 6,
        "avg_latency_ms": 303210.66,
        "latency_percentiles": { "p50": 204125, "p90": 1259631, "p95": 1259631, "p99": 1259631 },
        "trend_percentage": 0,
        "trend_direction": "neutral"
      },
      "agents": {
        "total_invocations": 6,
        "active_invocations": 0,
        "avg_latency_ms": 20095.28,
        "top_agents": [{ "agent": "unknown", "count": 6 }],
        "latency_percentiles": { "p50": 14874, "p90": 53376, "p95": 53376, "p99": 53376 },
        "trend_percentage": 0,
        "trend_direction": "neutral"
      },
      "business": {
        "active_conversations": 7,
        "total_conversations": 7,
        "queries": 48,
        "avg_response_time_ms": 303210.66,
        "trend_percentage": 0,
        "trend_direction": "neutral"
      },
      "kpis": {
        "per_agent_latencies": {
          "competitor_360": { "avg_latency_ms": 14859.67, "invocation_count": 3 },
          "Tariff360": { "avg_latency_ms": 30130.5, "invocation_count": 2 },
          "Spend": { "avg_latency_ms": 8100, "invocation_count": 1 },
          "OKR360": { "avg_latency_ms": 27727, "invocation_count": 1 }
        },
        "active_users": 4,
        "task_completion_accuracy": 100,
        "plan_execution_success_rate": 100,
        "latency_breakdown": {
          "apolo_planning_ms": 17863,
          "user_approval_ms": 362426,
          "ares_preparation_ms": 8171.25,
          "agent_execution_ms": 19797.75,
          "response_generation_ms": 30001.5
        }
      },
      "user_satisfaction": { "meets_target": true }
    },
    "drill_down": {
      "drill_down_data": {
        "top_users": [
          { "user_id": "68e014e36eff84a3537ce11e", "conversation_count": 3 },
          { "user_id": "68e015a86eff84a3537ce120", "conversation_count": 2 }
        ]
      },
      "failure_correlations": {
        "total_failures": 0, "total_conversations": 4
      },
      "agent_complexity_correlation": [],
      "recent_conversations": [
        { "conversation_id": "690d07d9bffe309093b8b78f", "status": "failed", "created_at": "2025-11-06T20:40:57" },
        { "conversation_id": "690d06ffbffe309093b8b757", "status": "success", "created_at": "2025-11-06T20:37:19" }
      ],
      "failed_count": 0, "success_count": 7, "total_count": 7,
      "cached_data": {
        "conversations": [
          { "_id": "690d0248bffe309093b8b6d0", "title": "Conversation 98", "status": "FINAL_REPORT_PRESENTED", "created_at": "2025-11-06 20:17:12" },
          { "_id": "690d00ddbffe309093b8b68d", "title": "Conversation 97", "status": "FINAL_REPORT_PRESENTED", "created_at": "2025-11-06 20:11:09" },
          { "_id": "690d0026bffe309093b8b667", "title": "Conversation 32", "status": "ARES_FOLLOWUP_PRESENTED", "created_at": "2025-11-06 20:08:06" }
        ],
        "plans": [
          { "_id": "690d0030bffe309093b8b66a", "status": "INITIAL_PLAN_PRESENTED", "created_at": "2025-11-06 20:08:16", "metadata": { "initial_user_query": "For Sugar in Indonesia..." } }
        ],
        "turns": [],
        "messages": [
          { "_id": "690d01b5bffe309093b8b6bd", "sender": "REPORTER", "content": "<html>...</html>", "type": "FINAL_REPORT_PRESENTED" },
          { "_id": "690d0735bffe309093b8b766", "sender": "REPORTER", "content": "<html>...</html>", "type": "FINAL_REPORT_PRESENTED" },
          { "_id": "690d08b8bffe309093b8b7b4", "sender": "REPORTER", "content": "<html>...</html>", "type": "FINAL_REPORT_PRESENTED" }
        ]
      }
    },
    "alerts": [
      { "id": 1, "message": "System issues requiring attention", "severity": "warning" },
      { "id": 2, "message": "All systems operating normally", "severity": "success" }
    ]
  }
};

// Replicate for other time ranges
MOCK_DATA["3h"] = { ...MOCK_DATA["1h"], time_range: "3h", hours: 3 };
MOCK_DATA["6h"] = { ...MOCK_DATA["1h"], time_range: "6h", hours: 6 };
MOCK_DATA["12h"] = { ...MOCK_DATA["1h"], time_range: "12h", hours: 12 };
MOCK_DATA["24h"] = { ...MOCK_DATA["1h"], time_range: "24h", hours: 24 };
