/*
using RulesEngine.Models;
using RulesEngine;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Order.API.Entities;
using Order.API;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Microsoft.Identity.Client;
using Order.API.Migrations;
using Microsoft.EntityFrameworkCore;

public class RulesEngineService
{
    private readonly RulesEngine.RulesEngine _rulesEngine;

    public RulesEngineService(OrderDbContext dbContext)
    {
        var rulesData = dbContext.RulesEngineConfigs.ToList();
        var workflowRules = rulesData
            .Select(r => new Workflow
            {
                WorkflowName = r.WorkflowName,
                Rules = JsonConvert.DeserializeObject<Rule[]>(r.Rules) // Deserialize JSON
            })
            .ToArray();

        _rulesEngine = new RulesEngine.RulesEngine(workflowRules);
    }


    //  Method for Validating an Order (POST)

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





    //  Method for Filtering Orders (GET)
    public async Task<bool> ShouldIncludeOrder(OrderClass order)
    {
        var inputs = new RuleParameter("order", order);
        List<RuleResultTree> resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderFilterRules", inputs);

        return resultList.All(r => r.IsSuccess); // show order if all rules pass
    }

}
*/




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
