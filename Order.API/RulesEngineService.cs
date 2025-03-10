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

public class RulesEngineService
{
    private readonly RulesEngine.RulesEngine _rulesEngine;

    public RulesEngineService()
    {
        string jsonRules = File.ReadAllText("order-rules.json");
        var workflowRules = JsonConvert.DeserializeObject<Workflow[]>(jsonRules);
        _rulesEngine = new RulesEngine.RulesEngine(workflowRules);
    }


    // ✅ Method for Validating an Order (POST)

    public async Task<List<string>> ValidateOrder(AddOrderCommand command)
    {


        // You can either convert AddOrderCommand to OrderClass or validate directly
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










    // ✅ Method for Filtering Orders (GET)
    public async Task<bool> ShouldIncludeOrder(OrderClass order)
    {
        var inputs = new RuleParameter("order", order);
        List<RuleResultTree> resultList = await _rulesEngine.ExecuteAllRulesAsync("OrderFilterRules", inputs);

        return resultList.All(r => r.IsSuccess); // Only include orders that pass all filters
    }

}

