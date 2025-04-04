
/*
using Newtonsoft.Json;
using Order.API.Entities;
using Order.API;
using RulesEngine.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

public class RulesEngineService
{
    private  RulesEngine.RulesEngine _rulesEngine;
    private readonly ILogger<RulesEngineService> _logger;
    private readonly OrderDbContext OrderDbContext;
    // Inject OrderDbContext and ILogger to access the database and log information
    public RulesEngineService(OrderDbContext dbContext, ILogger<RulesEngineService> logger)
    {
        _logger = logger;
        _rulesEngine = null; // Initialize here to be set later
        OrderDbContext = dbContext;
    }

    // This method dynamically loads the rule engine based on the requested engine and version
    public void InitializeRules(OrderDbContext dbContext, string version)
    {
        // Fetch rules from the database based on the requested version
        var rulesData = dbContext.RulesEngineConfigs
            .Where(r => r.Version == version)  // Fetch by the user-selected version
            .ToList();

        if (!rulesData.Any())
        {
            _logger.LogError($"No rules found for version {version}");
            throw new ArgumentException($"No rules found for version {version}");
        }

        // Deserialize the rules from JSON into Rule objects (or whatever structure you need)
        var workflowRules = rulesData
            .Select(r => new Workflow
            {
                WorkflowName = r.WorkflowName,
                Rules = JsonConvert.DeserializeObject<Rule[]>(r.Rules)  // Assuming Rule is your rule structure
            })
            .ToArray();

        // Initialize the rules (for now, just storing them or setting them up in memory)
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

 

    public async Task<bool> ShouldIncludeOrder(OrderClass order, string version)
    {
        // Fetch the rules from the database based on the version
        var rulesData = OrderDbContext.RulesEngineConfigs
            .Where(r => r.Version == version) // Get rules for the selected version
            .FirstOrDefault();

        if (rulesData == null)
        {
            _logger.LogError($"No rules found for version {version}");
            return false; // If no rules found for the version, exclude the order
        }

        // Deserialize the rules JSON into a list of Rule objects
        var rules = JsonConvert.DeserializeObject<List<Rule>>(rulesData.Rules);

        // Initialize the RulesEngine with the deserialized rules
        var workflow = new Workflow
        {
            WorkflowName = $"{version}Workflow",
            Rules = rules.ToArray()
        };

        var ruleEngine = new RulesEngine.RulesEngine(new[] { workflow });

        // Create the rule parameter for the order
        var ruleParameter = new RuleParameter("order", order);

        try
        {
            // Execute all rules for this order and this version
            var resultList = await ruleEngine.ExecuteAllRulesAsync($"{version}Workflow", ruleParameter);

            // If all rules pass (i.e., IsSuccess is true for all), the order should be included
            return resultList.All(r => r.IsSuccess);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing rules");
            throw;
        }
    }


}

*/


using Newtonsoft.Json;
using Order.API.Entities;
using Order.API;
using RulesEngine.Models;

public class RulesEngineService
{
    private RulesEngine.RulesEngine _rulesEngine;
    private readonly ILogger<RulesEngineService> _logger;
    private readonly OrderDbContext OrderDbContext;

    // Inject OrderDbContext and ILogger to access the database and log information
    public RulesEngineService(OrderDbContext dbContext, ILogger<RulesEngineService> logger)
    {
        _logger = logger;
        _rulesEngine = null; // Initialize here to be set later
        OrderDbContext = dbContext;
    }

    // This method dynamically loads the rule engine based on the requested engine and version
    public void InitializeRules(OrderDbContext dbContext, string version, string workflowName)
    {
        var rulesData = dbContext.RulesEngineConfigs
            .Where(r => r.Version == version && r.WorkflowName == workflowName)  // Filter by both version and workflow
            .ToList();

        if (!rulesData.Any())
        {
            _logger.LogError($"No rules found for version {version} and workflow {workflowName}");
            throw new ArgumentException($"No rules found for version {version} and workflow {workflowName}");
        }

        var workflowRules = rulesData
            .Select(r => new Workflow
            {
                WorkflowName = r.WorkflowName,
                Rules = JsonConvert.DeserializeObject<Rule[]>(r.Rules)
            })
            .ToArray();

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
            var workflowName = "OrderValidationRules";  // Static name for validation workflow
            resultList = await _rulesEngine.ExecuteAllRulesAsync(workflowName, inputs);  // Use the validation workflow
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

    // This method should be used for filtering orders (e.g., in the GET request)
    public async Task<bool> ShouldIncludeOrder(OrderClass order, string version, string workflowName)
    {
        // Fetch the rules from the database based on the version
        var rulesData = OrderDbContext.RulesEngineConfigs
            .Where(r => r.Version == version) // Get rules for the selected version
            .FirstOrDefault();

        if (rulesData == null)
        {
            _logger.LogError($"No rules found for version {version}");
            return false; // If no rules found for the version, exclude the order
        }

        // Deserialize the rules JSON into a list of Rule objects
        var rules = JsonConvert.DeserializeObject<List<Rule>>(rulesData.Rules);

        // Initialize the RulesEngine with the deserialized rules
        var workflow = new Workflow
        {
            WorkflowName = workflowName,  // Use the passed workflow name (like OrderFilteringRules)
            Rules = rules.ToArray()
        };

        var ruleEngine = new RulesEngine.RulesEngine(new[] { workflow });

        // Create the rule parameter for the order
        var ruleParameter = new RuleParameter("order", order);

        try
        {
            // Execute all rules for this order and this version
            var resultList = await ruleEngine.ExecuteAllRulesAsync(workflowName, ruleParameter);  // Use the filtering workflow

            // If all rules pass (i.e., IsSuccess is true for all), the order should be included
            return resultList.All(r => r.IsSuccess);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing rules");
            throw;
        }
    }

    // This method is used in the GetAllOrders to filter based on the active version and corresponding rules
    public async Task<List<OrderClass>> FilterOrders(List<OrderClass> orders)
    {
        var filteredOrders = new List<OrderClass>();

        foreach (var order in orders)
        {
            // Execute the filtering rules that were initialized earlier
            var ruleParameter = new RuleParameter("order", order);
            var resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderFilterRules", ruleParameter);

            if (resultList.All(r => r.IsSuccess))
            {
                filteredOrders.Add(order);
            }
        }

        return filteredOrders;
    }


}
