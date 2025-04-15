

using Newtonsoft.Json;
using Order.API.Entities;
using Order.API;
using RulesEngine.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Order.API
{
    public class RulesEngineService
    {
        private RulesEngine.RulesEngine _rulesEngine;
        private readonly ILogger<RulesEngineService> _logger;
        private readonly OrderDbContext _dbContext;

        public RulesEngineService(OrderDbContext dbContext, ILogger<RulesEngineService> logger )
        {
            _dbContext = dbContext;
            _logger = logger;
            _rulesEngine = new RulesEngine.RulesEngine(new Workflow[0]); // Initialize with an empty workflow
        }

        public async Task InitializeRulesAsync(OrderDbContext dbContext, string version, string workflowName)
        {
            var rulesData = await dbContext.RulesEngineConfigs
                .Where(r => r.Version == version && r.WorkflowName == workflowName)
                .ToListAsync();

            if (!rulesData.Any())
                throw new ArgumentException($"No rules found for workflow '{workflowName}' and version '{version}'");

            var workflows = rulesData.Select(r => new Workflow
            {
                WorkflowName = r.WorkflowName,
                Rules = JsonConvert.DeserializeObject<Rule[]>(r.Rules)
            }).ToArray();

            _rulesEngine = new RulesEngine.RulesEngine(workflows);
        }

        public async Task<List<string>> ValidateOrder(AddOrderCommand command)
        {
            var order = new OrderClass
            {
                Name = command.Name,
                Email = command.Email,
                Phone = command.Phone,
                OrderAmount = command.OrderAmount
            };

            var inputs = new RuleParameter("order", order);
            try
            {
                var resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderValidationRules", inputs);
                return resultList
                    .Where(r => !r.IsSuccess)
                    .Select(r => r.ExceptionMessage ?? "Validation failed")
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing validation rules");
                throw;
            }
        }

        public async Task<bool> ShouldIncludeOrder(OrderClass order, string version, string workflowName)
        {
            var rulesData = await _dbContext.RulesEngineConfigs
                .FirstOrDefaultAsync(r => r.Version == version && r.WorkflowName == workflowName);

            if (rulesData == null)
            {
                _logger.LogError($"No rules found for workflow '{workflowName}' and version '{version}'");
                return false;
            }

            var rules = JsonConvert.DeserializeObject<List<Rule>>(rulesData.Rules);
            var workflow = new Workflow
            {
                WorkflowName = workflowName,
                Rules = rules.ToArray()
            };

            var ruleEngine = new RulesEngine.RulesEngine(new[] { workflow });
            var ruleParameter = new RuleParameter("order", order);

            try
            {
                var resultList = await ruleEngine.ExecuteAllRulesAsync(workflowName, ruleParameter);
                return resultList.All(r => r.IsSuccess);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing filter rules");
                throw;
            }
        }
    }


}