﻿/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities; // Adjust the namespace as needed

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RulesManagementController : ControllerBase
    {
        private readonly OrderDbContext _dbContext;
        private readonly ILogger<RulesManagementController> _logger;

        public RulesManagementController(OrderDbContext dbContext, ILogger<RulesManagementController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        // GET: api/RulesManagement
        // Retrieves all rules configurations.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetAllRules()
        {
            var rules = await _dbContext.RulesEngineConfigs.ToListAsync();
            return Ok(rules);
        }

        // GET: api/RulesManagement/{id}
        // Retrieves a single rule configuration by its ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<RulesEngineConfigs>> GetRule(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }
            return Ok(ruleConfig);
        }

        // POST: api/RulesManagement
        // Creates a new rule configuration.
        [HttpPost]
        public async Task<ActionResult<RulesEngineConfigs>> CreateRule(RulesEngineConfigs ruleConfig)
        {
            // Optionally, add validation here for your JSON rules format

            _dbContext.RulesEngineConfigs.Add(ruleConfig);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRule), new { id = ruleConfig.Id }, ruleConfig);
        }

        // PUT: api/RulesManagement/{id}
        // Updates an existing rule configuration.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRule(int id, RulesEngineConfigs ruleConfig)
        {
            if (id != ruleConfig.Id)
            {
                return BadRequest("ID mismatch");
            }

            _dbContext.Entry(ruleConfig).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _dbContext.RulesEngineConfigs.AnyAsync(r => r.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/RulesManagement/{id}
        // Deletes a rule configuration.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }

            _dbContext.RulesEngineConfigs.Remove(ruleConfig);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/RulesManagement/workflow/{workflowName}
        // Optional: Retrieves rules configurations filtered by workflow name.
        [HttpGet("workflow/{workflowName}")]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetRulesByWorkflow(string workflowName)
        {
            var rules = await _dbContext.RulesEngineConfigs
     .Where(r => r.WorkflowName == workflowName)
     .ToListAsync();


            return Ok(rules);
        }






        [HttpPut("set-active/{id}")]
        public async Task<IActionResult> SetActiveRuleVersion(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }

            // Check if the version is already active in the same workflow
            var activeRule = await _dbContext.RulesEngineConfigs
                .FirstOrDefaultAsync(r => r.IsActive && r.WorkflowName == ruleConfig.WorkflowName);

            if (activeRule != null && activeRule.Id == ruleConfig.Id)
            {
                return Ok(new { Message = "This version is already active.", ActiveVersion = ruleConfig.Version });
            }

            // Deactivate all other versions in the same workflow
            var allRulesInWorkflow = await _dbContext.RulesEngineConfigs
                .Where(r => r.WorkflowName == ruleConfig.WorkflowName)
                .ToListAsync();

            foreach (var rule in allRulesInWorkflow)
            {
                rule.IsActive = false;
                _dbContext.Entry(rule).State = EntityState.Modified; // Explicitly mark as modified
            }

            // Set the selected version as active
            ruleConfig.IsActive = true;
            _dbContext.Entry(ruleConfig).State = EntityState.Modified; // Explicitly mark as modified
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Active rule version updated.", ActiveVersion = ruleConfig.Version });
        }



        [HttpGet("active-all")]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetAllActiveRules()
        {
            var activeRules = await _dbContext.RulesEngineConfigs
                .Where(r => r.IsActive)
                .ToListAsync();

            if (activeRules.Count == 0)
            {
                return NotFound("No active rule versions found.");
            }

            return Ok(activeRules);
        }



    }
}

*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities; // Adjust the namespace as needed

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RulesManagementController : ControllerBase
    {
        private readonly OrderDbContext _dbContext;
        private readonly ILogger<RulesManagementController> _logger;

        public RulesManagementController(OrderDbContext dbContext, ILogger<RulesManagementController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        // GET: api/RulesManagement
        // Retrieves all rules configurations.

     

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetAllRules(
    [FromQuery] bool includeArchived = false)
        {
            var query = _dbContext.RulesEngineConfigs.AsQueryable();

            if (!includeArchived)
            {
                query = query.Where(r => !r.IsArchived);
            }

            return Ok(await query.ToListAsync());
        }









        // GET: api/RulesManagement/{id}
        // Retrieves a single rule configuration by its ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<RulesEngineConfigs>> GetRule(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }
            return Ok(ruleConfig);
        }

        // POST: api/RulesManagement
        // Creates a new rule configuration.
       




        [HttpPost]
        public async Task<ActionResult<RulesEngineConfigs>> CreateRule( [FromBody] RulesEngineConfigs ruleConfig)
        {
            // Ensure new rules aren't archived by default
            ruleConfig.IsArchived = false;
            _dbContext.RulesEngineConfigs.Add(ruleConfig);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRule), new { id = ruleConfig.Id }, ruleConfig);
        }










        // PUT: api/RulesManagement/{id}
        // Updates an existing rule configuration.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRule(int id, RulesEngineConfigs ruleConfig)
        {
            if (id != ruleConfig.Id)
            {
                return BadRequest("ID mismatch");
            }

            _dbContext.Entry(ruleConfig).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _dbContext.RulesEngineConfigs.AnyAsync(r => r.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/RulesManagement/{id}
        // Deletes a rule configuration.
      

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }

            ruleConfig.IsArchived = true; // Archive instead of delete
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }











        // GET: api/RulesManagement/workflow/{workflowName}
        // Optional: Retrieves rules configurations filtered by workflow name.
       
        [HttpGet("workflow/{workflowName}")]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetRulesByWorkflow(
     string workflowName,
     [FromQuery] bool includeArchived = false)
        {
            var query = _dbContext.RulesEngineConfigs
                .Where(r => r.WorkflowName == workflowName);

            if (!includeArchived)
            {
                query = query.Where(r => !r.IsArchived);
            }

            return Ok(await query.ToListAsync());
        }









        [HttpPut("set-active/{id}")]
        public async Task<IActionResult> SetActiveRuleVersion(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }

            // If the rule is already active, toggle it off
            if (ruleConfig.IsActive)
            {
                ruleConfig.IsActive = false;
                _dbContext.Entry(ruleConfig).State = EntityState.Modified; // Explicitly mark as modified
                await _dbContext.SaveChangesAsync();
                return Ok(new { Message = "Rule version deactivated.", ActiveVersion = ruleConfig.Version });
            }

            // If the rule is not active, activate it and deactivate others in the same workflow
            var activeRule = await _dbContext.RulesEngineConfigs
                .FirstOrDefaultAsync(r => r.IsActive && r.WorkflowName == ruleConfig.WorkflowName);

            if (activeRule != null)
            {
                // Deactivate the currently active rule in the same workflow
                activeRule.IsActive = false;
                _dbContext.Entry(activeRule).State = EntityState.Modified; // Explicitly mark as modified
            }

            ruleConfig.IsActive = true;
            _dbContext.Entry(ruleConfig).State = EntityState.Modified; // Explicitly mark as modified
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Active rule version updated.", ActiveVersion = ruleConfig.Version });
        }



        [HttpGet("active-all")]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetAllActiveRules()
        {
            var activeRules = await _dbContext.RulesEngineConfigs
                .Where(r => r.IsActive)
                .ToListAsync();

            if (activeRules.Count == 0)
            {
                return NotFound("No active rule versions found.");
            }

            return Ok(activeRules);
        }



    }
}


