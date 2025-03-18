/*
 


using Newtonsoft.Json;
using Order.API.Entities;
using Order.API;
using RulesEngine.Models;

public class RulesEngineService
{
    private readonly RulesEngine.RulesEngine _rulesEngine;

    // Inject OrderDbContext to access the database
    public RulesEngineService(OrderDbContext dbContext)
    {
        // For example, assume the version comes from the request context or headers
        string requestedVersion = "v2"; // This could come from API headers or query string

        // Fetch rules from the database based on the requested version
        var rulesData = dbContext.RulesEngineConfigs
            .Where(r => r.Version == requestedVersion)
            .ToList();

        // Deserialize the rules from JSON into Rule objects and create workflows
        var workflowRules = rulesData
            .Select(r => new Workflow
            {
                WorkflowName = r.WorkflowName,
                Rules = JsonConvert.DeserializeObject<Rule[]>(r.Rules)
            })
            .ToArray();

        // Initialize the RulesEngine with the correct versioned rules
        _rulesEngine = new RulesEngine.RulesEngine(workflowRules);
    }

    // Example method for validating orders
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
        List<RuleResultTree> resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderValidationRules", inputs);

        return resultList
            .Where(r => !r.IsSuccess)
            .Select(r => r.ExceptionMessage ?? "Validation failed")
            .ToList();
    }

    // Example method for filtering orders
    public async Task<bool> ShouldIncludeOrder(OrderClass order)
    {
        var inputs = new RuleParameter("order", order);
        List<RuleResultTree> resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderFilterRules", inputs);

        return resultList.All(r => r.IsSuccess); // Only include order if all rules pass
    }
}

*/


using Newtonsoft.Json;
using Order.API.Entities;
using Order.API;
using RulesEngine.Models;
using Microsoft.Extensions.Logging;

public class RulesEngineService
{
    private readonly RulesEngine.RulesEngine _rulesEngine;
    private readonly ILogger<RulesEngineService> _logger;

    // Inject OrderDbContext and ILogger to access the database and log information
    public RulesEngineService(OrderDbContext dbContext, ILogger<RulesEngineService> logger)
    {
        _logger = logger;

        // For example, assume the version comes from the request context or headers
        string requestedVersion = "v1"; // This could come from API headers or query string

        // Fetch rules from the database based on the requested version
        var rulesData = dbContext.RulesEngineConfigs
            .Where(r => r.Version == requestedVersion)
            .ToList();

        if (!rulesData.Any())
        {
            _logger.LogError($"No rules found for version {requestedVersion}");
            throw new ArgumentException($"No rules found for version {requestedVersion}");
        }

        // Deserialize the rules from JSON into Rule objects and create workflows
        var workflowRules = rulesData
            .Select(r => new Workflow
            {
                WorkflowName = r.WorkflowName,
                Rules = JsonConvert.DeserializeObject<Rule[]>(r.Rules)
            })
            .ToArray();

        // Initialize the RulesEngine with the correct versioned rules
        _rulesEngine = new RulesEngine.RulesEngine(workflowRules);
    }

    // Example method for validating orders
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
        List<RuleResultTree> resultList;
        try
        {
            resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderValidationRules", inputs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing rules");
            throw;
        }

        return resultList
            .Where(r => !r.IsSuccess)
            .Select(r => r.ExceptionMessage ?? "Validation failed")
            .ToList();
    }

    // Example method for filtering orders
    public async Task<bool> ShouldIncludeOrder(OrderClass order)
    {
        var inputs = new RuleParameter("order", order);
        List<RuleResultTree> resultList;
        try
        {
            resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderFilterRules", inputs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing rules");
            throw;
        }

        return resultList.All(r => r.IsSuccess); // Only include order if all rules pass
    }
}
